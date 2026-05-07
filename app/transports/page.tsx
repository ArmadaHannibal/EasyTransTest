"use client";

import * as React from "react";
import { useEffect, useState, useMemo, useCallback, useId } from "react";
import { FaSearchengin, FaBus } from "react-icons/fa";
import { BsFillCreditCard2FrontFill } from "react-icons/bs";
import { IoTicketSharp } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import useSWR from "swr";
import { fetchAgenciesWithTickets } from "@/services/agencyService";
import { useRouter } from "next/navigation";
import { MdLocationPin } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import { motion } from "framer-motion";
import { Image } from "@heroui/image";
import {
  FolderOpen,
  Code2,
  Rocket,
  AlertCircle,
  ShieldAlert,
  XCircle,
} from "lucide-react";
import {
  Select as SelectHeroui,
  SelectItem as SelectItemHeroui,
} from "@heroui/select";
import { RadioGroup, Radio } from "@heroui/radio";
import { Chip } from "@heroui/chip";
import { EmptyState } from "@/components/interactive-empty-state";
import Loader from "@/components/loader-15";
import type { Theme } from "@/types/EmptyState";
import { createClient } from "@/utils/supabase/client";
import DecorativeNumber from "@/components/DecorativeNumber";

const supabase = createClient();

const BAND_COLORS = [
  "#1D9E75",
  "#378ADD",
  "#BA7517",
  "#D85A30",
  "#D4537E",
  "#7F77DD",
  "#639922",
];
const getBandColor = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return BAND_COLORS[Math.abs(hash) % BAND_COLORS.length];
};
const getInitials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

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

// ── VignetteAgence ─────────────────────────────────────────────────────────────
const VignetteAgence = ({ name, color }: { name: string; color: string }) => {
  const initials = getInitials(name);
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#080808]">
      <GridPattern />
      <div
        className="absolute w-28 h-28 rounded-full blur-2xl"
        style={{ background: `${color}18` }}
      />
      <svg
        viewBox="0 0 80 80"
        width="64"
        height="64"
        fill="none"
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
      <div
        className="relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-black tracking-wider border border-white/10"
        style={{ background: `${color}22`, color }}
      >
        {initials}
      </div>
    </div>
  );
};

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
      <div className="h-3 w-full bg-white/[0.04] rounded" />
      <div className="h-3 w-2/3 bg-white/[0.04] rounded" />
      <div className="pt-3 border-t border-white/[0.06] flex justify-between">
        <div className="h-4 w-16 bg-white/[0.06] rounded" />
        <div className="h-7 w-24 bg-white/[0.08] rounded" />
      </div>
    </div>
  </div>
);

// ── AgencyCard ─────────────────────────────────────────────────────────────────
const AgencyCard = ({
  agency,
  ratingsMap,
  onVisit,
  index,
}: {
  agency: any;
  ratingsMap: Record<string, number>;
  onVisit: (id: string) => void;
  index: number;
}) => {
  const bandColor = getBandColor(agency.name ?? "A");
  const agRating = ratingsMap[agency.id];
  const isTopRated = agRating && agRating >= 4;
  const owner = Array.isArray(agency.users) ? agency.users[0] : agency.users;
  const cities = new Set<string>();
  agency.buses?.forEach((b: any) =>
    b.tickets?.forEach((t: any) => {
      if (t.departure_location) cities.add(t.departure_location);
      if (t.destination) cities.add(t.destination);
    }),
  );
  const cityList = Array.from(cities).slice(0, 3);
  const busCount = agency.buses?.length ?? 0;
  const ticketCount =
    agency.buses?.reduce(
      (acc: number, b: any) => acc + (b.tickets?.length ?? 0),
      0,
    ) ?? 0;

  return (
    <div className="group relative bg-[#0d0d0d] hover:bg-[#0f0f0f] transition-colors duration-300 overflow-hidden flex flex-col">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/0 group-hover:bg-white/20 transition-all duration-500 z-10" />

      {/* Zone visuelle */}
      <div className="relative h-44 overflow-hidden bg-[#080808] flex-shrink-0">
        <VignetteAgence name={agency.name ?? "AG"} color={bandColor} />
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
        {isTopRated && (
          <div className="absolute top-3 right-3 z-20">
            <MonoBadge label="Top noté" accent />
          </div>
        )}
        {/* Bande couleur bas */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px]"
          style={{ background: bandColor, opacity: 0.6 }}
        />
      </div>

      <div className="h-px bg-white/[0.06]" />

      {/* Body */}
      <div className="px-5 pt-4 pb-5 flex flex-col flex-1">
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

        {/* Adresse + tel */}
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
                className="text-[9px] px-2 py-0.5 border border-white/[0.08] text-white/25 font-mono tracking-wider"
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
              <p className="text-[10px] text-white/20 font-mono mt-0.5">Bus</p>
            </div>
            <div>
              <p className="text-base font-black text-white leading-none">
                {ticketCount}
              </p>
              <p className="text-[10px] text-white/20 font-mono mt-0.5">
                Tickets
              </p>
            </div>
          </div>
          <button
            onClick={() => onVisit(agency.id)}
            className="text-[10px] cursor-pointer tracking-[.2em] uppercase font-mono text-white/40 hover:text-white border border-white/[0.08] hover:border-white/20 px-3 py-1.5 transition-all duration-300"
          >
            Visiter →
          </button>
        </div>
      </div>
    </div>
  );
};

// ── COMPOSANT PRINCIPAL ────────────────────────────────────────────────────────
export default function TransportsPage() {
  const { data: agencies, error } = useSWR(
    "agencies-data",
    fetchAgenciesWithTickets,
  );
  const isLoading = !agencies && !error;
  const router = useRouter();
  const [ratingsMap, setRatingsMap] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!agencies?.length) return;
    const fetchRatings = async () => {
      const { data } = await supabase
        .from("agency_reviews")
        .select("agency_id, rating");
      if (!data) return;
      const map: Record<string, { sum: number; count: number }> = {};
      for (const r of data as { agency_id: string; rating: number }[]) {
        if (!map[r.agency_id]) map[r.agency_id] = { sum: 0, count: 0 };
        map[r.agency_id].sum += r.rating;
        map[r.agency_id].count += 1;
      }
      const avg: Record<string, number> = {};
      for (const [id, { sum, count }] of Object.entries(map))
        avg[id] = Math.round(sum / count);
      setRatingsMap(avg);
    };
    fetchRatings();
  }, [agencies]);

  const uniqueCities = useMemo(() => {
    if (!agencies) return [];
    const cities = new Set<string>();
    agencies.forEach((ag: any) =>
      ag.buses?.forEach((bus: any) =>
        bus.tickets?.forEach((t: any) => {
          if (t.departure_location) cities.add(t.departure_location);
          if (t.destination) cities.add(t.destination);
        }),
      ),
    );
    return Array.from(cities).sort();
  }, [agencies]);

  const uniqueAgencies = useMemo(() => {
    if (!agencies) return [];
    return agencies.map((ag: any) => ({ id: ag.id, name: ag.name }));
  }, [agencies]);

  const [cityFilter, setCityFilter] = useState<Set<string>>(new Set());
  const [agencyFilter, setAgencyFilter] = useState<Set<string>>(new Set());
  const [ratingFilter, setRatingFilter] = useState<string>("");

  const filteredAgencies = useMemo(() => {
    if (!agencies) return [];
    return agencies.filter((ag: any) => {
      if (agencyFilter.size > 0 && !agencyFilter.has(ag.id)) return false;
      if (cityFilter.size > 0) {
        const cities = Array.from(cityFilter);
        const hasCity = ag.buses?.some((bus: any) =>
          bus.tickets?.some((t: any) =>
            cities.some(
              (c) => t.departure_location === c || t.destination === c,
            ),
          ),
        );
        if (!hasCity) return false;
      }
      if (ratingFilter) {
        const minRating = parseInt(ratingFilter);
        if ((ratingsMap[ag.id] ?? 0) < minRating) return false;
      }
      return true;
    });
  }, [agencies, cityFilter, agencyFilter, ratingFilter, ratingsMap]);

  const activeFiltersCount =
    (cityFilter.size > 0 ? 1 : 0) +
    (agencyFilter.size > 0 ? 1 : 0) +
    (ratingFilter ? 1 : 0);
  const clearFilters = () => {
    setCityFilter(new Set());
    setAgencyFilter(new Set());
    setRatingFilter("");
  };
  const handleVisitAgency = useCallback(
    (id: string) => router.push(`/agencies/${id}`),
    [router],
  );
  const handleAction = useCallback(() => window.location.reload(), []);
  const theme: Theme = "light";

  const motionDiv = (delay: number, children: React.ReactNode) => (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );

  if (isLoading)
    return (
      <div className="relative flex flex-col items-center justify-center h-screen">
        <Loader />
        <div className="mt-64 text-center text-white/40 text-sm font-mono tracking-widest">
          Recherche d'agences…
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center w-full mx-auto max-w-6xl h-screen">
        {motionDiv(
          0.6,
          <EmptyState
            theme={theme}
            variant="error"
            title="Oups… quelque chose s'est mal passé !"
            description="Une erreur est survenue lors du chargement. Veuillez réessayer."
            icons={[
              <AlertCircle key="e1" className="h-6 w-6" />,
              <ShieldAlert key="e2" className="h-6 w-6" />,
              <XCircle key="e3" className="h-6 w-6" />,
            ]}
            action={{ label: "Recharger la page", onClick: handleAction }}
          />,
        )}
      </div>
    );

  return (
    <>
      {/* ══ HEADER ══ */}
      <header>
        <div className="relative h-[70vh] lg:h-[95vh] min-h-[500px] overflow-hidden bg-[#080808]">
          <div
            className="absolute inset-0 bg-cover bg-right"
            style={{
              backgroundImage:
                "url(https://res.cloudinary.com/dtrpkegss/image/upload/v1768056789/portrait-d-un-touriste-gras-en-voyage-_1_-_1__lgnxby.webp)",
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
                Transport
              </span>
            </div>
            <h1
              className="text-2xl lg:text-5xl font-black text-white leading-[1.05] max-w-xl mb-5"
              style={{ letterSpacing: "-.03em" }}
            >
              Achetez vos tickets de bus{" "}
              <span className="text-white/35">
                auprès des agences officielles.
              </span>
            </h1>
            <p className="text-[13px] leading-[1.85] text-white/40 max-w-md mb-8">
              Réservez vos billets de bus facilement auprès d'agences de
              transport fiables. Comparez les horaires, les prix et voyagez en
              toute sécurité.
            </p>
            {/* <div className="flex items-center gap-6">
              <button className="group flex items-center gap-3 text-[11px] tracking-[.25em] uppercase text-white/50 hover:text-white transition-all duration-300">
                Voir les agences
                <span className="inline-block w-6 h-px bg-current group-hover:w-10 transition-all duration-300" />
              </button>
              <div className="w-px h-5 bg-white/12" />
              <button className="group flex items-center gap-3 text-[11px] tracking-[.25em] uppercase text-white/50 hover:text-white transition-all duration-300">
                Comment ça marche
                <span className="inline-block w-6 h-px bg-current group-hover:w-10 transition-all duration-300" />
              </button>
            </div> */}
          </div>
        </div>
      </header>

      {/* ══ COMMENT ÇA MARCHE ══ */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <DecorativeNumber number="01" />
        <div className="absolute left-8 top-0 bottom-0 w-px bg-white/[0.06] hidden lg:block" />
        <div className="relative mx-auto max-w-6xl px-6 lg:px-0">
          <SectionHeader
            label="Guide"
            subtitle="COMMENT ACHETER VOTRE TICKET DE BUS ?"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/[0.06]">
            {/* Image */}
            <div className="relative overflow-hidden bg-[#080808] min-h-[360px]">
              <GridPattern />
              <img
                src="https://res.cloudinary.com/dtrpkegss/image/upload/v1768061588/medium-shot-female-economist-holding-tablet-_1__gqthiw.webp"
                alt="Comment ça marche"
                className="absolute inset-0 w-full h-full object-cover brightness-[.55]"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to right, transparent 60%, #0d0d0d 100%)",
                }}
              />
            </div>

            {/* Steps */}
            <div className="flex flex-col">
              {[
                {
                  id: "01",
                  Icon: FaSearchengin,
                  title: "Choisissez votre trajet",
                  desc: "Sélectionnez votre ville de départ, votre destination et la date de voyage.",
                },
                {
                  id: "02",
                  Icon: FaBus,
                  title: "Sélectionnez une agence",
                  desc: "Comparez les agences partenaires, les horaires et les tarifs disponibles.",
                },
                {
                  id: "03",
                  Icon: BsFillCreditCard2FrontFill,
                  title: "Payez en toute sécurité",
                  desc: "Réglez votre billet via notre système de paiement sécurisé.",
                },
                {
                  id: "04",
                  Icon: IoTicketSharp,
                  title: "Recevez votre ticket",
                  desc: "Votre ticket est disponible immédiatement après paiement.",
                },
              ].map(({ id, Icon, title, desc }, i) => (
                <div
                  key={id}
                  className={`group flex items-start gap-5 px-6 py-6 transition-colors duration-300 hover:bg-(--bg-legebluefort) ${i < 3 ? "border-b border-white/[0.06]" : ""}`}
                >
                  <div className="flex-shrink-0 w-9 h-9 border border-white/[0.08] flex items-center justify-center text-white/50 group-hover:text-white/90 group-hover:border-white/20 transition-all duration-300">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-[9px] font-mono tracking-[.35em] text-white/20">
                        {id}
                      </span>
                      <h4 className="text-[13px] font-bold text-white tracking-tight">
                        {title}
                      </h4>
                    </div>
                    <p className="text-[11px] leading-[1.7] text-white/35">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ LISTE DES AGENCES ══ */}
      <section className="relative pb-20">
        <DecorativeNumber number="02" />
        <div className="absolute left-8 top-0 bottom-0 w-px bg-white/[0.06] hidden lg:block" />
        <div className="relative mx-auto max-w-6xl px-6 lg:px-0">
          <SectionHeader
            label="Partenaires"
            subtitle="AGENCES DE TRANSPORT PARTENAIRES"
          />

          {/* Filtres */}
          <div className="border border-white/[0.06] bg-[#0d0d0d] p-5 mb-px">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-[3px] h-6 bg-white/40" />
                <span className="text-[11px] tracking-[.3em] uppercase text-white/50 font-medium">
                  Filtres
                </span>
              </div>
              <div className="flex items-center gap-3">
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-[10px] font-mono tracking-[.2em] text-white/40 hover:text-white border border-white/[0.08] hover:border-white/20 px-3 py-1.5 transition-all duration-300"
                  >
                    Effacer ({activeFiltersCount})
                  </button>
                )}
                <span className="text-[10px] font-mono tracking-[.2em] uppercase text-white/25 border border-white/[0.06] px-2 py-0.5">
                  {filteredAgencies.length} agence
                  {filteredAgencies.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <p className="text-[9px] tracking-[.35em] uppercase text-white/30 font-mono mb-2">
                  Ville desservie
                </p>
                <SelectHeroui
                  className="max-w-xs"
                  placeholder="Toutes les villes"
                  selectionMode="multiple"
                  selectedKeys={cityFilter}
                  onSelectionChange={(keys) =>
                    setCityFilter(keys as Set<string>)
                  }
                >
                  {uniqueCities.map((city) => (
                    <SelectItemHeroui key={city}>{city}</SelectItemHeroui>
                  ))}
                </SelectHeroui>
              </div>
              <div>
                <p className="text-[9px] tracking-[.35em] uppercase text-white/30 font-mono mb-2">
                  Agences
                </p>
                <SelectHeroui
                  className="max-w-xs"
                  placeholder="Toutes les agences"
                  selectionMode="multiple"
                  selectedKeys={agencyFilter}
                  onSelectionChange={(keys) =>
                    setAgencyFilter(keys as Set<string>)
                  }
                >
                  {uniqueAgencies.map((ag: any) => (
                    <SelectItemHeroui key={ag.id}>{ag.name}</SelectItemHeroui>
                  ))}
                </SelectHeroui>
              </div>
              <div>
                <p className="text-[9px] tracking-[.35em] uppercase text-white/30 font-mono mb-2">
                  Note minimum
                </p>
                <RadioGroup
                  orientation="horizontal"
                  value={ratingFilter}
                  onValueChange={(v) =>
                    setRatingFilter(v === ratingFilter ? "" : v)
                  }
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Radio key={n} value={String(n)}>
                      <div className="flex gap-0.5">
                        {Array.from({ length: n }).map((_, i) => (
                          <FaStar
                            key={i}
                            className={`w-3 h-3 ${ratingFilter && parseInt(ratingFilter) >= n ? "text-amber-400" : "text-white/20"}`}
                          />
                        ))}
                      </div>
                    </Radio>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </div>

          {/* Grille agences */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.06]">
            {filteredAgencies.length > 0 ? (
              filteredAgencies.map((agency: any, i: number) => (
                <AgencyCard
                  key={agency.id}
                  agency={agency}
                  ratingsMap={ratingsMap}
                  onVisit={handleVisitAgency}
                  index={i}
                />
              ))
            ) : (
              <div className="col-span-4 bg-[#0d0d0d] py-20 flex justify-center">
                {motionDiv(
                  0.2,
                  <EmptyState
                    theme={theme}
                    title={
                      activeFiltersCount > 0
                        ? "Aucune agence ne correspond à vos critères"
                        : "Aucun partenaire disponible"
                    }
                    description={
                      activeFiltersCount > 0
                        ? "Essayez de modifier ou d'effacer vos filtres."
                        : "Les partenaires seront affichés ici lorsqu'ils seront disponibles."
                    }
                    icons={[
                      <FolderOpen key="p1" className="h-6 w-6" />,
                      <Code2 key="p2" className="h-6 w-6" />,
                      <Rocket key="p3" className="h-6 w-6" />,
                    ]}
                  />,
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ══ AVANTAGES ══ */}
      <section className="relative pt-20 pb-0">
        <DecorativeNumber number="03" />
        <div className="absolute left-8 top-0 bottom-0 w-px bg-white/[0.06] hidden lg:block" />
        <div className="relative mx-auto max-w-6xl px-6 lg:px-0">
          <SectionHeader
            label="Garanties"
            subtitle="POURQUOI ACHETER VOTRE TICKET CHEZ EASYTRANS"
          />

          {/* ── Desktop : image + badges flottants ── */}
          <div className="relative justify-center w-full hidden lg:flex">
            <Image
              alt=""
              src="https://res.cloudinary.com/dtrpkegss/image/upload/v1768133834/erasebg-transformed_1_yty1uf.webp"
              width={700}
              className="object-cover"
            />
            {[
              { top: "top-24 left-96", label: "Agences de bus vérifiées" },
              { top: "top-0 right-32", label: "Prix transparents" },
              { top: "top-96 z-10 right-32", label: "Paiement sécurisé" },
              { top: "top-60 z-10 right-[34rem]", label: "Assistance client" },
              { top: "top-48 z-10 right-0", label: "Réservation rapide" },
            ].map(({ top, label }) => (
              <div
                key={label}
                className={`absolute ${top} flex gap-2 items-center bg-(--bg-legebluecalme) border border-white/[0.12] hover:border-white/25 px-4 py-2.5 transition-all duration-300 group`}
              >
                <div className="w-7 h-7 border border-black/30 flex items-center justify-center flex-shrink-0 group-hover:border-white/20 transition-all duration-300">
                  <FaCheck className="w-3 h-3 text-black group-hover:text-white/90 transition-colors duration-300" />
                </div>
                <span className="text-[11px] tracking-[.15em] uppercase text-black group-hover:text-white font-medium transition-colors duration-300 whitespace-nowrap">
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* ── Mobile / Tablet : grille de cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/[0.06] lg:hidden">
            {[
              { id: "01", label: "Agences de bus vérifiées" },
              { id: "02", label: "Prix transparents" },
              { id: "03", label: "Paiement sécurisé" },
              { id: "04", label: "Assistance client" },
              { id: "05", label: "Réservation rapide" },
            ].map(({ id, label }) => (
              <div
                key={label}
                className="group bg-(--bg-legebluecalme) hover:bg-[#111] transition-colors duration-300 px-5 py-4 relative flex items-center gap-4"
              >
                <div className="absolute top-0 left-0 right-0 h-px bg-white/0 group-hover:bg-white/15 transition-all duration-300" />
                <div className="w-8 h-8 border border-white/[0.08] flex items-center justify-center flex-shrink-0 group-hover:border-white/20 transition-all duration-300">
                  <FaCheck className="w-3 h-3 text-white/40 group-hover:text-white/80 transition-colors duration-300" />
                </div>
                <div>
                  <span className="text-[9px] font-mono tracking-[.35em] text-white/20 block mb-0.5">
                    {id}
                  </span>
                  <span className="text-[12px] font-bold text-white tracking-tight">
                    {label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
