"use client";

import * as React from "react";
import { useId, useEffect, useState, useMemo } from "react";
import { FaStar } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { MdFavorite } from "react-icons/md";
import { IoShieldCheckmarkSharp } from "react-icons/io5";
import { FaReceipt } from "react-icons/fa6";
import { LuRefreshCcwDot } from "react-icons/lu";
import { IoHeadsetSharp } from "react-icons/io5";
import {
  MdBusinessCenter,
  MdOutlineFamilyRestroom,
  MdApartment,
  MdWaves,
  MdLocationCity,
  MdFlight,
  MdPool,
  MdBreakfastDining,
  MdLocalParking,
  MdPets,
} from "react-icons/md";
import { GiLovers } from "react-icons/gi";
import { TbQuestionMark, TbTagsFilled, TbTrees } from "react-icons/tb";
import { FaCrown } from "react-icons/fa";
import { Slider } from "@heroui/slider";
import { Link } from "@heroui/link";
import { Pagination } from "@heroui/pagination";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/client";
import { BsCheckLg } from "react-icons/bs";
import Loader from "@/components/loader-15";

// ── Types ──────────────────────────────────────────────────────────────────────
interface AgencyRel {
  name: string;
  logo_url?: string | null;
}
interface Hotel {
  hotel_id: string;
  name: string;
  city: string | null;
  country: string | null;
  star_rating: number | null;
  main_image_url: string | null;
  description: string | null;
  address: string | null;
  agencies: AgencyRel | AgencyRel[] | null;
  hotel_rooms: { price_per_night: number }[] | null;
  has_pool: boolean;
  has_breakfast: boolean;
  has_parking: boolean;
  pets_allowed: boolean;
  is_business: boolean;
  is_family: boolean;
  is_romantic: boolean;
  is_unusual: boolean;
  is_luxury: boolean;
  is_budget: boolean;
  is_apart_hotel: boolean;
  near_beach: boolean;
  near_center: boolean;
  near_airport: boolean;
  in_nature: boolean;
}

const CATEGORY_FIELD_MAP: Record<string, keyof Hotel> = {
  business: "is_business",
  famille: "is_family",
  romantique: "is_romantic",
  insolite: "is_unusual",
  luxe: "is_luxury",
  bonplan: "is_budget",
  appart: "is_apart_hotel",
  plage: "near_beach",
  centre: "near_center",
  aeroport: "near_airport",
  nature: "in_nature",
  piscine: "has_pool",
  breakfast: "has_breakfast",
  parking: "has_parking",
  animaux: "pets_allowed",
};

// ── Helpers ────────────────────────────────────────────────────────────────────
const getAgency = (rel: Hotel["agencies"]): AgencyRel | null => {
  if (!rel) return null;
  if (Array.isArray(rel)) return rel[0] ?? null;
  return rel as AgencyRel;
};
const agencyName = (rel: Hotel["agencies"]) =>
  getAgency(rel)?.name ?? "Agence inconnue";
const minPrice = (hotel: Hotel): number | null => {
  const rooms = hotel.hotel_rooms;
  if (!Array.isArray(rooms) || rooms.length === 0) return null;
  const prices = rooms
    .map((r) => Number(r.price_per_night))
    .filter((p) => !isNaN(p));
  return prices.length > 0 ? Math.min(...prices) : null;
};

const PAGE_SIZE = 8;
const supabase = createClient();

// ── Catégories ─────────────────────────────────────────────────────────────────
const ArrayCategorie = [
  {
    id: 1,
    title: "Style de Voyage",
    colorHex: "#e05c5c",
    question: "Pour quel voyage ?",
    equipement: [
      {
        id: "business",
        icon: MdBusinessCenter,
        title: "Business",
        description: "Hôtels avec bureau, WiFi haut débit...",
      },
      {
        id: "famille",
        icon: MdOutlineFamilyRestroom,
        title: "En Famille",
        description: "Établissements avec chambres communicantes...",
      },
      {
        id: "romantique",
        icon: GiLovers,
        title: "Romantique",
        description: "Hôtels de charme, boutiques-hôtels...",
      },
      {
        id: "insolite",
        icon: TbQuestionMark,
        title: "Insolite",
        description: "Cabanes, bulles, châteaux...",
      },
    ],
  },
  {
    id: 2,
    title: "Budget et Standing",
    colorHex: "#f07a30",
    question: "Quel budget ?",
    equipement: [
      {
        id: "luxe",
        icon: FaCrown,
        title: "Luxe",
        description: "4 et 5 étoiles uniquement.",
      },
      {
        id: "bonplan",
        icon: TbTagsFilled,
        title: "Bon Plan",
        description: "Hôtels avec le meilleur rapport qualité/prix.",
      },
      {
        id: "appart",
        icon: MdApartment,
        title: "Appart'hôtels",
        description: "Pour ceux qui veulent une cuisine.",
      },
    ],
  },
  {
    id: 3,
    title: "Emplacement",
    colorHex: "#f5c518",
    question: "Où souhaitez-vous être ?",
    equipement: [
      {
        id: "plage",
        icon: MdWaves,
        title: "Pieds dans l'eau",
        description: "Accès direct à la plage.",
      },
      {
        id: "centre",
        icon: MdLocationCity,
        title: "Centre-ville",
        description: "Pour tout faire à pied.",
      },
      {
        id: "aeroport",
        icon: MdFlight,
        title: "Aéroport",
        description: "Pour les escales ou les voyages courts.",
      },
      {
        id: "nature",
        icon: TbTrees,
        title: "Pleine Nature",
        description: "Pour le calme, loin de l'agitation urbaine.",
      },
    ],
  },
  {
    id: 4,
    title: "Services",
    colorHex: "#1a73e8",
    question: "Quels équipements ?",
    equipement: [
      {
        id: "piscine",
        icon: MdPool,
        title: "Avec Piscine",
        description: "Pour la détente.",
      },
      {
        id: "breakfast",
        icon: MdBreakfastDining,
        title: "Petit-déjeuner",
        description: "Pour éviter les frais cachés.",
      },
      {
        id: "parking",
        icon: MdLocalParking,
        title: "Parking disponible",
        description: "Crucial pour les clients venant en voiture.",
      },
      {
        id: "animaux",
        icon: MdPets,
        title: "Animaux acceptés",
        description: "Une niche de clients très fidèle.",
      },
    ],
  },
];

// ── Design system (issu de PartenairesHome) ────────────────────────────────────
const GridPattern = () => {
  const id = useId();
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.04]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id={id} width="20" height="20" patternUnits="userSpaceOnUse">
          <path
            d="M 20 0 L 0 0 0 20"
            fill="none"
            stroke="white"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
};

const VignetteHotel = ({ stars }: { stars: number | null }) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#080808]">
    {/* <GridPattern /> */}
    <div className="absolute w-32 h-20 rounded-full blur-2xl bg-amber-500/10" />
    <svg
      viewBox="0 0 80 80"
      width="64"
      height="64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="relative opacity-55"
    >
      <rect
        x="18"
        y="18"
        width="44"
        height="54"
        stroke="white"
        strokeOpacity="0.15"
        strokeWidth="1"
        fill="white"
        fillOpacity="0.02"
      />
      {[0, 1, 2, 3].map((row) =>
        [0, 1, 2].map((col) => (
          <rect
            key={`${row}-${col}`}
            x={22 + col * 12}
            y={22 + row * 10}
            width="8"
            height="6"
            rx="1"
            stroke="white"
            strokeOpacity={row === 0 ? "0.3" : "0.15"}
            strokeWidth="0.7"
            fill="white"
            fillOpacity={row === 0 ? "0.06" : "0.02"}
          />
        )),
      )}
      <rect
        x="30"
        y="56"
        width="20"
        height="16"
        stroke="white"
        strokeOpacity="0.2"
        strokeWidth="0.8"
        fill="white"
        fillOpacity="0.04"
      />
      <path
        d="M22 56 L58 56"
        stroke="white"
        strokeOpacity="0.12"
        strokeWidth="0.8"
      />
    </svg>
    {stars && stars > 0 && (
      <div className="relative flex gap-0.5 mt-1">
        {Array.from({ length: stars }).map((_, i) => (
          <FaStar key={i} className="w-2.5 h-2.5 text-amber-400/60" />
        ))}
      </div>
    )}
  </div>
);

interface SmartImageProps {
  src: string | null;
  alt: string;
  eager?: boolean;
  fallback: React.ReactNode;
  className?: string;
}
const SmartImage: React.FC<SmartImageProps> = ({
  src,
  alt,
  eager,
  fallback,
  className = "",
}) => {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">(
    src ? "loading" : "error",
  );
  useEffect(() => {
    if (!src) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    const img = new window.Image();
    img.src = src;
    img.onload = () => setStatus("loaded");
    img.onerror = () => setStatus("error");
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);
  if (status === "error" || !src) return <>{fallback}</>;
  return (
    <>
      {status === "loading" && (
        <div className="absolute inset-0 bg-[#080808] animate-pulse" />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${status === "loaded" ? "opacity-100" : "opacity-0"} ${className}`}
      />
    </>
  );
};

const MonoBadge = ({ label, accent }: { label: string; accent?: boolean }) => (
  <span
    className={`text-[9px] tracking-[.2em] uppercase px-2 py-0.5 border ${accent ? "border-amber-400/30 bg-amber-400/30 text-white" : "border-white/[0.08] bg-gray-700 text-white"}`}
  >
    {label}
  </span>
);

const CardCTA = ({
  href,
  label,
  disabled,
}: {
  href: string;
  label: string;
  disabled?: boolean;
}) => (
  <Link
    href={disabled ? "#" : href}
    aria-disabled={disabled}
    className={`flex items-center gap-2 text-[10px] tracking-[.25em] uppercase transition-all duration-300 no-underline group/cta ${disabled ? "text-white/15 pointer-events-none" : "text-white/40 hover:text-white hover:gap-3"}`}
  >
    {label}
    <span className="inline-block w-4 h-px bg-current group-hover/cta:w-7 transition-all duration-300" />
  </Link>
);

const SkeletonCard = () => (
  <div className="bg-[#0d0d0d] overflow-hidden">
    {/* <div className="h-44 bg-[#080808] relative overflow-hidden">
      <GridPattern />
    </div> */}
    <div className="h-px bg-white/[0.06]" />
    <div className="p-5 space-y-3">
      <div className="h-2 w-8 bg-white/[0.06] rounded" />
      <div className="h-4 w-3/4 bg-white/[0.08] rounded" />
      <div className="h-3 w-full bg-white/[0.04] rounded" />
      <div className="pt-3 border-t border-white/[0.06] flex justify-between items-center">
        <div className="h-4 w-16 bg-white/[0.06] rounded" />
        <div className="h-5 w-20 bg-white/[0.08] rounded" />
      </div>
    </div>
  </div>
);

const SectionHeader = ({
  label,
  subtitle,
}: {
  label: string;
  subtitle: string;
}) => (
  <div className="mb-10 md:mb-14 w-full">
    <div className="flex items-center gap-5">
      <div className="w-[3px] h-20 bg-white shrink-0" />
      <div>
        <p className="text-xs tracking-[0.45em] uppercase text-white/40 mt-1">
          {label}
        </p>
        <h2 className="text-sm md:text-base font-black text-white tracking-tight mt-1">
          {subtitle}
        </h2>
      </div>
    </div>
    <div className="mt-6 flex items-center gap-4">
      <div className="h-px flex-1 bg-white/10" />
      <span className="text-white/20 text-xs tracking-widest">EasyTrans</span>
      <div className="w-8 h-px bg-white/10" />
    </div>
  </div>
);

// ── Hotel Card (design system PartenairesHome) ─────────────────────────────────
const HotelCard = ({ hotel, index }: { hotel: Hotel; index: number }) => {
  const prix = minPrice(hotel);
  const aName = agencyName(hotel.agencies);
  const isPremium = (hotel.star_rating ?? 0) >= 4;

  return (
    <div className="group relative bg-[#0d0d0d] hover:bg-[#0f0f0f] transition-colors duration-300 overflow-hidden flex flex-col h-full">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/0 group-hover:bg-white/20 transition-all duration-500 z-10" />

      <div className="relative h-44 overflow-hidden bg-[#080808] flex-shrink-0">
        {/* <GridPattern /> */}
        <SmartImage
          src={hotel.main_image_url}
          alt={hotel.name}
          eager={index < 4}
          className="brightness-[.65] group-hover:brightness-[.8] group-hover:scale-[1.03] transition-all duration-500"
          fallback={<VignetteHotel stars={hotel.star_rating} />}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0d0d0d] z-10" />

        <button className="absolute top-3 right-3 z-20 w-7 h-7 border border-white/10 bg-black/40 flex items-center justify-center hover:bg-white/10 transition-colors">
          <MdFavorite className="text-white/50 w-3.5 h-3.5" />
        </button>

        <div className="absolute top-3 left-3 z-20 flex gap-1.5">
          <MonoBadge
            label={prix ? "Disponible" : "Non renseigné"}
            accent={!!prix}
          />
          {isPremium && <MonoBadge label="Premium" accent />}
        </div>

        <div className="absolute bottom-3 left-3 z-20">
          <span className="text-[9px] tracking-[.2em] uppercase text-white/40 font-mono">
            {aName}
          </span>
        </div>
      </div>

      <div className="h-px bg-white/[0.06]" />

      <div className="px-5 pt-4 pb-5 flex flex-col flex-1">
        <div className="flex items-center gap-1 text-[10px] text-white/25 mb-2">
          <FaLocationDot className="w-2.5 h-2.5 text-white/20" />
          <span className="truncate font-mono">
            {hotel.city}
            {hotel.country ? `, ${hotel.country}` : ""}
          </span>
        </div>
        <h3 className="text-base font-black text-white tracking-tight mb-2 truncate">
          {hotel.name}
        </h3>
        {hotel.star_rating && (
          <div className="flex gap-0.5 mb-3">
            {Array.from({ length: hotel.star_rating }).map((_, i) => (
              <FaStar key={i} className="text-amber-400/70 w-2.5 h-2.5" />
            ))}
          </div>
        )}
        <div className="mt-auto border-t border-white/[0.06] pt-4 flex items-center justify-between">
          <div>
            {prix ? (
              <>
                <p className="text-[9px] text-white/20 font-mono">
                  À partir de
                </p>
                <p className="text-base font-black text-white leading-tight mt-0.5">
                  {prix.toLocaleString()}
                  <span className="text-[10px] font-normal text-white/25 ml-1">
                    FCFA/nuit
                  </span>
                </p>
              </>
            ) : (
              <span className="text-[10px] text-white/20 italic">
                Prix non renseigné
              </span>
            )}
          </div>
          <CardCTA
            href={`/hebergements/hotel/${hotel.hotel_id}`}
            label={prix ? "Réserver" : "Voir"}
          />
        </div>
      </div>
    </div>
  );
};

// ── Category Card (dark redesign) ──────────────────────────────────────────────
const CategoryCard = ({
  cat,
  selectedCategory,
  onSelect,
}: {
  cat: (typeof ArrayCategorie)[0];
  selectedCategory: string | null;
  onSelect: (id: string) => void;
}) => (
  <div
    className="bg-[#0d0d0d] overflow-hidden border-t-2"
    style={{ borderColor: `${cat.colorHex}40` }}
  >
    {/* <GridPattern /> */}
    {/* Header */}
    <div className="relative px-5 py-4 border-b border-white/[0.06]">
      <span
        className="text-[9px] tracking-[.3em] uppercase font-mono mb-2 block"
        style={{ color: cat.colorHex }}
      >
        {cat.title}
      </span>
      <p className="text-sm font-black text-white tracking-tight">
        {cat.question}
      </p>
    </div>
    {/* Items */}
    {cat.equipement.map((eq) => {
      const Icon = eq.icon;
      const isActive = selectedCategory === eq.id;
      return (
        <div
          key={eq.id}
          onClick={() => onSelect(eq.id)}
          className={`relative flex items-center gap-3 px-5 py-3 cursor-pointer border-b border-white/[0.04] last:border-0 transition-all duration-200 group/item ${isActive ? "bg-white/[0.04]" : "hover:bg-white/[0.02]"}`}
        >
          {/* Accent left si actif */}
          {isActive && (
            <div
              className="absolute left-0 top-0 bottom-0 w-[2px]"
              style={{ backgroundColor: cat.colorHex }}
            />
          )}

          <div
            className="w-8 h-8 flex items-center justify-center flex-shrink-0 border border-white/[0.06] transition-all duration-200"
            style={{
              backgroundColor: isActive ? `${cat.colorHex}18` : "transparent",
            }}
          >
            <Icon
              className="w-3.5 h-3.5"
              style={{
                color: isActive ? cat.colorHex : "rgba(255,255,255,0.3)",
              }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <p
              className={`text-[13px] font-bold truncate transition-colors ${isActive ? "text-white" : "text-white/50 group-hover/item:text-white/70"}`}
            >
              {eq.title}
            </p>
            <p className="text-[10px] text-white/20 truncate font-mono">
              {eq.description}
            </p>
          </div>

          <div
            className="w-[16px] h-[16px] flex items-center justify-center flex-shrink-0 border transition-all duration-200"
            style={{
              borderColor: isActive ? cat.colorHex : "rgba(255,255,255,0.1)",
              backgroundColor: isActive ? cat.colorHex : "transparent",
            }}
          >
            {isActive && <BsCheckLg className="w-2 h-2 text-white" />}
          </div>
        </div>
      );
    })}
  </div>
);

// ── COMPOSANT PRINCIPAL ────────────────────────────────────────────────────────
export default function HebergementsHotelPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [cities, setCities] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [starFilter, setStarFilter] = useState(0);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  const [page, setPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: hotelsData } = await supabase
        .from("hotels")
        .select(
          `hotel_id, name, city, country, star_rating, main_image_url, description, address,
          has_pool, has_breakfast, has_parking, pets_allowed,
          is_business, is_family, is_romantic, is_unusual,
          is_luxury, is_budget, is_apart_hotel,
          near_beach, near_center, near_airport, in_nature,
          agencies(name, logo_url)`,
        )
        .order("created_at", { ascending: false });
      const hotelList =
        (hotelsData as unknown as Omit<Hotel, "hotel_rooms">[]) || [];
      const { data: roomsData } = await supabase
        .from("hotel_rooms")
        .select("hotel_id, price_per_night")
        .eq("is_available", true);
      const roomsByHotel: Record<string, { price_per_night: number }[]> = {};
      if (roomsData) {
        for (const room of roomsData as {
          hotel_id: string;
          price_per_night: number;
        }[]) {
          if (!roomsByHotel[room.hotel_id]) roomsByHotel[room.hotel_id] = [];
          roomsByHotel[room.hotel_id].push({
            price_per_night: room.price_per_night,
          });
        }
      }
      const list: Hotel[] = hotelList.map((h) => ({
        ...h,
        hotel_rooms: roomsByHotel[h.hotel_id] ?? [],
      }));
      setHotels(list);
      setCities(
        Array.from(
          new Set(list.map((h) => h.city).filter(Boolean)),
        ) as string[],
      );
      setLoading(false);
    };
    fetchData();
  }, []);

  const filtered = useMemo(
    () =>
      hotels.filter((h) => {
        if (search) {
          const q = search.toLowerCase();
          if (
            ![h.name, h.city, h.country].some((v) =>
              v?.toLowerCase().includes(q),
            )
          )
            return false;
        }
        if (cityFilter !== "all" && h.city !== cityFilter) return false;
        if (starFilter > 0 && (h.star_rating ?? 0) < starFilter) return false;
        const prix = minPrice(h);
        if (prix !== null && (prix < priceRange[0] || prix > priceRange[1]))
          return false;
        if (categoryFilter) {
          const field = CATEGORY_FIELD_MAP[categoryFilter];
          if (field && !h[field]) return false;
        }
        return true;
      }),
    [hotels, search, cityFilter, starFilter, priceRange, categoryFilter],
  );

  useEffect(() => {
    setPage(1);
  }, [search, cityFilter, starFilter, priceRange, categoryFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleCategorySelect = (id: string) => {
    setCategoryFilter((prev) => (prev === id ? null : id));
    document
      .getElementById("listing-hotels")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const activeLabel = ArrayCategorie.flatMap((c) => c.equipement).find(
    (e) => e.id === categoryFilter,
  )?.title;

  const isLoading = loading;

  if (isLoading)
    return (
      <div className="relative flex flex-col items-center justify-center h-screen">
        <Loader />
        <div className="mt-64 text-center text-white/40 text-sm font-mono tracking-widest">
          Recherche d'hôtels…
        </div>
      </div>
    );

  return (
    <>
      {/* ══ HERO ══ */}
      <header>
        <div className="relative bg-[url(https://res.cloudinary.com/dtrpkegss/image/upload/v1768140405/vue-de-l-espace-interieur-de-l-hotel-de-luxe_1__11zon_hjkp2u.webp)] bg-right bg-no-repeat bg-size-[60rem] lg:bg-size-[100rem] h-[70vh] lg:h-[75vh]">
          <div className="flex flex-col mx-auto max-w-6xl justify-end items-center h-full text-white text-left pl-0 lg:p-4 pb-12 pr-0 lg:pb-56 z-10 relative">
            <div className="flex justify-center text-center">
              <div>
                <h1 className="text-[1.5rem] lg:text-4xl font-bold mb-4 w-[23rem] lg:w-[43rem]">
                  EasyTrans - Réservez un appartement ou une chambre pour votre
                  séjour
                </h1>
                <p className="text-sm lg:text-base w-[23rem] lg:w-[43rem]">
                  Trouvez des appartements confortables et des chambres
                  soigneusement sélectionnés pour vos séjours courts ou longs.
                </p>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 bg-black opacity-50" />
          <div className="absolute -bottom-1 w-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
              <path
                fill="#01202f"
                fillOpacity="1"
                d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,277.3C672,288,768,288,864,282.7C960,277,1056,267,1152,266.7C1248,267,1344,277,1392,282.7L1440,288L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              />
            </svg>
          </div>
        </div>
      </header>

      {/* ══ AVANTAGES ══ */}
      <section className="relative py-16 md:py-24">
        <div className="absolute left-8 top-0 bottom-0 w-px bg-white/[0.08] hidden lg:block" />
        <div className="mx-auto max-w-6xl px-4 lg:px-0">
          <SectionHeader
            label="Hôtel"
            subtitle="CE QUI REND NOS HÔTELS UNIQUES"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-0 divide-y divide-white/[0.06]">
              {[
                {
                  icon: IoShieldCheckmarkSharp,
                  num: "01",
                  title: "Hôtels vérifiés",
                  desc: "Tous nos établissements sont rigoureusement sélectionnés.",
                },
                {
                  icon: FaReceipt,
                  num: "02",
                  title: "Prix transparents",
                  desc: "Toujours sans frais cachés.",
                },
                {
                  icon: LuRefreshCcwDot,
                  num: "03",
                  title: "Flexibilité de séjour",
                  desc: "Annulation claire et simple.",
                },
                {
                  icon: IoHeadsetSharp,
                  num: "04",
                  title: "Assistance 24/7",
                  desc: "Toujours à vos côtés.",
                },
              ].map(({ icon: Icon, num, title, desc }) => (
                <div
                  key={num}
                  className="group flex items-start gap-6 py-6 hover:bg-white/[0.015] transition-colors duration-300 px-2 -mx-2"
                >
                  <span className="text-[10px] font-black tracking-[.3em] text-white/20 font-mono pt-1 flex-shrink-0">
                    {num}
                  </span>
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-8 h-8 border border-white/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:border-white/30 transition-colors">
                      <Icon className="w-3.5 h-3.5 text-white/30 group-hover:text-white/60 transition-colors" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white tracking-tight">
                        {title}
                      </h4>
                      <p className="text-[11px] text-white/30 mt-1 leading-relaxed">
                        {desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative hidden lg:block">
              <div className="relative h-[28rem] overflow-hidden bg-[#080808] border border-white/[0.06]">
                {/* <GridPattern /> */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://res.cloudinary.com/dtrpkegss/image/upload/v1768140405/vue-de-l-espace-interieur-de-l-hotel-de-luxe_1__11zon_hjkp2u.webp"
                  alt="Vue hôtel luxe"
                  className="absolute inset-0 w-full h-full object-cover brightness-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-[9px] tracking-[.35em] uppercase text-white/30 mb-1 font-mono">
                    EasyTrans
                  </p>
                  <p className="text-base font-black text-white">
                    Hébergements premium sélectionnés
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ CATÉGORIES ══ */}
      <section className="relative py-16 md:py-20">
        <div className="absolute left-8 top-0 bottom-0 w-px bg-white/[0.08] hidden lg:block" />
        <div className="mx-auto max-w-6xl px-4 lg:px-0">
          <SectionHeader
            label="Filtrer par"
            subtitle="CATÉGORIES D'HÉBERGEMENTS"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.06] mb-px">
            {ArrayCategorie.slice(0, 3).map((cat) => (
              <CategoryCard
                key={cat.id}
                cat={cat}
                selectedCategory={categoryFilter}
                onSelect={handleCategorySelect}
              />
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.06]">
            <div className="lg:col-start-2">
              <CategoryCard
                cat={ArrayCategorie[3]}
                selectedCategory={categoryFilter}
                onSelect={handleCategorySelect}
              />
            </div>
          </div>

          {/* Badge filtre actif */}
          {categoryFilter && (
            <div className="flex items-center gap-3 mt-6 pt-6 border-t border-white/[0.06]">
              <span className="text-[10px] tracking-[.2em] uppercase text-white/30 font-mono">
                Filtre actif
              </span>
              <span className="text-[10px] tracking-[.15em] uppercase text-white border border-white/20 px-3 py-1 font-mono">
                {activeLabel}
              </span>
              <button
                onClick={() => setCategoryFilter(null)}
                className="text-[10px] tracking-[.2em] uppercase text-white/25 hover:text-white/60 transition-colors font-mono"
              >
                Effacer ×
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ══ LISTING + FILTRES ══ */}
      <section id="listing-hotels" className="relative py-16 md:py-20 pb-28">
        <div className="absolute left-8 top-0 bottom-0 w-px bg-white/[0.08] hidden lg:block" />
        <div className="mx-auto max-w-6xl px-4 lg:px-0">
          <SectionHeader
            label="Catalogue"
            subtitle="HÉBERGEMENTS DISPONIBLES"
          />

          {/* Filtres — dark panel */}
          <div className="bg-[#0d0d0d] border border-white/[0.06] p-6 mb-8">
            {/* <GridPattern /> */}
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-5">
                <p className="text-[10px] tracking-[.35em] uppercase text-white/30 font-mono">
                  Affiner la recherche
                </p>
                <span className="text-[10px] tracking-[.2em] text-white/20 font-mono border border-white/[0.08] px-2 py-0.5">
                  {filtered.length} résultat{filtered.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Recherche */}
                <div>
                  <p className="text-[10px] tracking-[.3em] uppercase text-white/30 font-mono mb-2">
                    Recherche
                  </p>
                  <Input
                    placeholder="Nom, ville, pays..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-transparent border-white/[0.08] text-white placeholder:text-white/20 rounded-none focus:border-white/30 text-sm"
                  />
                </div>

                {/* Ville */}
                <div>
                  <p className="text-[10px] tracking-[.3em] uppercase text-white/30 font-mono mb-2">
                    Ville
                  </p>
                  <select
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    className="w-full bg-transparent border border-white/[0.08] text-white/60 px-3 py-2 text-sm focus:outline-none focus:border-white/30 appearance-none"
                  >
                    <option value="all" className="bg-[#0d0d0d]">
                      Toutes les villes
                    </option>
                    {cities.map((c) => (
                      <option key={c} value={c} className="bg-[#0d0d0d]">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Étoiles */}
                <div>
                  <p className="text-[10px] tracking-[.3em] uppercase text-white/30 font-mono mb-2">
                    Étoiles minimum
                  </p>
                  <div className="flex gap-1 flex-wrap mt-1">
                    {[0, 1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        onClick={() => setStarFilter(n)}
                        className={`px-2.5 py-1 text-[10px] tracking-[.15em] uppercase border transition-all duration-200 font-mono ${
                          starFilter === n
                            ? "border-white/40 text-white bg-white/10"
                            : "border-white/[0.08] text-white/30 hover:border-white/20 hover:text-white/50"
                        }`}
                      >
                        {n === 0 ? "Tous" : `${n}★`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Prix */}
                <div className="sm:col-span-2 lg:col-span-3">
                  <p className="text-[10px] tracking-[.3em] uppercase text-white/30 font-mono mb-2">
                    Prix / nuit —{" "}
                    <span className="text-white/50">
                      {priceRange[0].toLocaleString()} –{" "}
                      {priceRange[1].toLocaleString()} FCFA
                    </span>
                  </p>
                  <Slider
                    className="max-w-md"
                    value={priceRange}
                    onChange={(v) => setPriceRange(v as [number, number])}
                    formatOptions={{ style: "currency", currency: "XAF" }}
                    label=" "
                    maxValue={500000}
                    minValue={0}
                    step={1000}
                    classNames={{
                      track: "bg-white/10",
                      filler: "bg-white/40",
                      thumb: "bg-white border-0 w-3 h-3",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Grille hôtels */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.06]">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : paginated.length === 0 ? (
            <div className="border border-white/[0.06] py-20 text-center">
              {/* <GridPattern /> */}
              <p className="relative text-white/30 text-sm font-mono tracking-widest">
                AUCUN RÉSULTAT
              </p>
              <p className="relative text-white/15 text-xs mt-2 font-mono">
                Modifiez vos filtres pour afficher des hôtels
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.06]">
              {paginated.map((hotel, i) => (
                <HotelCard key={hotel.hotel_id} hotel={hotel} index={i} />
              ))}
            </div>
          )}

          {!loading && totalPages > 1 && (
            <div className="flex justify-end mt-8 pt-6 border-t border-white/[0.06]">
              <Pagination
                showControls
                page={page}
                total={totalPages}
                onChange={(p) => {
                  setPage(p);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                classNames={{
                  item: "bg-transparent border border-white/[0.08] text-white/40 rounded-none hover:bg-white/10",
                  cursor: "bg-white text-black rounded-none font-black",
                }}
              />
            </div>
          )}
        </div>
      </section>
    </>
  );
}
