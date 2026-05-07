"use client";

import * as React from "react";
import { useEffect, useState, useMemo, useCallback, useId } from "react";
import { FaGasPump } from "react-icons/fa6";
import { GiCarWheel } from "react-icons/gi";
import { HiMiniShieldCheck } from "react-icons/hi2";
import { IoReceiptSharp, IoHeadset } from "react-icons/io5";
import { LuRefreshCcwDot } from "react-icons/lu";
import { IoBriefcase } from "react-icons/io5";
import { FaUsers, FaSearch } from "react-icons/fa";
import { PiSeatFill } from "react-icons/pi";
import { SiTransmission } from "react-icons/si";
import { GiGearStickPattern } from "react-icons/gi";
import { FaCogs } from "react-icons/fa";
import { RiLoopLeftLine } from "react-icons/ri";
import { Image } from "@heroui/image";
import { Link } from "@heroui/link";
import { Pagination } from "@heroui/pagination";
import { Slider } from "@heroui/slider";
import { RadioGroup, SentimentCard } from "@/components/sentiment-radio-group";
import { CheckboxGroup, Checkbox } from "@heroui/checkbox";
import ExpandOnHover from "@/components/expand-cards";
import { createClient } from "@/utils/supabase/client";
import DecorativeNumber from "@/components/DecorativeNumber";
import Loader from "@/components/loader-15";

const supabase = createClient();

interface AgencyRel {
  name: string;
  logo_url?: string | null;
}
interface CarRental {
  car_id: string;
  brand: string;
  model: string;
  year: number | null;
  seats: number | null;
  transmission: string | null;
  fuel_type: string | null;
  price_per_day: number;
  is_available: boolean | null;
  description: string | null;
  main_image_url: string | null;
  category_id: string | null;
  agencies: AgencyRel | AgencyRel[] | null;
}
const getAgency = (rel: CarRental["agencies"]): AgencyRel | null => {
  if (!rel) return null;
  if (Array.isArray(rel)) return rel[0] ?? null;
  return rel as AgencyRel;
};
const relName = (rel: CarRental["agencies"]): string =>
  getAgency(rel)?.name ?? "Agence inconnue";

const PAGE_SIZE = 8;

// ── GridPattern ────────────────────────────────────────────────────────────────
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

// ── MonoBadge ──────────────────────────────────────────────────────────────────
const MonoBadge = ({ label, accent }: { label: string; accent?: boolean }) => (
  <span
    className={`text-[9px] tracking-[.2em] uppercase px-2 py-0.5 border font-mono
    ${accent ? "border-amber-400/30 bg-amber-400/20 text-amber-300" : "border-white/[0.08] text-white/25"}`}
  >
    {label}
  </span>
);

// ── SectionHeader ──────────────────────────────────────────────────────────────
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
        <p className="text-[10px] tracking-[0.45em] uppercase text-white/40 mt-1">
          {label}
        </p>
        <h2 className="text-sm md:text-base font-black text-white tracking-tight mt-1">
          {subtitle}
        </h2>
      </div>
    </div>
    <div className="mt-6 flex items-center gap-4">
      <div className="h-px flex-1 bg-white/10" />
      <span className="text-white/20 text-xs font-mono tracking-widest">
        EasyTrans
      </span>
      <div className="w-8 h-px bg-white/10" />
    </div>
  </div>
);

// ── VignetteVoiture ────────────────────────────────────────────────────────────
const VignetteVoiture = ({ brand }: { brand: string }) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#080808]">
    <GridPattern />
    <div className="absolute w-40 h-16 rounded-full blur-3xl bg-white/[0.03]" />
    <svg
      viewBox="0 0 100 60"
      width="90"
      height="54"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="relative opacity-55"
    >
      <path
        d="M10 42 L10 32 Q10 26 16 26 L28 26 L40 14 L72 14 L82 26 L90 26 Q96 26 96 32 L96 42 Z"
        stroke="white"
        strokeOpacity="0.2"
        strokeWidth="1"
        fill="white"
        fillOpacity="0.02"
      />
      <path
        d="M42 26 L50 15 L70 15 L78 26 Z"
        stroke="white"
        strokeOpacity="0.2"
        strokeWidth="0.8"
        fill="white"
        fillOpacity="0.04"
      />
      <circle
        cx="28"
        cy="44"
        r="8"
        stroke="white"
        strokeOpacity="0.2"
        strokeWidth="1"
        fill="none"
      />
      <circle
        cx="28"
        cy="44"
        r="3.5"
        stroke="white"
        strokeOpacity="0.15"
        strokeWidth="0.8"
        fill="none"
      />
      <circle cx="28" cy="44" r="1" fill="white" fillOpacity="0.3" />
      <circle
        cx="76"
        cy="44"
        r="8"
        stroke="white"
        strokeOpacity="0.2"
        strokeWidth="1"
        fill="none"
      />
      <circle
        cx="76"
        cy="44"
        r="3.5"
        stroke="white"
        strokeOpacity="0.15"
        strokeWidth="0.8"
        fill="none"
      />
      <circle cx="76" cy="44" r="1" fill="white" fillOpacity="0.3" />
      <rect
        x="84"
        y="30"
        width="8"
        height="5"
        rx="1"
        stroke="white"
        strokeOpacity="0.25"
        strokeWidth="0.8"
        fill="white"
        fillOpacity="0.05"
      />
    </svg>
    <p className="relative text-[10px] tracking-[.2em] text-white/20 uppercase mt-1 font-mono">
      {brand}
    </p>
  </div>
);

// ── SmartImage ─────────────────────────────────────────────────────────────────
const SmartImage = ({
  src,
  alt,
  eager,
  fallback,
  className = "",
}: {
  src: string | null;
  alt: string;
  eager?: boolean;
  fallback: React.ReactNode;
  className?: string;
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

// ── SkeletonCard ───────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-[#0d0d0d] overflow-hidden relative">
    <div className="h-44 bg-[#080808] relative overflow-hidden">
      <GridPattern />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent animate-pulse" />
    </div>
    <div className="h-px bg-white/[0.06]" />
    <div className="p-5 space-y-3">
      <div className="h-2 w-8 bg-white/[0.06] rounded" />
      <div className="h-4 w-3/4 bg-white/[0.08] rounded" />
      <div className="h-3 w-2/3 bg-white/[0.04] rounded" />
      <div className="pt-3 border-t border-white/[0.06] flex justify-between items-center">
        <div className="h-4 w-16 bg-white/[0.06] rounded" />
        <div className="h-7 w-24 bg-white/[0.08] rounded" />
      </div>
    </div>
  </div>
);

// ── CarCard ────────────────────────────────────────────────────────────────────
const CarCard = ({ car, index }: { car: CarRental; index: number }) => {
  const aName = relName(car.agencies);
  const isPremium = (car.seats ?? 0) >= 7 || Number(car.price_per_day) >= 80000;
  return (
    <div
      className={`group relative bg-[#0d0d0d] hover:bg-[#0f0f0f] transition-colors duration-300 overflow-hidden flex flex-col ${!car.is_available ? "opacity-60" : ""}`}
    >
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/0 group-hover:bg-white/20 transition-all duration-500 z-10" />
      <div className="relative h-44 overflow-hidden bg-[#080808] flex-shrink-0">
        <GridPattern />
        <SmartImage
          src={car.main_image_url}
          alt={`${car.brand} ${car.model}`}
          eager={index < 4}
          className={`${car.is_available ? "brightness-[.65] group-hover:brightness-[.8]" : "brightness-[.4]"} group-hover:scale-[1.03] transition-all duration-500`}
          fallback={<VignetteVoiture brand={car.brand} />}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0d0d0d] z-10" />
        <div className="absolute top-3 left-3 z-20 flex gap-1.5">
          <MonoBadge
            label={car.is_available ? "Disponible" : "Indisponible"}
            accent={car.is_available ?? false}
          />
          {isPremium && car.is_available && (
            <MonoBadge label="Premium" accent />
          )}
        </div>
        <div className="absolute bottom-3 left-3 z-20">
          <span className="text-[9px] tracking-[.2em] uppercase text-white/40 font-mono">
            {aName}
          </span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/20 opacity-0 group-hover:opacity-60 transition-all duration-500" />
      </div>
      <div className="h-px bg-white/[0.06]" />
      <div className="px-5 pt-4 pb-5 flex flex-col flex-1">
        <p className="text-[10px] tracking-[.35em] text-white/20 font-mono mb-1">
          {car.year ?? "—"}
        </p>
        <h3 className="text-base font-black text-white tracking-tight mb-3 truncate">
          {car.brand} {car.model}
        </h3>
        <div className="flex gap-2 mb-4 flex-wrap">
          {car.seats && (
            <div className="flex items-center gap-1.5 border border-white/[0.08] px-2 py-1">
              <PiSeatFill className="w-3 h-3 text-white/30" />
              <span className="text-[10px] text-white/30 font-mono">
                {car.seats} pl.
              </span>
            </div>
          )}
          {car.transmission && (
            <div className="flex items-center gap-1.5 border border-white/[0.08] px-2 py-1">
              <SiTransmission className="w-3 h-3 text-white/30" />
              <span className="text-[10px] text-white/30 font-mono">
                {car.transmission.slice(0, 5)}.
              </span>
            </div>
          )}
          {car.fuel_type && (
            <div className="flex items-center gap-1.5 border border-white/[0.08] px-2 py-1">
              <FaGasPump className="w-3 h-3 text-white/30" />
              <span className="text-[10px] text-white/30 font-mono truncate max-w-[40px]">
                {car.fuel_type}
              </span>
            </div>
          )}
        </div>
        <div className="mt-auto border-t border-white/[0.06] pt-4 flex items-center justify-between">
          <div>
            <p className="text-[9px] text-white/20 font-mono">À partir de</p>
            <p className="text-base font-black text-white leading-tight mt-0.5">
              {car.price_per_day
                ? Number(car.price_per_day).toLocaleString()
                : "—"}
              <span className="text-[10px] font-normal text-white/25 ml-1">
                FCFA/j
              </span>
            </p>
          </div>
          <Link
            href={car.is_available ? `/voitures/${car.car_id}` : "#"}
            aria-disabled={!car.is_available}
            className={`text-[10px] tracking-[.2em] uppercase font-mono border px-3 py-1.5 transition-all duration-300 no-underline
              ${
                car.is_available
                  ? "text-white/40 hover:text-white border-white/[0.08] hover:border-white/20"
                  : "text-white/15 border-white/[0.04] pointer-events-none"
              }`}
          >
            {car.is_available ? "Voir →" : "Indispo."}
          </Link>
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
export default function VoituresPage() {
  const [cars, setCars] = useState<CarRental[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [transmission, setTransmission] = useState("all");
  const [fuelSelected, setFuelSelected] = useState<string[]>([]);
  const [seatsSelected, setSeatsSelected] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  const [availOnly, setAvailOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [categoryLabel, setCategoryLabel] = useState("");
  const listingRef = React.useRef<HTMLElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from("car_rentals")
        .select(
          `car_id, brand, model, year, seats, transmission, fuel_type, price_per_day, is_available, description, main_image_url, category_id, agencies(name, logo_url)`,
        )
        .order("created_at", { ascending: false });
      setCars((data as unknown as CarRental[]) ?? []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const filtered = useMemo(
    () =>
      cars.filter((c) => {
        if (
          search &&
          !`${c.brand} ${c.model}`.toLowerCase().includes(search.toLowerCase())
        )
          return false;
        if (
          transmission !== "all" &&
          c.transmission?.toLowerCase() !== transmission.toLowerCase()
        )
          return false;
        if (fuelSelected.length > 0) {
          const ft = c.fuel_type?.toLowerCase() ?? "";
          const matchFuel = fuelSelected.some((f) => {
            const fl = f.toLowerCase();
            if (fl === "diesel")
              return (
                ft.includes("diesel") ||
                ft.includes("gasoil") ||
                ft.includes("gazole")
              );
            if (fl === "électrique")
              return ft.includes("lectrique") || ft.includes("electrique");
            return ft.includes(fl);
          });
          if (!matchFuel) return false;
        }
        if (seatsSelected.length > 0) {
          const seats = c.seats ?? 0;
          const ok = seatsSelected.some((s) => {
            if (s === "+7") return seats >= 7;
            if (s === "7") return seats === 7 || seats >= 7;
            return seats === parseInt(s);
          });
          if (!ok) return false;
        }
        const p = Number(c.price_per_day);
        if (p < priceRange[0] || p > priceRange[1]) return false;
        if (availOnly && !c.is_available) return false;
        if (categoryId !== null && c.category_id !== categoryId) return false;
        return true;
      }),
    [
      cars,
      search,
      transmission,
      fuelSelected,
      seatsSelected,
      priceRange,
      availOnly,
      categoryId,
    ],
  );

  useEffect(() => {
    setPage(1);
  }, [
    search,
    transmission,
    fuelSelected,
    seatsSelected,
    priceRange,
    availOnly,
    categoryId,
  ]);

  const isLoading = loading;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const activeFiltersCount =
    (search ? 1 : 0) +
    (transmission !== "all" ? 1 : 0) +
    (fuelSelected.length > 0 ? 1 : 0) +
    (seatsSelected.length > 0 ? 1 : 0) +
    (availOnly ? 1 : 0) +
    (categoryLabel ? 1 : 0);

  const clearFilters = useCallback(() => {
    setSearch("");
    setTransmission("all");
    setFuelSelected([]);
    setSeatsSelected([]);
    setPriceRange([0, 500000]);
    setAvailOnly(false);
    setCategoryId(null);
    setCategoryLabel("");
  }, []);

  if (isLoading)
    return (
      <div className="relative flex flex-col items-center justify-center h-screen">
        <Loader />
        <div className="mt-64 text-center text-white/40 text-sm font-mono tracking-widest">
          Recherche de voitures…
        </div>
      </div>
    );

  return (
    <>
      {/* ══ HEADER ══ */}
      <header>
        <div className="relative h-[70vh] lg:h-[75vh] min-h-[500px] overflow-hidden bg-[#080808]">
          <div
            className="absolute inset-0 bg-cover bg-right"
            style={{
              backgroundImage:
                "url(https://res.cloudinary.com/dtrpkegss/image/upload/v1768322838/powerful-headlights-particle-view-modern-luxury-cars-parked-indoors-daytime_4_11zon_sj2hxx.webp)",
              filter: "brightness(.4) grayscale(.15)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgba(8,8,8,.95) 30%, rgba(8,8,8,.5) 65%, rgba(8,8,8,.15) 100%)",
            }}
          />
          <div className="absolute left-8 top-0 bottom-0 w-px bg-white/[0.06] hidden lg:block" />
          <div className="relative z-10 h-full flex flex-col justify-end mx-auto max-w-6xl px-6 lg:px-0 pb-16 lg:pb-24">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-px bg-white/40" />
              <span className="text-[10px] tracking-[.45em] uppercase text-white/40 font-medium">
                Location
              </span>
            </div>
            <h1
              className="text-2xl lg:text-5xl font-black text-white leading-[1.05] max-w-xl mb-5"
              style={{ letterSpacing: "-.03em" }}
            >
              Location de voiture sécurisée{" "}
              <span className="text-white/35">avec EasyTrans.</span>
            </h1>
            <p className="text-[13px] leading-[1.85] text-white/40 max-w-md mb-8">
              Roulez l&apos;esprit tranquille grâce à notre sélection
              d&apos;agences fiables et de véhicules bien entretenus. Avec
              EasyTrans, les prix sont transparents et la réservation est
              entièrement sécurisée.
            </p>
          </div>
        </div>
      </header>

      {/* ══ SECTION 01 — POUR QUEL VOYAGE ══ */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <DecorativeNumber number="01" />
        <div className="absolute left-8 top-0 bottom-0 w-px bg-white/[0.06] hidden lg:block" />
        <div className="relative mx-auto max-w-6xl px-6 lg:px-0">
          <SectionHeader
            label="Usages"
            subtitle="POUR QUEL VOYAGE LOUEZ-VOUS ?"
          />

          {/* Grille 3 cartes premium */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.06]">
            {[
              {
                num: "01",
                icon: (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                ),
                label: "Catégorie 01",
                title: "Week-end\ncity trip",
                desc: "Circulez facilement en ville, garez-vous sans stress et profitez pleinement de quelques jours d'évasion.",
                img: "https://res.cloudinary.com/dtrpkegss/image/upload/v1768322838/powerful-headlights-particle-view-modern-luxury-cars-parked-indoors-daytime_4_11zon_sj2hxx.webp",
              },
              {
                num: "02",
                icon: <IoBriefcase className="w-4 h-4" />,
                label: "Catégorie 02",
                title: "Voyage\nprofessionnel",
                desc: "Déplacements efficaces, rendez-vous importants et confort optimal sur toute la durée de votre trajet.",
                img: "https://res.cloudinary.com/dtrpkegss/image/upload/v1769249109/hand-holding-key-driving-car-into-sunset-generated-by-ai_iuajqr.webp",
              },
              {
                num: "03",
                icon: <FaUsers className="w-4 h-4" />,
                label: "Catégorie 03",
                title: "Vacances\nen famille",
                desc: "Voyagez à plusieurs avec espace passagers et bagages généreux, pour des vacances en toute sérénité.",
                img: "https://res.cloudinary.com/dtrpkegss/image/upload/v1768850213/5376547_1_ib3fdb.webp",
              },
            ].map((item) => (
              <div
                key={item.num}
                className="group relative bg-[#0a0a0a] hover:bg-[#0f0f0f] transition-colors duration-300 overflow-hidden flex flex-col cursor-default"
              >
                {/* Top hover bar */}
                <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-white/0 group-hover:bg-white/15 transition-all duration-500 z-10" />

                {/* Image */}
                <div className="relative h-52 overflow-hidden bg-[#080808] flex-shrink-0">
                  <GridPattern />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.img}
                    alt={item.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover brightness-50 grayscale-[.3] group-hover:brightness-[.65] group-hover:scale-[1.04] transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a] z-10" />
                  {/* Big number */}
                  <span
                    className="absolute top-3 right-4 z-20 select-none pointer-events-none text-[80px] leading-none font-light text-white/[0.08] group-hover:text-white/[0.04] transition-opacity duration-400"
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                    }}
                  >
                    {item.num}
                  </span>
                </div>

                {/* Content */}
                <div className="px-7 pt-6 pb-7 flex flex-col flex-1 relative">
                  {/* Icon box */}
                  <div className="w-9 h-9 border border-white/10 flex items-center justify-center text-white/35 mb-5 group-hover:border-white/20 transition-colors duration-300">
                    {item.icon}
                  </div>
                  <p className="text-[9px] tracking-[.35em] uppercase font-mono text-white/20 mb-2">
                    {item.label}
                  </p>
                  <h3
                    className="text-[26px] font-light text-white leading-[1.15] mb-4 whitespace-pre-line"
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-[12px] text-white/30 leading-[1.85]">
                    {item.desc}
                  </p>

                  {/* Tag reveal on hover */}
                  <div className="mt-5 flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                    <div className="w-4 h-px bg-white/25" />
                    <span className="text-[9px] tracking-[.2em] uppercase font-mono text-white/40">
                      Voir les véhicules
                    </span>
                    <span className="text-white/30 text-sm">↗</span>
                  </div>

                  {/* Bottom line slide */}
                  <div className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-white/20 group-hover:w-full transition-all duration-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ DESCRIPTION ══ */}
      <section className="relative mx-auto max-w-6xl py-20">
        <div className="absolute left-8 top-0 bottom-0 w-px bg-white/[0.06] hidden lg:block" />
        <div className="relative z-10 flex flex-wrap gap-5 justify-center px-6 lg:px-0">
          <div className="w-[38rem] text-white text-justify">
            <p>
              <em>
                Chez EasyTrans, nous sélectionnons exclusivement des véhicules
                fiables, récents et confortables, issus de notre réseau
                d&apos;agences partenaires vérifiées. Chaque partenaire est
                soigneusement évalué selon des critères stricts de qualité, de
                service et de transparence, afin de garantir une expérience de
                location en toute tranquillité. Nos offres sont proposées à des
                prix clairs, justes et sans frais cachés, pour que vous puissiez
                planifier votre voyage sans mauvaises surprises. Que ce soit
                pour un trajet professionnel, un week-end en famille ou un long
                séjour, nous vous proposons une large flotte de véhicules
                adaptée à tous les besoins et budgets. Avec EasyTrans, profitez
                d&apos;un processus de réservation simple, rapide et sécurisée.
              </em>
            </p>
          </div>
          <div>
            <Image
              alt=""
              src="https://res.cloudinary.com/dtrpkegss/image/upload/v1769249109/hand-holding-key-driving-car-into-sunset-generated-by-ai_iuajqr.webp"
              width={500}
            />
          </div>
        </div>
      </section>

      {/* ══ SECTION 02 — NOTRE COLLECTION (ExpandOnHover) ══ */}
      <section className="pb-28">
        <ExpandOnHover
          onCategorySelect={(id, label) => {
            setCategoryId(id);
            setCategoryLabel(label);
            setPage(1);
            setTimeout(() => {
              listingRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }, 100);
          }}
        />
      </section>

      {/* ══ LISTING ══ */}
      <section ref={listingRef} className="relative pb-20">
        <DecorativeNumber number="02" />
        <div className="absolute left-8 top-0 bottom-0 w-px bg-white/[0.06] hidden lg:block" />
        <div className="relative mx-auto max-w-6xl px-6 lg:px-0">
          <SectionHeader label="Catalogue" subtitle="LISTE DES VOITURES" />

          {/* Filtres */}
          <div className="relative border border-white/[0.06] bg-[#0d0d0d] p-5 mb-px overflow-hidden">
            <GridPattern />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-[3px] h-6 bg-white/40" />
                  <span className="text-[11px] tracking-[.3em] uppercase text-white/50 font-mono font-medium">
                    Filtres
                  </span>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <label className="flex items-center gap-2 text-[10px] font-mono tracking-[.15em] uppercase text-white/40 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={availOnly}
                      onChange={(e) => setAvailOnly(e.target.checked)}
                      className="w-3.5 h-3.5 accent-blue-500"
                    />
                    Disponibles uniquement
                  </label>
                  {categoryLabel && (
                    <button
                      onClick={() => {
                        setCategoryId(null);
                        setCategoryLabel("");
                      }}
                      className="text-[10px] font-mono tracking-[.15em] uppercase text-white/40 hover:text-white border border-white/[0.08] hover:border-white/20 px-2 py-1 transition-all duration-300"
                    >
                      {categoryLabel} ×
                    </button>
                  )}
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-[10px] font-mono tracking-[.2em] text-white/40 hover:text-white border border-white/[0.08] hover:border-white/20 px-3 py-1.5 transition-all duration-300"
                    >
                      Effacer ({activeFiltersCount})
                    </button>
                  )}
                  <span className="text-[10px] font-mono tracking-[.2em] uppercase text-white/25 border border-white/[0.06] px-2 py-0.5">
                    {filtered.length} véhicule{filtered.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <p className="text-[9px] tracking-[.35em] uppercase text-white/30 font-mono mb-2">
                    Recherche
                  </p>
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 w-3 h-3" />
                    <input
                      type="text"
                      placeholder="Marque ou modèle..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full bg-[#080808] border border-white/[0.08] text-white/60 placeholder:text-white/20 font-mono text-[11px] tracking-wider pl-8 pr-3 py-2 focus:outline-none focus:border-white/20 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <p className="text-[9px] tracking-[.35em] uppercase text-white/30 font-mono mb-2">
                    Transmission
                  </p>
                  <RadioGroup
                    value={transmission}
                    onValueChange={setTransmission}
                    defaultValue="all"
                    className="flex flex-row gap-2"
                  >
                    <SentimentCard
                      value="all"
                      emoji={
                        <span className="text-base">
                          <RiLoopLeftLine />
                        </span>
                      }
                      title="Toutes"
                      className="cursor-pointer"
                    />
                    <SentimentCard
                      value="Manuelle"
                      emoji={<GiGearStickPattern className="text-base" />}
                      title="Manuelle"
                      className="cursor-pointer"
                    />
                    <SentimentCard
                      value="Automatique"
                      emoji={<FaCogs className="text-base" />}
                      title="Automatique"
                      className="cursor-pointer"
                    />
                  </RadioGroup>
                </div>
                <div>
                  <p className="text-[9px] tracking-[.35em] uppercase text-white/30 font-mono mb-2">
                    Prix / jour —{" "}
                    <span className="text-white/20">
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
                <div>
                  <p className="text-[9px] tracking-[.35em] uppercase text-white/30 font-mono mb-2">
                    Carburant / Énergie
                  </p>
                  <CheckboxGroup
                    color="warning"
                    value={fuelSelected}
                    onValueChange={setFuelSelected}
                    orientation="horizontal"
                  >
                    {["Essence", "Diesel", "Hybride", "Électrique"].map((v) => (
                      <Checkbox
                        key={v}
                        value={v}
                        classNames={{
                          label:
                            "text-[10px] text-white/40 font-mono tracking-wider uppercase",
                        }}
                      >
                        {v}
                      </Checkbox>
                    ))}
                  </CheckboxGroup>
                </div>
                <div>
                  <p className="text-[9px] tracking-[.35em] uppercase text-white/30 font-mono mb-2">
                    Nombre de places
                  </p>
                  <CheckboxGroup
                    color="warning"
                    value={seatsSelected}
                    onValueChange={setSeatsSelected}
                    orientation="horizontal"
                  >
                    {["2", "3", "4", "5", "6", "7", "+7"].map((v) => (
                      <Checkbox
                        key={v}
                        value={v}
                        classNames={{
                          label:
                            "text-[10px] text-white/40 font-mono tracking-wider uppercase",
                        }}
                      >
                        {v} pl.
                      </Checkbox>
                    ))}
                  </CheckboxGroup>
                </div>
              </div>
            </div>
          </div>

          {/* Grille voitures */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.06]">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : paginated.length === 0 ? (
            <div className="relative bg-[#0d0d0d] py-20 flex flex-col items-center justify-center overflow-hidden">
              <GridPattern />
              <GiCarWheel className="relative w-12 h-12 text-white/10 mb-4" />
              <p className="relative text-[11px] font-mono tracking-[.2em] uppercase text-white/20">
                Aucun véhicule ne correspond à vos critères.
              </p>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="relative mt-4 text-[10px] font-mono tracking-[.2em] text-white/40 hover:text-white border border-white/[0.08] hover:border-white/20 px-4 py-2 transition-all duration-300"
                >
                  Effacer les filtres
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.06]">
              {paginated.map((car, i) => (
                <CarCard key={car.car_id} car={car} index={i} />
              ))}
            </div>
          )}

          {!loading && totalPages > 1 && (
            <div className="flex justify-end w-full mt-10 pt-6 border-t border-white/[0.06]">
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

      {/* ══ SECTION 03 — GARANTIES ══ */}
      <section className="relative mx-auto max-w-6xl py-36">
        <div className="absolute left-8 top-0 bottom-0 w-px bg-white/[0.06] hidden lg:block" />
        <div className="relative px-6 lg:px-0">
          <SectionHeader label="Engagements" subtitle="GARANTIES" />

          {/* Grille 2×2 premium */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/[0.05]">
            {[
              {
                letter: "A",
                icon: <HiMiniShieldCheck className="w-6 h-6" />,
                title: "Véhicules\ncontrôlés",
                text: "Chaque véhicule est inspecté avant d'être proposé à la location : état général, propreté et équipements essentiels vérifiés.",
                badge: "Inspection rigoureuse",
              },
              {
                letter: "B",
                icon: <IoReceiptSharp className="w-6 h-6" />,
                title: "Prix sans\nsurprise",
                text: "Le prix affiché est le prix final. Pas de frais ajoutés au moment du paiement, pas de conditions floues.",
                badge: "Tarification transparente",
              },
              {
                letter: "C",
                icon: <IoHeadset className="w-6 h-6" />,
                title: "Assistance\n24 / 7",
                text: "Un imprévu sur la route ? Notre assistance est disponible à tout moment, avant, pendant et après votre trajet.",
                badge: "Disponibilité permanente",
              },
              {
                letter: "D",
                icon: <LuRefreshCcwDot className="w-6 h-6" />,
                title: "Annulation\nflexible",
                text: "Notre politique d'annulation est simple, lisible et sans piège, pour vous laisser la liberté de réserver sans pression.",
                badge: "Politique claire",
              },
            ].map(({ letter, icon, title, text, badge }) => (
              <div
                key={letter}
                className="group relative bg-[#0a0a0a] hover:bg-[#0d0d0d] transition-colors duration-400 overflow-hidden p-10"
              >
                <GridPattern />

                {/* Big letter watermark */}
                <span
                  className="absolute top-0 right-4 select-none pointer-events-none text-[130px] leading-none font-light text-white/[0.025] group-hover:text-white/[0.04] group-hover:-translate-y-2 transition-all duration-500"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  {letter}
                </span>

                <div className="relative z-10 group-hover:-translate-y-0.5 transition-transform duration-300">
                  {/* Letter index */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-7 h-7 border border-white/10 flex items-center justify-center">
                      <span
                        className="text-sm font-normal text-white/35"
                        style={{
                          fontFamily: "'Cormorant Garamond', Georgia, serif",
                        }}
                      >
                        {letter}
                      </span>
                    </div>
                    <span className="text-[9px] font-mono tracking-[.4em] uppercase text-white/15">
                      Garantie
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="relative w-12 h-12 mb-6">
                    <div className="absolute inset-0 border border-white/[0.08]" />
                    <div className="absolute inset-[4px] bg-white/[0.03] flex items-center justify-center text-white/35">
                      {icon}
                    </div>
                  </div>

                  {/* Title */}
                  <h3
                    className="text-[28px] font-light text-white leading-[1.15] mb-4 whitespace-pre-line"
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                    }}
                  >
                    {title}
                  </h3>

                  {/* Text */}
                  <p className="text-[12px] text-white/30 leading-[1.9] max-w-xs">
                    {text}
                  </p>

                  {/* Badge */}
                  <span className="inline-block mt-5 text-[8px] font-mono tracking-[.2em] uppercase text-white/20 border border-white/[0.08] px-3 py-1.5">
                    {badge}
                  </span>
                </div>

                {/* Bottom line slide on hover */}
                <div className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-white/20 group-hover:w-full transition-all duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
