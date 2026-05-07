"use client";

import { useEffect, useState, useId, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IoSearch } from "react-icons/io5";
import { PiBuildingApartmentFill } from "react-icons/pi";
import { Tabs, Tab } from "@heroui/tabs";
import { Pagination } from "@heroui/pagination";
import type { Key } from "@react-types/shared";
import { FaBus, FaCar, FaStar, FaGasPump, FaPhoneAlt } from "react-icons/fa";
import { FaHotel, FaLocationDot, FaChevronDown } from "react-icons/fa6";
import { MdPeople } from "react-icons/md";
import { PiSeatFill } from "react-icons/pi";
import { SiTransmission } from "react-icons/si";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();
const PER_PAGE = 12;

// ── Types ──────────────────────────────────────────────────────────────────────
interface TicketResult {
  ticket_id: number;
  ticket_price: number | null;
  departure_date: string | null;
  departure_location: string | null;
  destination: string | null;
  buses: {
    bus_name: string | null;
    bus_capacity: number | null;
    bus_type: string | null;
    bus_image_url: string | null;
    users: { first_name: string; last_name: string } | null;
  } | null;
}

interface HotelResult {
  hotel_id: string;
  name: string;
  city: string | null;
  country: string | null;
  star_rating: number | null;
  main_image_url: string | null;
  has_pool: boolean | null;
  has_parking: boolean | null;
  has_breakfast: boolean | null;
  hotel_rooms: { price_per_night: number }[];
}

interface ApartmentResult {
  apartment_id: string;
  title: string;
  city: string | null;
  country: string | null;
  price_per_night: number;
  max_guests: number;
  main_image_url: string | null;
  property_type: string | null;
}

interface CarResult {
  car_id: string;
  brand: string;
  model: string;
  year: number | null;
  seats: number | null;
  transmission: string | null;
  fuel_type: string | null;
  price_per_day: number;
  main_image_url: string | null;
  is_available?: boolean;
}

// ── Helpers ────────────────────────────────────────────────────────────────────
const minHotelPrice = (rooms: { price_per_night: number }[]) =>
  rooms.length
    ? Math.min(...rooms.map((r) => Number(r.price_per_night)))
    : null;

const fmt = (d: string | null, type: "date" | "time") =>
  d
    ? new Date(d).toLocaleString(
        "fr-FR",
        type === "date"
          ? { day: "2-digit", month: "short", year: "numeric" }
          : { hour: "2-digit", minute: "2-digit" },
      )
    : "—";

// ── Design system (from PartenairesHome) ──────────────────────────────────────

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

const VignetteBus = ({ type }: { type: string | null }) => (
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
      <rect
        x="8"
        y="14"
        width="84"
        height="36"
        rx="4"
        stroke="white"
        strokeOpacity="0.2"
        strokeWidth="1"
        fill="white"
        fillOpacity="0.02"
      />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect
          key={i}
          x={14 + i * 16}
          y="20"
          width="10"
          height="10"
          rx="1"
          stroke="white"
          strokeOpacity="0.2"
          strokeWidth="0.7"
          fill="white"
          fillOpacity="0.04"
        />
      ))}
      <circle
        cx="24"
        cy="52"
        r="6"
        stroke="white"
        strokeOpacity="0.2"
        strokeWidth="1"
        fill="none"
      />
      <circle
        cx="24"
        cy="52"
        r="2.5"
        stroke="white"
        strokeOpacity="0.15"
        strokeWidth="0.8"
        fill="none"
      />
      <circle
        cx="76"
        cy="52"
        r="6"
        stroke="white"
        strokeOpacity="0.2"
        strokeWidth="1"
        fill="none"
      />
      <circle
        cx="76"
        cy="52"
        r="2.5"
        stroke="white"
        strokeOpacity="0.15"
        strokeWidth="0.8"
        fill="none"
      />
      <rect
        x="8"
        y="36"
        width="84"
        height="4"
        stroke="white"
        strokeOpacity="0.1"
        strokeWidth="0.5"
        fill="white"
        fillOpacity="0.02"
      />
    </svg>
    {type && (
      <p className="relative text-[10px] tracking-[.2em] text-white/20 uppercase mt-1">
        {type}
      </p>
    )}
  </div>
);

// SmartImage avec blur-up + fallback
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
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${status === "loaded" ? "opacity-100" : "opacity-0"} ${className}`}
      />
    </>
  );
};

// MonoBadge
const MonoBadge = ({ label, accent }: { label: string; accent?: boolean }) => (
  <span
    className={`text-[9px] tracking-[.2em] uppercase px-2 py-0.5 border
    ${accent ? "border-amber-400/30 bg-amber-400/30 text-white" : "border-white/[0.08] bg-gray-700 text-white"}`}
  >
    {label}
  </span>
);

// CardCTA
const CardCTA = ({
  href,
  label,
  disabled,
}: {
  href: string;
  label: string;
  disabled?: boolean;
}) => (
  <a
    href={disabled ? "#" : href}
    aria-disabled={disabled}
    className={`flex items-center gap-2 text-[10px] tracking-[.25em] uppercase transition-all duration-300 no-underline group/cta
      ${disabled ? "text-white/15 pointer-events-none" : "text-white/40 hover:text-white hover:gap-3"}`}
  >
    {label}
    <span className="inline-block w-4 h-px bg-current group-hover/cta:w-7 transition-all duration-300" />
  </a>
);

// SkeletonCard
const SkeletonCard = () => (
  <div className="bg-[#0d0d0d] overflow-hidden">
    <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/[0.06]" />
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
        <div className="h-7 w-24 bg-white/[0.08] rounded" />
      </div>
    </div>
  </div>
);

// ── TICKET CARD ────────────────────────────────────────────────────────────────
const TicketCard = ({
  ticket,
  index,
  onClick,
}: {
  ticket: TicketResult;
  index: number;
  onClick: () => void;
}) => {
  const bus = ticket.buses;
  return (
    <div
      onClick={onClick}
      className="group relative bg-[#0d0d0d] hover:bg-[#0f0f0f] transition-colors duration-300 overflow-hidden flex flex-col cursor-pointer"
    >
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/0 group-hover:bg-white/20 transition-all duration-500 z-10" />

      {/* Image zone */}
      <div className="relative h-44 overflow-hidden bg-[#080808] flex-shrink-0">
        <GridPattern />
        <SmartImage
          src={bus?.bus_image_url ?? null}
          alt={bus?.bus_name ?? "Bus"}
          eager={index < 3}
          className="brightness-[.65] group-hover:brightness-[.8] group-hover:scale-[1.03] transition-all duration-500"
          fallback={<VignetteBus type={bus?.bus_type ?? null} />}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0d0d0d] z-10" />
        <div className="absolute top-3 left-3 z-20">
          <MonoBadge label="Disponible" accent />
        </div>
        {bus?.bus_type && (
          <div className="absolute bottom-3 left-3 z-20">
            <span className="text-[9px] tracking-[.2em] uppercase text-white/40 font-mono">
              {bus.bus_type}
            </span>
          </div>
        )}
      </div>

      <div className="h-px bg-white/[0.06]" />

      {/* Body */}
      <div className="px-5 pt-4 pb-5 flex flex-col flex-1">
        {/* Route */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base font-black text-white tracking-tight truncate">
            {ticket.departure_location}
          </span>
          <span className="text-amber-400 text-sm flex-shrink-0">→</span>
          <span className="text-base font-black text-white tracking-tight truncate">
            {ticket.destination}
          </span>
        </div>

        {/* Infos bus */}
        {bus?.bus_name && (
          <p className="text-[11px] text-white/30 mb-3 font-mono">
            {bus.bus_name}
          </p>
        )}

        {/* Date / heure */}
        <div className="space-y-1.5 mb-3">
          <div className="flex items-center gap-1.5 text-[11px] text-white/30 font-mono">
            <span className="text-white/20">📅</span>
            <span>{fmt(ticket.departure_date, "date")}</span>
            <span className="text-white/15 mx-1">·</span>
            <span>{fmt(ticket.departure_date, "time")}</span>
          </div>
          {bus?.bus_capacity && (
            <div className="flex items-center gap-1.5 text-[11px] text-white/30 font-mono">
              <MdPeople className="text-white/20" />
              <span>{bus.bus_capacity} places</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-auto border-t border-white/[0.06] pt-4 flex items-center justify-between">
          <div>
            <p className="text-[9px] text-white/20 font-mono">Prix</p>
            <p className="text-base font-black text-white leading-tight mt-0.5">
              {ticket.ticket_price
                ? Number(ticket.ticket_price).toLocaleString()
                : "—"}
              <span className="text-[10px] font-normal text-white/25 ml-1">
                FCFA
              </span>
            </p>
          </div>
          <button className="text-[10px] cursor-pointer tracking-[.2em] uppercase text-white/40 hover:text-white border border-white/[0.08] hover:border-white/20 px-3 py-1.5 transition-all duration-300">
            Voir →
          </button>
        </div>
      </div>
    </div>
  );
};

// ── HOTEL CARD ─────────────────────────────────────────────────────────────────
const HotelCard = ({ hotel, index }: { hotel: HotelResult; index: number }) => {
  const prix = minHotelPrice(hotel.hotel_rooms);
  const isPremium = (hotel.star_rating ?? 0) >= 4;
  return (
    <div className="group relative bg-[#0d0d0d] hover:bg-[#0f0f0f] transition-colors duration-300 overflow-hidden flex flex-col">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/0 group-hover:bg-white/20 transition-all duration-500 z-10" />

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
        <div className="absolute top-3 left-3 z-20 flex gap-1.5">
          <MonoBadge
            label={prix ? "Disponible" : "Non renseigné"}
            accent={!!prix}
          />
          {isPremium && <MonoBadge label="Premium" accent />}
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

        {/* Équipements */}
        <div className="flex flex-wrap gap-1 mb-3">
          {hotel.has_pool && (
            <span className="text-[9px] border border-white/[0.08] text-white/25 px-2 py-0.5 font-mono">
              Piscine
            </span>
          )}
          {hotel.has_breakfast && (
            <span className="text-[9px] border border-white/[0.08] text-white/25 px-2 py-0.5 font-mono">
              Petit-déj.
            </span>
          )}
          {hotel.has_parking && (
            <span className="text-[9px] border border-white/[0.08] text-white/25 px-2 py-0.5 font-mono">
              Parking
            </span>
          )}
        </div>

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
const ApartmentCard = ({
  apt,
  index,
}: {
  apt: ApartmentResult;
  index: number;
}) => (
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
        <MonoBadge label={apt.property_type ?? "Appartement"} />
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

// ── CAR CARD ───────────────────────────────────────────────────────────────────
const CarCard = ({ car, index }: { car: CarResult; index: number }) => {
  const available = car.is_available !== false;
  return (
    <div
      className={`group relative bg-[#0d0d0d] hover:bg-[#0f0f0f] transition-colors duration-300 overflow-hidden flex flex-col ${!available ? "opacity-60" : ""}`}
    >
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/0 group-hover:bg-white/20 transition-all duration-500 z-10" />

      <div className="relative h-44 overflow-hidden bg-[#080808] flex-shrink-0">
        <GridPattern />
        <SmartImage
          src={car.main_image_url}
          alt={`${car.brand} ${car.model}`}
          eager={index < 4}
          className={`${available ? "brightness-[.65] group-hover:brightness-[.8]" : "brightness-[.4]"} group-hover:scale-[1.03] transition-all duration-500`}
          fallback={<VignetteVoiture brand={car.brand} />}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0d0d0d] z-10" />
        <div className="absolute top-3 left-3 z-20">
          <MonoBadge
            label={available ? "Disponible" : "Indisponible"}
            accent={available}
          />
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

        <div className="flex gap-2 mb-3 flex-wrap">
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
              {Number(car.price_per_day).toLocaleString()}
              <span className="text-[10px] font-normal text-white/25 ml-1">
                FCFA/j
              </span>
            </p>
          </div>
          <CardCTA
            href={`/voitures/${car.car_id}`}
            label={available ? "Voir" : "Indispo."}
            disabled={!available}
          />
        </div>
      </div>
    </div>
  );
};

// ── Empty states ───────────────────────────────────────────────────────────────
const EmptyState = ({
  icon,
  message,
  sub,
}: {
  icon: React.ReactNode;
  message: string;
  sub: string;
}) => (
  <div className="col-span-full py-20 flex flex-col items-center text-white/20">
    <div className="mb-4 opacity-20">{icon}</div>
    <p className="text-lg font-black tracking-tight text-white/30">{message}</p>
    <p className="text-sm mt-1">{sub}</p>
  </div>
);

// ── Filtre row commun ──────────────────────────────────────────────────────────
const FilterRow = ({
  children,
  onReset,
  hasFilters,
}: {
  children: React.ReactNode;
  onReset?: () => void;
  hasFilters?: boolean;
}) => (
  <div className="bg-[#0d0d0d] border border-white/[0.08] p-5 mb-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
      {children}
    </div>
    {hasFilters && onReset && (
      <button
        onClick={onReset}
        className="mt-3 text-xs text-white/30 hover:text-white/60 transition-colors"
      >
        ✕ Réinitialiser les filtres
      </button>
    )}
  </div>
);

// ── ONGLET TRANSPORT ──────────────────────────────────────────────────────────
function TransportTab({
  departures,
  destinations,
}: {
  departures: string[];
  destinations: string[];
}) {
  const router = useRouter();
  const [depFilter, setDepFilter] = useState("");
  const [destFilter, setDestFilter] = useState("");
  const [dateFilter, setDateFilter] = useState<Date | undefined>();
  const [openDate, setOpenDate] = useState(false);
  const [results, setResults] = useState<TicketResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [page, setPage] = useState(1);

  const search = async () => {
    setLoading(true);
    setSearched(true);
    setPage(1);
    let q = supabase
      .from("tickets")
      .select(
        `ticket_id, ticket_price, departure_date, departure_location, destination,
         buses(bus_name, bus_capacity, bus_type, bus_image_url, users(first_name, last_name))`,
      )
      .gt("departure_date", new Date().toISOString());
    if (depFilter) q = q.eq("departure_location", depFilter);
    if (destFilter) q = q.eq("destination", destFilter);
    if (dateFilter) {
      const d = dateFilter.toISOString().split("T")[0];
      q = q
        .gte("departure_date", `${d}T00:00:00`)
        .lte("departure_date", `${d}T23:59:59`);
    }
    const { data } = await q
      .order("departure_date", { ascending: true })
      .limit(200);
    setResults((data as unknown as TicketResult[]) ?? []);
    setLoading(false);
  };

  const totalPages = Math.max(1, Math.ceil(results.length / PER_PAGE));
  const paginated = results.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="mt-6">
      <FilterRow
        hasFilters={!!(depFilter || destFilter || dateFilter)}
        onReset={() => {
          setDepFilter("");
          setDestFilter("");
          setDateFilter(undefined);
        }}
      >
        <div className="flex flex-col gap-1.5">
          <Label className="text-[10px] tracking-[.3em] text-white/30 uppercase">
            Départ
          </Label>
          <Select
            value={depFilter || "all"}
            onValueChange={(v) => setDepFilter(v === "all" ? "" : v)}
          >
            <SelectTrigger className="bg-white/5 border-white/[0.1] text-white text-sm cursor-pointer">
              <SelectValue placeholder="Toutes les villes" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all" className="cursor-pointer">Toutes les villes</SelectItem>
              {departures.map((d) => (
                <SelectItem key={d} value={d} className="cursor-pointer">
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-[10px] tracking-[.3em] text-white/30 uppercase">
            Destination
          </Label>
          <Select
            value={destFilter || "all"}
            onValueChange={(v) => setDestFilter(v === "all" ? "" : v)}
          >
            <SelectTrigger className="bg-white/5 border-white/[0.1] text-white text-sm cursor-pointer">
              <SelectValue placeholder="Toutes destinations" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all" className="cursor-pointer">
                Toutes les destinations
              </SelectItem>
              {destinations.map((d) => (
                <SelectItem key={d} value={d} className="cursor-pointer">
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-[10px] tracking-[.3em] text-white/30 uppercase">
            Date de départ
          </Label>
          <Popover open={openDate} onOpenChange={setOpenDate}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="bg-white/5 border-white/[0.1] text-white justify-between font-normal w-full text-sm cursor-pointer"
              >
                {dateFilter
                  ? dateFilter.toLocaleDateString("fr-FR")
                  : "Toutes les dates"}
                <FaChevronDown className="w-3 h-3 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white" align="start">
              <Calendar
                mode="single"
                selected={dateFilter}
                captionLayout="dropdown"
                onSelect={(d) => {
                  setDateFilter(d);
                  setOpenDate(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
        <button
          onClick={search}
          disabled={loading}
          className="flex items-center justify-center cursor-pointer gap-2 text-[10px] tracking-[.3em] uppercase font-bold text-white bg-white/10 hover:bg-white/15 border border-white/[0.1] hover:border-white/20 px-4 py-2.5 transition-all duration-300 disabled:opacity-40"
        >
          <IoSearch className="w-3.5 h-3.5" />
          {loading ? "Recherche..." : "Rechercher"}
        </button>
      </FilterRow>

      {searched && (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] tracking-[.3em] text-white/30 uppercase font-mono">
              {loading
                ? "Chargement…"
                : `${results.length} trajet${results.length !== 1 ? "s" : ""} trouvé${results.length !== 1 ? "s" : ""}`}
            </p>
            {!loading && results.length > PER_PAGE && (
              <p className="text-white/20 text-xs font-mono">
                Page {page} / {totalPages}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-px bg-white/[0.06]">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            ) : results.length === 0 ? (
              <EmptyState
                icon={<FaBus className="w-16 h-16" />}
                message="Aucun trajet trouvé"
                sub="Essayez de modifier les filtres."
              />
            ) : (
              paginated.map((ticket, i) => (
                <TicketCard
                  key={ticket.ticket_id}
                  ticket={ticket}
                  index={i}
                  onClick={() => router.push("/transports")}
                />
              ))
            )}
          </div>

          {!loading && totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <Pagination
                showControls
                page={page}
                total={totalPages}
                onChange={(p) => {
                  setPage(p);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── ONGLET HÉBERGEMENT ─────────────────────────────────────────────────────────
function HebergementTab({ cities }: { cities: string[] }) {
  const router = useRouter();
  const [hebergType, setHebergType] = useState<"hotel" | "apartment">("hotel");
  const [cityFilter, setCityFilter] = useState("");
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();
  const [openCheckIn, setOpenCheckIn] = useState(false);
  const [openCheckOut, setOpenCheckOut] = useState(false);
  const [hotelResults, setHotelResults] = useState<HotelResult[]>([]);
  const [apartmentResults, setApartmentResults] = useState<ApartmentResult[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [page, setPage] = useState(1);

  const results = hebergType === "hotel" ? hotelResults : apartmentResults;
  const totalPages = Math.max(1, Math.ceil(results.length / PER_PAGE));
  const paginated = results.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const search = async () => {
    setLoading(true);
    setSearched(true);
    setPage(1);
    if (hebergType === "hotel") {
      let q = supabase
        .from("hotels")
        .select(
          "hotel_id, name, city, country, star_rating, main_image_url, has_pool, has_parking, has_breakfast, hotel_rooms(price_per_night)",
        );
      if (cityFilter) q = q.eq("city", cityFilter);
      const { data } = await q.limit(200);
      setHotelResults((data as unknown as HotelResult[]) ?? []);
    } else {
      let q = supabase
        .from("apartments")
        .select(
          "apartment_id, title, city, country, price_per_night, max_guests, main_image_url, property_type",
        )
        .eq("is_published", true);
      if (cityFilter) q = q.eq("city", cityFilter);
      const { data } = await q.limit(200);
      setApartmentResults((data as unknown as ApartmentResult[]) ?? []);
    }
    setLoading(false);
  };

  return (
    <div className="mt-6">
      {/* Toggle type */}
      <div className="flex gap-px mb-6">
        {(["hotel", "apartment"] as const).map((type) => (
          <button
            key={type}
            onClick={() => {
              setHebergType(type);
              setSearched(false);
            }}
            className={`flex items-center cursor-pointer gap-2 px-5 py-2 text-[10px] tracking-[.25em] uppercase font-bold transition-all duration-300
              ${hebergType === type ? "bg-white text-black" : "bg-white/5 text-white/40 hover:text-white border border-white/[0.08]"}`}
          >
            {type === "hotel" ? (
              <>
                <FaHotel className="w-3 h-3" /> Hôtels
              </>
            ) : (
              <>
                <PiBuildingApartmentFill className="w-3 h-3" /> Appartements
              </>
            )}
          </button>
        ))}
      </div>

      <FilterRow>
        <div className="flex flex-col gap-1.5">
          <Label className="text-[10px] tracking-[.3em] text-white/30 uppercase">
            Ville
          </Label>
          <Select
            value={cityFilter || "all"}
            onValueChange={(v) => setCityFilter(v === "all" ? "" : v)}
          >
            <SelectTrigger className="bg-white/5 border-white/[0.1] text-white text-sm cursor-pointer">
              <SelectValue placeholder="Toutes les villes" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all" className="cursor-pointer">
                Toutes les villes
              </SelectItem>
              {cities.map((c) => (
                <SelectItem key={c} value={c} className="cursor-pointer">
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-[10px] tracking-[.3em] text-white/30 uppercase">
            Arrivée
          </Label>
          <Popover open={openCheckIn} onOpenChange={setOpenCheckIn}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="bg-white/5 border-white/[0.1] cursor-pointer text-white justify-between font-normal w-full text-sm"
              >
                {checkIn
                  ? checkIn.toLocaleDateString("fr-FR")
                  : "Date d'arrivée"}
                <FaChevronDown className="w-3 h-3 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white" align="start">
              <Calendar
                mode="single"
                selected={checkIn}
                captionLayout="dropdown"
                onSelect={(d) => {
                  setCheckIn(d);
                  setOpenCheckIn(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-[10px] tracking-[.3em] text-white/30 uppercase">
            Départ
          </Label>
          <Popover open={openCheckOut} onOpenChange={setOpenCheckOut}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="bg-white/5 border-white/[0.1] cursor-pointer text-white justify-between font-normal w-full text-sm"
              >
                {checkOut
                  ? checkOut.toLocaleDateString("fr-FR")
                  : "Date de départ"}
                <FaChevronDown className="w-3 h-3 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white" align="start">
              <Calendar
                mode="single"
                selected={checkOut}
                captionLayout="dropdown"
                onSelect={(d) => {
                  setCheckOut(d);
                  setOpenCheckOut(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
        <button
          onClick={search}
          disabled={loading}
          className="flex items-center cursor-pointer justify-center gap-2 text-[10px] tracking-[.3em] uppercase font-bold text-white bg-white/10 hover:bg-white/15 border border-white/[0.1] hover:border-white/20 px-4 py-2.5 transition-all duration-300 disabled:opacity-40"
        >
          <IoSearch className="w-3.5 h-3.5" />
          {loading ? "Recherche..." : "Rechercher"}
        </button>
      </FilterRow>

      {searched && (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] tracking-[.3em] text-white/30 uppercase font-mono">
              {loading
                ? "Chargement…"
                : `${results.length} résultat${results.length !== 1 ? "s" : ""}`}
            </p>
            {!loading && results.length > PER_PAGE && (
              <p className="text-white/20 text-xs font-mono">
                Page {page} / {totalPages}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-white/[0.06]">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            ) : results.length === 0 ? (
              <EmptyState
                icon={
                  <span className="text-5xl">
                    {hebergType === "hotel" ? "🏨" : "🏠"}
                  </span>
                }
                message="Aucun résultat trouvé"
                sub="Modifiez vos critères."
              />
            ) : hebergType === "hotel" ? (
              (paginated as HotelResult[]).map((hotel, i) => (
                <HotelCard key={hotel.hotel_id} hotel={hotel} index={i} />
              ))
            ) : (
              (paginated as ApartmentResult[]).map((apt, i) => (
                <ApartmentCard key={apt.apartment_id} apt={apt} index={i} />
              ))
            )}
          </div>

          {!loading && totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <Pagination
                showControls
                page={page}
                total={totalPages}
                onChange={(p) => {
                  setPage(p);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── ONGLET VOITURE ─────────────────────────────────────────────────────────────
function VoitureTab() {
  const router = useRouter();
  const [carSeats, setCarSeats] = useState("");
  const [carDate, setCarDate] = useState<Date | undefined>();
  const [openDate, setOpenDate] = useState(false);
  const [results, setResults] = useState<CarResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(results.length / PER_PAGE));
  const paginated = results.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const search = async () => {
    setLoading(true);
    setSearched(true);
    setPage(1);
    let q = supabase
      .from("car_rentals")
      .select(
        "car_id, brand, model, year, seats, transmission, fuel_type, price_per_day, main_image_url, is_available",
      )
      .eq("is_available", true);
    if (carSeats) q = q.gte("seats", parseInt(carSeats));
    const { data } = await q
      .order("price_per_day", { ascending: true })
      .limit(200);
    setResults((data as unknown as CarResult[]) ?? []);
    setLoading(false);
  };

  return (
    <div className="mt-6">
      <FilterRow>
        <div className="flex flex-col gap-1.5">
          <Label className="text-[10px] tracking-[.3em] text-white/30 uppercase">
            Date de prise en charge
          </Label>
          <Popover open={openDate} onOpenChange={setOpenDate}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="bg-white/5 border-white/[0.1] cursor-pointer text-white justify-between font-normal w-full text-sm"
              >
                {carDate
                  ? carDate.toLocaleDateString("fr-FR")
                  : "Choisir une date"}
                <FaChevronDown className="w-3 h-3 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white" align="start">
              <Calendar
                mode="single"
                selected={carDate}
                captionLayout="dropdown"
                onSelect={(d) => {
                  setCarDate(d);
                  setOpenDate(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-[10px] tracking-[.3em] text-white/30 uppercase">
            Places minimum
          </Label>
          <Select
            value={carSeats || "all"}
            onValueChange={(v) => setCarSeats(v === "all" ? "" : v)}
          >
            <SelectTrigger className="bg-white/5 border-white/[0.1] cursor-pointer text-white text-sm">
              <SelectValue placeholder="Toutes" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all" className="cursor-pointer">
                Toutes
              </SelectItem>
              {[2, 4, 5, 6, 7, 8].map((n) => (
                <SelectItem key={n} value={String(n)} className="cursor-pointer">
                  {n} places minimum
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="lg:col-span-2 flex items-end">
          <button
            onClick={search}
            disabled={loading}
            className="w-full flex items-center cursor-pointer justify-center gap-2 text-[10px] tracking-[.3em] uppercase font-bold text-white bg-white/10 hover:bg-white/15 border border-white/[0.1] hover:border-white/20 px-4 py-2.5 transition-all duration-300 disabled:opacity-40"
          >
            <IoSearch className="w-3.5 h-3.5" />
            {loading ? "Recherche..." : "Rechercher"}
          </button>
        </div>
      </FilterRow>

      {searched && (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] tracking-[.3em] text-white/30 uppercase font-mono">
              {loading
                ? "Chargement…"
                : `${results.length} voiture${results.length !== 1 ? "s" : ""} disponible${results.length !== 1 ? "s" : ""}`}
            </p>
            {!loading && results.length > PER_PAGE && (
              <p className="text-white/20 text-xs font-mono">
                Page {page} / {totalPages}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-white/[0.06]">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            ) : results.length === 0 ? (
              <EmptyState
                icon={<FaCar className="w-16 h-16" />}
                message="Aucune voiture disponible"
                sub="Modifiez vos critères."
              />
            ) : (
              paginated.map((car, i) => (
                <CarCard key={car.car_id} car={car} index={i} />
              ))
            )}
          </div>

          {!loading && totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <Pagination
                showControls
                page={page}
                total={totalPages}
                onChange={(p) => {
                  setPage(p);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── PAGE PRINCIPALE ────────────────────────────────────────────────────────────
export default function RecherchePage() {
  return (
    <Suspense>
      <RechercheContent />
    </Suspense>
  );
}

function RechercheContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") ?? "transport") as Key;
  const [selected, setSelected] = useState<Key>(initialTab);

  const [departures, setDepartures] = useState<string[]>([]);
  const [destinations, setDestinations] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    supabase
      .from("tickets")
      .select("departure_location, destination")
      .then(({ data }) => {
        if (data) {
          setDepartures(
            Array.from(
              new Set(
                data
                  .map((t) => t.departure_location)
                  .filter(Boolean) as string[],
              ),
            ).sort(),
          );
          setDestinations(
            Array.from(
              new Set(
                data.map((t) => t.destination).filter(Boolean) as string[],
              ),
            ).sort(),
          );
        }
      });
    Promise.all([
      supabase.from("hotels").select("city"),
      supabase.from("apartments").select("city"),
    ]).then(([{ data: h }, { data: a }]) => {
      const all = [
        ...(h ?? []).map((x) => x.city),
        ...(a ?? []).map((x) => x.city),
      ].filter(Boolean) as string[];
      setCities(Array.from(new Set(all)).sort());
    });
  }, []);

  return (
    <div className="min-h-screen bg-(--bg-legebluefort) pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-5 mb-6">
            <div className="w-[3px] h-16 bg-white shrink-0" />
            <div>
              <p className="text-xs tracking-[0.45em] uppercase text-white/40">
                Explorer
              </p>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight mt-0.5">
                RECHERCHER
              </h1>
              <p className="text-white/30 text-sm mt-1">
                Transport · Hébergement · Location voiture
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-white/20 text-xs tracking-widest">
              EasyTrans
            </span>
            <div className="w-8 h-px bg-white/10" />
          </div>
        </div>

        <Tabs
          aria-label="Catégorie de recherche"
          selectedKey={selected}
          onSelectionChange={(k) => {
            setSelected(k);
            router.replace(`/recherche?tab=${k}`, { scroll: false });
          }}
          classNames={{
            tabList:
              "bg-transparent border-b border-white/[0.08] rounded-none p-0 gap-0",
            tab: "text-white/30 data-[selected=true]:text-white font-black tracking-[.15em] uppercase text-[11px] px-6 py-3 rounded-none border-b-2 border-transparent data-[selected=true]:border-white transition-all",
            tabContent: "group-data-[selected=true]:text-white",
            cursor: "hidden",
          }}
        >
          <Tab
            key="transport"
            title={
              <span className="flex items-center gap-2">
                <FaBus className="w-3.5 h-3.5" /> Transport
              </span>
            }
          >
            <TransportTab departures={departures} destinations={destinations} />
          </Tab>
          <Tab
            key="hebergement"
            title={
              <span className="flex items-center gap-2">
                <FaHotel className="w-3.5 h-3.5" /> Hébergement
              </span>
            }
          >
            <HebergementTab cities={cities} />
          </Tab>
          <Tab
            key="voiture"
            title={
              <span className="flex items-center gap-2">
                <FaCar className="w-3.5 h-3.5" /> Location voiture
              </span>
            }
          >
            <VoitureTab />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
