import { createClient } from "@/utils/supabase/client";

export async function uploadCarImage(file: File) {
    const supabase = createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Utilisateur non connecté");

    // Nom unique du fichier
    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `cars/${fileName}`;

    // Upload dans bucket "cars"
    const { error } = await supabase.storage
        .from("cars") // nom du bucket
        .upload(filePath, file);

    if (error) throw error;

    // Récupérer URL publique
    const { data } = supabase.storage
        .from("cars")
        .getPublicUrl(filePath);

    return data.publicUrl;
}