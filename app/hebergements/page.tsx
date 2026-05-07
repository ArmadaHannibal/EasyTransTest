"use client";

import * as React from "react";
import { useId, useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa6";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { FaLocationDot } from "react-icons/fa6";
import { Button as ButtonHeroui } from "@heroui/button";
import { FaPlus } from "react-icons/fa6";
import { FaStar } from "react-icons/fa";
import { MdFavorite, MdPeople, MdHome } from "react-icons/md";
import Loader from "@/components/loader-15";
import { Link } from "@heroui/link";
import { createClient } from "@/utils/supabase/client";

// ── Types ──────────────────────────────────────────────────────────────────────
interface Hotel {
  hotel_id: string;
  name: string;
  main_image_url: string | null;
  city: string | null;
  country: string | null;
  star_rating: number | null;
  agencies: { name: string; logo_url?: string | null }[] | null;
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
  agencies: { name: string; logo_url?: string | null }[] | null;
}

// ── Helpers ────────────────────────────────────────────────────────────────────
const relName = (rel: any): string => {
  if (!rel) return "Agence inconnue";
  if (Array.isArray(rel)) return rel[0]?.name ?? "Agence inconnue";
  return rel.name ?? "Agence inconnue";
};

const minHotelPrice = (hotel: Hotel): number | null => {
  const rooms = hotel.hotel_rooms;
  if (!Array.isArray(rooms) || rooms.length === 0) return null;
  const prices = rooms
    .map((r) => Number(r.price_per_night))
    .filter((p) => !isNaN(p));
  return prices.length > 0 ? Math.min(...prices) : null;
};

const supabase = createClient();

// ── Grille décorative (fond des vignettes) ─────────────────────────────────────
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

// ── Vignette SVG Hôtel ─────────────────────────────────────────────────────────
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

// ── Vignette SVG Appartement ───────────────────────────────────────────────────
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

// ── SmartImage avec fallback ────────────────────────────────────────────────────
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

// ── Badge mono ─────────────────────────────────────────────────────────────────
const MonoBadge = ({ label, accent }: { label: string; accent?: boolean }) => (
  <span
    className={`text-[9px] tracking-[.2em] uppercase px-2 py-0.5 border ${accent ? "border-amber-400/30 bg-amber-400/30 text-white" : "border-white/[0.08] bg-gray-700 text-white"}`}
  >
    {label}
  </span>
);

// ── CTA link ───────────────────────────────────────────────────────────────────
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

// ── Skeleton ────────────────────────────────────────────────────────────────────
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

// ── Section Header ─────────────────────────────────────────────────────────────
const SectionHeader = ({
  label,
  subtitle,
  children,
}: {
  label: string;
  subtitle: string;
  children?: React.ReactNode;
}) => (
  <div className="mb-10 md:mb-14 w-full">
    <div className="flex items-center justify-between">
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
      {children}
    </div>
    <div className="mt-6 flex items-center gap-4">
      <div className="h-px flex-1 bg-white/10" />
      <span className="text-white/20 text-xs tracking-widest">EasyTrans</span>
      <div className="w-8 h-px bg-white/10" />
    </div>
  </div>
);

// ── HOTEL CARD ─────────────────────────────────────────────────────────────────
const HotelCard = ({ hotel, index }: { hotel: Hotel; index: number }) => {
  const prix = minHotelPrice(hotel);
  const aName = relName(hotel.agencies);
  const isPremium = (hotel.star_rating ?? 0) >= 4;

  return (
    <div className="group relative bg-[#0d0d0d] hover:bg-[#0f0f0f] transition-colors duration-300 overflow-hidden flex flex-col h-full">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/0 group-hover:bg-white/20 transition-all duration-500 z-10" />

      {/* Zone image */}
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

        {/* Bouton favori */}
        <button className="absolute top-3 right-3 z-20 w-7 h-7 border border-white/10 bg-black/40 flex items-center justify-center hover:bg-white/10 transition-colors">
          <MdFavorite className="text-white/50 hover:text-white w-3.5 h-3.5 transition-colors" />
        </button>

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
    <div className="group relative bg-[#0d0d0d] hover:bg-[#0f0f0f] transition-colors duration-300 overflow-hidden flex flex-col h-full">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/0 group-hover:bg-white/20 transition-all duration-500 z-10" />

      {/* Zone image */}
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

        {/* Bouton favori */}
        <button className="absolute top-3 right-3 z-20 w-7 h-7 border border-white/10 bg-black/40 flex items-center justify-center hover:bg-white/10 transition-colors">
          <MdFavorite className="text-white/50 hover:text-white w-3.5 h-3.5 transition-colors" />
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

      {/* Body */}
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
          {eqs.length > 0 &&
            !hasWifi &&
            !hasKitchen &&
            !hasParking &&
            apt.equipments?.[0] && (
              <span className="flex items-center gap-0.5 text-[9px] border border-white/[0.08] text-white/25 px-2 py-0.5 font-mono">
                <MdHome className="w-2.5 h-2.5" /> {apt.equipments[0]}
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

// ── COMPOSANT PRINCIPAL ────────────────────────────────────────────────────────
export default function HebergementsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const [{ data: ht }, { data: apt }] = await Promise.all([
        supabase
          .from("hotels")
          .select(
            "hotel_id, name, main_image_url, city, country, star_rating, agencies(name, logo_url), hotel_rooms(price_per_night)",
          )
          .order("created_at", { ascending: false })
          .limit(6),
        supabase
          .from("apartments")
          .select(
            "apartment_id, title, main_image_url, city, country, price_per_night, max_guests, equipments, agencies(name, logo_url)",
          )
          .eq("is_published", true)
          .order("created_at", { ascending: false })
          .limit(6),
      ]);
      setHotels((ht as unknown as Hotel[]) || []);
      setApartments((apt as unknown as Apartment[]) || []);
      setLoading(false);
    };
    fetchAll();
  }, []);

  const isLoading = loading;

  if (isLoading)
    return (
      <div className="relative flex flex-col items-center justify-center h-screen">
        <Loader />
        <div className="mt-64 text-center text-white/40 text-sm font-mono tracking-widest">
          Recherche d'hébergements…
        </div>
      </div>
    );

  const SkeletonCarouselItem = () => (
    <CarouselItem className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
      <div className="p-1 h-full">
        <SkeletonCard />
      </div>
    </CarouselItem>
  );

  return (
    <>
      {/* ══ HERO ══ */}
      <header>
        <div className="relative bg-[url(https://res.cloudinary.com/dtrpkegss/image/upload/v1768138460/chambre-moderne-de-luxe-avec-literie-confortable-et-eclairage-genere-par-l-ia_drfxlf.webp)] bg-right bg-no-repeat bg-size-[60rem] lg:bg-size-[100rem] h-[70vh] lg:h-[75vh]">
          <div className="flex flex-col mx-auto max-w-6xl justify-end items-center h-full text-white text-left pl-0 lg:p-4 pb-12 pr-0 lg:pb-56 lg:pr-0 z-10 relative">
            <div className="flex justify-center text-center lg:justify-center lg:text-center">
              <div>
                <h1 className="text-[1.5rem] lg:text-4xl font-bold mb-4 w-[23rem] lg:w-[43rem]">
                  EasyTrans - Réservez un appartement ou une chambre pour votre
                  séjour
                </h1>
                <p className="text-sm lg:text-base w-[23rem] lg:w-[43rem]">
                  Trouvez des appartements confortables et des chambres
                  soigneusement sélectionnés pour vos séjours courts ou longs, à
                  des prix transparents et sécurisés.
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
            label="Pourquoi nous choisir"
            subtitle="RÉSERVEZ AVEC EASYTRANS, VOYAGEZ L'ESPRIT LIBRE"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Étapes */}
            <div className="space-y-0 divide-y divide-white/[0.06]">
              {[
                {
                  num: "01",
                  title: "Choisissez votre trajet",
                  desc: "Sélectionnez votre ville de départ, votre destination et la date de voyage.",
                },
                {
                  num: "02",
                  title: "Sélectionnez une agence",
                  desc: "Comparez les agences partenaires, les horaires et les tarifs.",
                },
                {
                  num: "03",
                  title: "Payez en toute sécurité",
                  desc: "Réglez votre billet via notre système de paiement sécurisé.",
                },
                {
                  num: "04",
                  title: "Recevez votre ticket",
                  desc: "Votre ticket est disponible immédiatement après paiement.",
                },
              ].map(({ num, title, desc }) => (
                <div
                  key={num}
                  className="group flex items-start gap-6 py-6 hover:bg-white/[0.015] transition-colors duration-300 px-2 -mx-2"
                >
                  <span className="text-[10px] font-black tracking-[.3em] text-white/20 font-mono pt-1 flex-shrink-0">
                    {num}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="w-4 h-4 border border-white/20 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:border-white/40 transition-colors">
                        <FaCheck className="w-2 h-2 text-white/40 group-hover:text-white/70 transition-colors" />
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
                </div>
              ))}
            </div>

            {/* Visuel */}
            <div className="relative hidden lg:block">
              <div className="absolute inset-0 border border-white/[0.06]" />
              <div className="relative h-[28rem] overflow-hidden bg-[#080808]">
                <GridPattern />
                <div className="absolute w-40 h-40 rounded-full blur-3xl bg-amber-500/8 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://res.cloudinary.com/dtrpkegss/image/upload/v1768140405/vue-de-l-espace-interieur-de-l-hotel-de-luxe_1__11zon_hjkp2u.webp"
                  alt="Vue hôtel luxe"
                  className="absolute inset-0 w-full h-full object-cover brightness-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-[9px] tracking-[.35em] uppercase text-white/30 mb-1">
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

      {/* ══ HÔTELS ══ */}
      <section className="relative py-16 md:py-20">
        <div className="absolute left-8 top-0 bottom-0 w-px bg-white/[0.08] hidden lg:block" />
        <div className="mx-auto max-w-6xl px-4 lg:px-0">
          <SectionHeader label="Hébergement" subtitle="HÔTELS DISPONIBLES">
            <ButtonHeroui
              as={Link}
              href="/hebergements/hotel"
              endContent={<FaPlus className="w-3 h-3" />}
              className="text-[10px] tracking-[.2em] uppercase text-white/40 hover:text-white border border-white/[0.08] hover:border-white/20 bg-transparent px-4 py-2 transition-all duration-300 h-auto rounded-none"
            >
              Voir plus
            </ButtonHeroui>
          </SectionHeader>

          <Carousel opts={{ align: "start" }} className="w-full">
            <CarouselContent className="-ml-px">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <CarouselItem
                      key={i}
                      className="pl-px basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                    >
                      <SkeletonCard />
                    </CarouselItem>
                  ))
                : hotels.map((hotel, i) => (
                    <CarouselItem
                      key={hotel.hotel_id}
                      className="pl-px basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                    >
                      <HotelCard hotel={hotel} index={i} />
                    </CarouselItem>
                  ))}
            </CarouselContent>
            <CarouselPrevious className="border-white/10 bg-transparent text-white/40 hover:bg-white/10 hover:text-white -left-4" />
            <CarouselNext className="border-white/10 bg-transparent text-white/40 hover:bg-white/10 hover:text-white -right-4" />
          </Carousel>
        </div>
      </section>

      {/* ══ APPARTEMENTS ══ */}
      <section className="relative py-16 md:py-20">
        <div className="absolute left-8 top-0 bottom-0 w-px bg-white/[0.08] hidden lg:block" />
        <div className="mx-auto max-w-6xl px-4 lg:px-0">
          <SectionHeader
            label="Hébergement"
            subtitle="APPARTEMENTS DISPONIBLES"
          >
            <ButtonHeroui
              as={Link}
              href="/hebergements/appartement"
              endContent={<FaPlus className="w-3 h-3" />}
              className="text-[10px] tracking-[.2em] uppercase text-white/40 hover:text-white border border-white/[0.08] hover:border-white/20 bg-transparent px-4 py-2 transition-all duration-300 h-auto rounded-none"
            >
              Voir plus
            </ButtonHeroui>
          </SectionHeader>

          <Carousel opts={{ align: "start" }} className="w-full">
            <CarouselContent className="-ml-px">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <CarouselItem
                      key={i}
                      className="pl-px basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                    >
                      <SkeletonCard />
                    </CarouselItem>
                  ))
                : apartments.map((apt, i) => (
                    <CarouselItem
                      key={apt.apartment_id}
                      className="pl-px basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                    >
                      <ApartmentCard apt={apt} index={i} />
                    </CarouselItem>
                  ))}
            </CarouselContent>
            <CarouselPrevious className="border-white/10 bg-transparent text-white/40 hover:bg-white/10 hover:text-white -left-4" />
            <CarouselNext className="border-white/10 bg-transparent text-white/40 hover:bg-white/10 hover:text-white -right-4" />
          </Carousel>
        </div>
      </section>

      {/* ══ SECTION VALEUR ══ */}
      <section className="relative py-16 md:py-20">
        <div className="absolute left-8 top-0 bottom-0 w-px bg-white/[0.08] hidden lg:block" />
        <div className="mx-auto max-w-6xl px-4 lg:px-0">
          <SectionHeader
            label="Notre promesse"
            subtitle="VOTRE HÉBERGEMENT, SANS STRESS"
          />

          <div className="relative overflow-hidden bg-[#080808]">
            <GridPattern />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://res.cloudinary.com/dtrpkegss/image/upload/v1768137666/portrait-d-un-touriste-gras-en-voyage-_2__u37sb3.webp"
              alt="Touriste en voyage"
              className="absolute inset-0 w-full h-full object-cover object-top brightness-[.3]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-[#080808]/80 to-transparent" />

            <div className="relative z-10 px-10 py-16 max-w-xl">
              <p className="text-[9px] tracking-[.35em] uppercase text-white/30 mb-4 font-mono">
                EasyTrans
              </p>
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-6 leading-tight">
                Ne perdez plus de temps à chercher votre hébergement
              </h2>
              <p className="text-[12px] text-white/35 leading-relaxed mb-8">
                Avec Easy Trans, consultez un large catalogue
                d&apos;appartements et de chambres soigneusement sélectionnés
                pour répondre à tous vos besoins. Que ce soit pour une virée en
                amoureux, un voyage d&apos;affaires, ou un séjour de détente,
                trouvez rapidement le logement idéal.
              </p>
              <div className="flex items-center gap-4">
                <div className="h-px w-8 bg-white/20" />
                <span className="text-[9px] tracking-[.3em] uppercase text-white/20 font-mono">
                  Disponible maintenant
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
