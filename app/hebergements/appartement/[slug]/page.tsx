"use client";

import { useEffect, useState, useId } from "react";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";
import { Button as ButtonHeroui } from "@heroui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { Progress } from "@heroui/progress";
import { Avatar } from "@heroui/avatar";
import { Link } from "@heroui/link";
import { Chip } from "@heroui/chip";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { FaStar, FaLock } from "react-icons/fa";
import { FaLocationDot, FaArrowLeft } from "react-icons/fa6";
import {
  MdCheckCircle,
  MdCancel,
  MdPhone,
  MdBed,
  MdOutlineCleaningServices,
  MdOutlineSpa,
  MdOutlineLocalLaundryService,
  MdOutlineRoomService,
  MdOutlinePool,
  MdOutlineFitnessCenter,
  MdOutlineMeetingRoom,
  MdOutlineBeachAccess,
  MdOutlineBalcony,
} from "react-icons/md";
import { BsFillSendFill } from "react-icons/bs";
import { CgEyeAlt } from "react-icons/cg";
import { createClient } from "@/utils/supabase/client";
import {
  TbMessageCircleFilled,
  TbWifi,
  TbAirConditioning,
  TbToolsKitchen2,
  TbCoffee,
  TbShirt,
  TbParking,
} from "react-icons/tb";
import { IoHome, IoRestaurantOutline, IoCarOutline } from "react-icons/io5";
import { GrGallery } from "react-icons/gr";
import {
  LuLogIn,
  LuConciergeBell,
  LuWaves,
  LuMountain,
  LuTrees,
  LuWine,
  LuUtensilsCrossed,
  LuClock,
} from "react-icons/lu";
import { RiSafe2Fill } from "react-icons/ri";
import {
  PiSecurityCameraLight,
  PiWheelchairLight,
  PiVanLight,
} from "react-icons/pi";

// ── Types ──────────────────────────────────────────────────────────────────────
interface AgencyRel {
  name: string;
  logo_url?: string | null;
  phone?: string | null;
}
interface Review {
  review_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  reviewer_id: string;
  users: {
    first_name: string;
    last_name: string;
    profile_picture?: string | null;
  } | null;
}
interface ApartmentImage {
  image_id: string;
  image_url: string;
}
interface BedDetail {
  type: string;
  count: number;
}
interface ApartmentDetail {
  apartment_id: string;
  title: string;
  description: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  price_per_night: number;
  max_guests: number;
  number_of_rooms: number | null;
  number_of_bathrooms: number | null;
  main_image_url: string | null;
  is_studio: boolean | null;
  is_family: boolean | null;
  is_luxury: boolean | null;
  is_long_stay: boolean | null;
  is_furnished: boolean | null;
  is_published: boolean | null;
  property_type: string | null;
  equipments: string[] | null;
  house_rules: string[] | null;
  bed_details: BedDetail[] | null;
  images: string[] | null;
  check_in_time: string | null;
  check_out_time: string | null;
  cleaning_fee: number | null;
  service_fee: number | null;
  agencies: AgencyRel | AgencyRel[] | null;
  apartment_images: ApartmentImage[];
}

const getAgency = (rel: ApartmentDetail["agencies"]): AgencyRel | null => {
  if (!rel) return null;
  if (Array.isArray(rel)) return rel[0] ?? null;
  return rel as AgencyRel;
};

// ── Equipment icons ────────────────────────────────────────────────────────────
const EQUIPMENT_ICON_MAP: Record<string, React.ElementType> = {
  climatisation: TbAirConditioning,
  clim: TbAirConditioning,
  "wi-fi": TbWifi,
  wifi: TbWifi,
  internet: TbWifi,
  restaurant: IoRestaurantOutline,
  "petit-déjeuner": TbCoffee,
  "petit déjeuner": TbCoffee,
  "salle de sport": MdOutlineFitnessCenter,
  fitness: MdOutlineFitnessCenter,
  spa: MdOutlineSpa,
  "salle de réunion": MdOutlineMeetingRoom,
  voiturier: IoCarOutline,
  parking: TbParking,
  navette: PiVanLight,
  "navette aéroport": PiVanLight,
  conciergerie: LuConciergeBell,
  blanchisserie: MdOutlineLocalLaundryService,
  ménage: MdOutlineCleaningServices,
  "room service": MdOutlineRoomService,
  piscine: MdOutlinePool,
  "coffre-fort": RiSafe2Fill,
  sécurité: PiSecurityCameraLight,
  "accès pmr": PiWheelchairLight,
  cuisine: TbToolsKitchen2,
  "cuisine équipée": TbToolsKitchen2,
  bar: LuWine,
  terrasse: MdOutlineBalcony,
  balcon: MdOutlineBalcony,
  jardin: LuTrees,
  "plage privée": MdOutlineBeachAccess,
  "vue mer": LuWaves,
  "vue montagne": LuMountain,
  serviettes: TbShirt,
  peignoir: TbShirt,
};

const EquipmentIcon = ({
  name,
  className = "w-4 h-4",
}: {
  name: string | null;
  className?: string;
}) => {
  const Icon = EQUIPMENT_ICON_MAP[(name ?? "").toLowerCase().trim()];
  if (Icon) return <Icon className={className} />;
  return <LuUtensilsCrossed className={`${className} opacity-40`} />;
};

const FALLBACK_IMG =
  "https://res.cloudinary.com/dtrpkegss/image/upload/v1766792889/beau-studio-de-cuisine-interieur-moderne_1_ezenag.jpg";
const FALLBACK_AVATAR = "https://i.pravatar.cc/150?u=a04258114e29026702d";
const supabase = createClient();
const toDateInput = (d: Date) => d.toISOString().split("T")[0];
const today = toDateInput(new Date());
const tomorrow = toDateInput(new Date(Date.now() + 86400000));
const diffDays = (from: string, to: string) =>
  Math.max(
    0,
    Math.round((new Date(to).getTime() - new Date(from).getTime()) / 86400000),
  );

// ── GridPattern (du 1er code) ──────────────────────────────────────────────────
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

// SmartImage
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
        <div className="absolute inset-0 bg-(--bg-legebluefort) animate-pulse" />
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

// Vignette appartement SVG
const VignetteApartment = () => (
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-(--bg-legebluefort)">
    <GridPattern />
    <div className="absolute w-32 h-20 rounded-full blur-2xl bg-teal-500/10" />
    <svg
      viewBox="0 0 80 80"
      width="56"
      height="56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="relative opacity-50"
    >
      <rect
        x="15"
        y="20"
        width="50"
        height="48"
        stroke="white"
        strokeOpacity="0.15"
        strokeWidth="1"
        fill="white"
        fillOpacity="0.02"
      />
      <rect
        x="20"
        y="25"
        width="8"
        height="8"
        stroke="white"
        strokeOpacity="0.25"
        strokeWidth="0.7"
        fill="white"
        fillOpacity="0.04"
      />
      <rect
        x="33"
        y="25"
        width="8"
        height="8"
        stroke="white"
        strokeOpacity="0.25"
        strokeWidth="0.7"
        fill="white"
        fillOpacity="0.04"
      />
      <rect
        x="46"
        y="25"
        width="8"
        height="8"
        stroke="white"
        strokeOpacity="0.25"
        strokeWidth="0.7"
        fill="white"
        fillOpacity="0.04"
      />
      <rect
        x="20"
        y="38"
        width="8"
        height="8"
        stroke="white"
        strokeOpacity="0.15"
        strokeWidth="0.7"
        fill="white"
        fillOpacity="0.02"
      />
      <rect
        x="33"
        y="38"
        width="8"
        height="8"
        stroke="white"
        strokeOpacity="0.15"
        strokeWidth="0.7"
        fill="white"
        fillOpacity="0.02"
      />
      <rect
        x="46"
        y="38"
        width="8"
        height="8"
        stroke="white"
        strokeOpacity="0.15"
        strokeWidth="0.7"
        fill="white"
        fillOpacity="0.02"
      />
      <rect
        x="30"
        y="55"
        width="20"
        height="13"
        stroke="white"
        strokeOpacity="0.2"
        strokeWidth="0.8"
        fill="white"
        fillOpacity="0.04"
      />
    </svg>
  </div>
);

// SectionHeader — barre teal, style 1er code
const SectionHeader = ({ label, title }: { label: string; title: string }) => (
  <div className="mb-6">
    <div className="flex items-center gap-4">
      <div className="w-[3px] h-12 bg-teal-400 shrink-0" />
      <div>
        <p className="text-[10px] tracking-[0.45em] uppercase text-teal-400/60">
          {label}
        </p>
        <h2 className="text-base font-bold text-white tracking-tight mt-0.5">
          {title}
        </h2>
      </div>
    </div>
    <div className="mt-3 flex items-center gap-4">
      <div className="h-px flex-1 bg-white/[0.08]" />
      <span className="text-white/15 text-[10px] tracking-widest">
        EasyTrans
      </span>
      <div className="w-8 h-px bg-white/[0.08]" />
    </div>
  </div>
);

// Auth banner — couleurs 2e code original
const AuthRequiredBanner = ({ redirectUrl }: { redirectUrl: string }) => (
  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-teal-400/[0.06] border border-teal-400/20 rounded-2xl px-4 py-4">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-teal-400/12 flex items-center justify-center flex-shrink-0">
        <FaLock className="w-4 h-4 text-teal-400/70" />
      </div>
      <div>
        <p className="text-white font-semibold text-sm">Connexion requise</p>
        <p className="text-white/40 text-xs mt-0.5">
          Connectez-vous pour réserver cet appartement.
        </p>
      </div>
    </div>
    <div className="flex gap-2 flex-shrink-0">
      <a
        href={`/register?redirect=${encodeURIComponent(redirectUrl)}`}
        className="py-2 px-3 rounded-xl text-xs font-medium border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-all"
      >
        S&apos;inscrire
      </a>
      <a
        href={`/login?redirect=${encodeURIComponent(redirectUrl)}`}
        className="flex items-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold bg-teal-500 hover:bg-teal-400 text-black transition-all"
      >
        <LuLogIn className="w-3.5 h-3.5" /> Se connecter
      </a>
    </div>
  </div>
);

const CATEGORY_ITEMS = [
  {
    key: "is_studio",
    emoji: "🏠",
    label: "Studio",
    color: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  },
  {
    key: "is_family",
    emoji: "👨‍👩‍👧",
    label: "Familial",
    color: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  },
  {
    key: "is_luxury",
    emoji: "👑",
    label: "Luxe",
    color: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  },
  {
    key: "is_long_stay",
    emoji: "📅",
    label: "Longue durée",
    color: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  },
  {
    key: "is_furnished",
    emoji: "🛋️",
    label: "Meublé",
    color: "bg-green-500/20 text-green-300 border-green-500/30",
  },
];

// ── Page ───────────────────────────────────────────────────────────────────────
export default function AppartementPostPage() {
  const params = useParams();
  const router = useRouter();
  const aptId = params?.slug as string;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [apt, setApt] = useState<ApartmentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectUrl, setSelectUrl] = useState("");
  const [activeTab, setActiveTab] = useState<"info" | "gallery" | "reviews">(
    "info",
  );
  const [nom, setNom] = useState("");
  const [phone, setPhone] = useState("");
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [booking, setBooking] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [bookingMsg, setBookingMsg] = useState("");
  const [bookedDates, setBookedDates] = useState<
    { check_in: string; check_out: string }[]
  >([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [authLoaded, setAuthLoaded] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [ratingInput, setRatingInput] = useState(5);
  const [commentText, setCommentText] = useState("");

  const isLoggedIn = !!currentUserId;
  const currentUrl =
    typeof window !== "undefined"
      ? window.location.pathname
      : `/hebergements/appartement/${aptId}`;
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

  useEffect(() => {
    if (!aptId) return;
    const fetchData = async () => {
      const { data } = await supabase
        .from("apartments")
        .select(
          `apartment_id, title, description, address, city, country,
         price_per_night, max_guests, number_of_rooms, number_of_bathrooms,
         main_image_url, is_studio, is_family, is_luxury, is_long_stay,
         is_furnished, is_published, property_type,
         equipments, house_rules, bed_details, images,
         check_in_time, check_out_time, cleaning_fee, service_fee,
         agencies(name, logo_url, phone),
         apartment_images(image_id, image_url)`,
        )
        .eq("apartment_id", aptId)
        .single();
      if (data) {
        const d = data as unknown as ApartmentDetail;
        setApt(d);
        setSelectUrl(d.main_image_url ?? FALLBACK_IMG);
      }
      const { data: b } = await supabase
        .from("apartment_bookings")
        .select("check_in, check_out")
        .eq("apartment_id", aptId)
        .in("status", ["pending", "confirmed"]);
      setBookedDates((b as { check_in: string; check_out: string }[]) ?? []);
      const { data: rv } = await supabase
        .from("apartment_reviews")
        .select(
          "review_id, rating, comment, created_at, reviewer_id, users(first_name, last_name, profile_picture)",
        )
        .eq("apartment_id", aptId)
        .order("created_at", { ascending: false });
      setReviews((rv as unknown as Review[]) ?? []);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUserId(user?.id ?? null);
      setAuthLoaded(true);
      setLoading(false);
    };
    fetchData();
  }, [aptId]);

  const allImages = apt
    ? [
        apt.main_image_url ?? FALLBACK_IMG,
        ...(apt.apartment_images ?? []).map((i) => i.image_url),
        ...(apt.images ?? []),
      ].filter((v, i, a) => v && a.indexOf(v) === i)
    : [];

  const nights = diffDays(checkIn, checkOut);
  const cleaningFee = apt?.cleaning_fee ?? 0;
  const serviceFee = apt?.service_fee ?? 0;
  const baseTotal = nights * (apt?.price_per_night ?? 0);
  const total = baseTotal + cleaningFee + serviceFee;
  const hasConflict = bookedDates.some(({ check_in, check_out }) => {
    const s = new Date(checkIn).getTime(),
      e = new Date(checkOut).getTime();
    return (
      s < new Date(check_out).getTime() && e > new Date(check_in).getTime()
    );
  });

  const handleBook = async () => {
    if (!apt || !isLoggedIn) return;
    if (nights < 1) {
      setBookingMsg("La date de départ doit être après la date d'arrivée.");
      setBooking("error");
      return;
    }
    if (hasConflict) {
      setBookingMsg("Ces dates sont déjà réservées.");
      setBooking("error");
      return;
    }
    if (!nom.trim()) {
      setBookingMsg("Veuillez saisir votre nom.");
      setBooking("error");
      return;
    }
    setBooking("loading");
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { error } = await supabase.from("apartment_bookings").insert({
      apartment_id: apt.apartment_id,
      user_id: user?.id ?? null,
      check_in: checkIn,
      check_out: checkOut,
      guests: adults + children,
      total_price: total,
      status: "pending",
    });
    if (error) {
      setBookingMsg("Une erreur est survenue.");
      setBooking("error");
    } else {
      setBookingMsg(
        `✓ Réservation envoyée ! ${nights} nuit${nights > 1 ? "s" : ""} · ${total.toLocaleString()} FCFA`,
      );
      setBooking("success");
      setBookedDates((prev) => [
        ...prev,
        { check_in: checkIn, check_out: checkOut },
      ]);
    }
    setTimeout(() => {
      setBooking("idle");
      setBookingMsg("");
    }, 5000);
  };

  const handleReview = async () => {
    if (!commentText.trim()) {
      setReviewError("Le commentaire est requis.");
      return;
    }
    setReviewLoading(true);
    setReviewError("");
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setReviewError("Vous devez être connecté pour laisser un avis.");
      setReviewLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from("apartment_reviews")
      .insert({
        apartment_id: aptId,
        reviewer_id: user.id,
        rating: ratingInput,
        comment: commentText.trim(),
      })
      .select(
        "review_id, rating, comment, created_at, reviewer_id, users(first_name, last_name, profile_picture)",
      )
      .single();
    if (error) {
      setReviewError(
        error.code === "23505"
          ? "Vous avez déjà laissé un avis pour cet appartement."
          : "Une erreur est survenue.",
      );
      setReviewLoading(false);
    } else {
      setReviews((prev) => [data as unknown as Review, ...prev]);
      setCommentText("");
      setRatingInput(5);
      setReviewSuccess(true);
      setReviewLoading(false);
      setTimeout(() => setReviewSuccess(false), 4000);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    const { error } = await supabase
      .from("apartment_reviews")
      .delete()
      .eq("review_id", reviewId);
    if (!error)
      setReviews((prev) => prev.filter((r) => r.review_id !== reviewId));
  };

  const agency = apt ? getAgency(apt.agencies) : null;
  const activeCategories = CATEGORY_ITEMS.filter(
    (item) => (apt as any)?.[item.key] === true,
  );

  if (loading)
    return (
      <div className="min-h-screen bg-(--bg-legebluefort) flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 border-4 border-white/10 border-t-teal-400 rounded-full animate-spin" />
          <p className="text-white/40 text-sm tracking-widest uppercase">
            Chargement de l&apos;appartement...
          </p>
        </div>
      </div>
    );

  if (!apt)
    return (
      <div className="min-h-screen bg-(--bg-legebluefort) flex flex-col items-center justify-center gap-4">
        <p className="text-white/40 text-xl">Appartement introuvable.</p>
        <ButtonHeroui
          as={Link}
          href="/hebergements/appartement"
          className="bg-teal-500 text-black font-semibold"
        >
          Retour aux appartements
        </ButtonHeroui>
      </div>
    );

  return (
    <div className="min-h-screen bg-(--bg-legebluefort)">
      {/* ══ HERO ══ */}
      <div className="relative h-[60vh] overflow-hidden">
        <SmartImage
          src={selectUrl || allImages[0] || FALLBACK_IMG}
          alt={apt.title}
          eager
          className="brightness-[.55]"
          fallback={<VignetteApartment />}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-(--bg-legebluefort) via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />

        <button
          onClick={() => router.back()}
          className="absolute top-6 left-6 z-20 flex items-center gap-2 bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-full border border-white/20 transition-all group"
        >
          <FaArrowLeft className="group-hover:-translate-x-0.5 transition-transform text-xs" />{" "}
          Retour
        </button>

        <div className="absolute top-6 right-6 z-20 flex gap-2">
          {apt.property_type && (
            <span className="bg-white/10 border border-white/20 text-white/70 text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm">
              {apt.property_type}
            </span>
          )}
          <span className="bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm">
            ● Disponible
          </span>
        </div>

        {allImages.length > 1 && (
          <div className="absolute bottom-32 right-6 z-20 flex gap-2">
            {allImages.slice(0, 5).map((url, i) => (
              <button
                key={i}
                onClick={() => setSelectUrl(url)}
                className={`w-14 h-10 rounded-lg overflow-hidden border-2 transition-all ${selectUrl === url ? "border-teal-400 scale-110" : "border-white/20 opacity-60 hover:opacity-100"}`}
              >
                <img src={url} alt="" className="object-cover w-full h-full" />
              </button>
            ))}
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between flex-wrap gap-4">
              <div>
                <p className="text-teal-400 text-sm font-medium tracking-[0.2em] uppercase mb-1">
                  {apt.city}
                  {apt.country ? `, ${apt.country}` : ""}
                </p>
                <h1 className="font-tourney text-4xl lg:text-6xl font-bold text-white leading-tight">
                  {apt.title}
                </h1>
                {(apt.address || apt.city) && (
                  <span className="flex items-center gap-1.5 text-white/60 text-sm mt-2">
                    <FaLocationDot className="text-red-400" />
                    {apt.address ?? `${apt.city}, ${apt.country}`}
                  </span>
                )}
              </div>
              <div className="text-right">
                <p className="text-white/30 text-xs uppercase tracking-wider mb-1">
                  Prix / nuit
                </p>
                <p className="font-tourney text-4xl font-bold text-teal-400 leading-tight">
                  {Number(apt.price_per_night).toLocaleString()}
                  <span className="text-lg font-normal text-white/40 ml-1">
                    FCFA
                  </span>
                </p>
                {reviews.length > 0 && (
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <FaStar className="text-teal-400 w-3.5 h-3.5" />
                    <span className="text-white/60 text-sm font-semibold">
                      {avgRating}
                    </span>
                    <span className="text-white/30 text-xs">
                      ({reviews.length} avis)
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══ STATS — gradient coloré du 2e code ══ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 mb-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {(
            [
              apt.number_of_rooms && {
                label: "Chambres",
                value: apt.number_of_rooms,
                color: "from-teal-500/20 to-teal-600/10",
                border: "border-teal-500/30",
                text: "text-teal-300",
              },
              apt.number_of_bathrooms && {
                label: "Salles de bain",
                value: apt.number_of_bathrooms,
                color: "from-cyan-500/20 to-cyan-600/10",
                border: "border-cyan-500/30",
                text: "text-cyan-300",
              },
              apt.max_guests && {
                label: "Voyageurs max",
                value: apt.max_guests,
                color: "from-blue-500/20 to-blue-600/10",
                border: "border-blue-500/30",
                text: "text-blue-300",
              },
              reviews.length > 0 && {
                label: "Avis clients",
                value: reviews.length,
                color: "from-purple-500/20 to-purple-600/10",
                border: "border-purple-500/30",
                text: "text-purple-300",
              },
            ].filter(Boolean) as any[]
          ).map((s: any) => (
            <div
              key={s.label}
              className={`bg-gradient-to-br ${s.color} border ${s.border} rounded-2xl p-4 text-center backdrop-blur-sm`}
            >
              <p className={`text-3xl font-bold font-tourney ${s.text}`}>
                {s.value}
              </p>
              <p className="text-white/50 text-xs mt-1 uppercase tracking-wider">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Colonne principale ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Onglets — style 2e code */}
            <div className="flex gap-1 bg-white/5 p-1 rounded-xl w-fit">
              {(
                [
                  { key: "info", label: "Infos", icon: IoHome },
                  {
                    key: "gallery",
                    label: "Galerie",
                    icon: GrGallery,
                    count: allImages.length,
                  },
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
                    className={`flex gap-1.5 items-center px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === tab.key ? "bg-teal-500 text-white shadow" : "text-white/50 hover:text-white"}`}
                  >
                    <Icon /> {tab.label}
                    {"count" in tab && tab.count > 0 && (
                      <span
                        className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${activeTab === tab.key ? "bg-white/20" : "bg-white/10"}`}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* ══ ONGLET INFOS ══ */}
            {activeTab === "info" && (
              <div className="space-y-5">
                {activeCategories.length > 0 && (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <SectionHeader label="Profil" title="Type de logement" />
                    <div className="flex flex-wrap gap-2">
                      {activeCategories.map(({ key, emoji, label, color }) => (
                        <Chip key={key} size="sm" className={`border ${color}`}>
                          {emoji} {label}
                        </Chip>
                      ))}
                    </div>
                  </div>
                )}

                {apt.equipments && apt.equipments.length > 0 && (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <div className="flex items-start justify-between">
                      <SectionHeader
                        label="Confort"
                        title="Équipements & services"
                      />
                      {apt.equipments.length > 8 && (
                        <button
                          onClick={onOpen}
                          className="text-xs font-medium text-teal-400 hover:text-teal-300 border border-teal-400/20 hover:border-teal-400/40 rounded-xl px-3 py-1.5 transition-all flex-shrink-0 mt-1"
                        >
                          Tout voir ({apt.equipments.length})
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {apt.equipments.slice(0, 8).map((eq, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3 hover:bg-white/8 hover:border-teal-400/20 transition-all"
                        >
                          <div className="bg-teal-400/10 p-2.5 rounded-xl flex-shrink-0">
                            <EquipmentIcon
                              name={eq}
                              className="text-teal-400 w-4 h-4"
                            />
                          </div>
                          <span className="text-white/60 text-sm">{eq}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {apt.bed_details && apt.bed_details.length > 0 && (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <SectionHeader label="Couchage" title="Détails des lits" />
                    <div className="flex flex-wrap gap-3">
                      {apt.bed_details.map((bed, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5"
                        >
                          <MdBed className="text-teal-400 w-4 h-4" />
                          <span className="text-white/70 text-sm">
                            {bed.count}× {bed.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {apt.description && (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <SectionHeader label="Présentation" title="À propos" />
                    <p className="text-white/60 text-sm leading-relaxed">
                      {apt.description}
                    </p>
                  </div>
                )}

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <SectionHeader label="Résumé" title="Détails du logement" />
                  <div className="flex flex-wrap gap-2">
                    {apt.number_of_rooms && (
                      <Chip
                        size="sm"
                        className="bg-teal-500/20 text-teal-300 border border-teal-500/30"
                      >
                        {apt.number_of_rooms} chambre
                        {apt.number_of_rooms > 1 ? "s" : ""}
                      </Chip>
                    )}
                    {apt.number_of_bathrooms && (
                      <Chip
                        size="sm"
                        className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                      >
                        {apt.number_of_bathrooms} salle
                        {apt.number_of_bathrooms > 1 ? "s" : ""} de bain
                      </Chip>
                    )}
                    {apt.max_guests && (
                      <Chip
                        size="sm"
                        className="bg-blue-500/20 text-blue-300 border border-blue-500/30"
                      >
                        {apt.max_guests} voyageurs max
                      </Chip>
                    )}
                  </div>
                </div>

                {(apt.check_in_time || apt.check_out_time) && (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <SectionHeader
                      label="Organisation"
                      title="Horaires d'accueil"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      {apt.check_in_time && (
                        <div className="bg-teal-500/10 border border-teal-500/20 rounded-xl p-4 text-center">
                          <LuClock className="w-5 h-5 text-teal-400/60 mx-auto mb-1" />
                          <p className="text-teal-400/60 text-xs uppercase tracking-wider mb-1">
                            Arrivée dès
                          </p>
                          <p className="text-teal-300 font-semibold text-lg">
                            {apt.check_in_time}
                          </p>
                        </div>
                      )}
                      {apt.check_out_time && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
                          <LuClock className="w-5 h-5 text-red-400/60 mx-auto mb-1" />
                          <p className="text-red-400/60 text-xs uppercase tracking-wider mb-1">
                            Départ avant
                          </p>
                          <p className="text-red-300 font-semibold text-lg">
                            {apt.check_out_time}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {apt.house_rules && apt.house_rules.length > 0 && (
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6">
                    <SectionHeader
                      label="Conditions"
                      title="Règles du logement"
                    />
                    <ul className="space-y-2 text-sm text-white/70">
                      {apt.house_rules.map((rule, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-amber-400 mt-0.5 flex-shrink-0">
                            ▸
                          </span>
                          {rule}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {bookedDates.length > 0 && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5">
                    <SectionHeader
                      label="Calendrier"
                      title="Dates non disponibles"
                    />
                    <div className="flex flex-wrap gap-2">
                      {bookedDates.map((b, i) => (
                        <span
                          key={i}
                          className="bg-red-500/20 border border-red-400/20 text-red-300 text-xs px-3 py-1 rounded-full"
                        >
                          {b.check_in} → {b.check_out}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {agency && (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <SectionHeader
                      label="Partenaire"
                      title="Agence responsable"
                    />
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-3">
                        {agency.logo_url && (
                          <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 flex-shrink-0">
                            <img
                              src={agency.logo_url}
                              alt={agency.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <span className="text-white font-semibold">
                          {agency.name}
                        </span>
                      </div>
                      {agency.phone && (
                        <a
                          href={`tel:${agency.phone}`}
                          className="flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white text-sm px-4 py-2 rounded-full transition-all"
                        >
                          <MdPhone className="text-teal-400" />
                          {agency.phone}
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ══ ONGLET GALERIE ══ */}
            {activeTab === "gallery" && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <SectionHeader label="Visuels" title="Galerie photos" />
                {allImages.length === 0 ? (
                  <p className="text-white/30 text-sm text-center py-10">
                    Aucune photo disponible.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {allImages.map((url, i) => (
                      <div
                        key={i}
                        onClick={() => setSelectUrl(url)}
                        className={`relative cursor-pointer rounded-2xl overflow-hidden border-2 transition-all hover:scale-[1.02] ${selectUrl === url ? "border-teal-400" : "border-white/10 hover:border-white/30"}`}
                      >
                        <div className="relative h-[150px]">
                          <SmartImage
                            src={url}
                            alt={`Photo ${i + 1}`}
                            fallback={<VignetteApartment />}
                            className={
                              selectUrl === url
                                ? "brightness-[.7]"
                                : "brightness-[.6] hover:brightness-[.75]"
                            }
                          />
                          {selectUrl === url && (
                            <div className="absolute inset-0 flex items-center justify-center z-10 bg-teal-500/20">
                              <CgEyeAlt className="text-white w-8 h-8" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ══ ONGLET AVIS ══ */}
            {activeTab === "reviews" && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3 relative overflow-hidden">
                    <GridPattern />
                    <div className="relative">
                      {ratingStats.map(({ label, pct }) => (
                        <Progress
                          key={label}
                          classNames={{
                            base: "w-full",
                            track: "border border-white/10",
                            indicator: "bg-teal-400",
                            label: "text-white/40 text-xs",
                            value: "text-white/40 text-xs",
                          }}
                          label={
                            <div className="flex items-center gap-1.5">
                              <span>{label}</span>
                              <FaStar className="text-teal-400 w-3 h-3" />
                            </div>
                          }
                          radius="sm"
                          showValueLabel
                          size="sm"
                          value={pct}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 relative overflow-hidden">
                    <GridPattern />
                    <div className="relative flex flex-col items-center gap-2">
                      <span className="font-tourney text-6xl font-bold text-teal-400">
                        {avgRating}
                      </span>
                      <div className="flex gap-1">
                        {Array.from({
                          length: Math.round(parseFloat(avgRating) || 0),
                        }).map((_, i) => (
                          <FaStar key={i} className="text-teal-400 w-5 h-5" />
                        ))}
                      </div>
                      <span className="text-white/30 text-sm">
                        {reviews.length} avis
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                    <h3 className="text-white font-semibold mb-4 underline underline-offset-4">
                      Commentaires récents
                    </h3>
                    <ScrollShadow
                      className="space-y-3 h-[350px] pr-1"
                      size={80}
                    >
                      {reviews.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-white/20 gap-2">
                          <FaStar className="w-10 h-10 opacity-20" />
                          <p className="text-sm">Soyez le premier !</p>
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
                          return (
                            <div
                              key={review.review_id}
                              className="flex gap-3 bg-white/5 border border-white/10 rounded-xl p-4"
                            >
                              <Avatar
                                isBordered
                                color="secondary"
                                className="w-10 h-10 flex-shrink-0"
                                src={avatar}
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <p className="text-white font-medium text-sm">
                                      {fullName}
                                    </p>
                                    <p className="text-white/25 text-xs">
                                      {date}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-1.5 flex-shrink-0">
                                    <div className="flex gap-0.5">
                                      {Array.from({ length: 5 }).map((_, j) => (
                                        <FaStar
                                          key={j}
                                          className={`w-3 h-3 ${j < review.rating ? "text-teal-400" : "text-white/10"}`}
                                        />
                                      ))}
                                    </div>
                                    {currentUserId === review.reviewer_id && (
                                      <button
                                        onClick={() =>
                                          handleDeleteReview(review.review_id)
                                        }
                                        className="text-xs text-red-400 hover:text-red-300 border border-red-400/20 rounded px-1.5 py-0.5 transition-colors"
                                      >
                                        ✕
                                      </button>
                                    )}
                                  </div>
                                </div>
                                {review.comment && (
                                  <p className="text-white/40 text-xs mt-2 leading-relaxed">
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

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                    <h3 className="text-white font-semibold mb-4 underline underline-offset-4">
                      Laisser un avis
                    </h3>
                    <div className="space-y-4">
                      <div className="flex flex-col gap-2">
                        <span className="text-white/40 text-sm">Note *</span>
                        <div className="flex gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setRatingInput(i + 1)}
                              onMouseEnter={() => setRatingInput(i + 1)}
                              className="focus:outline-none hover:scale-110 transition-transform"
                            >
                              <FaStar
                                className={`w-7 h-7 transition-colors ${i < ratingInput ? "text-teal-400" : "text-white/15 hover:text-white/25"}`}
                              />
                            </button>
                          ))}
                        </div>
                        <span className="text-xs text-white/25">
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
                      <div>
                        <Label className="text-white/40 text-sm">
                          Commentaire *
                        </Label>
                        <Textarea
                          placeholder="Partagez votre expérience..."
                          className="bg-white/5 border border-white/10 text-white placeholder:text-white/20 rounded-xl mt-1 resize-none focus:border-teal-400/40"
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                        />
                      </div>
                      {reviewError && (
                        <div className="flex items-center gap-2 bg-red-500/10 border border-red-400/20 rounded-xl px-3 py-2 text-xs text-red-400">
                          <MdCancel className="flex-shrink-0" />
                          {reviewError}
                        </div>
                      )}
                      {reviewSuccess && (
                        <div className="flex items-center gap-2 bg-green-500/10 border border-green-400/20 rounded-xl px-3 py-2 text-xs text-green-400">
                          <MdCheckCircle className="flex-shrink-0" />
                          Avis publié !
                        </div>
                      )}
                      <ButtonHeroui
                        className="w-full bg-teal-500 text-black font-bold hover:bg-teal-400 rounded-xl"
                        endContent={<BsFillSendFill />}
                        type="button"
                        isLoading={reviewLoading}
                        isDisabled={reviewLoading || reviewSuccess}
                        onClick={handleReview}
                      >
                        Publier l&apos;avis
                      </ButtonHeroui>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Sidebar sticky — style 2e code ── */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-teal-500/20 to-transparent border-b border-white/10 p-5">
                <h3 className="text-white font-semibold text-lg">
                  Réserver cet appartement
                </h3>
                <p className="text-white/40 text-xs mt-0.5">
                  Confirmation agence requise
                </p>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-white/30 text-xs uppercase tracking-wider">
                      Prix / nuit
                    </p>
                    <p className="font-tourney text-3xl font-bold text-teal-400 leading-tight">
                      {Number(apt.price_per_night).toLocaleString()}
                      <span className="text-sm font-normal text-white/30 ml-1">
                        FCFA
                      </span>
                    </p>
                  </div>
                  {nights > 0 && (
                    <div className="text-right">
                      <p className="text-white/30 text-xs">
                        {nights} nuit{nights > 1 ? "s" : ""}
                      </p>
                      <p className="text-white font-semibold text-sm">
                        {baseTotal.toLocaleString()} FCFA
                      </p>
                    </div>
                  )}
                </div>
                <hr className="border-white/10" />

                <div className="space-y-3">
                  <div>
                    <label className="text-white/40 text-xs uppercase tracking-wider block mb-1.5">
                      Votre nom *
                    </label>
                    <input
                      type="text"
                      placeholder="Jean Dupont"
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                      className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-teal-400/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-white/40 text-xs uppercase tracking-wider block mb-1.5">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      placeholder="+242 06 000 0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-teal-400/50 transition-colors"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-white/40 text-xs uppercase tracking-wider block mb-1.5">
                        Arrivée *
                      </label>
                      <input
                        type="date"
                        min={today}
                        value={checkIn}
                        onChange={(e) => {
                          setCheckIn(e.target.value);
                          if (e.target.value >= checkOut)
                            setCheckOut(
                              toDateInput(
                                new Date(
                                  new Date(e.target.value).getTime() + 86400000,
                                ),
                              ),
                            );
                          setBooking("idle");
                        }}
                        className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-teal-400/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-white/40 text-xs uppercase tracking-wider block mb-1.5">
                        Départ *
                      </label>
                      <input
                        type="date"
                        min={checkIn || today}
                        value={checkOut}
                        onChange={(e) => {
                          setCheckOut(e.target.value);
                          setBooking("idle");
                        }}
                        className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-teal-400/50 transition-colors"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {
                        label: "Adultes *",
                        value: adults,
                        min: 1,
                        max: apt.max_guests - children,
                        set: setAdults,
                      },
                      {
                        label: "Enfants",
                        value: children,
                        min: 0,
                        max: apt.max_guests - adults,
                        set: setChildren,
                      },
                    ].map(({ label, value, min, max, set }) => (
                      <div key={label}>
                        <label className="text-white/40 text-xs uppercase tracking-wider block mb-1.5">
                          {label}
                        </label>
                        <div className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-xl px-3 py-2">
                          <button
                            onClick={() => set((n) => Math.max(min, n - 1))}
                            className="text-white/50 hover:text-white transition-colors text-lg font-medium w-5 text-center"
                          >
                            −
                          </button>
                          <span className="flex-1 text-center text-white font-semibold text-sm">
                            {value}
                          </span>
                          <button
                            onClick={() => set((n) => Math.min(max, n + 1))}
                            className="text-white/50 hover:text-white transition-colors text-lg font-medium w-5 text-center"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-white/25 text-xs text-center">
                    Max {apt.max_guests} personnes au total
                  </p>
                </div>

                {nights > 0 && (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-1.5 text-sm">
                    <div className="flex justify-between text-white/40">
                      <span>
                        {Number(apt.price_per_night).toLocaleString()} ×{" "}
                        {nights} nuit{nights > 1 ? "s" : ""}
                      </span>
                      <span>{baseTotal.toLocaleString()}</span>
                    </div>
                    {cleaningFee > 0 && (
                      <div className="flex justify-between text-white/40">
                        <span>Frais de ménage</span>
                        <span>{cleaningFee.toLocaleString()}</span>
                      </div>
                    )}
                    {serviceFee > 0 && (
                      <div className="flex justify-between text-white/40">
                        <span>Frais de service</span>
                        <span>{serviceFee.toLocaleString()}</span>
                      </div>
                    )}
                    <hr className="border-white/10" />
                    <div className="flex justify-between text-white font-bold">
                      <span>Total</span>
                      <span className="text-teal-400">
                        {total.toLocaleString()} FCFA
                      </span>
                    </div>
                  </div>
                )}

                {hasConflict && (
                  <div className="flex items-center gap-2 bg-red-500/10 border border-red-400/20 rounded-xl px-3 py-2 text-xs text-red-400">
                    <MdCancel className="flex-shrink-0" />
                    Ces dates sont déjà réservées.
                  </div>
                )}
                {booking === "success" && (
                  <div className="flex items-start gap-2 bg-green-500/10 border border-green-400/20 rounded-xl px-3 py-2 text-xs text-green-400">
                    <MdCheckCircle className="flex-shrink-0 mt-0.5" />
                    <span>{bookingMsg}</span>
                  </div>
                )}
                {booking === "error" && (
                  <div className="flex items-start gap-2 bg-red-500/10 border border-red-400/20 rounded-xl px-3 py-2 text-xs text-red-400">
                    <MdCancel className="flex-shrink-0 mt-0.5" />
                    <span>{bookingMsg}</span>
                  </div>
                )}

                {authLoaded && !isLoggedIn ? (
                  <AuthRequiredBanner redirectUrl={currentUrl} />
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={handleBook}
                      disabled={
                        nights < 1 ||
                        hasConflict ||
                        booking === "success" ||
                        booking === "loading"
                      }
                      className="w-full bg-teal-500 hover:bg-teal-400 disabled:opacity-30 disabled:cursor-not-allowed text-black font-bold py-3 rounded-xl transition-all text-sm tracking-wide"
                    >
                      {booking === "loading"
                        ? "Envoi en cours..."
                        : booking === "success"
                          ? "✓ Réservation envoyée"
                          : "Réserver maintenant"}
                    </button>
                    {agency?.phone && (
                      <a
                        href={`tel:${agency.phone}`}
                        className="flex items-center justify-center gap-2 w-full border border-white/15 hover:border-white/30 text-white/50 hover:text-white text-sm py-3 rounded-xl transition-all"
                      >
                        <MdPhone className="text-teal-400" />
                        Contacter l&apos;agence
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══ MODAL équipements ══ */}
      <Modal isOpen={isOpen} size="4xl" onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-white bg-(--bg-legebluefort) border-b border-white/[0.08] text-sm font-semibold">
                Tous les équipements ({apt.equipments?.length ?? 0})
              </ModalHeader>
              <ModalBody className="bg-(--bg-legebluefort) p-4">
                <ScrollShadow className="h-[400px] pr-2" size={80}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(apt.equipments ?? []).map((eq, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3"
                      >
                        <div className="bg-teal-400/10 p-2.5 rounded-xl flex-shrink-0">
                          <EquipmentIcon
                            name={eq}
                            className="text-teal-400 w-4 h-4"
                          />
                        </div>
                        <span className="text-white/60 text-sm">{eq}</span>
                      </div>
                    ))}
                  </div>
                </ScrollShadow>
              </ModalBody>
              <ModalFooter className="bg-(--bg-legebluefort) border-t border-white/[0.08]">
                <ButtonHeroui
                  variant="light"
                  className="text-white/50 hover:text-white text-sm"
                  onPress={onClose}
                >
                  Fermer
                </ButtonHeroui>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
