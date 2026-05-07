"use client"; // car on fait un fetch côté client via Supabase auth

import { createClient } from "@/utils/supabase/client";

export async function getCartCount(): Promise<number> {
  const supabase = createClient();

  // Récupérer l'utilisateur actuel
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return 0;

  // Récupérer le cart du user
  const { data: carts } = await supabase
    .from("cart")
    .select("cart_id")
    .eq("user_id", user.id);

  if (!carts || carts.length === 0) return 0;

  const cartIds = carts.map((c) => c.cart_id);

  // Récupérer tous les items du panier
  const { data: items } = await supabase
    .from("cart_items")
    .select("quantity")
    .in("cart_id", cartIds);

  if (!items) return 0;

  // Somme des quantités
  return items.reduce((acc, item) => acc + item.quantity, 0);
}
