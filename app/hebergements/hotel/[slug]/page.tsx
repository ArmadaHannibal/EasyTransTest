"use client";

import { useEffect, useState, useMemo, useId } from "react";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";
import { Button as ButtonHeroui } from "@heroui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@heroui/link";
import { Progress } from "@heroui/progress";
import { Avatar } from "@heroui/avatar";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { Chip } from "@heroui/chip";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { CheckboxGroup } from "@heroui/checkbox";
import type { CheckboxProps } from "@heroui/checkbox";
import { useCheckbox } from "@heroui/checkbox";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pagination } from "@heroui/pagination";
import { tv } from "tailwind-variants";
import { FaStar, FaLock } from "react-icons/fa";
import { FaLocationDot, FaArrowLeft, FaBed, FaCheck } from "react-icons/fa6";
import {
  MdCheckCircle,
  MdCancel,
  MdPhone,
  MdKingBed,
  MdPeople,
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
import {
  TbParking,
  TbWifi,
  TbAirConditioning,
  TbToolsKitchen2,
  TbCoffee,
  TbShirt,
  TbMessageCircleFilled,
} from "react-icons/tb";
import { RiSafe2Fill } from "react-icons/ri";
import {
  LuConciergeBell,
  LuWaves,
  LuMountain,
  LuTrees,
  LuWine,
  LuUtensilsCrossed,
  LuPackage,
  LuLogIn,
} from "react-icons/lu";
import {
  PiSecurityCameraLight,
  PiWheelchairLight,
  PiVanLight,
} from "react-icons/pi";
import { IoRestaurantOutline, IoCarOutline } from "react-icons/io5";
import { GrGallery } from "react-icons/gr";
import { createClient } from "@/utils/supabase/client";
import { MdBedroomChild } from "react-icons/md";
import { FaBuilding } from "react-icons/fa";

// ── Types ──────────────────────────────────────────────────────────────────────
interface AgencyRel {
  name: string;
  logo_url?: string | null;
  phone?: string | null;
}
interface RoomEquipment {
  id: string;
  name: string | null;
}
interface RoomSupplement {
  id: string;
  label: string;
  price: number;
}
interface HotelRoom {
  room_id: string;
  room_type: string;
  description: string | null;
  price_per_night: number;
  max_guests: number;
  number_of_beds: number | null;
  is_available: boolean | null;
  main_image_url: string | null;
  room_equipments: RoomEquipment[];
  room_supplements: RoomSupplement[];
}
interface HotelEquipment {
  id: string;
  name: string | null;
  description: string | null;
}
interface HotelDetail {
  hotel_id: string;
  name: string;
  description: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  phone: string | null;
  email: string | null;
  star_rating: number | null;
  main_image_url: string | null;
  has_pool: boolean | null;
  has_breakfast: boolean | null;
  has_parking: boolean | null;
  pets_allowed: boolean | null;
  is_business: boolean | null;
  is_family: boolean | null;
  is_romantic: boolean | null;
  is_unusual: boolean | null;
  is_luxury: boolean | null;
  is_budget: boolean | null;
  is_apart_hotel: boolean | null;
  near_beach: boolean | null;
  near_center: boolean | null;
  near_airport: boolean | null;
  in_nature: boolean | null;
  agencies: AgencyRel | AgencyRel[] | null;
  hotel_rooms: HotelRoom[];
  hotel_equipments: HotelEquipment[];
}
interface Review {
  review_id: string;
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

const getAgency = (rel: HotelDetail["agencies"]): AgencyRel | null => {
  if (!rel) return null;
  if (Array.isArray(rel)) return rel[0] ?? null;
  return rel as AgencyRel;
};

// ── Equipment icon map ─────────────────────────────────────────────────────────
const EQUIPMENT_ICON_MAP: Record<string, React.ElementType> = {
  climatisation: TbAirConditioning,
  clim: TbAirConditioning,
  "wi-fi": TbWifi,
  wifi: TbWifi,
  "wi-fi gratuit": TbWifi,
  internet: TbWifi,
  restaurant: IoRestaurantOutline,
  "restaurant sur place": IoRestaurantOutline,
  "petit-déjeuner": TbCoffee,
  "petit déjeuner": TbCoffee,
  "salle de sport": MdOutlineFitnessCenter,
  fitness: MdOutlineFitnessCenter,
  spa: MdOutlineSpa,
  "spa & bien-être": MdOutlineSpa,
  "salle de réunion": MdOutlineMeetingRoom,
  "business center": MdOutlineMeetingRoom,
  voiturier: IoCarOutline,
  parking: TbParking,
  navette: PiVanLight,
  "navette aéroport": PiVanLight,
  conciergerie: LuConciergeBell,
  "conciergerie 24h/24": LuConciergeBell,
  blanchisserie: MdOutlineLocalLaundryService,
  "service blanchisserie": MdOutlineLocalLaundryService,
  ménage: MdOutlineCleaningServices,
  "room service": MdOutlineRoomService,
  piscine: MdOutlinePool,
  "piscine extérieure": MdOutlinePool,
  "coffre-fort": RiSafe2Fill,
  "coffre-fort en chambre": RiSafe2Fill,
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

// ── Supplement emojis ──────────────────────────────────────────────────────────
const SUPPLEMENT_EMOJI_MAP: Record<string, string> = {
  "Petit déjeuner continental": "🥐",
  "Petit déjeuner buffet": "🍳",
  "Demi-pension": "🍽️",
  "Pension complète": "🍴",
  "Navette aéroport aller": "🚐",
  "Navette aéroport aller-retour": "🚐",
  "Parking sécurisé": "🅿️",
  "Accès spa": "🧖",
  "Accès salle de sport": "🏋️",
  "Supplément animal": "🐾",
  "Lit bébé": "🛏️",
  "Décoration romantique": "🌹",
  "Bouteille de champagne": "🍾",
  "Gâteau d'anniversaire": "🎂",
  "Ménage quotidien premium": "🧹",
  "Service blanchisserie": "🧺",
  "Room service 24h": "🛎️",
  "Accès internet haut débit": "💻",
  "Appels internationaux": "📞",
  "Accès plage privée": "🏖️",
};
const getSupplementEmoji = (label: string) =>
  SUPPLEMENT_EMOJI_MAP[label] ?? "➕";

// ── Category groups ────────────────────────────────────────────────────────────
const CATEGORY_GROUPS = [
  {
    title: "Style de voyage",
    items: [
      {
        key: "is_business",
        emoji: "💼",
        label: "Business",
        color: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      },
      {
        key: "is_family",
        emoji: "👨‍👩‍👧",
        label: "Famille",
        color: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
      },
      {
        key: "is_romantic",
        emoji: "💑",
        label: "Romantique",
        color: "bg-pink-500/20 text-pink-300 border-pink-500/30",
      },
      {
        key: "is_unusual",
        emoji: "🏕️",
        label: "Insolite",
        color: "bg-orange-500/20 text-orange-300 border-orange-500/30",
      },
    ],
  },
  {
    title: "Budget & Standing",
    items: [
      {
        key: "is_luxury",
        emoji: "👑",
        label: "Luxe",
        color: "bg-amber-500/20 text-amber-300 border-amber-500/30",
      },
      {
        key: "is_budget",
        emoji: "🏷️",
        label: "Bon plan",
        color: "bg-green-500/20 text-green-300 border-green-500/30",
      },
      {
        key: "is_apart_hotel",
        emoji: "🏢",
        label: "Appart-hôtel",
        color: "bg-teal-500/20 text-teal-300 border-teal-500/30",
      },
    ],
  },
  {
    title: "Emplacement",
    items: [
      {
        key: "near_beach",
        emoji: "🌊",
        label: "Pieds dans l'eau",
        color: "bg-sky-500/20 text-sky-300 border-sky-500/30",
      },
      {
        key: "near_center",
        emoji: "🏙️",
        label: "Centre-ville",
        color: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
      },
      {
        key: "near_airport",
        emoji: "✈️",
        label: "Aéroport",
        color: "bg-slate-500/20 text-slate-300 border-slate-500/30",
      },
      {
        key: "in_nature",
        emoji: "🌲",
        label: "Pleine nature",
        color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      },
    ],
  },
  {
    title: "Services inclus",
    items: [
      {
        key: "has_pool",
        emoji: "🏊",
        label: "Piscine",
        color: "bg-teal-500/20 text-teal-300 border-teal-500/30",
      },
      {
        key: "has_breakfast",
        emoji: "🥐",
        label: "Petit-déjeuner",
        color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      },
      {
        key: "has_parking",
        emoji: "🅿️",
        label: "Parking",
        color: "bg-zinc-500/20 text-zinc-300 border-zinc-500/30",
      },
      {
        key: "pets_allowed",
        emoji: "🐾",
        label: "Animaux acceptés",
        color: "bg-rose-500/20 text-rose-300 border-rose-500/30",
      },
    ],
  },
];

const FALLBACK_IMG =
  "https://res.cloudinary.com/dtrpkegss/image/upload/v1767635038/pexels-quang-nguyen-vinh-222549-14024790_tzbe1h.webp";
const FALLBACK_ROOM =
  "https://res.cloudinary.com/dtrpkegss/image/upload/v1767635036/pexels-pixabay-164595_dskibe.webp";
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
const ROOMS_PER_PAGE = 9;

// ── GridPattern (from apt design) ─────────────────────────────────────────────
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

// ── SmartImage (from apt design) ──────────────────────────────────────────────
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

// ── VignetteHotel (hotel SVG placeholder) ─────────────────────────────────────
const VignetteHotel = () => (
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
        x="10"
        y="15"
        width="60"
        height="55"
        stroke="white"
        strokeOpacity="0.15"
        strokeWidth="1"
        fill="white"
        fillOpacity="0.02"
      />
      <rect
        x="15"
        y="22"
        width="10"
        height="10"
        stroke="white"
        strokeOpacity="0.25"
        strokeWidth="0.7"
        fill="white"
        fillOpacity="0.04"
      />
      <rect
        x="30"
        y="22"
        width="10"
        height="10"
        stroke="white"
        strokeOpacity="0.25"
        strokeWidth="0.7"
        fill="white"
        fillOpacity="0.04"
      />
      <rect
        x="45"
        y="22"
        width="10"
        height="10"
        stroke="white"
        strokeOpacity="0.25"
        strokeWidth="0.7"
        fill="white"
        fillOpacity="0.04"
      />
      <rect
        x="15"
        y="38"
        width="10"
        height="10"
        stroke="white"
        strokeOpacity="0.15"
        strokeWidth="0.7"
        fill="white"
        fillOpacity="0.02"
      />
      <rect
        x="30"
        y="38"
        width="10"
        height="10"
        stroke="white"
        strokeOpacity="0.15"
        strokeWidth="0.7"
        fill="white"
        fillOpacity="0.02"
      />
      <rect
        x="45"
        y="38"
        width="10"
        height="10"
        stroke="white"
        strokeOpacity="0.15"
        strokeWidth="0.7"
        fill="white"
        fillOpacity="0.02"
      />
      <rect
        x="30"
        y="54"
        width="20"
        height="16"
        stroke="white"
        strokeOpacity="0.2"
        strokeWidth="0.8"
        fill="white"
        fillOpacity="0.04"
      />
    </svg>
  </div>
);

// ── SectionHeader (from apt design) ───────────────────────────────────────────
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

// ── CustomCheckbox ─────────────────────────────────────────────────────────────
export const CustomCheckbox = (props: CheckboxProps) => {
  const checkbox = tv({
    slots: {
      base: "border-default hover:bg-default-200",
      content: "text-default-500",
    },
    variants: {
      isSelected: {
        true: {
          base: "border-teal-500 bg-teal-500 hover:bg-teal-400 hover:border-teal-400",
          content: "text-primary-foreground pl-1",
        },
      },
      isFocusVisible: {
        true: {
          base: "outline-solid outline-transparent ring-2 ring-focus ring-offset-2 ring-offset-background",
        },
      },
    },
  });
  const {
    children,
    isSelected,
    isFocusVisible,
    getBaseProps,
    getLabelProps,
    getInputProps,
  } = useCheckbox({ ...props });
  const styles = checkbox({ isSelected, isFocusVisible });
  const { ref: _ref, ...safeLabelProps } = getLabelProps();
  return (
    <label {...getBaseProps()}>
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <div
        {...safeLabelProps}
        className={`${styles.base()} cursor-pointer px-3 py-1.5 rounded-full border text-xs font-medium flex items-center gap-1.5 transition-all select-none`}
      >
        {isSelected && <FaCheck className="w-3 h-3" />}
        <span className={styles.content()}>{children}</span>
      </div>
    </label>
  );
};

// ── Auth banner (teal, apt style) ─────────────────────────────────────────────
const AuthRequiredBanner = ({ redirectUrl }: { redirectUrl: string }) => (
  <div className="flex flex-col items-center justify-between gap-3 bg-teal-400/[0.06] border border-teal-400/20 rounded-2xl px-4 py-4">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-teal-400/12 flex items-center justify-center flex-shrink-0">
        <FaLock className="w-4 h-4 text-teal-400/70" />
      </div>
      <div>
        <p className="text-white font-semibold text-sm">Connexion requise</p>
        <p className="text-white/40 text-xs mt-0.5">
          Connectez-vous pour réserver cette chambre.
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

// ── Page ───────────────────────────────────────────────────────────────────────
export default function HotelPostPage() {
  const params = useParams();
  const router = useRouter();
  const hotelId = params?.slug as string;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [hotel, setHotel] = useState<HotelDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectUrl, setSelectUrl] = useState("");
  const [activeTab, setActiveTab] = useState<"rooms" | "about" | "reviews">(
    "rooms",
  );
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);
  const [guestsFilter, setGuestsFilter] = useState("all");
  const [bedsFilter, setBedsFilter] = useState<string[]>([]);
  const [roomPage, setRoomPage] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState<HotelRoom | null>(null);
  const [bookingState, setBookingState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [bookingMsg, setBookingMsg] = useState("");
  const [bookedRooms, setBookedRooms] = useState<string[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [authLoaded, setAuthLoaded] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [ratingInput, setRatingInput] = useState(1);
  const [commentText, setCommentText] = useState("");
  const [selectedSupplements, setSelectedSupplements] = useState<
    Record<string, Set<string>>
  >({});

  const currentUrl =
    typeof window !== "undefined"
      ? window.location.pathname
      : `/hebergements/hotel/${hotelId}`;

  const isLoggedIn = !!currentUserId;

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

  // ── Supplements ───────────────────────────────────────────────────────────
  const toggleSupplement = (roomId: string, supId: string) => {
    setSelectedSupplements((prev) => {
      const current = new Set(prev[roomId] ?? []);
      if (current.has(supId)) current.delete(supId);
      else current.add(supId);
      return { ...prev, [roomId]: current };
    });
  };
  const getSupplementsTotal = (room: HotelRoom): number => {
    const selected = selectedSupplements[room.room_id];
    if (!selected || selected.size === 0) return 0;
    return room.room_supplements
      .filter((s) => selected.has(s.id))
      .reduce((acc, s) => acc + Number(s.price), 0);
  };
  const getSelectedSupplements = (room: HotelRoom): RoomSupplement[] => {
    const selected = selectedSupplements[room.room_id];
    if (!selected || selected.size === 0) return [];
    return room.room_supplements.filter((s) => selected.has(s.id));
  };

  // ── Data fetching ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!hotelId) return;
    const fetchData = async () => {
      const { data } = await supabase
        .from("hotels")
        .select(
          `
          hotel_id, name, description, address, city, country, phone, email,
          star_rating, main_image_url,
          has_pool, has_breakfast, has_parking, pets_allowed,
          is_business, is_family, is_romantic, is_unusual,
          is_luxury, is_budget, is_apart_hotel,
          near_beach, near_center, near_airport, in_nature,
          agencies(name, logo_url, phone),
          hotel_equipments(id, name, description),
          hotel_rooms(
            room_id, room_type, description, price_per_night, max_guests,
            number_of_beds, is_available, main_image_url,
            room_equipments(id, name),
            room_supplements(id, label, price)
          )
        `,
        )
        .eq("hotel_id", hotelId)
        .single();

      if (data) {
        const d = data as unknown as HotelDetail;
        setHotel(d);
        setSelectUrl(d.main_image_url ?? FALLBACK_IMG);
      }

      const { data: rv } = await supabase
        .from("hotel_reviews")
        .select(
          "review_id, reviewer_id, rating, comment, created_at, users(first_name, last_name, profile_picture)",
        )
        .eq("hotel_id", hotelId)
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
  }, [hotelId]);

  useEffect(() => {
    if (!hotelId || !checkIn || !checkOut) return;
    supabase
      .from("hotel_bookings")
      .select("room_id")
      .eq("hotel_id", hotelId)
      .in("status", ["pending", "confirmed"])
      .lt("check_in", checkOut)
      .gt("check_out", checkIn)
      .then(({ data }) =>
        setBookedRooms(
          ((data as { room_id: string }[]) ?? []).map((b) => b.room_id),
        ),
      );
  }, [hotelId, checkIn, checkOut]);

  const allImages = hotel
    ? [
        hotel.main_image_url ?? FALLBACK_IMG,
        ...(hotel.hotel_rooms
          .map((r) => r.main_image_url)
          .filter(Boolean) as string[]),
      ]
        .filter((v, i, a) => a.indexOf(v) === i)
        .slice(0, 5)
    : [];

  const filteredRooms = useMemo(() => {
    if (!hotel) return [];
    return hotel.hotel_rooms.filter((r) => {
      if (!r.is_available) return false;
      if (bookedRooms.includes(r.room_id)) return false;
      if (guestsFilter !== "all" && r.max_guests < parseInt(guestsFilter))
        return false;
      if (bedsFilter.length > 0) {
        const beds = r.number_of_beds ?? 0;
        const ok = bedsFilter.some((f) => {
          if (f === "1 lit") return beds === 1;
          if (f === "2 lits") return beds === 2;
          if (f === "3+ lits") return beds >= 3;
          return true;
        });
        if (!ok) return false;
      }
      return true;
    });
  }, [hotel, bookedRooms, guestsFilter, bedsFilter]);

  useEffect(() => {
    setRoomPage(1);
  }, [guestsFilter, bedsFilter, checkIn, checkOut]);

  const totalRoomPages = Math.max(
    1,
    Math.ceil(filteredRooms.length / ROOMS_PER_PAGE),
  );
  const paginatedRooms = filteredRooms.slice(
    (roomPage - 1) * ROOMS_PER_PAGE,
    roomPage * ROOMS_PER_PAGE,
  );
  const nights = diffDays(checkIn, checkOut);

  const activeGroups = CATEGORY_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => (hotel as any)?.[item.key] === true),
  })).filter((group) => group.items.length > 0);

  // ── Booking ───────────────────────────────────────────────────────────────
  const handleBook = async (room: HotelRoom) => {
    if (!hotel || !isLoggedIn) return;
    if (nights < 1) {
      setBookingMsg("Dates invalides.");
      setBookingState("error");
      return;
    }
    setSelectedRoom(room);
    setBookingState("loading");
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const suppTotal = getSupplementsTotal(room);
    const total = nights * Number(room.price_per_night) + suppTotal;
    const { error } = await supabase.from("hotel_bookings").insert({
      room_id: room.room_id,
      hotel_id: hotel.hotel_id,
      user_id: user?.id ?? null,
      check_in: checkIn,
      check_out: checkOut,
      guests: guestsFilter !== "all" ? parseInt(guestsFilter) : 1,
      total_price: total,
      status: "pending",
    });
    if (error) {
      setBookingMsg("Une erreur est survenue.");
      setBookingState("error");
    } else {
      const suppNames = getSelectedSupplements(room)
        .map((s) => s.label)
        .join(", ");
      setBookingMsg(
        `✓ Chambre réservée ! ${nights} nuit${nights > 1 ? "s" : ""} · ${total.toLocaleString()} XAF${suppNames ? ` · ${suppNames}` : ""}`,
      );
      setBookingState("success");
      setBookedRooms((prev) => [...prev, room.room_id]);
    }
    setTimeout(() => {
      setBookingState("idle");
      setBookingMsg("");
      setSelectedRoom(null);
    }, 5000);
  };

  // ── Reviews ───────────────────────────────────────────────────────────────
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
      .from("hotel_reviews")
      .insert({
        hotel_id: hotelId,
        reviewer_id: user.id,
        rating: ratingInput,
        comment: commentText.trim(),
      })
      .select(
        "review_id, reviewer_id, rating, comment, created_at, users(first_name, last_name, profile_picture)",
      )
      .single();
    if (error) {
      setReviewError(
        error.code === "23505"
          ? "Vous avez déjà laissé un avis pour cet hôtel."
          : "Une erreur est survenue.",
      );
      setReviewLoading(false);
    } else {
      setReviews((prev) => [data as unknown as Review, ...prev]);
      setCommentText("");
      setRatingInput(1);
      setReviewSuccess(true);
      setReviewLoading(false);
      setTimeout(() => setReviewSuccess(false), 4000);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    const { error } = await supabase
      .from("hotel_reviews")
      .delete()
      .eq("review_id", reviewId);
    if (!error)
      setReviews((prev) => prev.filter((r) => r.review_id !== reviewId));
  };

  // ── Loading / Not found ───────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-(--bg-legebluefort) flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 border-4 border-white/10 border-t-teal-400 rounded-full animate-spin" />
          <p className="text-white/40 text-sm tracking-widest uppercase">
            Chargement de l&apos;hôtel...
          </p>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen bg-(--bg-legebluefort) flex flex-col items-center justify-center gap-4">
        <p className="text-white/40 text-xl">Hôtel introuvable.</p>
        <ButtonHeroui
          as={Link}
          href="/hebergements/hotel"
          className="bg-teal-500 text-black font-semibold"
        >
          Retour aux hôtels
        </ButtonHeroui>
      </div>
    );
  }

  const agency = getAgency(hotel.agencies);

  return (
    <div className="min-h-screen bg-(--bg-legebluefort)">
      {/* ══ HERO ══ */}
      <div className="relative h-[60vh] overflow-hidden">
        <SmartImage
          src={selectUrl || allImages[0] || FALLBACK_IMG}
          alt={hotel.name}
          eager
          className="brightness-[.55]"
          fallback={<VignetteHotel />}
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
          <span className="bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm">
            ● {filteredRooms.length} chambre
            {filteredRooms.length !== 1 ? "s" : ""} dispo
          </span>
        </div>

        {allImages.length > 1 && (
          <div className="absolute bottom-32 right-6 z-20 flex gap-2">
            {allImages.map((url, i) => (
              <button
                key={i}
                onClick={() => setSelectUrl(url)}
                className={`w-14 h-10 rounded-lg overflow-hidden border-2 transition-all ${selectUrl === url ? "border-teal-400 scale-110" : "border-white/20 opacity-60 hover:opacity-100"}`}
              >
                <img alt="" src={url} className="object-cover w-full h-full" />
              </button>
            ))}
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between flex-wrap gap-4">
              <div>
                <div className="flex gap-1 mb-2">
                  {Array.from({ length: hotel.star_rating || 0 }).map(
                    (_, i) => (
                      <FaStar key={i} className="text-teal-400 w-4 h-4" />
                    ),
                  )}
                </div>
                <p className="text-teal-400 text-sm font-medium tracking-[0.2em] uppercase mb-1">
                  {hotel.city}
                  {hotel.country ? `, ${hotel.country}` : ""}
                </p>
                <h1 className="font-tourney text-4xl lg:text-6xl font-bold text-white leading-tight">
                  {hotel.name}
                </h1>
                <div className="flex flex-wrap gap-4 mt-2">
                  {(hotel.address || hotel.city) && (
                    <span className="flex items-center gap-1.5 text-white/60 text-sm">
                      <FaLocationDot className="text-red-400" />
                      {hotel.address ?? `${hotel.city}, ${hotel.country}`}
                    </span>
                  )}
                  {hotel.phone && (
                    <span className="flex items-center gap-1.5 text-white/60 text-sm">
                      <MdPhone className="text-teal-400" /> {hotel.phone}
                    </span>
                  )}
                </div>
              </div>
              {reviews.length > 0 && (
                <div className="text-right">
                  <p className="text-white/30 text-xs uppercase tracking-wider mb-1">
                    Note clients
                  </p>
                  <p className="font-tourney text-4xl font-bold text-teal-400 leading-tight">
                    {avgRating}
                  </p>
                  <div className="flex gap-0.5 justify-end mt-1">
                    {Array.from({
                      length: Math.round(parseFloat(avgRating) || 0),
                    }).map((_, i) => (
                      <FaStar key={i} className="text-teal-400 w-4 h-4" />
                    ))}
                  </div>
                  <p className="text-white/40 text-xs mt-1">
                    {reviews.length} avis
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ══ STATS ══ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 mb-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              label: "Chambres",
              value: hotel.hotel_rooms.length,
              color: "from-teal-500/20 to-teal-600/10",
              border: "border-teal-500/30",
              text: "text-teal-300",
            },
            {
              label: "Disponibles",
              value: filteredRooms.length,
              color: "from-cyan-500/20 to-cyan-600/10",
              border: "border-cyan-500/30",
              text: "text-cyan-300",
            },
            {
              label: "Étoiles",
              value: hotel.star_rating || 0,
              color: "from-blue-500/20 to-blue-600/10",
              border: "border-blue-500/30",
              text: "text-blue-300",
            },
            {
              label: "Avis clients",
              value: reviews.length,
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
              <p className="text-white/50 text-xs mt-1 uppercase tracking-wider">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Main column ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="flex gap-1 bg-white/5 p-1 rounded-xl w-fit">
              {(
                [
                  {
                    key: "rooms",
                    label: "Chambres",
                    icon: MdBedroomChild,
                    count: filteredRooms.length,
                  },
                  { key: "about", label: "À propos", icon: FaBuilding },
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
                    {"count" in tab && tab.count !== undefined && (
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

            {/* ══ ROOMS TAB ══ */}
            {activeTab === "rooms" && (
              <div className="space-y-5">
                {/* Auth banner */}
                {authLoaded && !isLoggedIn && (
                  <div className="flex items-center justify-between gap-4 bg-teal-400/8 border border-teal-400/20 rounded-2xl px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-400/15 flex items-center justify-center flex-shrink-0">
                        <FaLock className="w-4 h-4 text-teal-400" />
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">
                          Connexion requise pour réserver
                        </p>
                        <p className="text-white/45 text-xs mt-0.5">
                          Créez un compte gratuitement ou connectez-vous pour
                          accéder aux réservations.
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
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-500 hover:bg-teal-400 text-black transition-all"
                      >
                        <LuLogIn className="w-3.5 h-3.5" /> Se connecter
                      </a>
                    </div>
                  </div>
                )}

                {/* Filters */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <SectionHeader
                    label="Recherche"
                    title="Filtrer les chambres"
                  />
                  <div className="flex flex-wrap gap-4 items-end">
                    <div>
                      <label className="text-white/40 text-xs uppercase tracking-wider block mb-1.5">
                        Arrivée
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
                        }}
                        className="bg-white/10 border border-white/15 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-teal-400/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-white/40 text-xs uppercase tracking-wider block mb-1.5">
                        Départ
                      </label>
                      <input
                        type="date"
                        min={checkIn || today}
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="bg-white/10 border border-white/15 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-teal-400/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-white/40 text-xs uppercase tracking-wider block mb-1.5">
                        Voyageurs
                      </label>
                      <Select
                        value={guestsFilter}
                        onValueChange={setGuestsFilter}
                      >
                        <SelectTrigger className="w-44 bg-white/10 border-white/15 text-white">
                          <SelectValue placeholder="Voyageurs" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Voyageurs</SelectLabel>
                            <SelectItem value="all">Tous</SelectItem>
                            {[1, 2, 3, 4, 5, 6].map((n) => (
                              <SelectItem key={n} value={String(n)}>
                                {n} voyageur{n > 1 ? "s" : ""}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-white/40 text-xs uppercase tracking-wider block mb-2">
                        Lits
                      </label>
                      <CheckboxGroup
                        className="gap-1"
                        orientation="horizontal"
                        value={bedsFilter}
                        onChange={setBedsFilter}
                      >
                        {[
                          "Toutes les chambres",
                          "1 lit",
                          "2 lits",
                          "3+ lits",
                        ].map((v) => (
                          <CustomCheckbox key={v} value={v}>
                            {v}
                          </CustomCheckbox>
                        ))}
                      </CheckboxGroup>
                    </div>
                    <div className="ml-auto self-end">
                      <span className="text-white/40 text-sm">
                        {paginatedRooms.length} / {filteredRooms.length} chambre
                        {filteredRooms.length !== 1 ? "s" : ""}
                        {nights > 0 &&
                          ` · ${nights} nuit${nights > 1 ? "s" : ""}`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Booking feedback */}
                {bookingState === "success" && (
                  <div className="flex items-center gap-2 bg-green-500/10 border border-green-400/20 rounded-xl px-4 py-3 text-sm text-green-400">
                    <MdCheckCircle className="flex-shrink-0" />
                    {bookingMsg}
                  </div>
                )}
                {bookingState === "error" && (
                  <div className="flex items-center gap-2 bg-red-500/10 border border-red-400/20 rounded-xl px-4 py-3 text-sm text-red-400">
                    <MdCancel className="flex-shrink-0" />
                    {bookingMsg}
                  </div>
                )}

                {paginatedRooms.length === 0 ? (
                  <div className="text-center text-white/30 py-20">
                    <MdKingBed className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p>Aucune chambre disponible pour ces dates et critères.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {paginatedRooms.map((room) => {
                      const n = diffDays(checkIn, checkOut);
                      const suppTotal = getSupplementsTotal(room);
                      const total =
                        n * Number(room.price_per_night) + suppTotal;
                      const isBooking =
                        bookingState === "loading" &&
                        selectedRoom?.room_id === room.room_id;
                      const isBooked =
                        bookingState === "success" &&
                        selectedRoom?.room_id === room.room_id;
                      const selectedSups = getSelectedSupplements(room);
                      const hasSups =
                        room.room_supplements &&
                        room.room_supplements.length > 0;

                      return (
                        <div
                          key={room.room_id}
                          className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-teal-400/30 hover:bg-white/8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-teal-400/5"
                        >
                          {/* Room image */}
                          <div className="relative h-48 overflow-hidden">
                            <SmartImage
                              src={room.main_image_url}
                              alt={room.room_type}
                              fallback={<VignetteHotel />}
                              className="transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between z-10">
                              <h3 className="text-white font-semibold text-sm">
                                {room.room_type}
                              </h3>
                              <span className="bg-teal-400/20 border border-teal-400/30 text-teal-300 text-xs px-2 py-0.5 rounded-full">
                                {Number(room.price_per_night).toLocaleString()}{" "}
                                XAF/nuit
                              </span>
                            </div>
                          </div>

                          <div className="p-4 space-y-4">
                            {/* Quick info */}
                            <div className="flex flex-wrap gap-3 text-xs text-white/50">
                              {room.number_of_beds && (
                                <span className="flex items-center gap-1">
                                  <FaBed className="text-teal-400/70" />
                                  {room.number_of_beds} lit
                                  {room.number_of_beds > 1 ? "s" : ""}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <MdPeople className="text-cyan-400/70" />
                                Max {room.max_guests} pers.
                              </span>
                            </div>

                            {/* Equipment */}
                            {room.room_equipments &&
                            room.room_equipments.length > 0 ? (
                              <div className="flex flex-wrap gap-1.5">
                                {room.room_equipments.map((eq) => (
                                  <span
                                    key={eq.id}
                                    className="flex items-center gap-1.5 bg-white/5 border border-white/10 text-white/50 text-xs px-2.5 py-1.5 rounded-lg hover:bg-white/8 transition-colors"
                                  >
                                    <EquipmentIcon
                                      name={eq.name}
                                      className="w-3.5 h-3.5 text-teal-400"
                                    />
                                    {eq.name}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <p className="text-white/20 text-xs italic">
                                Aucun équipement renseigné.
                              </p>
                            )}

                            <hr className="border-white/10" />

                            {/* Supplements */}
                            {hasSups && (
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <LuPackage className="w-3.5 h-3.5 text-teal-400/70" />
                                  <p className="text-white/50 text-xs uppercase tracking-wider">
                                    Suppléments
                                  </p>
                                  {selectedSups.length > 0 && (
                                    <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-teal-400/15 text-teal-400 border border-teal-400/25">
                                      {selectedSups.length} sélectionné
                                      {selectedSups.length > 1 ? "s" : ""}
                                    </span>
                                  )}
                                </div>
                                <div className="space-y-1.5">
                                  {room.room_supplements.map((sup) => {
                                    const isSelected = (
                                      selectedSupplements[room.room_id] ??
                                      new Set()
                                    ).has(sup.id);
                                    return (
                                      <button
                                        key={sup.id}
                                        type="button"
                                        onClick={() =>
                                          toggleSupplement(room.room_id, sup.id)
                                        }
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${isSelected ? "bg-teal-400/12 border border-teal-400/35" : "bg-white/4 border border-white/8 hover:bg-white/8 hover:border-white/15"}`}
                                      >
                                        <div
                                          className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all ${isSelected ? "bg-teal-400" : "border border-white/25"}`}
                                        >
                                          {isSelected && (
                                            <FaCheck className="w-2 h-2 text-black" />
                                          )}
                                        </div>
                                        <span className="text-base leading-none flex-shrink-0">
                                          {getSupplementEmoji(sup.label)}
                                        </span>
                                        <span
                                          className={`flex-1 text-xs font-medium ${isSelected ? "text-teal-300" : "text-white/60"}`}
                                        >
                                          {sup.label}
                                        </span>
                                        <span
                                          className={`text-xs flex-shrink-0 font-semibold ${isSelected ? "text-teal-400" : "text-white/40"}`}
                                        >
                                          {Number(sup.price) === 0
                                            ? "Gratuit"
                                            : `+${Number(sup.price).toLocaleString()} XAF`}
                                        </span>
                                      </button>
                                    );
                                  })}
                                </div>
                                {selectedSups.length > 0 && (
                                  <div className="bg-teal-400/6 border border-teal-400/15 rounded-xl px-3 py-2 space-y-1">
                                    {selectedSups.map((s) => (
                                      <div
                                        key={s.id}
                                        className="flex justify-between items-center text-xs"
                                      >
                                        <span className="text-teal-300/70 flex items-center gap-1.5">
                                          <span>
                                            {getSupplementEmoji(s.label)}
                                          </span>
                                          {s.label}
                                        </span>
                                        <span className="text-teal-400">
                                          {Number(s.price) === 0
                                            ? "Gratuit"
                                            : `+${Number(s.price).toLocaleString()}`}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}

                            {hasSups && <hr className="border-white/10" />}

                            {/* Price recap */}
                            {n > 0 && (
                              <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-xs space-y-1.5">
                                <div className="flex justify-between text-white/40">
                                  <span>
                                    {Number(
                                      room.price_per_night,
                                    ).toLocaleString()}{" "}
                                    × {n} nuit{n > 1 ? "s" : ""}
                                  </span>
                                  <span>
                                    {(
                                      n * Number(room.price_per_night)
                                    ).toLocaleString()}
                                  </span>
                                </div>
                                {selectedSups.map((s) => (
                                  <div
                                    key={s.id}
                                    className="flex justify-between text-teal-400/70"
                                  >
                                    <span className="flex items-center gap-1">
                                      {getSupplementEmoji(s.label)} {s.label}
                                    </span>
                                    <span>
                                      {Number(s.price) === 0
                                        ? "Gratuit"
                                        : `+${Number(s.price).toLocaleString()}`}
                                    </span>
                                  </div>
                                ))}
                                <hr className="border-white/10" />
                                <div className="flex justify-between text-white font-semibold">
                                  <span>Total</span>
                                  <span className="text-teal-400">
                                    {total.toLocaleString()} XAF
                                  </span>
                                </div>
                              </div>
                            )}

                            {/* Book button or auth banner */}
                            {authLoaded && !isLoggedIn ? (
                              <AuthRequiredBanner redirectUrl={currentUrl} />
                            ) : (
                              <button
                                onClick={() => handleBook(room)}
                                disabled={
                                  isBooked || bookingState === "loading"
                                }
                                className="w-full bg-teal-500 hover:bg-teal-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold py-2.5 rounded-xl transition-all text-sm"
                              >
                                {isBooking
                                  ? "Envoi..."
                                  : isBooked
                                    ? "✓ Réservé"
                                    : "Réserver maintenant"}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {totalRoomPages > 1 && (
                  <div className="flex justify-end mt-6">
                    <Pagination
                      showControls
                      page={roomPage}
                      total={totalRoomPages}
                      onChange={(p) => {
                        setRoomPage(p);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* ══ ABOUT TAB ══ */}
            {activeTab === "about" && (
              <div className="space-y-5">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <SectionHeader
                    label="Présentation"
                    title={`À propos de ${hotel.name}`}
                  />
                  {hotel.description ? (
                    <p className="text-white/60 leading-relaxed text-sm">
                      {hotel.description}
                    </p>
                  ) : (
                    <p className="text-white/30 text-sm italic">
                      Aucune description disponible pour cet hôtel.
                    </p>
                  )}
                </div>

                {activeGroups.length > 0 && (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
                    <SectionHeader
                      label="Profil"
                      title="Type d'établissement"
                    />
                    {activeGroups.map((group) => (
                      <div key={group.title}>
                        <p className="text-white/30 text-xs uppercase tracking-widest mb-3">
                          {group.title}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {group.items.map(({ key, emoji, label, color }) => (
                            <Chip
                              key={key}
                              size="sm"
                              className={`border ${color}`}
                            >
                              {emoji} {label}
                            </Chip>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <div className="flex items-start justify-between">
                    <SectionHeader
                      label="Confort"
                      title="Équipements & services"
                    />
                    {hotel.hotel_equipments.length > 8 && (
                      <button
                        onClick={onOpen}
                        className="text-xs font-medium text-teal-400 hover:text-teal-300 border border-teal-400/20 hover:border-teal-400/40 rounded-xl px-3 py-1.5 transition-all flex-shrink-0 mt-1"
                      >
                        Tout voir ({hotel.hotel_equipments.length})
                      </button>
                    )}
                  </div>
                  {hotel.hotel_equipments.length === 0 ? (
                    <p className="text-white/30 text-sm italic">
                      Aucun équipement renseigné pour le moment.
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {hotel.hotel_equipments
                        .slice(0, 8)
                        .map(({ id, name, description }) => (
                          <div
                            key={id}
                            title={description ?? undefined}
                            className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3 hover:bg-white/8 hover:border-teal-400/20 transition-all"
                          >
                            <div className="bg-teal-400/10 p-2.5 rounded-xl flex-shrink-0">
                              <EquipmentIcon
                                name={name}
                                className="text-teal-400 w-4 h-4"
                              />
                            </div>
                            <span className="text-white/60 text-sm leading-tight">
                              {name}
                            </span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

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

            {/* ══ REVIEWS TAB ══ */}
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
                      className="space-y-3 h-[360px] pr-1"
                      size={80}
                    >
                      {reviews.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-white/20 gap-2">
                          <FaStar className="w-10 h-10 opacity-20" />
                          <p className="text-sm">
                            Soyez le premier à laisser un avis !
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

          {/* ── Sticky sidebar ── */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-teal-500/20 to-transparent border-b border-white/10 p-5">
                <h3 className="text-white font-semibold text-lg">
                  Réserver une chambre
                </h3>
                <p className="text-white/40 text-xs mt-0.5">
                  Confirmation agence requise
                </p>
              </div>
              <div className="p-5 space-y-4">
                {/* Price display */}
                {hotel.hotel_rooms.length > 0 && (
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-white/30 text-xs uppercase tracking-wider">
                        À partir de
                      </p>
                      <p className="font-tourney text-3xl font-bold text-teal-400 leading-tight">
                        {Math.min(
                          ...hotel.hotel_rooms.map((r) =>
                            Number(r.price_per_night),
                          ),
                        ).toLocaleString()}
                        <span className="text-sm font-normal text-white/30 ml-1">
                          XAF/nuit
                        </span>
                      </p>
                    </div>
                    {nights > 0 && (
                      <div className="text-right">
                        <p className="text-white/30 text-xs">
                          {nights} nuit{nights > 1 ? "s" : ""}
                        </p>
                        <p className="text-white/50 text-sm">sélectionnées</p>
                      </div>
                    )}
                  </div>
                )}

                <hr className="border-white/10" />

                {/* Date pickers */}
                <div className="space-y-3">
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
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-teal-400/50 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-white/40 text-xs uppercase tracking-wider block mb-1.5">
                      Voyageurs
                    </label>
                    <Select
                      value={guestsFilter}
                      onValueChange={setGuestsFilter}
                    >
                      <SelectTrigger className="w-full bg-white/10 border-white/15 text-white">
                        <SelectValue placeholder="Voyageurs" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Voyageurs</SelectLabel>
                          <SelectItem value="all">Tous</SelectItem>
                          {[1, 2, 3, 4, 5, 6].map((n) => (
                            <SelectItem key={n} value={String(n)}>
                              {n} voyageur{n > 1 ? "s" : ""}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Availability summary */}
                <div className="bg-teal-500/10 border border-teal-500/20 rounded-xl p-3 text-center">
                  <p className="text-teal-400/60 text-xs uppercase tracking-wider mb-0.5">
                    Chambres disponibles
                  </p>
                  <p className="text-teal-300 font-bold text-2xl font-tourney">
                    {filteredRooms.length}
                  </p>
                  {nights > 0 && (
                    <p className="text-teal-400/50 text-xs mt-0.5">
                      pour {nights} nuit{nights > 1 ? "s" : ""}
                    </p>
                  )}
                </div>

                {/* CTA */}
                {authLoaded && !isLoggedIn ? (
                  <AuthRequiredBanner redirectUrl={currentUrl} />
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => setActiveTab("rooms")}
                      className="w-full bg-teal-500 hover:bg-teal-400 text-black font-bold py-3 rounded-xl transition-all text-sm tracking-wide"
                    >
                      Voir les chambres disponibles
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

                {/* Hotel quick info */}
                {hotel.star_rating && (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                    <p className="text-white/30 text-xs uppercase tracking-wider mb-2">
                      Classement
                    </p>
                    <div className="flex gap-1">
                      {Array.from({ length: hotel.star_rating }).map((_, i) => (
                        <FaStar key={i} className="text-teal-400 w-4 h-4" />
                      ))}
                    </div>
                    {reviews.length > 0 && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="font-tourney text-xl font-bold text-teal-400">
                          {avgRating}
                        </span>
                        <span className="text-white/30 text-xs">
                          / 5 · {reviews.length} avis
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══ MODAL all equipments ══ */}
      <Modal isOpen={isOpen} size="4xl" onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-white bg-(--bg-legebluefort) border-b border-white/[0.08] text-sm font-semibold">
                Tous les équipements ({hotel.hotel_equipments.length})
              </ModalHeader>
              <ModalBody className="bg-(--bg-legebluefort) p-4">
                <ScrollShadow className="h-[400px] pr-2" size={80}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {hotel.hotel_equipments.map(({ id, name, description }) => (
                      <div
                        key={id}
                        className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-4"
                      >
                        <div className="bg-teal-400/10 p-2.5 rounded-xl flex-shrink-0">
                          <EquipmentIcon
                            name={name}
                            className="text-teal-400 w-5 h-5"
                          />
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">
                            {name}
                          </p>
                          {description && (
                            <p className="text-white/40 text-xs mt-0.5">
                              {description}
                            </p>
                          )}
                        </div>
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
