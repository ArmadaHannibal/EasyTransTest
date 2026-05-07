import { createClient } from "@/utils/supabase/client";
import { CarRental } from "@/types/cars";

// SELECT ALL
export async function getCars() {
  const { data, error } = await createClient()
    .from("car_rentals")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

// SELECT BY ID
export async function getCarById(car_id: string) {
  const { data, error } = await createClient()
    .from("car_rentals")
    .select("*")
    .eq("car_id", car_id)
    .single();

  if (error) throw error;
  return data;
}

// INSERT
export async function createCar(
  payload: Omit<CarRental, "car_id" | "created_at">
) {
  const { data, error } = await createClient()
    .from("car_rentals")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// UPDATE
export async function updateCar(car_id: string, updates: Partial<CarRental>) {
  const { data, error } = await createClient()
    .from("car_rentals")
    .update(updates)
    .eq("car_id", car_id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// DELETE
export async function deleteCar(car_id: string) {
  const { error } = await createClient()
    .from("car_rentals")
    .delete()
    .eq("car_id", car_id);

  if (error) throw error;
}
