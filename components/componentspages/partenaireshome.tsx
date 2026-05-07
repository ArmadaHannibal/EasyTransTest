"use client";

import React, { useEffect, useState, useCallback, useId } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { MdFavorite, MdPeople, MdHome } from "react-icons/md";
import { FaPhoneAlt, FaStar } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { PiSeatFill } from "react-icons/pi";
import { SiTransmission } from "react-icons/si";
import { FaGasPump } from "react-icons/fa";
import { MdLocationPin } from "react-icons/md";
import { createClient } from "@/utils/supabase/client";
import DecorativeNumber from "@/components/DecorativeNumber";

// ── Types (inchangés) ──────────────────────────────────────────────────────────
interface AgencyOwner {
  first_name: string;
  last_name: string;
  profile_picture?: string;
}
interface Agency {
  id: string;
  name: string;
  logo_url: string | null;
  address: string | null;
  phone: string | null;
  owner_id: string | null;
  users: AgencyOwner | AgencyOwner[] | null;
  buses?: {
    bus_id: number;
    tickets?: {
      departure_location: string | null;
      destination: string | null;
    }[];
  }[];
}
interface Hotel {
  hotel_id: string;
  name: string;
  main_image_url: string | null;
  city: string | null;
  country: string | null;
  star_rating: number | null;
  agencies:
    | { name: string; logo_url?: string | null }
    | { name: string; logo_url?: string | null }[]
    | null;
  hotel_rooms: { price_per_night: number }[] | null;
}
interface Apartment {
  apartment_id: string;
  title: string;
  main_image_url: string | null;
  city: string | null;
  country: string | null;
  price_per_night: number | null;
  max_guests: number | null;
  equipments: string[] | null;
  agencies:
    | { name: string; logo_url?: string | null }
    | { name: string; logo_url?: string | null }[]
    | null;
}
interface Car {
  car_id: string;
  brand: string;
  model: string;
  year: number | null;
  seats: number | null;
  transmission: string | null;
  fuel_type: string | null;
  main_image_url: string | null;
  price_per_day: number | null;
  is_available: boolean;
  agencies:
    | { name: string; logo_url?: string | null }
    | { name: string; logo_url?: string | null }[]
    | null;
}

// ── Helpers ────────────────────────────────────────────────────────────────────
const getRelAgency = (rel: any) => {
  if (!rel) return null;
  if (Array.isArray(rel)) return rel[0] ?? null;
  return rel;
};
const relName = (rel: any) => getRelAgency(rel)?.name ?? "Agence inconnue";
const relLogo = (rel: any) => getRelAgency(rel)?.logo_url ?? null;
const getInitials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((w: string) => w[0])
    .join("")
    .toUpperCase();
const getBandColor = (name: string) => {
  const colors = [
    "#378ADD",
    "#1D9E75",
    "#D85A30",
    "#D4537E",
    "#BA7517",
    "#534AB7",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};
const minHotelPrice = (hotel: Hotel): number | null => {
  const rooms = hotel.hotel_rooms;
  if (!Array.isArray(rooms) || rooms.length === 0) return null;
  const prices = rooms
    .map((r) => Number(r.price_per_night))
    .filter((p) => !isNaN(p));
  return prices.length > 0 ? Math.min(...prices) : null;
};
const getOwner = (users: Agency["users"]): AgencyOwner | null => {
  if (!users) return null;
  if (Array.isArray(users)) return users[0] ?? null;
  return users;
};

const supabase = createClient();

// ── Grille décorative réutilisable (fond des vignettes) ────────────────────────
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

// ── VIGNETTES SVG custom (pas d'image) ────────────────────────────────────────

const VignetteAgence = ({ name, color }: { name: string; color: string }) => {
  const initials = getInitials(name);
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#080808]">
      <GridPattern />
      {/* Halo */}
      <div
        className="absolute w-28 h-28 rounded-full blur-2xl"
        style={{ background: `${color}18` }}
      />
      {/* Bâtiment stylisé */}
      <svg
        viewBox="0 0 80 80"
        width="64"
        height="64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative mb-2 opacity-60"
      >
        <rect
          x="20"
          y="28"
          width="40"
          height="42"
          stroke="white"
          strokeOpacity="0.2"
          strokeWidth="1"
          fill="white"
          fillOpacity="0.02"
        />
        <polygon
          points="15,28 40,10 65,28"
          stroke="white"
          strokeOpacity="0.3"
          strokeWidth="1"
          fill="white"
          fillOpacity="0.05"
        />
        <rect
          x="28"
          y="42"
          width="8"
          height="8"
          stroke="white"
          strokeOpacity="0.25"
          strokeWidth="0.8"
          fill="none"
        />
        <rect
          x="44"
          y="42"
          width="8"
          height="8"
          stroke="white"
          strokeOpacity="0.25"
          strokeWidth="0.8"
          fill="none"
        />
        <rect
          x="34"
          y="54"
          width="12"
          height="16"
          stroke="white"
          strokeOpacity="0.3"
          strokeWidth="0.8"
          fill="white"
          fillOpacity="0.04"
        />
      </svg>
      {/* Initiales */}
      <div
        className="relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-black tracking-wider border border-white/10"
        style={{ background: `${color}22`, color }}
      >
        {initials}
      </div>
    </div>
  );
};

const VignetteHotel = ({ stars }: { stars: number | null }) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#080808]">
    <GridPattern />
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
      {/* Immeuble */}
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
      {/* Porte */}
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
      {/* Toit plat ligne */}
      <line
        x1="8"
        y1="25"
        x2="72"
        y2="25"
        stroke="white"
        strokeOpacity="0.2"
        strokeWidth="1"
      />
      {/* Antenne */}
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
    <p className="relative text-[10px] tracking-[.2em] text-white/20 uppercase mt-1">
      {brand}
    </p>
  </div>
);

// ── Image avec blur-up + vignette fallback ─────────────────────────────────────
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
  const [status, setStatus] = useState<"idle" | "loading" | "loaded" | "error">(
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
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          status === "loaded" ? "opacity-100" : "opacity-0"
        } ${className}`}
      />
    </>
  );
};

// ── Skeleton dark cohérent ─────────────────────────────────────────────────────
const SkeletonCard = ({
  index = 0,
  sectionPrefix = "sk",
}: {
  index?: number;
  sectionPrefix?: string;
}) => (
  <div className="bg-[#0d0d0d] overflow-hidden">
    <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/[0.06]" />
    <div className="h-44 bg-[#080808] relative overflow-hidden">
      <div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent animate-[shimmer_1.5s_infinite]"
        style={{ backgroundSize: "200% 100%" }}
      />
      <GridPattern />
    </div>
    <div className="h-px bg-white/[0.06]" />
    <div className="p-5 space-y-3">
      <div className="h-2 w-8 bg-white/[0.06] rounded" />
      <div className="h-4 w-3/4 bg-white/[0.08] rounded" />
      <div className="h-3 w-full bg-white/[0.04] rounded" />
      <div className="h-3 w-2/3 bg-white/[0.04] rounded" />
      <div className="pt-3 border-t border-white/[0.06] flex justify-between items-center">
        <div className="h-4 w-16 bg-white/[0.06] rounded" />
        <div className="h-7 w-24 bg-white/[0.08] rounded" />
      </div>
    </div>
  </div>
);

// ── Header section (style DestinationHome) ─────────────────────────────────────
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
      <span className="text-white/20 text-xs tracking-widest">
        EasyTrans
      </span>
      <div className="w-8 h-px bg-white/10" />
    </div>
  </div>
);

// ── CTA link (style cohérent) ──────────────────────────────────────────────────
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
    className={`flex items-center gap-2 text-[10px] tracking-[.25em] uppercase transition-all duration-300 no-underline group/cta
      ${disabled ? "text-white/15 pointer-events-none" : "text-white/40 hover:text-white hover:gap-3"}`}
  >
    {label}
    <span className="inline-block w-4 h-px bg-current group-hover/cta:w-7 transition-all duration-300" />
  </Link>
);

// ── Badge mono ─────────────────────────────────────────────────────────────────
const MonoBadge = ({ label, accent }: { label: string; accent?: boolean }) => (
  <span
    className={`text-[9px] tracking-[.2em] uppercase px-2 py-0.5 border
    ${accent ? "border-amber-400/30 bg-amber-400/30 text-white" : "border-white/[0.08] bg-gray-700 text-white"}`}
  >
    {label}
  </span>
);

// ── AGENCY CARD ────────────────────────────────────────────────────────────────
const AgencyCard = ({
  agency,
  ratingsMap,
  onVisit,
  index,
}: {
  agency: Agency;
  ratingsMap: Record<string, number>;
  onVisit: (id: string) => void;
  index: number;
}) => {
  const bandColor = getBandColor(agency.name ?? "A");
  const agRating = ratingsMap[agency.id];
  const isTopRated = agRating && agRating >= 4;
  const owner = getOwner(agency.users);
  const cities = new Set<string>();
  agency.buses?.forEach((b) =>
    b.tickets?.forEach((t) => {
      if (t.departure_location) cities.add(t.departure_location);
      if (t.destination) cities.add(t.destination);
    }),
  );
  const cityList = Array.from(cities).slice(0, 3);
  const busCount = agency.buses?.length ?? 0;
  const ticketCount =
    agency.buses?.reduce((acc, b) => acc + (b.tickets?.length ?? 0), 0) ?? 0;

  return (
    <div className="group relative bg-[#0d0d0d] hover:bg-[#0f0f0f] transition-colors duration-300 overflow-hidden flex flex-col">
      {/* Accent top */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/0 group-hover:bg-white/20 transition-all duration-500 z-10" />

      {/* Zone visuelle */}
      <div className="relative h-44 overflow-hidden bg-[#080808] flex-shrink-0">
        <GridPattern />
        <VignetteAgence name={agency.name ?? "AG"} color={bandColor} />
        {/* Logo overlay si dispo */}
        {agency.logo_url && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <SmartImage
              src={agency.logo_url}
              alt={agency.name}
              eager={index < 4}
              className="object-contain brightness-90"
              fallback={
                <VignetteAgence name={agency.name ?? "AG"} color={bandColor} />
              }
            />
          </div>
        )}
        {/* Badge top-rated */}
        {isTopRated && (
          <div className="absolute top-3 right-3 z-20">
            <MonoBadge label="Top noté" accent />
          </div>
        )}
      </div>

      <div className="h-px bg-white/[0.06]" />

      {/* Body */}
      <div className="px-5 pt-4 pb-5 flex flex-col flex-1">
        {/* <p className="text-[10px] tracking-[.35em] text-white/20 font-bold mb-2">
          {agency.id.slice(0, 8)}
        </p> */}
        <h3 className="text-base font-black text-white tracking-tight mb-0.5">
          {agency.name}
        </h3>
        {owner && (
          <p className="text-[11px] text-white/30 mb-3">
            {owner.first_name} {owner.last_name}
          </p>
        )}

        {/* Étoiles */}
        <div className="flex items-center gap-1.5 mb-3">
          {agRating ? (
            <>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaStar
                    key={i}
                    className={`w-2.5 h-2.5 ${i < agRating ? "text-amber-400" : "text-white/10"}`}
                  />
                ))}
              </div>
              <span className="text-[10px] text-white/30 font-mono">
                {agRating}/5
              </span>
            </>
          ) : (
            <span className="text-[10px] text-white/20 italic font-mono">
              Aucun avis
            </span>
          )}
        </div>

        {/* Adresse + téléphone */}
        <div className="space-y-1.5 mb-3">
          <div className="flex items-center gap-1.5 text-[11px] text-white/30">
            <MdLocationPin className="flex-shrink-0 text-sm text-white/20" />
            <span className="truncate">
              {agency.address ?? "Adresse non disponible"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-white/30">
            <FaPhoneAlt className="flex-shrink-0 text-xs text-white/20" />
            <span>{agency.phone ?? "Aucun numéro"}</span>
          </div>
        </div>

        {/* Villes */}
        {cityList.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {cityList.map((c) => (
              <span
                key={c}
                className="text-[9px] px-2 py-0.5 border border-white/[0.08] text-white/25 tracking-wider"
              >
                {c}
              </span>
            ))}
            {cities.size > 3 && (
              <span className="text-[9px] text-white/20 font-mono">
                +{cities.size - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto border-t border-white/[0.06] pt-4 flex items-center justify-between">
          <div className="flex gap-4">
            <div>
              <p className="text-base font-black text-white leading-none">
                {busCount}
              </p>
              <p className="text-[10px] text-white/20 mt-0.5">Bus</p>
            </div>
            <div>
              <p className="text-base font-black text-white leading-none">
                {ticketCount}
              </p>
              <p className="text-[10px] text-white/20 mt-0.5">
                Tickets
              </p>
            </div>
          </div>
          <button
            onClick={() => onVisit(agency.id)}
            className="text-[10px] cursor-pointer tracking-[.2em] uppercase text-white/40 hover:text-white border border-white/[0.08] hover:border-white/20 px-3 py-1.5 transition-all duration-300"
          >
            Visiter →
          </button>
        </div>
      </div>
    </div>
  );
};

// ── HOTEL CARD ─────────────────────────────────────────────────────────────────
const HotelCard = ({ hotel, index }: { hotel: Hotel; index: number }) => {
  const prix = minHotelPrice(hotel);
  const aName = relName(hotel.agencies);
  const isPremium = (hotel.star_rating ?? 0) >= 4;

  return (
    <div className="group relative bg-[#0d0d0d] hover:bg-[#0f0f0f] transition-colors duration-300 overflow-hidden flex flex-col">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/0 group-hover:bg-white/20 transition-all duration-500 z-10" />

      {/* Image zone */}
      <div className="relative h-44 overflow-hidden bg-[#080808] flex-shrink-0">
        <GridPattern />
        <SmartImage
          src={hotel.main_image_url}
          alt={hotel.name}
          eager={index < 2}
          className="brightness-[.65] group-hover:brightness-[.8] group-hover:scale-[1.03] transition-all duration-500"
          fallback={<VignetteHotel stars={hotel.star_rating} />}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0d0d0d] z-10" />

        {/* Badges */}
        <div className="absolute top-3 left-3 z-20 flex gap-1.5">
          <MonoBadge
            label={prix ? "Disponible" : "Non renseigné"}
            accent={!!prix}
          />
          {isPremium && <MonoBadge label="Premium" accent />}
        </div>

        {/* Agence */}
        <div className="absolute bottom-3 left-3 z-20">
          <span className="text-[9px] tracking-[.2em] uppercase text-white/40 font-mono">
            {aName}
          </span>
        </div>
      </div>

      <div className="h-px bg-white/[0.06]" />

      {/* Body */}
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

// ── APARTMENT CARD ─────────────────────────────────────────────────────────────
const ApartmentCard = ({ apt, index }: { apt: Apartment; index: number }) => {
  const aName = relName(apt.agencies);
  const eqs = (apt.equipments ?? []).map((e) => e.toLowerCase());
  const hasWifi = eqs.some(
    (e) => e.includes("wi-fi") || e.includes("wifi") || e.includes("internet"),
  );
  const hasKitchen = eqs.some((e) => e.includes("cuisine"));
  const hasParking = eqs.some((e) => e.includes("parking"));

  return (
    <div className="group relative bg-[#0d0d0d] hover:bg-[#0f0f0f] transition-colors duration-300 overflow-hidden flex flex-col">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/0 group-hover:bg-white/20 transition-all duration-500 z-10" />

      <div className="relative h-44 overflow-hidden bg-[#080808] flex-shrink-0">
        <GridPattern />
        <SmartImage
          src={apt.main_image_url}
          alt={apt.title}
          eager={index < 2}
          className="brightness-[.65] group-hover:brightness-[.8] group-hover:scale-[1.03] transition-all duration-500"
          fallback={<VignetteAppartement />}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0d0d0d] z-10" />
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

        {/* Équipements */}
        <div className="flex flex-wrap gap-1 mb-3">
          {hasWifi && (
            <span className="text-[9px] border border-white/[0.08] text-white/25 px-2 py-0.5 font-mono">
              WiFi
            </span>
          )}
          {hasKitchen && (
            <span className="text-[9px] border border-white/[0.08] text-white/25 px-2 py-0.5 font-mono">
              Cuisine
            </span>
          )}
          {hasParking && (
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
              {apt.price_per_night
                ? Number(apt.price_per_night).toLocaleString()
                : "—"}
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

// ── CAR CARD ───────────────────────────────────────────────────────────────────
const CarCard = ({ car, index }: { car: Car; index: number }) => {
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
            accent={car.is_available}
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
      </div>

      <div className="h-px bg-white/[0.06]" />

      <div className="px-5 pt-4 pb-5 flex flex-col flex-1">
        <p className="text-[10px] tracking-[.35em] text-white/20 font-bold mb-1">
          {car.year ?? "—"}
        </p>
        <h3 className="text-base font-black text-white tracking-tight mb-3 truncate">
          {car.brand} {car.model}
        </h3>

        {/* Specs */}
        <div className="flex gap-2 mb-3">
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
              <span className="text-[10px] text-white/30 truncate max-w-[40px]">
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
          <CardCTA
            href={`/voitures/${car.car_id}`}
            label={car.is_available ? "Voir" : "Indispo."}
            disabled={!car.is_available}
          />
        </div>
      </div>
    </div>
  );
};

// ── COMPOSANT PRINCIPAL ────────────────────────────────────────────────────────
const PartenairesHome: React.FC = () => {
  const router = useRouter();
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [ratingsMap, setRatingsMap] = useState<Record<string, number>>({});
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const [{ data: ag }, { data: ht }, { data: apt }, { data: ca }] =
        await Promise.all([
          supabase
            .from("agencies")
            .select(
              "id, name, logo_url, address, phone, owner_id, users(first_name, last_name, profile_picture)",
            )
            .limit(4),
          supabase
            .from("hotels")
            .select(
              "hotel_id, name, main_image_url, city, country, star_rating, agencies(name, logo_url), hotel_rooms(price_per_night)",
            )
            .order("created_at", { ascending: false })
            .limit(2),
          supabase
            .from("apartments")
            .select(
              "apartment_id, title, main_image_url, city, country, price_per_night, max_guests, equipments, agencies(name, logo_url)",
            )
            .eq("is_published", true)
            .order("created_at", { ascending: false })
            .limit(2),
          supabase
            .from("car_rentals")
            .select(
              "car_id, brand, model, year, seats, transmission, fuel_type, main_image_url, price_per_day, is_available, agencies(name, logo_url)",
            )
            .order("created_at", { ascending: false })
            .limit(4),
        ]);

      const agencyList = (ag as unknown as Agency[]) || [];

      if (agencyList.length > 0) {
        const ownerIds = agencyList
          .map((a) => a.owner_id)
          .filter(Boolean) as string[];
        if (ownerIds.length > 0) {
          const { data: busesData } = await supabase
            .from("buses")
            .select(
              "bus_id, owner_id, tickets(departure_location, destination)",
            )
            .in("owner_id", ownerIds);
          if (busesData) {
            const busesByOwner: Record<string, any[]> = {};
            busesData.forEach((b: any) => {
              if (!busesByOwner[b.owner_id]) busesByOwner[b.owner_id] = [];
              busesByOwner[b.owner_id].push(b);
            });
            agencyList.forEach((agency) => {
              if (agency.owner_id)
                agency.buses = busesByOwner[agency.owner_id] ?? [];
            });
          }
        }
      }

      let ratingsResult: Record<string, number> = {};
      if (agencyList.length > 0) {
        const agIds = agencyList.map((a) => a.id);
        const { data: reviewsData } = await supabase
          .from("agency_reviews")
          .select("agency_id, rating")
          .in("agency_id", agIds);
        if (reviewsData) {
          const byAgency: Record<string, number[]> = {};
          reviewsData.forEach((r: any) => {
            if (!byAgency[r.agency_id]) byAgency[r.agency_id] = [];
            byAgency[r.agency_id].push(r.rating);
          });
          agencyList.forEach((agency) => {
            const ratings = byAgency[agency.id];
            if (ratings?.length)
              ratingsResult[agency.id] = Math.round(
                ratings.reduce((a, b) => a + b, 0) / ratings.length,
              );
          });
        }
      }

      setAgencies(agencyList);
      setRatingsMap(ratingsResult);
      setHotels((ht as unknown as Hotel[]) || []);
      setApartments((apt as unknown as Apartment[]) || []);
      setCars((ca as unknown as Car[]) || []);
      setLoading(false);
    };
    fetchAll();
  }, []);

  const handleVisitAgency = useCallback(
    (id: string) => router.push(`/agencies/${id}`),
    [router],
  );

  return (
    <section className="relative py-8 md:py-10">
      <div className="absolute left-8 top-0 bottom-0 w-px bg-white/[0.08] hidden lg:block" />
      <DecorativeNumber number="04" />

      {/* ══ AGENCES ══ */}
      <div className="relative mx-auto max-w-6xl px-4 lg:px-0 mb-16">
        <SectionHeader
          label="Transport"
          subtitle="NOS PARTENAIRES TRANSPORT DE CONFIANCE"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.06]">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <SkeletonCard key={i} index={i} sectionPrefix="ag" />
              ))
            : agencies.map((agency, i) => (
                <AgencyCard
                  key={agency.id}
                  agency={agency}
                  ratingsMap={ratingsMap}
                  onVisit={handleVisitAgency}
                  index={i}
                />
              ))}
        </div>
      </div>

      {/* ══ HÉBERGEMENTS ══ */}
      <div className="relative mx-auto max-w-6xl px-4 lg:px-0 mb-16">
        <SectionHeader
          label="Hébergement"
          subtitle="NOS HÉBERGEMENTS RECOMMANDÉS"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.06]">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} index={i} sectionPrefix="ht" />
            ))
          ) : (
            <>
              {hotels.map((hotel, i) => (
                <HotelCard key={hotel.hotel_id} hotel={hotel} index={i} />
              ))}
              {apartments.map((apt, i) => (
                <ApartmentCard key={apt.apartment_id} apt={apt} index={i} />
              ))}
            </>
          )}
        </div>
      </div>

      {/* ══ VOITURES ══ */}
      <div className="relative mx-auto max-w-6xl px-4 lg:px-0">
        <SectionHeader
          label="Location"
          subtitle="LOUEZ LA VOITURE ADAPTÉE À VOTRE VOYAGE"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.06]">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <SkeletonCard key={i} index={i} sectionPrefix="ca" />
              ))
            : cars.map((car, i) => (
                <CarCard key={car.car_id} car={car} index={i} />
              ))}
        </div>
      </div>
    </section>
  );
};

export default PartenairesHome;
