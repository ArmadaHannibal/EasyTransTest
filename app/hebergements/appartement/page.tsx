"use client";

import * as React from "react";
import { useId, useEffect, useState, useMemo } from "react";
import { FaLocationDot } from "react-icons/fa6";
import {
  MdFavorite,
  MdPeople,
  MdLockOpen,
  MdWeekend,
  MdSavings,
  MdFamilyRestroom,
  MdOutlineSchedule,
} from "react-icons/md";
import { Link } from "@heroui/link";
import { Pagination } from "@heroui/pagination";
import { Slider } from "@heroui/slider";
import { CheckboxGroup, Checkbox } from "@heroui/checkbox";
import { Input } from "@/components/ui/input";
import { RiMapPinFill } from "react-icons/ri";
import {
  TbHomeHeart,
  TbBuildingWarehouse,
  TbHome2,
  TbCalendarTime,
} from "react-icons/tb";
import { MdSingleBed } from "react-icons/md";
import { FaGem } from "react-icons/fa";
import { BsCheckLg } from "react-icons/bs";
import { createClient } from "@/utils/supabase/client";
import Loader from "@/components/loader-15";

// ── Types ──────────────────────────────────────────────────────────────────────
interface AgencyRel {
  name: string;
  logo_url?: string | null;
}
interface Apartment {
  apartment_id: string;
  title: string;
  city: string | null;
  country: string | null;
  address: string | null;
  price_per_night: number;
  max_guests: number | null;
  number_of_rooms: number | null;
  equipments: string[] | null;
  main_image_url: string | null;
  agencies: AgencyRel | AgencyRel[] | null;
  is_studio: boolean;
  is_family: boolean;
  is_luxury: boolean;
  is_long_stay: boolean;
}

// ── Helpers ────────────────────────────────────────────────────────────────────
const getAgency = (rel: Apartment["agencies"]): AgencyRel | null => {
  if (!rel) return null;
  if (Array.isArray(rel)) return rel[0] ?? null;
  return rel as AgencyRel;
};
const agencyName = (rel: Apartment["agencies"]): string =>
  getAgency(rel)?.name ?? "Agence inconnue";
const hasEquip = (equipments: string[] | null, ...keywords: string[]) => {
  if (!equipments) return false;
  return equipments.some((e) =>
    keywords.some((k) => e.toLowerCase().includes(k.toLowerCase())),
  );
};

const PAGE_SIZE = 8;
const supabase = createClient();

const CATEGORY_FIELD_MAP: Record<string, keyof Apartment> = {
  studio: "is_studio",
  famille: "is_family",
  luxe: "is_luxury",
  longstay: "is_long_stay",
};

const ArrayCategorie = [
  {
    id: 1,
    categoryId: "studio",
    title: "Studios Cozy",
    desc: "Idéal pour les couples ou voyageurs en solo.",
    icon: TbHomeHeart,
    iconTop: MdSingleBed,
    colorHex: "#6366f1",
  },
  {
    id: 2,
    categoryId: "famille",
    title: "Appartements Familiaux",
    desc: "Grandes surfaces avec plusieurs chambres.",
    icon: MdFamilyRestroom,
    iconTop: TbHome2,
    colorHex: "#f59e0b",
  },
  {
    id: 3,
    categoryId: "luxe",
    title: "Lofts de Luxe",
    desc: "Design moderne et vues imprenables.",
    icon: TbBuildingWarehouse,
    iconTop: FaGem,
    colorHex: "#e05c5c",
  },
  {
    id: 4,
    categoryId: "longstay",
    title: "Séjours Longue Durée",
    desc: "Équipés pour le télétravail (Fibre, bureau).",
    icon: MdOutlineSchedule,
    iconTop: TbCalendarTime,
    colorHex: "#1a73e8",
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

const VignetteAppartement = () => (
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#080808]">
    <GridPattern />
    <div className="absolute w-28 h-20 rounded-full blur-2xl bg-blue-500/8" />
    <svg
      viewBox="0 0 80 80"
      width="64"
      height="64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="relative opacity-55"
    >
      <rect
        x="12"
        y="25"
        width="56"
        height="47"
        stroke="white"
        strokeOpacity="0.15"
        strokeWidth="1"
        fill="white"
        fillOpacity="0.02"
      />
      {[0, 1, 2, 3].map((row) =>
        [0, 1, 2, 3].map((col) => (
          <rect
            key={`${row}-${col}`}
            x={16 + col * 12}
            y={28 + row * 10}
            width="8"
            height="6"
            rx="1"
            stroke="white"
            strokeOpacity="0.18"
            strokeWidth="0.7"
            fill="white"
            fillOpacity="0.04"
          />
        )),
      )}
      <rect
        x="33"
        y="57"
        width="14"
        height="15"
        stroke="white"
        strokeOpacity="0.25"
        strokeWidth="0.8"
        fill="white"
        fillOpacity="0.04"
      />
      <line
        x1="8"
        y1="25"
        x2="72"
        y2="25"
        stroke="white"
        strokeOpacity="0.2"
        strokeWidth="1"
      />
      <line
        x1="40"
        y1="25"
        x2="40"
        y2="15"
        stroke="white"
        strokeOpacity="0.15"
        strokeWidth="0.8"
      />
      <line
        x1="36"
        y1="17"
        x2="44"
        y2="17"
        stroke="white"
        strokeOpacity="0.15"
        strokeWidth="0.8"
      />
    </svg>
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

const CardCTA = ({ href, label }: { href: string; label: string }) => (
  <Link
    href={href}
    className="flex items-center gap-2 text-[10px] tracking-[.25em] uppercase transition-all duration-300 no-underline group/cta text-white/40 hover:text-white hover:gap-3"
  >
    {label}
    <span className="inline-block w-4 h-px bg-current group-hover/cta:w-7 transition-all duration-300" />
  </Link>
);

const SkeletonCard = () => (
  <div className="bg-[#0d0d0d] overflow-hidden">
    <div className="h-44 bg-[#080808] relative overflow-hidden">
      <GridPattern />
    </div>
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

// ── Apartment Card ─────────────────────────────────────────────────────────────
const ApartmentCard = ({ apt, index }: { apt: Apartment; index: number }) => {
  const aName = agencyName(apt.agencies);
  const wifi = hasEquip(apt.equipments, "wi-fi", "wifi", "internet");
  const cuisine = hasEquip(apt.equipments, "cuisine");
  const parking = hasEquip(apt.equipments, "parking");

  return (
    <div className="group relative bg-[#0d0d0d] hover:bg-[#0f0f0f] transition-colors duration-300 overflow-hidden flex flex-col h-full">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/0 group-hover:bg-white/20 transition-all duration-500 z-10" />

      <div className="relative h-44 overflow-hidden bg-[#080808] flex-shrink-0">
        <GridPattern />
        <SmartImage
          src={apt.main_image_url}
          alt={apt.title}
          eager={index < 4}
          className="brightness-[.65] group-hover:brightness-[.8] group-hover:scale-[1.03] transition-all duration-500"
          fallback={<VignetteAppartement />}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0d0d0d] z-10" />

        <button className="absolute top-3 right-3 z-20 w-7 h-7 border border-white/10 bg-black/40 flex items-center justify-center hover:bg-white/10 transition-colors">
          <MdFavorite className="text-white/50 w-3.5 h-3.5" />
        </button>

        <div className="absolute top-3 left-3 z-20">
          <MonoBadge label="Appartement" />
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
            {apt.city}
            {apt.country ? `, ${apt.country}` : ""}
          </span>
        </div>

        <h3 className="text-base font-black text-white tracking-tight mb-3 truncate">
          {apt.title}
        </h3>

        <div className="flex flex-wrap gap-1 mb-3">
          {wifi && (
            <span className="text-[9px] border border-white/[0.08] text-white/25 px-2 py-0.5 font-mono">
              WiFi
            </span>
          )}
          {cuisine && (
            <span className="text-[9px] border border-white/[0.08] text-white/25 px-2 py-0.5 font-mono">
              Cuisine
            </span>
          )}
          {parking && (
            <span className="text-[9px] border border-white/[0.08] text-white/25 px-2 py-0.5 font-mono">
              Parking
            </span>
          )}
          {apt.max_guests && (
            <span className="flex items-center gap-0.5 text-[9px] border border-white/[0.08] text-white/25 px-2 py-0.5 font-mono">
              <MdPeople className="w-2.5 h-2.5" /> {apt.max_guests} pers.
            </span>
          )}
        </div>

        <div className="mt-auto border-t border-white/[0.06] pt-4 flex items-center justify-between">
          <div>
            <p className="text-[9px] text-white/20 font-mono">À partir de</p>
            <p className="text-base font-black text-white leading-tight mt-0.5">
              {Number(apt.price_per_night).toLocaleString()}
              <span className="text-[10px] font-normal text-white/25 ml-1">
                FCFA/nuit
              </span>
            </p>
          </div>
          <CardCTA
            href={`/hebergements/appartement/${apt.apartment_id}`}
            label="Réserver"
          />
        </div>
      </div>
    </div>
  );
};

// ── Category Card — style original + touche dark ───────────────────────────────
const CategoryCard = ({
  cat,
  categoryFilter,
  onSelect,
}: {
  cat: (typeof ArrayCategorie)[0];
  categoryFilter: string | null;
  onSelect: (id: string) => void;
}) => {
  const Icon = cat.icon;
  const IconTop = cat.iconTop;
  const isActive = categoryFilter === cat.categoryId;

  return (
    <div
      onClick={() => onSelect(cat.categoryId)}
      className="relative w-[15rem] cursor-pointer transition-all duration-300 select-none"
      style={{
        transform: isActive ? "scale(1.03)" : "scale(1)",
      }}
    >
      {/* Ombre portée — plus sombre que l'original pour coller au dark theme */}
      <div
        className="absolute inset-0 rounded-2xl transition-all duration-300"
        style={{
          boxShadow: isActive
            ? `0 0 0 2px ${cat.colorHex}, rgba(0,0,0,0.7) 0px 24px 48px, rgba(0,0,0,0.5) 0px 12px 20px`
            : "rgba(0,0,0,0.6) 0px 19px 38px, rgba(0,0,0,0.4) 0px 15px 12px",
        }}
      />

      {/* Carte principale */}
      <div className="relative rounded-2xl bg-[#111111] border border-white/[0.06]">
        <GridPattern />

        {/* Accent top coloré */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] transition-all duration-500 z-10"
          style={{
            backgroundColor: isActive ? cat.colorHex : `${cat.colorHex}30`,
          }}
        />

        {/* Pin SVG flottant — repositionné pour coller au style original */}
        <div className="absolute left-0 -translate-x-1/2 -top-[16%] z-30 pointer-events-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="pin"
            src="https://res.cloudinary.com/dtrpkegss/image/upload/v1769357885/3dicons-pin-dynamic-color_idzzxr.png"
            width={70}
            height={70}
            style={{
              filter: `drop-shadow(0 10px 8px rgba(0,0,0,0.8)) drop-shadow(0 4px 4px rgba(0,0,0,0.6))`,
            }}
          />
        </div>

        {/* Icône centrale (IconTop) — style original conservé, fond coloré sombre */}
        <div
          className="absolute top-4 left-1/2 -translate-x-1/2 z-20 w-14 h-14 flex items-center justify-center border transition-all duration-300"
          style={{
            backgroundColor: isActive
              ? `${cat.colorHex}25`
              : `${cat.colorHex}12`,
            borderColor: isActive ? `${cat.colorHex}80` : `${cat.colorHex}30`,
          }}
        >
          <IconTop
            className="w-7 h-7 transition-all duration-300"
            style={{ color: isActive ? cat.colorHex : "rgba(255,255,255,0.4)" }}
          />
        </div>

        {/* Badge actif — arrondi comme l'original */}
        {isActive && (
          <div
            className="absolute top-2 right-2 z-30 flex items-center gap-1 bg-white/10 border px-2 py-0.5 rounded-full"
            style={{ borderColor: `${cat.colorHex}60` }}
          >
            <BsCheckLg className="w-2 h-2" style={{ color: cat.colorHex }} />
            <span
              className="text-[9px] tracking-[.15em] uppercase font-mono"
              style={{ color: cat.colorHex }}
            >
              Actif
            </span>
          </div>
        )}

        {/* Corps de la carte — hauteur fixe comme l'original */}
        <div className="relative z-10 flex flex-col gap-2 justify-end items-center text-center h-[17rem] px-4 pb-5">
          {/* Texte */}
          <div className="flex-1 flex flex-col justify-end pb-2">
            <p
              className="text-[9px] tracking-[.3em] uppercase font-mono mb-2 transition-colors"
              style={{
                color: isActive ? cat.colorHex : "rgba(255,255,255,0.2)",
              }}
            >
              {cat.categoryId}
            </p>
            <h5
              className={`text-base font-black tracking-tight transition-colors ${isActive ? "text-white" : "text-white/70 group-hover:text-white/90"}`}
            >
              {cat.title}
            </h5>
            <p className="text-[11px] text-white/30 mt-1 leading-relaxed">
              {cat.desc}
            </p>
          </div>

          {/* Icône secondaire + hint */}
          <div className="flex flex-col items-center gap-1">
            <Icon
              className={`w-10 h-10 transition-colors ${isActive ? "text-white/60" : "text-white/20"}`}
            />
            <span
              className="text-[10px] font-mono tracking-wider transition-colors"
              style={{
                color: isActive ? cat.colorHex : "rgba(255,255,255,0.2)",
              }}
            >
              {isActive ? "✓ Filtre actif — retirer" : "Cliquer pour filtrer ↓"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── COMPOSANT PRINCIPAL ────────────────────────────────────────────────────────
export default function HebergementsAppartementPage() {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [cities, setCities] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [equip, setEquip] = useState<string[]>([]);
  const [guestsMin, setGuestsMin] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from("apartments")
        .select(
          `apartment_id, title, city, country, address, price_per_night,
           max_guests, number_of_rooms, equipments,
           main_image_url, is_studio, is_family, is_luxury, is_long_stay,
           agencies(name, logo_url)`,
        )
        .eq("is_published", true)
        .order("created_at", { ascending: false });
      const list = (data as unknown as Apartment[]) || [];
      setApartments(list);
      setCities(
        Array.from(
          new Set(list.map((a) => a.city).filter(Boolean)),
        ) as string[],
      );
      setLoading(false);
    };
    fetchData();
  }, []);

  const filtered = useMemo(
    () =>
      apartments.filter((a) => {
        if (search) {
          const q = search.toLowerCase();
          if (
            ![a.title, a.city, a.country].some((v) =>
              v?.toLowerCase().includes(q),
            )
          )
            return false;
        }
        if (cityFilter !== "all" && a.city !== cityFilter) return false;
        const p = Number(a.price_per_night);
        if (p < priceRange[0] || p > priceRange[1]) return false;
        if (guestsMin && (a.max_guests ?? 0) < parseInt(guestsMin))
          return false;
        if (selected.length > 0) {
          const rooms = a.number_of_rooms ?? 0;
          const ok = selected.some((r) => {
            if (r === "Studio") return rooms <= 1;
            if (r === "1 chambre") return rooms === 1;
            if (r === "2+ chambres") return rooms >= 2;
            return false;
          });
          if (!ok) return false;
        }
        if (
          equip.includes("Cuisine équipée") &&
          !hasEquip(a.equipments, "cuisine")
        )
          return false;
        if (
          equip.includes("Wifi fibre") &&
          !hasEquip(a.equipments, "wi-fi", "wifi", "internet")
        )
          return false;
        if (equip.includes("Parking") && !hasEquip(a.equipments, "parking"))
          return false;
        if (categoryFilter) {
          const field = CATEGORY_FIELD_MAP[categoryFilter];
          if (field && !a[field]) return false;
        }
        return true;
      }),
    [
      apartments,
      cityFilter,
      priceRange,
      guestsMin,
      selected,
      equip,
      categoryFilter,
      search,
    ],
  );

  useEffect(() => {
    setPage(1);
  }, [
    cityFilter,
    priceRange,
    guestsMin,
    selected,
    equip,
    categoryFilter,
    search,
  ]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleCategorySelect = (categoryId: string) => {
    setCategoryFilter((prev) => (prev === categoryId ? null : categoryId));
    document
      .getElementById("listing-appartements")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const activeCategoryLabel = ArrayCategorie.find(
    (c) => c.categoryId === categoryFilter,
  )?.title;

  const isLoading = loading;

  if (isLoading)
    return (
      <div className="relative flex flex-col items-center justify-center h-screen">
        <Loader />
        <div className="mt-64 text-center text-white/40 text-sm font-mono tracking-widest">
          Recherche d'appartements…
        </div>
      </div>
    );

  return (
    <>
      {/* ══ HERO ══ */}
      <header>
        <div className="relative bg-[url(https://res.cloudinary.com/dtrpkegss/image/upload/v1769350354/interior-space-decorated-boho-style_atvmnc.webp)] bg-right bg-no-repeat bg-size-[60rem] lg:bg-size-[100rem] h-[70vh] lg:h-[75vh]">
          <div className="flex flex-col mx-auto max-w-6xl justify-end items-center h-full text-white text-left pl-0 lg:p-4 pb-12 pr-0 lg:pb-56 z-10 relative">
            <div className="flex justify-center text-center">
              <div>
                <h1 className="text-[1.5rem] lg:text-4xl font-bold mb-4 w-[23rem] lg:w-[43rem]">
                  EasyTrans - Appartements et Locations de vacances
                </h1>
                <p className="text-sm lg:text-base w-[23rem] lg:w-[43rem]">
                  Profitez de plus d&apos;espace, d&apos;une cuisine privée et
                  de la liberté totale pour votre séjour.
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
            label="Nos appartements"
            subtitle="POURQUOI CHOISIR NOS APPARTEMENTS ?"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-0 divide-y divide-white/[0.06]">
              {[
                {
                  icon: MdLockOpen,
                  num: "01",
                  title: "Autonomie totale",
                  desc: "Cuisinez vos propres repas et vivez à votre rythme.",
                },
                {
                  icon: MdWeekend,
                  num: "02",
                  title: "Espace & Confort",
                  desc: "Des salons spacieux pour se détendre après une journée de visite.",
                },
                {
                  icon: MdSavings,
                  num: "03",
                  title: "Économie",
                  desc: "Idéal pour les longs séjours et les familles.",
                },
                {
                  icon: RiMapPinFill,
                  num: "04",
                  title: "Emplacements locaux",
                  desc: "Vivez dans les quartiers les plus authentiques de la ville.",
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
                <GridPattern />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://res.cloudinary.com/dtrpkegss/image/upload/v1769350354/bright-modern-living-room-with-natural-light-minimalist-design_b0zrwq.webp"
                  alt="Appartement moderne"
                  className="absolute inset-0 w-full h-full object-cover brightness-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-[9px] tracking-[.35em] uppercase text-white/30 mb-1 font-mono">
                    EasyTrans
                  </p>
                  <p className="text-base font-black text-white">
                    Appartements soigneusement sélectionnés
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
            subtitle="CATÉGORIES D'APPARTEMENTS"
          />

          {/* Grille catégories — overflow visible pour le pin SVG et les ombres */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-14 pt-10">
            {ArrayCategorie.slice(0, 3).map((cat) => (
              <div key={cat.id} className="flex justify-center">
                <CategoryCard
                  cat={cat}
                  categoryFilter={categoryFilter}
                  onSelect={handleCategorySelect}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-center pt-6 pb-2">
            <CategoryCard
              cat={ArrayCategorie[3]}
              categoryFilter={categoryFilter}
              onSelect={handleCategorySelect}
            />
          </div>

          {/* Badge filtre actif */}
          {categoryFilter && (
            <div className="flex items-center gap-3 mt-6 pt-6 border-t border-white/[0.06]">
              <span className="text-[10px] tracking-[.2em] uppercase text-white/30 font-mono">
                Filtre actif
              </span>
              <span className="text-[10px] tracking-[.15em] uppercase text-white border border-white/20 px-3 py-1 font-mono">
                {activeCategoryLabel}
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
      <section
        id="listing-appartements"
        className="relative py-16 md:py-20 pb-28"
      >
        <div className="absolute left-8 top-0 bottom-0 w-px bg-white/[0.08] hidden lg:block" />
        <div className="mx-auto max-w-6xl px-4 lg:px-0">
          <SectionHeader
            label="Catalogue"
            subtitle="APPARTEMENTS DISPONIBLES"
          />

          {/* Filtres — dark panel */}
          <div className="relative bg-[#0d0d0d] border border-white/[0.06] p-6 mb-8 overflow-hidden">
            <GridPattern />
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

                {/* Capacité */}
                <div>
                  <p className="text-[10px] tracking-[.3em] uppercase text-white/30 font-mono mb-2">
                    Capacité minimum
                  </p>
                  <Input
                    type="number"
                    min={1}
                    placeholder="Nombre de personnes"
                    value={guestsMin}
                    onChange={(e) => setGuestsMin(e.target.value)}
                    className="bg-transparent border-white/[0.08] text-white placeholder:text-white/20 rounded-none focus:border-white/30 text-sm"
                  />
                </div>

                {/* Chambres */}
                <div>
                  <p className="text-[10px] tracking-[.3em] uppercase text-white/30 font-mono mb-3">
                    Nombre de chambres
                  </p>
                  <CheckboxGroup
                    color="warning"
                    value={selected}
                    onValueChange={setSelected}
                    orientation="horizontal"
                    classNames={{ base: "gap-2" }}
                  >
                    {["Studio", "1 chambre", "2+ chambres"].map((v) => (
                      <Checkbox
                        key={v}
                        value={v}
                        classNames={{
                          label:
                            "text-[10px] text-white/40 font-mono tracking-wider uppercase",
                          wrapper: "rounded-none border-white/20",
                        }}
                      >
                        {v}
                      </Checkbox>
                    ))}
                  </CheckboxGroup>
                </div>

                {/* Équipements */}
                <div>
                  <p className="text-[10px] tracking-[.3em] uppercase text-white/30 font-mono mb-3">
                    Équipements
                  </p>
                  <CheckboxGroup
                    color="warning"
                    value={equip}
                    onValueChange={setEquip}
                    orientation="horizontal"
                    classNames={{ base: "gap-2" }}
                  >
                    {["Cuisine équipée", "Wifi fibre", "Parking"].map((v) => (
                      <Checkbox
                        key={v}
                        value={v}
                        classNames={{
                          label:
                            "text-[10px] text-white/40 font-mono tracking-wider uppercase",
                          wrapper: "rounded-none border-white/20",
                        }}
                      >
                        {v === "Cuisine équipée"
                          ? "Cuisine"
                          : v === "Wifi fibre"
                            ? "WiFi"
                            : v}
                      </Checkbox>
                    ))}
                  </CheckboxGroup>
                </div>

                {/* Prix */}
                <div>
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
                    maxValue={1000000}
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

              {/* Catégorie active dans les filtres */}
              {categoryFilter && (
                <div className="flex items-center gap-3 mt-5 pt-5 border-t border-white/[0.06]">
                  <span className="text-[10px] tracking-[.2em] uppercase text-white/30 font-mono">
                    Catégorie
                  </span>
                  <span className="text-[10px] tracking-[.15em] uppercase text-white border border-white/20 px-3 py-1 font-mono">
                    {activeCategoryLabel}
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
          </div>

          {/* Grille appartements */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.06]">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : paginated.length === 0 ? (
            <div className="relative border border-white/[0.06] py-20 text-center overflow-hidden">
              <GridPattern />
              <p className="relative text-white/30 text-sm font-mono tracking-widest">
                AUCUN RÉSULTAT
              </p>
              <p className="relative text-white/15 text-xs mt-2 font-mono">
                Modifiez vos filtres pour afficher des appartements
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.06]">
              {paginated.map((apt, i) => (
                <ApartmentCard key={apt.apartment_id} apt={apt} index={i} />
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
