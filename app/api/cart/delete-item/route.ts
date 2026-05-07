import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function DELETE(req: Request) {
  const { cart_item_id } = await req.json();
  const supabase = await createClient();

  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("cart_item_id", cart_item_id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ success: true });
}
