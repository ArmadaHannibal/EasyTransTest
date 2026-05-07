import { createClient } from "@/utils/supabase/client";

export async function uploadBusImage(file: File, userId: string) {
  const supabase = createClient();
  const fileExt = file.name.split(".").pop();
  const fileName = `${userId}-${Date.now()}.${fileExt}`;
  const filePath = `${userId}/${fileName}`; // juste le nom du fichier, pas de dossier "buses/"

  const { error: uploadError } = await supabase.storage
    .from("buses") // le bucket
    .upload(filePath, file, { cacheControl: "3600", upsert: false });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from("buses").getPublicUrl(filePath);
  return data.publicUrl;
}

export async function createBus(bus: {
  bus_name: string;
  bus_capacity: number;
  bus_type: string;
  bus_license_plate: string;
  bus_description?: string;
  bus_image_url?: string;
  // owner_id: string;
}) {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) throw new Error("Utilisateur non connecté");

  // Validation champs obligatoires
  if (
    !bus.bus_name?.trim() ||
    !bus.bus_type?.trim() ||
    !bus.bus_license_plate?.trim() ||
    !bus.bus_capacity ||
    bus.bus_capacity <= 0
  ) {
    throw new Error("Tous les champs obligatoires doivent être remplis");
  }

  // Vérification doublon (immatriculation unique par user)
  const { data: existingBus } = await supabase
    .from("buses")
    .select("id")
    .eq("bus_license_plate", bus.bus_license_plate)
    .eq("owner_id", user.id)
    .maybeSingle();

  if (existingBus) {
    throw new Error("Un bus avec cette immatriculation existe déjà");
  }

  const { data, error } = await supabase
    .from("buses")
    .insert([
      {
        ...bus,
        owner_id: user.id, // important pour RLS
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function fetchBuses(ownerId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("buses")
    .select("*")
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function fetchTicketCountByBus(busId: number) {
  const supabase = createClient();

  const { count, error } = await supabase
    .from("tickets")
    .select("*", { count: "exact", head: true })
    .eq("bus_id", busId);

  if (error) throw error;
  return count || 0;
}

export async function fetchTicketsByBus(busId: number) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("tickets")
    .select("*")
    .eq("bus_id", busId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

// Modifier un bus
export async function updateBus(
  busId: number,
  updates: Partial<{
    bus_name: string;
    bus_capacity: number;
    bus_type: string;
    bus_license_plate: string;
    bus_description?: string;
    bus_image_url?: string;
  }>,
) {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) throw new Error("Utilisateur non connecté");

  const { data, error } = await supabase
    .from("buses")
    .update(updates)
    .eq("bus_id", busId)
    .eq("owner_id", user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Supprimer un bus
export async function deleteBus(busId: number) {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) throw new Error("Utilisateur non connecté");

  const { error } = await supabase
    .from("buses")
    .delete()
    .eq("bus_id", busId)
    .eq("owner_id", user.id);

  if (error) throw error;
  return true;
}
