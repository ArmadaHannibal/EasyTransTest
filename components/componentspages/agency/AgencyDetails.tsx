"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Image } from "@heroui/image";
import { User } from "@heroui/user";
import { Select, SelectItem } from "@heroui/select";
import { Input } from "@heroui/input";
import { Avatar } from "@heroui/avatar";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { Progress } from "@heroui/progress";
import { addToast, ToastProvider } from "@heroui/toast";
import { Link } from "@heroui/link";
import EmojiPicker, { Theme } from "emoji-picker-react";
import {
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaBus,
  FaArrowLeft,
  FaMoneyBillWave,
  FaSearch,
  FaComment,
  FaTrash,
  FaLock,
} from "react-icons/fa";
import {
  MdEmail,
  MdDirectionsBus,
  MdVerified,
  MdLocalOffer,
  MdSupportAgent,
  MdCancel,
  MdCheckCircle,
} from "react-icons/md";
import { FaStar } from "react-icons/fa";
import { BsFillSendFill } from "react-icons/bs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/components/ui/number-field";
import { EnrichedAgency } from "@/services/agencyService";
import { addToCart } from "@/actions/addToCart";
import { useCartStore } from "@/store/cartStore";
import ClientOnly from "@/components/ClientOnly";
import { useUserProfile } from "@/hooks/useUserProfile";
import { IoTicketSharp } from "react-icons/io5";
import { TbMessageCircleFilled } from "react-icons/tb";
import { FaCalendarAlt } from "react-icons/fa";
import { LuLogIn } from "react-icons/lu";

// ── Types ──────────────────────────────────────────────────────────────────────
interface AgencyReview {
  review_id: string;
  agency_id: string;
  reviewer_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  users: {
    first_name: string;
    last_name: string;
    profile_picture?: string | null;
  } | null;
}
interface AgencyService {
  id: string;
  agency_id: string;
  label: string | null;
}
interface AgencyCondition {
  id: string;
  agency_id: string;
  label: string | null;
}
interface AgencyDetailsProps {
  agency: EnrichedAgency;
}
interface FilterState {
  searchQuery: string;
  departureLocation: string;
  destination: string;
  maxPrice: number | null;
  sortBy: "price" | "date" | "departure" | "destination";
  sortOrder: "asc" | "desc";
}

const FALLBACK_AVATAR = "https://i.pravatar.cc/150?u=agency";

// ── Bannière connexion inline (dans la card ticket) ───────────────────────────
const AuthRequiredTicket = ({ redirectUrl }: { redirectUrl: string }) => (
  <div className="flex items-center justify-between gap-2 bg-white/5 border border-white/15 rounded-xl px-3 py-2.5">
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 rounded-lg bg-blue-400/10 flex items-center justify-center flex-shrink-0">
        <FaLock className="w-3 h-3 text-blue-400/70" />
      </div>
      <p className="text-white/50 text-xs leading-tight">
        <span className="text-white/70 font-medium block">
          Connexion requise
        </span>
        pour ajouter au panier
      </p>
    </div>
    <a
      href={`/login?redirect=${encodeURIComponent(redirectUrl)}`}
      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold flex-shrink-0 bg-blue-500 hover:bg-blue-400 text-white transition-all"
    >
      <LuLogIn className="w-3.5 h-3.5" /> Connexion
    </a>
  </div>
);

// ── Bannière connexion pour le formulaire d'avis ──────────────────────────────
const AuthRequiredReview = ({ redirectUrl }: { redirectUrl: string }) => (
  <div className="flex flex-col items-center gap-3 bg-blue-400/6 border border-blue-400/20 rounded-xl px-4 py-5 text-center">
    <div className="w-10 h-10 rounded-xl bg-blue-400/12 flex items-center justify-center">
      <FaLock className="w-4 h-4 text-blue-400/70" />
    </div>
    <div>
      <p className="text-white font-semibold text-sm">Connexion requise</p>
      <p className="text-white/40 text-xs mt-1 leading-relaxed">
        Connectez-vous pour laisser un avis sur cette agence.
      </p>
    </div>
    <div className="flex gap-2 w-full">
      <a
        href={`/inscription?redirect=${encodeURIComponent(redirectUrl)}`}
        className="flex-1 py-2 rounded-lg text-xs font-medium border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-all text-center"
      >
        S&apos;inscrire
      </a>
      <a
        href={`/connexion?redirect=${encodeURIComponent(redirectUrl)}`}
        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold bg-blue-500 hover:bg-blue-400 text-white transition-all"
      >
        <LuLogIn className="w-3.5 h-3.5" /> Se connecter
      </a>
    </div>
  </div>
);

// ── Composant principal ────────────────────────────────────────────────────────
const AgencyDetails: React.FC<AgencyDetailsProps> = ({ agency }) => {
  const router = useRouter();
  const { profile } = useUserProfile();
  const add = useCartStore((s) => s.add);

  const isLoggedIn = !!profile?.user_id;
  const currentUrl =
    typeof window !== "undefined"
      ? window.location.pathname
      : `/agences/${agency.id}`;

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    departureLocation: "",
    destination: "",
    maxPrice: null,
    sortBy: "date",
    sortOrder: "asc",
  });
  const [quantity, setQuantity] = useState<Record<string, number>>({});

  // Reviews
  const [reviews, setReviews] = useState<AgencyReview[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [ratingInput, setRatingInput] = useState(1);
  const [commentText, setCommentText] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"tickets" | "about" | "reviews">(
    "tickets",
  );

  // Services & Conditions
  const [services, setServices] = useState<AgencyService[]>([]);
  const [conditions, setConditions] = useState<AgencyCondition[]>([]);
  const [aboutLoading, setAboutLoading] = useState(true);

  // Charger avis
  useEffect(() => {
    if (!agency?.id) return;
    const fetchReviews = async () => {
      setReviewsLoading(true);
      try {
        const res = await fetch(`/api/reviews/${agency.id}`);
        if (!res.ok) throw new Error();
        setReviews((await res.json()) ?? []);
      } catch (e) {
        console.error(e);
      } finally {
        setReviewsLoading(false);
      }
    };
    fetchReviews();
  }, [agency?.id]);

  // Charger services & conditions
  useEffect(() => {
    if (!agency?.id) return;
    const fetchAbout = async () => {
      setAboutLoading(true);
      try {
        const [svcRes, condRes] = await Promise.all([
          fetch(`/api/agencies/${agency.id}/services`),
          fetch(`/api/agencies/${agency.id}/conditions`),
        ]);
        if (svcRes.ok) setServices(await svcRes.json());
        if (condRes.ok) setConditions(await condRes.json());
      } catch (e) {
        console.error(e);
      } finally {
        setAboutLoading(false);
      }
    };
    fetchAbout();
  }, [agency?.id]);

  // Soumettre avis
  const handleReviewSubmit = async () => {
    if (!commentText.trim()) {
      setReviewError("Le commentaire est requis.");
      return;
    }
    if (!isLoggedIn) return; // bouton remplacé par AuthRequiredReview, sécurité défensive
    setReviewLoading(true);
    setReviewError("");
    try {
      const res = await fetch(`/api/reviews/${agency.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewer_id: profile!.user_id,
          rating: ratingInput,
          comment: commentText.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setReviewError(
          res.status === 409
            ? "Vous avez déjà laissé un avis pour cette agence."
            : (data.error ?? "Erreur."),
        );
      } else {
        setReviews((prev) => [data, ...prev]);
        setCommentText("");
        setRatingInput(1);
        setReviewSuccess(true);
        setTimeout(() => setReviewSuccess(false), 4000);
      }
    } catch {
      setReviewError("Erreur réseau.");
    } finally {
      setReviewLoading(false);
    }
  };

  // Supprimer avis
  const handleDeleteReview = async (reviewId: string) => {
    if (
      !confirm(
        "Êtes-vous sûr de vouloir supprimer votre avis ? Cette action est irréversible.",
      )
    )
      return;
    setDeletingId(reviewId);
    try {
      const res = await fetch(`/api/reviews/${agency.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review_id: reviewId }),
      });
      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.review_id !== reviewId));
        addToast({ title: "Avis supprimé", color: "success" });
      } else {
        addToast({ title: "Erreur lors de la suppression", color: "danger" });
      }
    } catch {
      addToast({ title: "Erreur réseau", color: "danger" });
    } finally {
      setDeletingId(null);
    }
  };

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : "—";

  const ratingStats = [5, 4, 3, 2, 1]
    .map((star) => ({
      star,
      label: ["UN", "DEUX", "TROIS", "QUATRE", "CINQ"][star - 1],
      pct:
        reviews.length > 0
          ? Math.round(
              (reviews.filter((r) => r.rating === star).length /
                reviews.length) *
                100,
            )
          : 0,
    }))
    .reverse();

  // Tickets
  const allTickets = useMemo(
    () =>
      agency.buses.flatMap((bus) =>
        (bus.tickets || []).map((t) => ({ ...t, bus_id: bus.bus_id })),
      ),
    [agency.buses],
  );
  const uniqueDepartures = useMemo(
    () =>
      Array.from(
        new Set(allTickets.map((t) => t.departure_location).filter(Boolean)),
      ),
    [allTickets],
  );
  const uniqueDestinations = useMemo(
    () =>
      Array.from(new Set(allTickets.map((t) => t.destination).filter(Boolean))),
    [allTickets],
  );

  const filteredTickets = useMemo(() => {
    return allTickets
      .filter((t) => {
        if (
          filters.departureLocation &&
          t.departure_location !== filters.departureLocation
        )
          return false;
        if (filters.destination && t.destination !== filters.destination)
          return false;
        if (filters.maxPrice !== null && t.ticket_price > filters.maxPrice)
          return false;
        return true;
      })
      .sort((a, b) => {
        const dir = filters.sortOrder === "asc" ? 1 : -1;
        if (filters.sortBy === "price")
          return dir * ((a.ticket_price || 0) - (b.ticket_price || 0));
        if (filters.sortBy === "date")
          return (
            dir *
            (new Date(a.departure_date || 0).getTime() -
              new Date(b.departure_date || 0).getTime())
          );
        if (filters.sortBy === "departure")
          return (
            dir *
            (a.departure_location || "").localeCompare(
              b.departure_location || "",
            )
          );
        if (filters.sortBy === "destination")
          return dir * (a.destination || "").localeCompare(b.destination || "");
        return 0;
      });
  }, [allTickets, filters]);

  const fmt = (n: number) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
    }).format(n);
  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <ClientOnly>
      <ToastProvider placement="top-center" toastOffset={60} />

      <div className="min-h-screen bg-(--bg-legebluefort)">
        {/* ══ HERO ══ */}
        <div className="relative overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "url(https://res.cloudinary.com/dtrpkegss/image/upload/v1763327814/fond-hexadecimal-pour-la-mise-en-reseau_qqrbfc.jpg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-(--bg-legebluefort)" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-white/70 hover:text-white text-sm mb-8 transition-colors group"
            >
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />{" "}
              Retour
            </button>
            <div className="flex flex-col lg:flex-row items-start lg:items-end gap-8">
              <div className="relative flex-shrink-0">
                <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl">
                  <Image
                    alt={agency.name}
                    src={
                      agency.logo_url ||
                      "https://res.cloudinary.com/dtrpkegss/image/upload/v1758121603/young-black-woman-aun-tram-station-uses-smartphone_rpalos.jpg"
                    }
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-1.5 shadow-lg z-10">
                  <MdVerified className="text-white w-4 h-4" />
                </div>
              </div>
              <div className="flex-1">
                <h1 className="font-tourney text-4xl lg:text-5xl font-bold text-white mb-2 tracking-wide">
                  {agency.name}
                </h1>
                <div className="flex flex-wrap gap-3 mb-4">
                  <Chip
                    color="warning"
                    variant="shadow"
                    startContent={<FaBus className="ml-1" />}
                  >
                    {agency.buses_count} bus
                  </Chip>
                  <Chip
                    className="bg-white/10 text-white border border-white/20"
                    variant="bordered"
                  >
                    {agency.tickets_count} tickets
                  </Chip>
                  {reviews.length > 0 && (
                    <Chip
                      className="bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      variant="bordered"
                      startContent={
                        <FaStar className="ml-1 text-amber-400 w-3 h-3" />
                      }
                    >
                      {avgRating} / 5
                    </Chip>
                  )}
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-white/70">
                  {agency.phone && (
                    <span className="flex items-center gap-1.5">
                      <FaPhoneAlt className="text-blue-400" />
                      {agency.phone}
                    </span>
                  )}
                  {agency.address && (
                    <span className="flex items-center gap-1.5">
                      <FaMapMarkerAlt className="text-red-400" />
                      {agency.address}
                    </span>
                  )}
                  {agency.owner?.email && (
                    <span className="flex items-center gap-1.5">
                      <MdEmail className="text-green-400" />
                      {agency.owner.email}
                    </span>
                  )}
                </div>
              </div>
              <div className="hidden lg:block bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
                <p className="text-xs text-white/50 mb-2 uppercase tracking-wider">
                  Propriétaire
                </p>
                <User
                  name={
                    <span className="text-white font-semibold">
                      {agency.owner?.first_name} {agency.owner?.last_name}
                    </span>
                  }
                  avatarProps={{
                    src:
                      agency.owner?.profile_picture ||
                      "https://res.cloudinary.com/dtrpkegss/image/upload/v1758118983/WhatsApp_Image_2024-12-18_%C3%A0_22.27.36_d01591c2-removebg_jgijg7.png",
                    size: "md",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ══ STATS ══ */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                label: "Bus actifs",
                value: agency.buses_count,
                color: "from-blue-500/20 to-blue-600/10",
                border: "border-blue-500/30",
                text: "text-blue-300",
              },
              {
                label: "Tickets dispo",
                value: agency.tickets_count,
                color: "from-amber-500/20 to-amber-600/10",
                border: "border-amber-500/30",
                text: "text-amber-300",
              },
              {
                label: "Avis clients",
                value: reviews.length,
                color: "from-green-500/20 to-green-600/10",
                border: "border-green-500/30",
                text: "text-green-300",
              },
              {
                label: "Note moyenne",
                value: avgRating,
                color: "from-purple-500/20 to-purple-600/10",
                border: "border-purple-500/30",
                text: "text-purple-300",
              },
            ].map(({ label, value, color, border, text }) => (
              <div
                key={label}
                className={`bg-gradient-to-br ${color} border ${border} rounded-2xl p-4 text-center backdrop-blur-sm`}
              >
                <p className={`text-3xl font-bold font-tourney ${text}`}>
                  {value}
                </p>
                <p className="text-white/60 text-xs mt-1 uppercase tracking-wider">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {/* ══ ONGLETS ══ */}
          <div className="flex gap-1 bg-white/5 p-1 rounded-xl mb-8 w-fit">
            {(
              [
                {
                  key: "tickets",
                  label: "Tickets",
                  icon: IoTicketSharp,
                  count: filteredTickets.length,
                },
                { key: "about", label: "À propos", icon: FaBus },
                {
                  key: "reviews",
                  label: "Avis",
                  icon: TbMessageCircleFilled,
                  count: reviews.length,
                },
              ] as const
            ).map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === tab.key ? "bg-(--bg-legebluecalme) text-white shadow-lg" : "text-white/60 hover:text-white"}`}
                >
                  <Icon className="w-4 h-4" /> {tab.label}
                  {"count" in tab && tab.count !== undefined && (
                    <span
                      className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${activeTab === tab.key ? "bg-white/20" : "bg-white/10"}`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* ══ TICKETS ══ */}
          {activeTab === "tickets" && (
            <div className="space-y-6">
              {/* Bannière globale non connecté au-dessus des filtres */}
              {!isLoggedIn && (
                <div className="flex items-center justify-between gap-4 bg-blue-400/8 border border-blue-400/20 rounded-2xl px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-400/15 flex items-center justify-center flex-shrink-0">
                      <FaLock className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">
                        Connexion requise pour réserver des tickets
                      </p>
                      <p className="text-white/45 text-xs mt-0.5">
                        Créez un compte gratuitement ou connectez-vous pour
                        accéder au panier.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <a
                      href={`/register?redirect=${encodeURIComponent(currentUrl)}`}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-all"
                    >
                      S&apos;inscrire
                    </a>
                    <a
                      href={`/login?redirect=${encodeURIComponent(currentUrl)}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-500 hover:bg-blue-400 text-white transition-all"
                    >
                      <LuLogIn className="w-3.5 h-3.5" /> Se connecter
                    </a>
                  </div>
                </div>
              )}

              {/* Filtres */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <FaSearch className="text-blue-400" /> Filtrer les tickets
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <Select
                    placeholder="Lieu de départ"
                    onChange={(e) =>
                      setFilters((p) => ({
                        ...p,
                        departureLocation: e.target.value,
                      }))
                    }
                  >
                    {[
                      { key: "", label: "Tous les départs" },
                      ...uniqueDepartures.map((l) => ({ key: l, label: l })),
                    ].map((item) => (
                      <SelectItem key={item.key}>{item.label}</SelectItem>
                    ))}
                  </Select>
                  <Select
                    placeholder="Destination"
                    onChange={(e) =>
                      setFilters((p) => ({ ...p, destination: e.target.value }))
                    }
                  >
                    {[
                      { key: "", label: "Toutes destinations" },
                      ...uniqueDestinations.map((d) => ({ key: d, label: d })),
                    ].map((item) => (
                      <SelectItem key={item.key}>{item.label}</SelectItem>
                    ))}
                  </Select>
                  <Input
                    type="number"
                    placeholder="Prix max (XOF)"
                    startContent={
                      <FaMoneyBillWave className="text-amber-400" />
                    }
                    onChange={(e) =>
                      setFilters((p) => ({
                        ...p,
                        maxPrice: e.target.value
                          ? parseInt(e.target.value)
                          : null,
                      }))
                    }
                  />
                  <Select
                    placeholder="Trier par"
                    onChange={(e) =>
                      setFilters((p) => ({
                        ...p,
                        sortBy: e.target.value as any,
                      }))
                    }
                  >
                    <SelectItem key="date">Date de départ</SelectItem>
                    <SelectItem key="price">Prix</SelectItem>
                    <SelectItem key="departure">Départ</SelectItem>
                    <SelectItem key="destination">Destination</SelectItem>
                  </Select>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <Chip
                    size="sm"
                    color="warning"
                    variant="dot"
                    className="text-white"
                  >
                    {filteredTickets.length} ticket(s) trouvé(s)
                  </Chip>
                  <Select
                    placeholder="Ordre"
                    className="w-36"
                    onChange={(e) =>
                      setFilters((p) => ({
                        ...p,
                        sortOrder: e.target.value as any,
                      }))
                    }
                  >
                    <SelectItem key="asc">Croissant</SelectItem>
                    <SelectItem key="desc">Décroissant</SelectItem>
                  </Select>
                </div>
              </div>

              {filteredTickets.length === 0 ? (
                <div className="text-center py-20 text-white/40">
                  <MdDirectionsBus className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>Aucun ticket ne correspond à vos critères</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredTickets.map((ticket) => (
                    <div
                      key={`${ticket.bus_id}-${ticket.ticket_id}`}
                      className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/40 hover:bg-white/8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10"
                    >
                      <div
                        className="h-1.5 w-full"
                        style={{ background: `var(--bg-legebluecalme)` }}
                      />
                      <div className="p-5 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-white/40 uppercase tracking-wider mb-0.5">
                              Départ
                            </p>
                            <p className="text-white font-semibold truncate">
                              {ticket.departure_location || "—"}
                            </p>
                          </div>
                          <div className="flex flex-col items-center gap-1 flex-shrink-0">
                            <div className="w-px h-2 bg-white/20" />
                            <MdDirectionsBus className="text-(--bg-legebluecalme) w-5 h-5" />
                            <div className="w-px h-2 bg-white/20" />
                          </div>
                          <div className="flex-1 min-w-0 text-right">
                            <p className="text-xs text-white/40 uppercase tracking-wider mb-0.5">
                              Arrivée
                            </p>
                            <p className="text-white font-semibold truncate">
                              {ticket.destination || "—"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/50 bg-white/5 rounded-xl px-3 py-2">
                          <span className="text-(--bg-legebluecalme)">
                            <FaCalendarAlt />
                          </span>
                          <span>
                            {ticket.departure_date
                              ? fmtDate(ticket.departure_date)
                              : "Date non spécifiée"}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs text-white/40 mb-0.5">
                            Prix par place
                          </p>
                          <p className="text-xl font-bold text-amber-400 font-tourney">
                            {ticket.ticket_price
                              ? fmt(ticket.ticket_price)
                              : "—"}
                          </p>
                        </div>

                        {/* ── Quantité + panier ou bannière login ── */}
                        <div className="space-y-2 pt-2 border-t border-white/10">
                          {isLoggedIn ? (
                            <>
                              <div className="flex flex-col items-start gap-2">
                                <Label className="text-white/60 text-xs">
                                  Quantité
                                </Label>
                                <NumberField
                                  defaultValue={1}
                                  min={1}
                                  onValueChange={(v) =>
                                    setQuantity((prev) => ({
                                      ...prev,
                                      [ticket.ticket_id]: v || 1,
                                    }))
                                  }
                                >
                                  <NumberFieldGroup>
                                    <NumberFieldDecrement className="hover:bg-(--bg-legebluefort) hover:text-white" />
                                    <NumberFieldInput className="w-12 text-center" />
                                    <NumberFieldIncrement className="hover:bg-(--bg-legebluefort) hover:text-white" />
                                  </NumberFieldGroup>
                                </NumberField>
                              </div>
                              <Button
                                color="primary"
                                className="w-full font-semibold"
                                onPress={async () => {
                                  const qty = quantity[ticket.ticket_id] ?? 1;
                                  await addToCart(ticket.ticket_id, qty);
                                  add(qty);
                                }}
                              >
                                Ajouter au panier
                              </Button>
                            </>
                          ) : (
                            <AuthRequiredTicket redirectUrl={currentUrl} />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══ À PROPOS ══ */}
          {activeTab === "about" && (
            <div className="space-y-6">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-white font-semibold text-lg mb-3">
                  À propos de {agency.name}
                </h3>
                {agency.description ? (
                  <p className="text-white/70 leading-relaxed">
                    {agency.description}
                  </p>
                ) : (
                  <p className="text-white/30 text-sm italic">
                    Aucune description renseignée pour le moment.
                  </p>
                )}
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-4">
                  Services inclus
                </h3>
                {aboutLoading ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-24 rounded-2xl bg-white/5 border border-white/10 animate-pulse"
                      />
                    ))}
                  </div>
                ) : services.length === 0 ? (
                  <div className="flex items-center gap-2 text-white/30 text-sm bg-white/5 border border-white/10 rounded-2xl p-4">
                    <MdSupportAgent className="w-5 h-5" />
                    <span>Aucun service renseigné pour le moment.</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                    {services.map((svc) => (
                      <div
                        key={svc.id}
                        className="flex flex-col items-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-4 text-center hover:bg-white/8 hover:border-blue-500/30 transition-all"
                      >
                        <div className="bg-blue-500/20 p-3 rounded-xl">
                          <MdSupportAgent className="text-blue-400 w-5 h-5" />
                        </div>
                        <span className="text-white/70 text-xs leading-tight">
                          {svc.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6">
                <h3 className="text-amber-300 font-semibold mb-3 flex items-center gap-2">
                  <MdLocalOffer /> Conditions de voyage
                </h3>
                {aboutLoading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-5 rounded bg-amber-500/10 animate-pulse w-3/4"
                      />
                    ))}
                  </div>
                ) : conditions.length === 0 ? (
                  <p className="text-white/40 text-sm">
                    Aucune condition renseignée pour le moment.
                  </p>
                ) : (
                  <ul className="space-y-2 text-sm text-white/70">
                    {conditions.map((cond) => (
                      <li key={cond.id} className="flex items-start gap-2">
                        <span className="text-amber-400 mt-0.5 flex-shrink-0">
                          ▸
                        </span>
                        {cond.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* ══ AVIS ══ */}
          {activeTab === "reviews" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
                  {ratingStats.map(({ label, pct }) => (
                    <Progress
                      key={label}
                      classNames={{
                        base: "w-full",
                        track: "drop-shadow-md border border-white/10",
                        indicator: "bg-(--bg-legebluecalme)",
                        label: "tracking-wider font-medium text-white/60",
                        value: "text-white/60",
                      }}
                      label={
                        <div className="flex items-center gap-2">
                          <span className="text-xs">{label}</span>
                          <FaStar className="text-amber-400 w-3 h-3" />
                        </div>
                      }
                      radius="sm"
                      showValueLabel
                      size="sm"
                      value={pct}
                    />
                  ))}
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center gap-3">
                  <p className="text-6xl font-bold font-tourney text-(--bg-legebluecalme)">
                    {avgRating}
                  </p>
                  <div className="flex gap-1">
                    {Array.from({
                      length: Math.round(parseFloat(avgRating) || 0),
                    }).map((_, i) => (
                      <FaStar key={i} className="text-amber-400 w-6 h-6" />
                    ))}
                  </div>
                  <p className="text-white/50 text-sm">
                    {reviews.length} avis client
                    {reviews.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Liste avis */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <h3 className="text-white font-semibold mb-4 underline underline-offset-4">
                    Commentaires récents
                  </h3>
                  <ScrollShadow className="space-y-3 h-[420px] pr-2" size={80}>
                    {reviewsLoading ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      </div>
                    ) : reviews.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-white/30 gap-2">
                        <FaComment className="w-10 h-10 opacity-30" />
                        <p className="text-sm">
                          Aucun avis. Soyez le premier !
                        </p>
                      </div>
                    ) : (
                      reviews.map((review) => {
                        const u = Array.isArray(review.users)
                          ? review.users[0]
                          : review.users;
                        const fullName = u
                          ? `${u.first_name} ${u.last_name}`
                          : "Utilisateur";
                        const avatar = u?.profile_picture ?? FALLBACK_AVATAR;
                        const date = new Date(
                          review.created_at,
                        ).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        });
                        const isOwn = profile?.user_id === review.reviewer_id;
                        const isDeleting = deletingId === review.review_id;
                        return (
                          <div
                            key={review.review_id}
                            className="flex gap-3 bg-white/5 border border-white/10 rounded-xl p-4"
                          >
                            <Avatar
                              isBordered
                              color="primary"
                              className="w-12 h-12 flex-shrink-0"
                              src={avatar}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p className="text-white font-medium text-sm">
                                    {fullName}
                                  </p>
                                  <p className="text-white/40 text-xs">
                                    {date}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <div className="flex gap-0.5">
                                    {Array.from({ length: 5 }).map((_, j) => (
                                      <FaStar
                                        key={j}
                                        className={`w-3 h-3 ${j < review.rating ? "text-amber-400" : "text-white/20"}`}
                                      />
                                    ))}
                                  </div>
                                  {isOwn && (
                                    <button
                                      onClick={() =>
                                        handleDeleteReview(review.review_id)
                                      }
                                      disabled={isDeleting}
                                      title="Supprimer mon avis"
                                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${isDeleting ? "bg-red-500/10 border-red-500/20 text-red-400/50 cursor-not-allowed" : "bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-300 active:scale-95"}`}
                                    >
                                      {isDeleting ? (
                                        <>
                                          <span className="w-3 h-3 border border-red-400/50 border-t-red-400 rounded-full animate-spin" />
                                          <span>Suppression...</span>
                                        </>
                                      ) : (
                                        <>
                                          <FaTrash className="w-3 h-3" />
                                          <span>Supprimer</span>
                                        </>
                                      )}
                                    </button>
                                  )}
                                </div>
                              </div>
                              {review.comment && (
                                <p className="text-white/60 text-sm mt-2 leading-relaxed">
                                  {review.comment}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </ScrollShadow>
                </div>

                {/* Formulaire avis */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <h3 className="text-white font-semibold mb-4 underline underline-offset-4">
                    Laisser un avis
                  </h3>

                  {/* ── Si non connecté : bloc login, sinon formulaire ── */}
                  {!isLoggedIn ? (
                    <AuthRequiredReview redirectUrl={currentUrl} />
                  ) : (
                    <div className="space-y-4">
                      <div className="flex flex-col gap-2">
                        <span className="text-white/60 text-sm">Note *</span>
                        <div className="flex gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setRatingInput(i + 1)}
                              className="focus:outline-none transition-transform hover:scale-110"
                            >
                              <FaStar
                                className={`w-7 h-7 transition-colors ${i < ratingInput ? "text-amber-400" : "text-white/20 hover:text-white/40"}`}
                              />
                            </button>
                          ))}
                        </div>
                        <span className="text-xs text-white/40">
                          {
                            [
                              "",
                              "1 — Très mauvais",
                              "2 — Mauvais",
                              "3 — Moyen",
                              "4 — Bien",
                              "5 — Excellent",
                            ][ratingInput]
                          }
                        </span>
                      </div>
                      <div className="relative">
                        <Textarea
                          placeholder="Votre commentaire..."
                          className="bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-xl w-full min-h-[120px] p-3 resize-none focus:outline-none focus:border-blue-500/50"
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPicker(!showPicker)}
                          className="absolute bottom-2 right-2 text-xl hover:scale-110 transition-transform"
                        >
                          😀
                        </button>
                        {showPicker && (
                          <div className="absolute bottom-full right-0 mb-2 z-50">
                            <EmojiPicker
                              onEmojiClick={(e) =>
                                setCommentText((p) => p + e.emoji)
                              }
                              theme={Theme.DARK}
                              height={300}
                              width={320}
                              searchDisabled
                              skinTonesDisabled
                            />
                          </div>
                        )}
                      </div>
                      {reviewError && (
                        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2 text-xs text-red-400">
                          <MdCancel className="flex-shrink-0" />
                          {reviewError}
                        </div>
                      )}
                      {reviewSuccess && (
                        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-xl px-3 py-2 text-xs text-green-400">
                          <MdCheckCircle className="flex-shrink-0" />
                          Votre avis a été publié !
                        </div>
                      )}
                      <Button
                        className="w-full bg-(--bg-legebluefort) text-white font-semibold border border-blue-500/30"
                        endContent={<BsFillSendFill />}
                        isLoading={reviewLoading}
                        isDisabled={reviewLoading || reviewSuccess}
                        onPress={handleReviewSubmit}
                      >
                        Publier l&apos;avis
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ClientOnly>
  );
};

export default AgencyDetails;
