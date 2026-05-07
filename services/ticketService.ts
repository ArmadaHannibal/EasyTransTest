import { createClient } from "@/utils/supabase/client";

export type TicketInsert = {
  bus_id: number;
  ticket_price: number;
  departure_date: string;
  departure_location: string;
  destination: string;
  buyer_id: string;
  ticket_status?: "available" | "sold" | "cancelled";
  payment_status?: "pending" | "completed" | "failed";
  quantity: number;
  date_arrive?: string;
  heure_depart?: string;
  heure_arrive?: string;
};

export async function createTicket(ticket: TicketInsert) {
  const supabase = createClient();

  // Vérifier l’utilisateur connecté (utile avec RLS)
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Utilisateur non connecté");
  }

  const { data, error } = await supabase
    .from("tickets")
    .insert([
      {
        ...ticket,
        buyer_id: ticket.buyer_id || user.id,
        ticket_status: ticket.ticket_status ?? "sold",
        payment_status: ticket.payment_status ?? "pending",
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function fetchTickets() {
  const supabase = createClient();

  const { data: tickets, error } = await supabase
    .from("tickets")
    .select(
      `
      *,
      buses (
        bus_id,
        bus_name,
        bus_license_plate,
        owner_id,
        owner:users (
          user_id,
          first_name,
          last_name,
          email
        )
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) throw error;

  // Ensuite, on va chercher les agences des propriétaires
  const ownerIds = tickets.map((t) => t.buses?.owner?.user_id).filter(Boolean);

  const { data: agencies, error: agencyError } = await supabase
    .from("agencies")
    .select("*")
    .in("owner_id", ownerIds);

  if (agencyError) throw agencyError;

  // Fusionner les agences avec les tickets correspondants
  const enrichedTickets = tickets.map((ticket) => {
    const ownerId = ticket.buses?.owner?.user_id;
    const agency = agencies.find((a) => a.owner_id === ownerId);
    return { ...ticket, agency };
  });

  return enrichedTickets;
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
