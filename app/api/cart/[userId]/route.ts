import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// GET handler pour récupérer le panier
export const GET = async (req: NextRequest, context: any) => {
  // Déstructuration compatible avec le validator Next.js
  const params = await context?.params;
  const userId = params?.userId;

  if (!userId) {
    return NextResponse.json({ error: "userId manquant" }, { status: 400 });
  }

  const supabase = await createClient();

  // Récupérer le panier
  const { data: cart, error: cartError } = await supabase
    .from("cart")
    .select("cart_id")
    .eq("user_id", userId)
    .single();

  if (cartError) {
    return NextResponse.json({ error: "Panier introuvable" }, { status: 404 });
  }

  // Récupérer les items du panier
  const { data: items, error: itemsError } = await supabase
    .from("cart_items")
    .select(
      `cart_item_id,
       quantity,
       added_at,
       tickets (
         ticket_id,
         departure_location,
         destination,
         ticket_price,
         departure_date,
         bus_id
       )`
    )
    .eq("cart_id", cart.cart_id);

  if (itemsError) {
    return NextResponse.json({ error: itemsError.message }, { status: 400 });
  }

  return NextResponse.json(items);
};
