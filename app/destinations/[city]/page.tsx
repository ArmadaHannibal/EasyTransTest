"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Pagination } from "@heroui/pagination";
import { Chip } from "@heroui/chip";
import { FaArrowLeft, FaStar, FaLocationDot } from "react-icons/fa6";
import { FaBus, FaCar } from "react-icons/fa";
import { MdHotel, MdApartment, MdPeople } from "react-icons/md";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();
const PER_PAGE = 8;

// ── Destinations disponibles (même liste que DestinationHome) ─────────────────
const ALL_DESTINATIONS = [
  {
    city: "Brazzaville",
    url: "https://res.cloudinary.com/dtrpkegss/image/upload/v1765132100/A-Brazzaville-Mpila-est-en-plein-renouvellement-urbain_izfrwp.webp",
  },
  {
    city: "Pointe-Noire",
    url: "https://res.cloudinary.com/dtrpkegss/image/upload/v1765132101/vue-aerienne-de-drone-du-centre-ville-de-chisinau-vue-panoramique-sur-plusieurs-routes-de-batiments_oefmzk.webp",
  },
  {
    city: "Dolisie",
    url: "https://res.cloudinary.com/dtrpkegss/image/upload/v1765132100/Sans-titre-3_tukobh.webp",
  },
  {
    city: "Oyo",
    url: "https://res.cloudinary.com/dtrpkegss/image/upload/v1765132100/OYO_1_odb0wf.webp",
  },
];

// ── Types ─────────────────────────────────────────────────────────────────────
type Tab = "hotels" | "apartments" | "cars" | "tickets";

interface Hotel {
  hotel_id: string;
  name: string;
  city: string | null;
  star_rating: number | null;
  main_image_url: string | null;
  has_pool: boolean | null;
  has_breakfast: boolean | null;
  has_parking: boolean | null;
  agencies: { name: string } | null;
  hotel_rooms: { price_per_night: number }[];
}

interface Apartment {
  apartment_id: string;
  title: string;
  city: string | null;
  price_per_night: number;
  max_guests: number;
  main_image_url: string | null;
  property_type: string | null;
  agencies: { name: string } | null;
}

interface Car {
  car_id: string;
  brand: string;
  model: string;
  year: number | null;
  seats: number | null;
  transmission: string | null;
  price_per_day: number;
  main_image_url: string | null;
  agencies: { name: string; address: string | null } | null;
}

interface Ticket {
  ticket_id: number;
  ticket_price: number | null;
  departure_date: string | null;
  departure_location: string | null;
  destination: string | null;
  buses: {
    bus_name: string | null;
    bus_type: string | null;
    bus_capacity: number | null;
    bus_image_url: string | null;
  } | null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const minPrice = (rooms: { price_per_night: number }[]) =>
  rooms.length
    ? Math.min(...rooms.map((r) => Number(r.price_per_night)))
    : null;

const fmtPrice = (n: number) => Number(n).toLocaleString("fr-FR") + " FCFA";

const fmtDate = (d: string | null) =>
  d
    ? new Date(d).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
      })
    : "—";

// ── Page ──────────────────────────────────────────────────────────────────────
export default function DestinationPage() {
  const params = useParams();
  const router = useRouter();
  const city = decodeURIComponent((params?.city as string) ?? "");

  const [activeTab, setActiveTab] = useState<Tab>("hotels");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoaded, setInitialLoaded] = useState(false);

  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const [counts, setCounts] = useState({
    hotels: 0,
    apartments: 0,
    cars: 0,
    tickets: 0,
  });

  // ── Au chargement : fetch tous les counts + l'onglet actif ───────────────
  useEffect(() => {
    if (!city) return;
    setPage(1);
    setInitialLoaded(false);
    fetchAllCounts().then(() => setInitialLoaded(true));
    fetchTab(activeTab, 1);
  }, [city]);

  // ── Quand l'onglet change (sans changer de ville) ────────────────────────
  useEffect(() => {
    if (!city || !initialLoaded) return;
    setPage(1);
    fetchTab(activeTab, 1);
  }, [activeTab]);

  // ── Charge tous les counts en parallèle dès le début ────────────────────
  const fetchAllCounts = async () => {
    const [{ count: hotelCount }, { count: aptCount }, { count: ticketCount }] =
      await Promise.all([
        supabase
          .from("hotels")
          .select("hotel_id", { count: "exact", head: true })
          .ilike("city", city),
        supabase
          .from("apartments")
          .select("apartment_id", { count: "exact", head: true })
          .ilike("city", city)
          .eq("is_published", true),
        supabase
          .from("tickets")
          .select("ticket_id", { count: "exact", head: true })
          .gt("departure_date", new Date().toISOString())
          .or(`departure_location.ilike.${city},destination.ilike.${city}`),
      ]);

    // Voitures via agency_cities
    const { data: agencyIds } = await supabase
      .from("agency_cities")
      .select("agency_id")
      .ilike("city", city);
    const ids = (agencyIds ?? []).map((a: any) => a.agency_id);
    const carCount =
      ids.length > 0
        ? (
            await supabase
              .from("car_rentals")
              .select("car_id", { count: "exact", head: true })
              .in("agency_id", ids)
              .eq("is_available", true)
          ).count
        : 0;

    setCounts({
      hotels: hotelCount ?? 0,
      apartments: aptCount ?? 0,
      cars: carCount ?? 0,
      tickets: ticketCount ?? 0,
    });
  };

  const fetchTab = async (tab: Tab, p: number) => {
    setLoading(true);
    const from = (p - 1) * PER_PAGE;
    const to = from + PER_PAGE - 1;

    if (tab === "hotels") {
      const { data } = await supabase
        .from("hotels")
        .select(
          "hotel_id, name, city, star_rating, main_image_url, has_pool, has_breakfast, has_parking, agencies(name), hotel_rooms(price_per_night)",
        )
        .ilike("city", city)
        .range(from, to);
      setHotels((data as unknown as Hotel[]) ?? []);
    }

    if (tab === "apartments") {
      const { data } = await supabase
        .from("apartments")
        .select(
          "apartment_id, title, city, price_per_night, max_guests, main_image_url, property_type, agencies(name)",
        )
        .ilike("city", city)
        .eq("is_published", true)
        .range(from, to);
      setApartments((data as unknown as Apartment[]) ?? []);
    }

    if (tab === "cars") {
      const { data: agencyIds } = await supabase
        .from("agency_cities")
        .select("agency_id")
        .ilike("city", city);
      const ids = (agencyIds ?? []).map((a: any) => a.agency_id);

      if (ids.length === 0) {
        setCars([]);
      } else {
        const { data } = await supabase
          .from("car_rentals")
          .select(
            "car_id, brand, model, year, seats, transmission, price_per_day, main_image_url, agencies(name, address)",
          )
          .in("agency_id", ids)
          .eq("is_available", true)
          .range(from, to);
        setCars((data as unknown as Car[]) ?? []);
      }
    }

    if (tab === "tickets") {
      const { data } = await supabase
        .from("tickets")
        .select(
          "ticket_id, ticket_price, departure_date, departure_location, destination, buses(bus_name, bus_type, bus_capacity, bus_image_url)",
        )
        .gt("departure_date", new Date().toISOString())
        .or(`departure_location.ilike.${city},destination.ilike.${city}`)
        .range(from, to);
      setTickets((data as unknown as Ticket[]) ?? []);
    }

    setLoading(false);
  };

  const handlePageChange = (p: number) => {
    setPage(p);
    fetchTab(activeTab, p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalPages = Math.max(1, Math.ceil(counts[activeTab] / PER_PAGE));

  const currentDest = ALL_DESTINATIONS.find((d) => d.city === city);

  const TABS = [
    {
      key: "hotels" as Tab,
      label: "Hôtels",
      icon: MdHotel,
      count: counts.hotels,
    },
    {
      key: "apartments" as Tab,
      label: "Appartements",
      icon: MdApartment,
      count: counts.apartments,
    },
    { key: "cars" as Tab, label: "Voitures", icon: FaCar, count: counts.cars },
    {
      key: "tickets" as Tab,
      label: "Bus & Tickets",
      icon: FaBus,
      count: counts.tickets,
    },
  ];

  return (
    <div className="min-h-screen bg-(--bg-legebluefort) pt-20 pb-16">
      {/* ══ HERO ══ */}
      <div className="relative h-52 overflow-hidden mb-8">
        {currentDest && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${currentDest.url})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-(--bg-legebluefort)" />
        <div className="relative max-w-6xl mx-auto px-4 h-full flex flex-col justify-end pb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/70 hover:text-white text-sm mb-4 transition-colors w-fit group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Retour
          </button>
          <div className="flex items-center gap-3">
            <FaLocationDot className="text-red-400 w-5 h-5" />
            <h1 className="font-tourney text-4xl font-bold text-white">
              {city}
            </h1>
          </div>
          <p className="text-white/50 text-sm mt-1">
            {counts.hotels + counts.apartments + counts.cars + counts.tickets}{" "}
            résultat
            {counts.hotels +
              counts.apartments +
              counts.cars +
              counts.tickets !==
            1
              ? "s"
              : ""}{" "}
            disponibles dans cette zone
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 space-y-6">
        {/* ══ SWITCHER DE DESTINATION ══ */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-white/30 text-xs uppercase tracking-widest mb-3">
            Changer de destination
          </p>
          <div className="flex flex-wrap gap-2">
            {ALL_DESTINATIONS.map((dest) => (
              <button
                key={dest.city}
                onClick={() =>
                  router.push(`/destinations/${encodeURIComponent(dest.city)}`)
                }
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                  dest.city === city
                    ? "bg-white text-gray-900 border-white shadow-lg"
                    : "bg-white/5 text-white/60 border-white/10 hover:text-white hover:bg-white/10"
                }`}
              >
                <div
                  className="w-5 h-5 rounded-full bg-cover bg-center flex-shrink-0"
                  style={{ backgroundImage: `url(${dest.url})` }}
                />
                {dest.city}
                {dest.city === city && (
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 ml-1" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ══ TABS ══ */}
        <div className="flex gap-2 flex-wrap">
          {TABS.map(({ key, label, icon: Icon, count }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === key
                  ? "bg-(--bg-legebluecalme) text-white shadow"
                  : "bg-white/5 text-white/50 border border-white/10 hover:text-white hover:bg-white/10"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
              <span
                className={`px-1.5 py-0.5 rounded-full text-xs ${activeTab === key ? "bg-white/20" : "bg-white/10"}`}
              >
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* ══ RÉSULTATS ══ */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-white/10 border-t-white/60 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* HÔTELS */}
            {activeTab === "hotels" &&
              (hotels.length === 0 ? (
                <EmptyState label="hôtel" city={city} />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {hotels.map((h) => {
                    const prix = minPrice(h.hotel_rooms);
                    return (
                      <div
                        key={h.hotel_id}
                        onClick={() =>
                          router.push(`/hebergements/hotel/${h.hotel_id}`)
                        }
                        className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:border-yellow-400/30 hover:bg-white/8 transition-all group hover:-translate-y-1"
                      >
                        <div className="h-40 relative overflow-hidden">
                          {h.main_image_url ? (
                            <img
                              src={h.main_image_url}
                              alt={h.name}
                              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                            />
                          ) : (
                            <div className="w-full h-full bg-white/5 flex items-center justify-center">
                              <MdHotel className="text-white/20 w-10 h-10" />
                            </div>
                          )}
                          {h.star_rating && (
                            <div className="absolute top-2 left-2 flex gap-0.5">
                              {Array.from({ length: h.star_rating }).map(
                                (_, i) => (
                                  <FaStar
                                    key={i}
                                    className="text-yellow-400 w-3 h-3"
                                  />
                                ),
                              )}
                            </div>
                          )}
                          <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full">
                            {h.agencies?.name}
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="text-white font-semibold text-sm truncate">
                            {h.name}
                          </p>
                          <p className="text-white/40 text-xs flex items-center gap-1 mt-0.5">
                            <FaLocationDot className="text-red-400 w-3 h-3" />
                            {h.city}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {h.has_pool && (
                              <span className="text-[10px] bg-blue-400/10 text-blue-300 px-1.5 py-0.5 rounded-full">
                                🏊 Piscine
                              </span>
                            )}
                            {h.has_breakfast && (
                              <span className="text-[10px] bg-orange-400/10 text-orange-300 px-1.5 py-0.5 rounded-full">
                                🥐 Petit-déj.
                              </span>
                            )}
                            {h.has_parking && (
                              <span className="text-[10px] bg-green-400/10 text-green-300 px-1.5 py-0.5 rounded-full">
                                🅿️ Parking
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div>
                              <p className="text-[10px] text-white/30">
                                À partir de
                              </p>
                              <p className="text-yellow-400 font-bold text-sm">
                                {prix ? fmtPrice(prix) : "—"}{" "}
                                <span className="text-white/30 text-[10px] font-normal">
                                  /nuit
                                </span>
                              </p>
                            </div>
                            <span className="text-[10px] bg-yellow-400/15 text-yellow-300 px-2 py-0.5 rounded-full group-hover:bg-yellow-400/25">
                              Voir →
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}

            {/* APPARTEMENTS */}
            {activeTab === "apartments" &&
              (apartments.length === 0 ? (
                <EmptyState label="appartement" city={city} />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {apartments.map((apt) => (
                    <div
                      key={apt.apartment_id}
                      onClick={() =>
                        router.push(
                          `/hebergements/appartement/${apt.apartment_id}`,
                        )
                      }
                      className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:border-yellow-400/30 hover:bg-white/8 transition-all group hover:-translate-y-1"
                    >
                      <div className="h-40 relative overflow-hidden">
                        {apt.main_image_url ? (
                          <img
                            src={apt.main_image_url}
                            alt={apt.title}
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                          />
                        ) : (
                          <div className="w-full h-full bg-white/5 flex items-center justify-center">
                            <MdApartment className="text-white/20 w-10 h-10" />
                          </div>
                        )}
                        {apt.property_type && (
                          <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full">
                            {apt.property_type}
                          </div>
                        )}
                        <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full">
                          {apt.agencies?.name}
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="text-white font-semibold text-sm truncate">
                          {apt.title}
                        </p>
                        <p className="text-white/40 text-xs flex items-center gap-1 mt-0.5">
                          <FaLocationDot className="text-red-400 w-3 h-3" />
                          {apt.city}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1.5 text-white/40 text-xs">
                          <MdPeople className="w-3.5 h-3.5" /> Max{" "}
                          {apt.max_guests} pers.
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-yellow-400 font-bold text-sm">
                            {fmtPrice(apt.price_per_night)}{" "}
                            <span className="text-white/30 text-[10px] font-normal">
                              /nuit
                            </span>
                          </p>
                          <span className="text-[10px] bg-yellow-400/15 text-yellow-300 px-2 py-0.5 rounded-full group-hover:bg-yellow-400/25">
                            Voir →
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}

            {/* VOITURES */}
            {activeTab === "cars" &&
              (cars.length === 0 ? (
                <EmptyState label="voiture" city={city} />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {cars.map((car) => (
                    <div
                      key={car.car_id}
                      onClick={() => router.push(`/voitures/${car.car_id}`)}
                      className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:border-yellow-400/30 hover:bg-white/8 transition-all group hover:-translate-y-1"
                    >
                      <div className="h-40 relative overflow-hidden">
                        {car.main_image_url ? (
                          <img
                            src={car.main_image_url}
                            alt={`${car.brand} ${car.model}`}
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                          />
                        ) : (
                          <div className="w-full h-full bg-white/5 flex items-center justify-center">
                            <FaCar className="text-white/20 w-10 h-10" />
                          </div>
                        )}
                        <div className="absolute top-2 left-2 bg-green-500/80 text-white text-[10px] px-2 py-0.5 rounded-full">
                          Disponible
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full">
                          {car.agencies?.name}
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="text-white font-semibold text-sm">
                          {car.brand} {car.model}
                        </p>
                        {car.year && (
                          <p className="text-white/30 text-xs">{car.year}</p>
                        )}
                        <div className="flex flex-wrap gap-2 mt-1.5 text-white/40 text-xs">
                          {car.seats && (
                            <span className="flex items-center gap-0.5">
                              <MdPeople className="w-3.5 h-3.5" /> {car.seats}{" "}
                              places
                            </span>
                          )}
                          {car.transmission && (
                            <span>· {car.transmission}</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-yellow-400 font-bold text-sm">
                            {fmtPrice(car.price_per_day)}{" "}
                            <span className="text-white/30 text-[10px] font-normal">
                              /jour
                            </span>
                          </p>
                          <span className="text-[10px] bg-yellow-400/15 text-yellow-300 px-2 py-0.5 rounded-full group-hover:bg-yellow-400/25">
                            Voir →
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}

            {/* TICKETS BUS */}
            {activeTab === "tickets" &&
              (tickets.length === 0 ? (
                <EmptyState label="ticket de bus" city={city} />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tickets.map((t) => (
                    <div
                      key={t.ticket_id}
                      onClick={() => router.push("/transports")}
                      className="bg-white/5 border border-white/10 rounded-2xl p-4 cursor-pointer hover:border-yellow-400/30 hover:bg-white/8 transition-all group"
                    >
                      <div className="flex gap-3">
                        <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-white/5">
                          {t.buses?.bus_image_url ? (
                            <img
                              src={t.buses.bus_image_url}
                              alt={t.buses.bus_name ?? "Bus"}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FaBus className="text-white/20 w-6 h-6" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span
                              className={`font-semibold text-sm truncate ${t.departure_location?.toLowerCase() === city.toLowerCase() ? "text-yellow-300" : "text-white"}`}
                            >
                              {t.departure_location}
                            </span>
                            <span className="text-yellow-400 text-xs flex-shrink-0">
                              →
                            </span>
                            <span
                              className={`font-semibold text-sm truncate ${t.destination?.toLowerCase() === city.toLowerCase() ? "text-yellow-300" : "text-white"}`}
                            >
                              {t.destination}
                            </span>
                          </div>
                          <div className="flex gap-3 text-xs text-white/40">
                            <span>📅 {fmtDate(t.departure_date)}</span>
                            {t.buses?.bus_name && (
                              <span>🚌 {t.buses.bus_name}</span>
                            )}
                            {t.buses?.bus_type && (
                              <span>· {t.buses.bus_type}</span>
                            )}
                          </div>
                          {/* Indicateur destination correspondante */}
                          <div className="mt-1.5 flex gap-1.5">
                            {t.departure_location?.toLowerCase() ===
                              city.toLowerCase() && (
                              <span className="text-[10px] bg-green-400/10 text-green-400 px-2 py-0.5 rounded-full">
                                📍 Départ ici
                              </span>
                            )}
                            {t.destination?.toLowerCase() ===
                              city.toLowerCase() && (
                              <span className="text-[10px] bg-blue-400/10 text-blue-400 px-2 py-0.5 rounded-full">
                                🎯 Arrive ici
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex-shrink-0 text-right">
                          <p className="text-yellow-400 font-bold">
                            {t.ticket_price ? fmtPrice(t.ticket_price) : "—"}
                          </p>
                          <span className="text-[10px] mt-1 inline-block bg-yellow-400/15 text-yellow-300 px-2 py-0.5 rounded-full group-hover:bg-yellow-400/25">
                            Voir →
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <Pagination
                  showControls
                  page={page}
                  total={totalPages}
                  onChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ── État vide ─────────────────────────────────────────────────────────────────
function EmptyState({ label, city }: { label: string; city: string }) {
  return (
    <div className="text-center py-20 text-white/30">
      <FaLocationDot className="w-12 h-12 mx-auto mb-4 opacity-20" />
      <p className="text-lg">
        Aucun {label} disponible à {city} pour le moment.
      </p>
      <p className="text-sm mt-1 text-white/20">
        Nos partenaires étendent bientôt leur offre dans cette zone.
      </p>
    </div>
  );
}
