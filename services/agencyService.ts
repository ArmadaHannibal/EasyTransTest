import { createClient } from "@/utils/supabase/client";

// Exportez tous les types
export interface Ticket {
  ticket_id: string;
  bus_id: string;
  ticket_price: number;
  available_seats: number;
  departure_date: string;
  departure_location: string;
  destination: string;
  route?: {
    departure_city: string;
    arrival_city: string;
    departure_time: string;
    arrival_time: string;
  };
  // autres propriétés des tickets
}

export interface Bus {
  bus_id: string;
  owner_id: string;
  bus_model?: string;
  plate_number?: string;
  capacity?: number;
  owner?: {
    user_id: string;
    first_name: string;
    last_name: string;
  };
  tickets?: Ticket[];
}

export interface Agency {
  id: string;
  owner_id: string;
  name: string;
  phone?: string;
  address?: string;
  logo_url?: string;
  description?: string;
  owner?: {
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    profile_picture?: string;
  };
  // autres propriétés d'agence
}

export interface EnrichedAgency extends Agency {
  buses: Bus[];
  buses_count: number;
  tickets_count: number;
}

export async function fetchAgenciesWithTickets(): Promise<EnrichedAgency[]> {
  const supabase = createClient();

  // Récupérer toutes les agences avec leurs propriétaires
  const { data: agencies, error } = await supabase
    .from("agencies")
    .select(
      `
      *,
      owner:users (
        user_id,
        first_name,
        last_name,
        email,
        profile_picture
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) throw error;

  // Récupérer les bus et tickets associés à ces agences
  const ownerIds = agencies.map((a) => a.owner_id).filter(Boolean);

  const { data: busesWithTickets, error: busesError } = await supabase
    .from("buses")
    .select(
      `
      *,
      owner:users(user_id, first_name, last_name),
      tickets(*)
    `,
    )
    .in("owner_id", ownerIds);

  if (busesError) throw busesError;

  // Grouper les bus par owner_id pour éviter les doublons
  const busesByOwner = busesWithTickets.reduce(
    (acc: { [key: string]: Bus[] }, bus) => {
      if (!acc[bus.owner_id]) {
        acc[bus.owner_id] = [];
      }
      acc[bus.owner_id].push(bus);
      return acc;
    },
    {},
  );

  // Fusionner les données sans doublons
  const enrichedAgencies = agencies.map((agency): EnrichedAgency => {
    const agencyBuses = busesByOwner[agency.owner_id] || [];

    // Calculer le nombre total de tickets pour cette agence
    const totalTickets = agencyBuses.reduce((total: number, bus: Bus) => {
      return total + (bus.tickets?.length || 0);
    }, 0);

    return {
      ...agency,
      buses: agencyBuses,
      buses_count: agencyBuses.length,
      tickets_count: totalTickets,
    };
  });

  console.log("Nombre d'agences:", enrichedAgencies.length);
  console.log("Agences:", enrichedAgencies);

  return enrichedAgencies;
}

export async function fetchAgencyById(
  agencyId: string,
): Promise<EnrichedAgency | null> {
  const supabase = createClient();

  try {
    // Même structure que fetchAgenciesWithTickets
    const { data: agency, error } = await supabase
      .from("agencies")
      .select(
        `
        *,
        owner:users (
          user_id,
          first_name,
          last_name,
          email,
          profile_picture
        )
      `,
      )
      .eq("id", agencyId)
      .single();

    if (error) {
      console.error("Supabase error fetching agency:", error);
      return null;
    }

    if (!agency) {
      console.log("Agency not found for ID:", agencyId);
      return null;
    }

    // Même requête que dans fetchAgenciesWithTickets
    const { data: busesWithTickets, error: busesError } = await supabase
      .from("buses")
      .select(
        `
        *,
        owner:users(user_id, first_name, last_name),
        tickets(*)
      `,
      )
      .eq("owner_id", agency.owner_id);

    if (busesError) {
      console.error("Error fetching buses:", busesError);
      // Retourner l'agence avec des tableaux vides comme dans l'autre fonction
      return {
        ...agency,
        buses: [],
        buses_count: 0,
        tickets_count: 0,
      };
    }

    // Même calcul que dans fetchAgenciesWithTickets
    const totalTickets = busesWithTickets.reduce((total: number, bus: Bus) => {
      return total + (bus.tickets?.length || 0);
    }, 0);

    return {
      ...agency,
      buses: busesWithTickets,
      buses_count: busesWithTickets.length,
      tickets_count: totalTickets,
    };
  } catch (error) {
    console.error("Unexpected error in fetchAgencyById:", error);
    return null;
  }
}
