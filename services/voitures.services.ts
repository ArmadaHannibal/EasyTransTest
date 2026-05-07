import { createClient } from "@/utils/supabase/client";

export async function createCar(data: any, images: string[], agencyId: string) {
    const supabase = createClient();
    

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Utilisateur non connecté");

    // 🔎 Validation simple
    if (!data.brand || !data.model || !data.price_per_day) {
        throw new Error("Veuillez remplir les champs obligatoires");
    }

    // 1️⃣ Insert voiture
    const { data: car, error } = await supabase
        .from("car_rentals")
        .insert([
            {
                ...data,
                agency_id: agencyId,
                price_per_day: Number(data.price_per_day),
                year: data.year ? Number(data.year) : null,
                seats: data.seats ? Number(data.seats) : null,
                is_available: data.is_available,
            },
        ])
        .select()
        .single();

    if (error) throw error;

    // 2️⃣ Insert images liées
    if (images.length > 0) {
        const imagesToInsert = images.map((url) => ({
            car_id: car.car_id,
            image_url: url,
        }));

        const { error: imageError } = await supabase
            .from("car_images")
            .insert(imagesToInsert);

        if (imageError) throw imageError;
    }

    return car;
}