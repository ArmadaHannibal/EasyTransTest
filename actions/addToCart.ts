"use server";

import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function addToCart(ticketId: string, quantity: number = 1) {
  const cookieStore = cookies();
  const supabase = await createClient();

  // 1. Récupérer l’utilisateur
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Utilisateur non connecté");

  // 2. Vérifier si le user a déjà un cart
  const { data: existingCart } = await supabase
    .from("cart")
    .select("*")
    .eq("user_id", user.id)
    .single();

  let cartId = existingCart?.cart_id;

  // 3. Créer un cart si inexistant
  if (!existingCart) {
    const { data: newCart, error: cartErr } = await supabase
      .from("cart")
      .insert({ user_id: user.id })
      .select()
      .single();

    if (cartErr) throw cartErr;
    cartId = newCart.cart_id;
  }

  // 4. Vérifier si item déjà présent
  const { data: existingItem } = await supabase
    .from("cart_items")
    .select("*")
    .eq("cart_id", cartId)
    .eq("ticket_id", ticketId)
    .single();

  if (existingItem) {
    // Mettre à jour la quantité
    await supabase
      .from("cart_items")
      .update({
        quantity: existingItem.quantity + quantity,
      })
      .eq("cart_item_id", existingItem.cart_item_id);
  } else {
    // Ajouter un nouvel item
    await supabase.from("cart_items").insert({
      cart_id: cartId,
      ticket_id: ticketId,
      quantity: quantity,
    });
  }

  revalidatePath("/");

  return { success: true };
}
