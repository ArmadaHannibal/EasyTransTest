export interface CarRental {
  car_id: string;
  agency_id: string;
  brand: string;
  model: string;
  year?: number;
  seats?: number;
  transmission?: string;
  fuel_type?: string;
  price_per_day: number;
  is_available?: boolean;
  description?: string;
  main_image_url?: string;
  created_at?: string;
}

export interface CarImage {
  image_id: string;
  car_id: string;
  image_url: string;
}
