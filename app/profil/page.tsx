"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Image } from "@heroui/image";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { HiOutlineHandRaised } from "react-icons/hi2";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/client";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useAvatarUpload } from "@/hooks/use-avatar-upload";
import AvatarUpload from "@/components/file-upload/avatar-upload";

import {
  MdEdit,
  MdFavorite,
  MdLocationOn,
  MdPhone,
  MdEmail,
  MdPerson,
  MdSecurity,
  MdVerified,
  MdMenu,
  MdClose,
} from "react-icons/md";
import { IoTicketSharp } from "react-icons/io5";
import { BsBuildingFill } from "react-icons/bs";
import {
  FaUserShield,
  FaUser,
  FaShoppingCart,
  FaBed,
  FaCar,
  FaLock,
  FaKey,
} from "react-icons/fa";
import { IoStorefront } from "react-icons/io5";
import { HiOutlineCalendar } from "react-icons/hi";

const supabase = createClient();

interface Stats {
  cartItems: number;
  hotelBookings: number;
  apartmentBookings: number;
  carBookings: number;
  favoriteTickets: number;
  favoriteAgencies: number;
}

interface HotelBooking {
  booking_id: string;
  check_in: string;
  check_out: string;
  guests: number;
  total_price: number;
  status: string;
  hotels: { name: string; city: string | null } | null;
}

interface ApartmentBooking {
  booking_id: string;
  check_in: string;
  check_out: string;
  guests: number;
  total_price: number;
  status: string;
  apartments: { title: string; city: string | null } | null;
}

interface CarBooking {
  booking_id: string;
  start_date: string;
  end_date: string;
  days: number;
  total_price: number;
  status: string;
  car_rentals: { brand: string; model: string } | null;
}

const getRoleDetails = (role: string) => {
  switch (role) {
    case "admin":
      return {
        label: "Administrateur",
        icon: FaUserShield,
        color: "danger" as const,
        accent: "text-red-400",
        bg: "bg-red-500/15 border-red-500/25",
      };
    case "seller":
      return {
        label: "Vendeur",
        icon: IoStorefront,
        color: "primary" as const,
        accent: "text-blue-400",
        bg: "bg-blue-500/15 border-blue-500/25",
      };
    case "buyer":
      return {
        label: "Client",
        icon: FaShoppingCart,
        color: "success" as const,
        accent: "text-emerald-400",
        bg: "bg-emerald-500/15 border-emerald-500/25",
      };
    default:
      return {
        label: "Invité",
        icon: FaUser,
        color: "default" as const,
        accent: "text-white/50",
        bg: "bg-white/10 border-white/15",
      };
  }
};

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const fmtPrice = (n: number) => Number(n).toLocaleString("fr-FR") + " FCFA";

export default function ProfilePage() {
  const router = useRouter();
  const { profile, loading, setProfile } = useUserProfile();
  const { uploadAvatar } = useAvatarUpload();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [stats, setStats] = useState<Stats>({
    cartItems: 0,
    hotelBookings: 0,
    apartmentBookings: 0,
    carBookings: 0,
    favoriteTickets: 0,
    favoriteAgencies: 0,
  });
  const [hotelBookings, setHotelBookings] = useState<HotelBooking[]>([]);
  const [apartmentBookings, setApartmentBookings] = useState<
    ApartmentBooking[]
  >([]);
  const [carBookings, setCarBookings] = useState<CarBooking[]>([]);
  const [activeTab, setActiveTab] = useState<"hotels" | "apartments" | "cars">(
    "hotels",
  );
  const [activeSection, setActiveSection] = useState<
    "overview" | "bookings" | "security"
  >("overview");
  const [dataLoading, setDataLoading] = useState(true);
  // Mobile sidebar toggle
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    address: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [isDeactivating, setIsDeactivating] = useState(false);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        phone_number: profile.phone_number || "",
        address: profile.address || "",
      });
    }
  }, [profile]);

  useEffect(() => {
    if (!profile?.user_id) return;
    if (hasFetched.current) return;
    hasFetched.current = true;

    const uid = profile.user_id;
    const fetchAll = async () => {
      setDataLoading(true);
      const [
        { count: cartCount },
        { count: hotelCount },
        { count: aptCount },
        { count: carCount },
        { count: favTickets },
        { count: favAgencies },
        { data: hBookings },
        { data: aBookings },
        { data: cBookings },
      ] = await Promise.all([
        supabase
          .from("cart")
          .select("cart_id", { count: "exact", head: true })
          .eq("user_id", uid),
        supabase
          .from("hotel_bookings")
          .select("booking_id", { count: "exact", head: true })
          .eq("user_id", uid),
        supabase
          .from("apartment_bookings")
          .select("booking_id", { count: "exact", head: true })
          .eq("user_id", uid),
        supabase
          .from("car_bookings")
          .select("booking_id", { count: "exact", head: true })
          .eq("user_id", uid),
        supabase
          .from("favorites")
          .select("favorite_id", { count: "exact", head: true })
          .eq("user_id", uid)
          .not("ticket_id", "is", null),
        supabase
          .from("favorites")
          .select("favorite_id", { count: "exact", head: true })
          .eq("user_id", uid)
          .not("agency_user_id", "is", null),
        supabase
          .from("hotel_bookings")
          .select(
            "booking_id, check_in, check_out, guests, total_price, status, hotels(name, city)",
          )
          .eq("user_id", uid)
          .order("created_at", { ascending: false })
          .limit(5),
        supabase
          .from("apartment_bookings")
          .select(
            "booking_id, check_in, check_out, guests, total_price, status, apartments(title, city)",
          )
          .eq("user_id", uid)
          .order("created_at", { ascending: false })
          .limit(5),
        supabase
          .from("car_bookings")
          .select(
            "booking_id, start_date, end_date, days, total_price, status, car_rentals(brand, model)",
          )
          .eq("user_id", uid)
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

      setStats({
        cartItems: cartCount ?? 0,
        hotelBookings: hotelCount ?? 0,
        apartmentBookings: aptCount ?? 0,
        carBookings: carCount ?? 0,
        favoriteTickets: favTickets ?? 0,
        favoriteAgencies: favAgencies ?? 0,
      });
      setHotelBookings((hBookings as unknown as HotelBooking[]) ?? []);
      setApartmentBookings((aBookings as unknown as ApartmentBooking[]) ?? []);
      setCarBookings((cBookings as unknown as CarBooking[]) ?? []);
      setDataLoading(false);
    };
    fetchAll();
  }, [profile?.user_id]);

  const handleSave = async () => {
    if (!profile?.user_id) return;
    setSaveError("");
    setIsSaving(true);
    let final_picture = profile.profile_picture;
    if (selectedFile) {
      final_picture = await uploadAvatar(
        selectedFile,
        profile.user_id,
        profile.profile_picture,
      );
    }
    const { error } = await supabase
      .from("users")
      .update({
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        phone_number: formData.phone_number.trim() || null,
        address: formData.address.trim() || null,
        profile_picture: final_picture,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", profile.user_id);
    setIsSaving(false);
    if (error) {
      setSaveError(error.message);
      return;
    }
    setProfile((prev: any) => ({
      ...prev,
      ...formData,
      profile_picture: final_picture,
    }));
    setSelectedFile(null);
    onClose();
  };

  const handleDeactivate = async () => {
    if (!profile?.user_id) return;
    if (!confirm("Êtes-vous sûr de vouloir désactiver votre compte ?")) return;
    setIsDeactivating(true);
    await supabase
      .from("users")
      .update({ status: "inactive" })
      .eq("user_id", profile.user_id);
    await supabase.auth.signOut();
    router.push("/");
  };

  const roleDetails = getRoleDetails(profile?.role || "default");
  const RoleIcon = roleDetails.icon;

  // Handle section change — also close mobile sidebar
  const handleSectionChange = (
    section: "overview" | "bookings" | "security",
  ) => {
    setActiveSection(section);
    setSidebarOpen(false);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-(--bg-legebluefort) flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 border-4 border-white/10 border-t-(--bg-legebluecalme) rounded-full animate-spin" />
          <p className="text-white/40 text-sm tracking-widest uppercase">
            Chargement...
          </p>
        </div>
      </div>
    );

  if (!profile)
    return (
      <div className="min-h-screen bg-(--bg-legebluefort) flex flex-col items-center justify-center gap-4">
        <p className="text-white/50 text-xl">Vous n&apos;êtes pas connecté.</p>
        <Button
          onClick={() => router.push("/login")}
          className="bg-(--bg-legebluecalme) text-white"
        >
          Se connecter
        </Button>
      </div>
    );

  const navItems = [
    { key: "overview", label: "Vue d'ensemble", icon: MdPerson },
    { key: "bookings", label: "Réservations", icon: HiOutlineCalendar },
    { key: "security", label: "Sécurité", icon: MdSecurity },
  ] as const;

  return (
    <div className="min-h-screen bg-(--bg-legebluefort) pt-24 sm:pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50">
          {/* ── Barre titre ── */}
          <div className="bg-white/5 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center gap-3">
            {/* Bouton hamburger mobile */}
            <button
              className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg bg-white/8 border border-white/10 text-white/60 hover:text-white transition-all flex-shrink-0"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? (
                <MdClose className="w-4 h-4" />
              ) : (
                <MdMenu className="w-4 h-4" />
              )}
            </button>

            <div className="flex-1 text-center">
              <span className="text-white/40 text-xs tracking-widest uppercase font-medium truncate">
                Mon Profil — {profile.first_name} {profile.last_name}
              </span>
            </div>

            <button
              onClick={onOpen}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white/10 hover:bg-white/15 border border-white/15 text-white/70 hover:text-white transition-all flex-shrink-0"
            >
              <MdEdit className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Modifier</span>
            </button>
          </div>

          <div className="flex relative min-h-[80vh]">
            {/* ── Overlay mobile pour sidebar ── */}
            {sidebarOpen && (
              <div
                className="lg:hidden fixed inset-0 z-20 bg-black/60 backdrop-blur-sm"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            {/* ── Sidebar ── */}
            <aside
              className={`
                fixed lg:static top-16 left-0 h-full z-30
                w-72 lg:w-64 flex-shrink-0
                bg-(--bg-legebluefort) lg:bg-white/3
                backdrop-blur-xl border-r border-white/8
                flex flex-col
                transition-transform duration-300 ease-in-out
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                lg:translate-x-0
              `}
              style={{ minHeight: "100%" }}
            >
              {/* Avatar + identité */}
              <div className="p-5 border-b border-white/8">
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="relative">
                    <div
                      className="bouleprofile w-18 h-18 rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl"
                      style={{ width: 72, height: 72 }}
                    >
                      <Image
                        alt={`${profile.first_name} ${profile.last_name}`}
                        src={
                          profile.profile_picture ||
                          "https://res.cloudinary.com/dtrpkegss/image/upload/v1768931853/close-up-portrait-dark-skinned-adult-man-with-thick-bristle-smiles-toothy-wears-big-optical-glasses-striped-jumper-glad-meet-friend_1_11zon_ia0jwk.webp"
                        }
                        className="object-cover w-full h-full"
                        style={{
                          display: "block",
                          width: "100%",
                          height: "100%",
                        }}
                      />
                    </div>
                    <div
                      className={`absolute z-30 -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-(--bg-legebluefort) ${profile.status === "active" ? "bg-emerald-500" : "bg-red-500"}`}
                    />
                  </div>
                  <div>
                    <h2 className="text-white font-semibold text-sm leading-tight">
                      {profile.first_name} {profile.last_name}
                    </h2>
                    <span
                      className={`inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${roleDetails.bg} ${roleDetails.accent}`}
                    >
                      <RoleIcon className="w-3 h-3" />
                      {roleDetails.label}
                    </span>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2.5 text-white/40 text-xs px-1">
                    <MdEmail className="w-3.5 h-3.5 flex-shrink-0 text-(--bg-legebluecalme)" />
                    <span className="truncate">{profile.email}</span>
                  </div>
                  {profile.phone_number && (
                    <div className="flex items-center gap-2.5 text-white/40 text-xs px-1">
                      <MdPhone className="w-3.5 h-3.5 flex-shrink-0 text-(--bg-legebluecalme)" />
                      <span>{profile.phone_number}</span>
                    </div>
                  )}
                  {profile.address && (
                    <div className="flex items-center gap-2.5 text-white/40 text-xs px-1">
                      <MdLocationOn className="w-3.5 h-3.5 flex-shrink-0 text-(--bg-legebluecalme)" />
                      <span className="truncate">{profile.address}</span>
                    </div>
                  )}
                  {profile.created_at && (
                    <div className="flex items-center gap-2.5 text-white/30 text-xs px-1">
                      <HiOutlineCalendar className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>Inscrit le {fmtDate(profile.created_at)}</span>
                    </div>
                  )}
                </div>
              </div>

              <nav className="p-3 flex-1">
                <p className="text-white/25 text-xs uppercase tracking-widest px-3 mb-2 mt-1">
                  Navigation
                </p>
                {navItems.map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => handleSectionChange(key)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-0.5 ${
                      activeSection === key
                        ? "bg-(--bg-legebluecalme)/20 text-white border border-(--bg-legebluecalme)/30"
                        : "text-white/50 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 ${activeSection === key ? "text-(--bg-legebluecalme)" : ""}`}
                    />
                    {label}
                  </button>
                ))}
              </nav>

              <div className="hidden lg:block p-4 border-t border-white/8">
                <p className="text-white/25 text-xs uppercase tracking-widest mb-3">
                  Résumé
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    {
                      label: "Hôtels",
                      value: stats.hotelBookings,
                      color: "text-blue-400",
                    },
                    {
                      label: "Apparts",
                      value: stats.apartmentBookings,
                      color: "text-teal-400",
                    },
                    {
                      label: "Voitures",
                      value: stats.carBookings,
                      color: "text-amber-400",
                    },
                    {
                      label: "Favoris",
                      value: stats.favoriteTickets + stats.favoriteAgencies,
                      color: "text-pink-400",
                    },
                  ].map(({ label, value, color }) => (
                    <div
                      key={label}
                      className="bg-white/5 rounded-xl p-2.5 text-center border border-white/8"
                    >
                      <p className={`text-lg font-bold font-tourney ${color}`}>
                        {dataLoading ? "—" : value}
                      </p>
                      <p className="text-white/30 text-xs mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            {/* ── Contenu principal ── */}
            <main className="flex-1 overflow-auto bg-(--bg-legebluefort)/60 backdrop-blur-sm min-w-0">
              {/* ══ VUE D'ENSEMBLE ══ */}
              {activeSection === "overview" && (
                <div className="p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6">
                  <div>
                    <h1 className="text-white font-semibold text-lg sm:text-xl">
                      Vue d&apos;ensemble
                    </h1>
                    <p className="flex items-center gap-2 text-white/40 text-sm mt-0.5">
                      Bienvenue, {profile.first_name} <HiOutlineHandRaised />
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {[
                      {
                        label: "Réservations hôtels",
                        value: stats.hotelBookings,
                        icon: FaBed,
                        color: "text-blue-300",
                        bg: "from-blue-500/15 to-blue-600/8",
                        border: "border-blue-500/20",
                      },
                      {
                        label: "Réservations apparts",
                        value: stats.apartmentBookings,
                        icon: BsBuildingFill,
                        color: "text-teal-300",
                        bg: "from-teal-500/15 to-teal-600/8",
                        border: "border-teal-500/20",
                      },
                      {
                        label: "Locations voitures",
                        value: stats.carBookings,
                        icon: FaCar,
                        color: "text-amber-300",
                        bg: "from-amber-500/15 to-amber-600/8",
                        border: "border-amber-500/20",
                      },
                      {
                        label: "Tickets favoris",
                        value: stats.favoriteTickets,
                        icon: IoTicketSharp,
                        color: "text-yellow-300",
                        bg: "from-yellow-500/15 to-yellow-600/8",
                        border: "border-yellow-500/20",
                      },
                      {
                        label: "Agences favorites",
                        value: stats.favoriteAgencies,
                        icon: BsBuildingFill,
                        color: "text-pink-300",
                        bg: "from-pink-500/15 to-pink-600/8",
                        border: "border-pink-500/20",
                      },
                      {
                        label: "Paniers en cours",
                        value: stats.cartItems,
                        icon: FaShoppingCart,
                        color: "text-purple-300",
                        bg: "from-purple-500/15 to-purple-600/8",
                        border: "border-purple-500/20",
                      },
                    ].map(({ label, value, icon: Icon, color, bg, border }) => (
                      <div
                        key={label}
                        className={`bg-gradient-to-br ${bg} border ${border} rounded-xl sm:rounded-2xl p-3 sm:p-5 flex items-center gap-3 sm:gap-4 hover:scale-[1.02] transition-transform`}
                      >
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                          <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${color}`} />
                        </div>
                        <div>
                          <p
                            className={`text-2xl sm:text-3xl font-bold font-tourney ${color}`}
                          >
                            {dataLoading ? "—" : value}
                          </p>
                          <p className="text-white/40 text-[10px] sm:text-xs mt-0.5 leading-tight">
                            {label}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Infos profil */}
                  <div className="bg-white/4 border border-white/8 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4 sm:mb-5">
                      <h3 className="text-white font-semibold text-sm sm:text-base">
                        Informations personnelles
                      </h3>
                      <button
                        onClick={onOpen}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-white/15 text-white/50 hover:text-white hover:border-white/30 transition-all"
                      >
                        <MdEdit className="w-3.5 h-3.5" /> Modifier
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {[
                        {
                          label: "Prénom",
                          value: profile.first_name,
                          icon: MdPerson,
                        },
                        {
                          label: "Nom",
                          value: profile.last_name,
                          icon: MdPerson,
                        },
                        { label: "Email", value: profile.email, icon: MdEmail },
                        {
                          label: "Téléphone",
                          value: profile.phone_number || "Non renseigné",
                          icon: MdPhone,
                        },
                        {
                          label: "Adresse",
                          value: profile.address || "Non renseignée",
                          icon: MdLocationOn,
                        },
                        {
                          label: "Rôle",
                          value: roleDetails.label,
                          icon: FaUserShield,
                        },
                      ].map(({ label, value, icon: Icon }) => (
                        <div
                          key={label}
                          className="flex items-start gap-3 bg-white/4 rounded-xl px-3 sm:px-4 py-3 sm:py-3.5 border border-white/6"
                        >
                          <Icon className="w-4 h-4 text-(--bg-legebluecalme) flex-shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            <p className="text-white/35 text-xs uppercase tracking-wider">
                              {label}
                            </p>
                            <p className="text-white text-sm font-medium mt-0.5 truncate">
                              {value}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ══ RÉSERVATIONS ══ */}
              {activeSection === "bookings" && (
                <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-5">
                  <div>
                    <h1 className="text-white font-semibold text-lg sm:text-xl">
                      Mes réservations
                    </h1>
                    <p className="text-white/40 text-sm mt-0.5">
                      Historique de toutes vos réservations
                    </p>
                  </div>

                  {/* Tabs — scrollable on mobile */}
                  <div className="flex gap-1 sm:gap-1.5 bg-white/5 p-1 sm:p-1.5 rounded-xl w-full sm:w-fit border border-white/8 overflow-x-auto">
                    {(
                      [
                        {
                          key: "hotels",
                          label: "Hôtels",
                          count: stats.hotelBookings,
                          icon: FaBed,
                          accent: "text-blue-400",
                        },
                        {
                          key: "apartments",
                          label: "Apparts",
                          count: stats.apartmentBookings,
                          icon: BsBuildingFill,
                          accent: "text-teal-400",
                        },
                        {
                          key: "cars",
                          label: "Voitures",
                          count: stats.carBookings,
                          icon: FaCar,
                          accent: "text-amber-400",
                        },
                      ] as const
                    ).map(({ key, label, count, icon: Icon, accent }) => (
                      <button
                        key={key}
                        onClick={() => setActiveTab(key)}
                        className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex-shrink-0 ${
                          activeTab === key
                            ? "bg-(--bg-legebluecalme) text-white shadow-lg"
                            : "text-white/50 hover:text-white"
                        }`}
                      >
                        <Icon
                          className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${activeTab === key ? "text-white" : accent}`}
                        />
                        {label}
                        <span
                          className={`px-1.5 py-0.5 rounded-full text-xs ${activeTab === key ? "bg-white/20" : "bg-white/10"}`}
                        >
                          {count}
                        </span>
                      </button>
                    ))}
                  </div>

                  {dataLoading ? (
                    <div className="flex justify-center py-16">
                      <div className="w-8 h-8 border-2 border-white/10 border-t-white/60 rounded-full animate-spin" />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {activeTab === "hotels" &&
                        (hotelBookings.length === 0 ? (
                          <EmptyState label="réservation d'hôtel" />
                        ) : (
                          hotelBookings.map((b) => (
                            <BookingCard
                              key={b.booking_id}
                              icon={FaBed}
                              iconBg="bg-blue-500/15 border-blue-500/20"
                              iconColor="text-blue-400"
                              title={b.hotels?.name ?? "—"}
                              subtitle={`${b.hotels?.city ?? ""} · ${b.guests} voyageur${b.guests > 1 ? "s" : ""}`}
                              dates={`${fmtDate(b.check_in)} → ${fmtDate(b.check_out)}`}
                              price={fmtPrice(b.total_price)}
                              status={b.status}
                            />
                          ))
                        ))}
                      {activeTab === "apartments" &&
                        (apartmentBookings.length === 0 ? (
                          <EmptyState label="réservation d'appartement" />
                        ) : (
                          apartmentBookings.map((b) => (
                            <BookingCard
                              key={b.booking_id}
                              icon={BsBuildingFill}
                              iconBg="bg-teal-500/15 border-teal-500/20"
                              iconColor="text-teal-400"
                              title={b.apartments?.title ?? "—"}
                              subtitle={`${b.apartments?.city ?? ""} · ${b.guests} voyageur${b.guests > 1 ? "s" : ""}`}
                              dates={`${fmtDate(b.check_in)} → ${fmtDate(b.check_out)}`}
                              price={fmtPrice(b.total_price)}
                              status={b.status}
                            />
                          ))
                        ))}
                      {activeTab === "cars" &&
                        (carBookings.length === 0 ? (
                          <EmptyState label="location de voiture" />
                        ) : (
                          carBookings.map((b) => (
                            <BookingCard
                              key={b.booking_id}
                              icon={FaCar}
                              iconBg="bg-amber-500/15 border-amber-500/20"
                              iconColor="text-amber-400"
                              title={
                                b.car_rentals
                                  ? `${b.car_rentals.brand} ${b.car_rentals.model}`
                                  : "—"
                              }
                              subtitle={`${b.days} jour${b.days > 1 ? "s" : ""}`}
                              dates={`${fmtDate(b.start_date)} → ${fmtDate(b.end_date)}`}
                              price={fmtPrice(b.total_price)}
                              status={b.status}
                            />
                          ))
                        ))}
                    </div>
                  )}
                </div>
              )}

              {/* ══ SÉCURITÉ ══ */}
              {activeSection === "security" && (
                <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-5">
                  <div>
                    <h1 className="text-white font-semibold text-lg sm:text-xl">
                      Sécurité & compte
                    </h1>
                    <p className="text-white/40 text-sm mt-0.5">
                      Gérez la sécurité de votre compte
                    </p>
                  </div>

                  <div className="bg-white/4 border border-white/8 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <FaKey className="w-4 h-4 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-semibold mb-1 text-sm sm:text-base">
                          Changer le mot de passe
                        </h3>
                        <p className="text-white/40 text-xs sm:text-sm mb-4 leading-relaxed">
                          Un lien de réinitialisation sera envoyé à votre
                          adresse email{" "}
                          <span className="text-white/60">{profile.email}</span>
                          .
                        </p>
                        <button
                          onClick={async () => {
                            await supabase.auth.resetPasswordForEmail(
                              profile.email,
                            );
                            alert("Email de réinitialisation envoyé !");
                          }}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-white/8 hover:bg-white/12 border border-white/15 hover:border-white/25 text-white transition-all"
                        >
                          <FaKey className="w-3.5 h-3.5" />
                          Envoyer le lien de réinitialisation
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-500/6 border border-red-500/20 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <h3 className="text-red-400 font-semibold text-xs uppercase tracking-wider">
                        Zone dangereuse
                      </h3>
                    </div>
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-red-500/15 border border-red-500/25 flex items-center justify-center flex-shrink-0">
                        <FaLock className="w-4 h-4 text-red-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-semibold mb-1 text-sm sm:text-base">
                          Désactiver le compte
                        </h4>
                        <p className="text-white/40 text-xs sm:text-sm mb-4 leading-relaxed">
                          Cette action est temporaire. Votre compte sera
                          suspendu et vous serez déconnecté.
                        </p>
                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 mb-4 flex items-center gap-2">
                          <span className="text-amber-400 text-xs">⚠</span>
                          <p className="text-amber-300 text-xs">
                            Cette action est temporaire mais impactante sur
                            votre accès.
                          </p>
                        </div>
                        <button
                          onClick={handleDeactivate}
                          disabled={isDeactivating}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 hover:border-red-500/50 text-red-400 hover:text-red-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isDeactivating ? (
                            <span className="w-4 h-4 border border-red-400/50 border-t-red-400 rounded-full animate-spin" />
                          ) : (
                            <FaLock className="w-3.5 h-3.5" />
                          )}
                          Désactiver mon compte
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>

      {/* ══ MODAL ÉDITION ══ */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg" backdrop="blur">
        <ModalContent className="bg-(--bg-legebluefort) border border-white/10 mx-2">
          {() => (
            <>
              <ModalHeader className="text-white font-semibold border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-(--bg-legebluecalme)/20 border border-(--bg-legebluecalme)/30 flex items-center justify-center">
                    <MdEdit className="text-(--bg-legebluecalme) w-4 h-4" />
                  </div>
                  Modifier le profil
                </div>
              </ModalHeader>
              <ModalBody className="space-y-4 py-5">
                <div className="flex justify-center">
                  <AvatarUpload
                    urlprofile={profile.profile_picture ?? undefined}
                    onFileChange={(file: File | null) => setSelectedFile(file)}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="grid gap-1.5">
                    <Label
                      htmlFor="edit-first"
                      className="text-white/50 text-xs uppercase tracking-wider"
                    >
                      Prénom
                    </Label>
                    <Input
                      id="edit-first"
                      value={formData.first_name}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          first_name: e.target.value,
                        }))
                      }
                      placeholder="Jean"
                      className="bg-white/5 border-white/15 text-white placeholder:text-white/20 focus:border-(--bg-legebluecalme)/50"
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label
                      htmlFor="edit-last"
                      className="text-white/50 text-xs uppercase tracking-wider"
                    >
                      Nom
                    </Label>
                    <Input
                      id="edit-last"
                      value={formData.last_name}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          last_name: e.target.value,
                        }))
                      }
                      placeholder="Dupont"
                      className="bg-white/5 border-white/15 text-white placeholder:text-white/20 focus:border-(--bg-legebluecalme)/50"
                    />
                  </div>
                </div>
                <div className="grid gap-1.5">
                  <Label
                    htmlFor="edit-phone"
                    className="text-white/50 text-xs uppercase tracking-wider"
                  >
                    Téléphone
                  </Label>
                  <Input
                    id="edit-phone"
                    type="tel"
                    value={formData.phone_number}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        phone_number: e.target.value,
                      }))
                    }
                    placeholder="+242 06 000 0000"
                    className="bg-white/5 border-white/15 text-white placeholder:text-white/20 focus:border-(--bg-legebluecalme)/50"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label
                    htmlFor="edit-address"
                    className="text-white/50 text-xs uppercase tracking-wider"
                  >
                    Adresse
                  </Label>
                  <Input
                    id="edit-address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, address: e.target.value }))
                    }
                    placeholder="Brazzaville, Congo"
                    className="bg-white/5 border-white/15 text-white placeholder:text-white/20 focus:border-(--bg-legebluecalme)/50"
                  />
                </div>
                {saveError && (
                  <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/25 rounded-xl px-3 py-2.5 text-xs text-red-400">
                    <span>⚠</span> {saveError}
                  </div>
                )}
              </ModalBody>
              <ModalFooter className="border-t border-white/10 pt-4 gap-2">
                <Button
                  variant="flat"
                  onPress={onClose}
                  disabled={isSaving}
                  className="text-white/50 hover:text-white border border-white/10"
                >
                  Annuler
                </Button>
                <Button
                  className="bg-(--bg-legebluecalme) text-white font-semibold"
                  isLoading={isSaving}
                  onPress={handleSave}
                >
                  Enregistrer
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

function BookingCard({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  subtitle,
  dates,
  price,
  status,
}: {
  icon: any;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
  dates: string;
  price: string;
  status: string;
}) {
  const dotColor =
    status === "confirmed"
      ? "bg-emerald-400"
      : status === "cancelled"
        ? "bg-red-400"
        : "bg-amber-400";
  const statusLabel =
    status === "confirmed"
      ? "Confirmé"
      : status === "cancelled"
        ? "Annulé"
        : "En attente";
  const statusText =
    status === "confirmed"
      ? "text-emerald-400"
      : status === "cancelled"
        ? "text-red-400"
        : "text-amber-400";
  const statusBg =
    status === "confirmed"
      ? "bg-emerald-500/10 border-emerald-500/20"
      : status === "cancelled"
        ? "bg-red-500/10 border-red-500/20"
        : "bg-amber-500/10 border-amber-500/20";

  return (
    <div className="flex items-start sm:items-center justify-between bg-white/4 border border-white/8 rounded-xl sm:rounded-2xl p-3 sm:p-4 gap-3 hover:bg-white/6 hover:border-white/12 transition-all flex-col sm:flex-row">
      <div className="flex items-center gap-3 sm:gap-4 min-w-0 w-full sm:w-auto">
        <div
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${iconBg} border flex items-center justify-center flex-shrink-0`}
        >
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-white font-semibold text-sm truncate">{title}</p>
          <p className="text-white/40 text-xs mt-0.5">{subtitle}</p>
          <p className="text-white/30 text-xs">{dates}</p>
        </div>
      </div>
      <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-1.5 flex-shrink-0 w-full sm:w-auto justify-between sm:justify-end">
        <div
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium ${statusBg} ${statusText}`}
        >
          <div className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
          {statusLabel}
        </div>
        <p className="text-white font-bold text-sm">{price}</p>
      </div>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="text-center py-12 sm:py-16 text-white/20">
      <HiOutlineCalendar className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 opacity-20" />
      <p className="text-sm">Aucune {label} pour le moment.</p>
    </div>
  );
}
