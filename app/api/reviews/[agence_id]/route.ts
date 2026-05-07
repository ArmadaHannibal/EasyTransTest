import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// ── GET /api/reviews/[agence_id] — charger les avis d'une agence ──────────────
export const GET = async (req: Request, context: any) => {
  const params = await context?.params;
  const agence_id = params?.agence_id;

  if (!agence_id) {
    return NextResponse.json({ error: "agence_id manquant" }, { status: 400 });
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("agency_reviews")
    .select(`
      review_id,
      agency_id,
      rating,
      comment,
      created_at,
      users:reviewer_id (
        first_name,
        last_name,
        profile_picture
      )
    `)
    .eq("agency_id", agence_id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data);
};

// ── DELETE /api/reviews/[agence_id] — supprimer son propre avis ──────────────
export const DELETE = async (req: Request, context: any) => {
  const supabase = await createClient();
  const { review_id } = await req.json();

  if (!review_id) {
    return NextResponse.json({ error: "review_id manquant" }, { status: 400 });
  }

  // Vérifier que l'user connecté est bien l'auteur
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { error } = await supabase
    .from("agency_reviews")
    .delete()
    .eq("review_id", review_id)
    .eq("reviewer_id", user.id); // sécurité : ne supprime que son propre avis

  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
};

// ── POST /api/reviews/[agence_id] — soumettre un avis ────────────────────────
export const POST = async (req: Request, context: any) => {
  const params = await context?.params;
  const agence_id = params?.agence_id;

  if (!agence_id) {
    return NextResponse.json({ error: "agence_id manquant" }, { status: 400 });
  }

  const supabase = await createClient();
  const { reviewer_id, rating, comment } = await req.json();

  if (!reviewer_id || !rating) {
    return NextResponse.json(
      { error: "reviewer_id et rating sont requis" },
      { status: 400 }
    );
  }
  if (rating < 1 || rating > 5) {
    return NextResponse.json(
      { error: "La note doit être entre 1 et 5" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("agency_reviews")
    .insert([{ agency_id: agence_id, reviewer_id, rating, comment }])
    .select(`
      review_id,
      agency_id,
      rating,
      comment,
      created_at,
      users:reviewer_id (
        first_name,
        last_name,
        profile_picture
      )
    `)
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "Vous avez déjà laissé un avis pour cette agence." },
        { status: 409 }
      );
    }
    console.error("Supabase error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data, { status: 201 });
};