import { createClient } from "@/utils/supabase/client";

export async function addCarImages(car_id: string, image_urls: string[]) {
  if (image_urls.length === 0) return;

  const supabase = createClient();

  // 1) Compter les images déjà existantes
  const { data: existing, error: countError } = await supabase
    .from("car_images")
    .select("image_id", { count: "exact" })
    .eq("car_id", car_id);

  if (countError) throw countError;

  const currentCount = existing?.length ?? 0;

  // 2) Vérifier la limite de 4
  if (currentCount + image_urls.length > 4) {
    throw new Error("Cette voiture ne peut pas avoir plus de 4 images.");
  }

  // 3) Insérer en batch
  const rows = image_urls.map((url) => ({
    car_id,
    image_url: url,
  }));

  const { data, error } = await supabase
    .from("car_images")
    .insert(rows)
    .select();

  if (error) throw error;

  return data;
}
