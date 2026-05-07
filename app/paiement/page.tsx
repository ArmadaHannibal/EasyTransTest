"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

// ── Types (reprend les types du panier) ───────────────────────────────────────
type ItemKind = "ticket" | "car" | "hotel" | "apartment";

interface CartItem {
    kind: ItemKind;
    id: string;
    quantity: number;
    label: string;
    sublabel: string;
    price: number;
    agencyId: string;
    agencyName: string;
    raw: any;
}

type PaymentMethod = "mtn" | "airtel";

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmtPrice = (n: number) =>
    new Intl.NumberFormat("fr-FR").format(Math.round(n)) + " FCFA";

const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

const KIND_CONFIG: Record<
    ItemKind,
    { label: string; labelPlural: string; color: string; bg: string; unit: string; icon: React.ReactNode }
> = {
    ticket: {
        label: "Ticket bus",
        labelPlural: "Tickets bus",
        color: "#185FA5",
        bg: "#E6F1FB",
        unit: "billet",
        icon: (
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        ),
    },
    car: {
        label: "Location voiture",
        labelPlural: "Locations voiture",
        color: "#3B6D11",
        bg: "#EAF3DE",
        unit: "jour",
        icon: (
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 6H5l-2 6h18l-2-6h-6z" />
            </svg>
        ),
    },
    hotel: {
        label: "Hôtel",
        labelPlural: "Hôtels",
        color: "#854F0B",
        bg: "#FAEEDA",
        unit: "nuit",
        icon: (
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0h2M5 21H3M9 7h1m-1 4h1m4-4h1m-1 4h1" />
            </svg>
        ),
    },
    apartment: {
        label: "Appartement",
        labelPlural: "Appartements",
        color: "#534AB7",
        bg: "#EEEDFE",
        unit: "nuit",
        icon: (
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        ),
    },
};

// ── Supabase actions (même logique que le panier) ─────────────────────────────
async function updateQuantity(item: CartItem, newQty: number): Promise<void> {
    if (newQty < 1) return;
    if (item.kind === "ticket") {
        await supabase.from("cart_items").update({ quantity: newQty }).eq("cart_item_id", item.id);
    } else if (item.kind === "car") {
        const startDate = new Date(item.raw.start_date);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + newQty);
        const unitPrice = item.price / item.quantity;
        await supabase.from("car_bookings").update({
            days: newQty,
            end_date: endDate.toISOString().split("T")[0],
            total_price: unitPrice * newQty,
        }).eq("booking_id", item.id);
    } else if (item.kind === "hotel") {
        const checkIn = new Date(item.raw.check_in);
        const checkOut = new Date(checkIn);
        checkOut.setDate(checkOut.getDate() + newQty);
        const unitPrice = item.price / item.quantity;
        await supabase.from("hotel_bookings").update({
            check_out: checkOut.toISOString().split("T")[0],
            total_price: unitPrice * newQty,
        }).eq("booking_id", item.id);
    } else if (item.kind === "apartment") {
        const checkIn = new Date(item.raw.check_in);
        const checkOut = new Date(checkIn);
        checkOut.setDate(checkOut.getDate() + newQty);
        const unitPrice = item.price / item.quantity;
        await supabase.from("apartment_bookings").update({
            check_out: checkOut.toISOString().split("T")[0],
            total_price: unitPrice * newQty,
        }).eq("booking_id", item.id);
    }
}

async function removeItem(item: CartItem): Promise<void> {
    if (item.kind === "ticket") {
        await supabase.from("cart_items").delete().eq("cart_item_id", item.id);
    } else {
        await supabase.from(
            item.kind === "car" ? "car_bookings" :
                item.kind === "hotel" ? "hotel_bookings" : "apartment_bookings"
        ).update({ status: "cancelled" }).eq("booking_id", item.id);
    }
}

// ── Stepper quantité ──────────────────────────────────────────────────────────
function QuantityStepper({
    item,
    onUpdate,
}: {
    item: CartItem;
    onUpdate: (id: string, newQty: number, newPrice: number) => void;
}) {
    const [qty, setQty] = useState(item.quantity);
    const [saving, setSaving] = useState(false);
    const cfg = KIND_CONFIG[item.kind];
    const unitPrice = item.price / item.quantity;

    const change = async (delta: number) => {
        const next = qty + delta;
        if (next < 1) return;
        setSaving(true);
        setQty(next);
        await updateQuantity(item, next);
        onUpdate(item.id, next, unitPrice * next);
        setSaving(false);
    };

    return (
        <div
            className="flex items-center rounded-lg overflow-hidden"
            style={{ border: "0.5px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.3)" }}
        >
            <button
                disabled={qty <= 1 || saving}
                onClick={() => change(-1)}
                className="w-7 h-7 flex items-center justify-center disabled:opacity-30 transition-colors hover:bg-white/5"
                style={{ color: "rgba(255,255,255,0.4)" }}
            >
                <svg width="9" height="2" viewBox="0 0 9 2" fill="none"><rect width="9" height="1.5" rx=".75" fill="currentColor" /></svg>
            </button>
            <div
                className="px-2.5 flex flex-col items-center min-w-[38px]"
                style={{ borderLeft: "0.5px solid rgba(255,255,255,0.08)", borderRight: "0.5px solid rgba(255,255,255,0.08)" }}
            >
                {saving ? (
                    <span className="w-3 h-3 border border-white/30 border-t-white/70 rounded-full animate-spin my-1" />
                ) : (
                    <>
                        <span className="text-[13px] font-semibold text-white/90 leading-none">{qty}</span>
                        <span className="text-[8px] text-white/25 mt-0.5 leading-none">{cfg.unit}{qty > 1 ? "s" : ""}</span>
                    </>
                )}
            </div>
            <button
                disabled={saving}
                onClick={() => change(+1)}
                className="w-7 h-7 flex items-center justify-center disabled:opacity-30 transition-colors hover:bg-white/5"
                style={{ color: "#c9a96e" }}
            >
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                    <rect x="3.75" width="1.5" height="9" rx=".75" fill="currentColor" />
                    <rect y="3.75" width="9" height="1.5" rx=".75" fill="currentColor" />
                </svg>
            </button>
        </div>
    );
}

// ── Ligne item du récapitulatif ───────────────────────────────────────────────
function CheckoutItemRow({
    item,
    onUpdate,
    onRemove,
}: {
    item: CartItem;
    onUpdate: (id: string, newQty: number, newPrice: number) => void;
    onRemove: (id: string) => void;
}) {
    const cfg = KIND_CONFIG[item.kind];
    const [showConfirm, setShowConfirm] = useState(false);
    const [removing, setRemoving] = useState(false);

    const handleRemove = async () => {
        setRemoving(true);
        await removeItem(item);
        onRemove(item.id);
    };

    return (
        <div
            className="flex items-center gap-3 py-3.5"
            style={{ borderBottom: "0.5px solid rgba(255,255,255,0.05)" }}
        >
            {/* Icône */}
            <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: cfg.bg, color: cfg.color }}
            >
                {cfg.icon}
            </div>

            {/* Infos */}
            <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-white/90 truncate leading-tight">{item.label}</p>
                <p className="text-[10px] text-white/30 mt-0.5 truncate">{item.sublabel}</p>
                <p className="text-[10px] mt-0.5" style={{ color: "rgba(201,169,110,0.6)" }}>
                    {item.agencyName}
                </p>
            </div>

            {/* Stepper */}
            <QuantityStepper item={item} onUpdate={onUpdate} />

            {/* Prix */}
            <p
                className="text-[14px] font-light text-white/85 flex-shrink-0 min-w-[90px] text-right"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
                {fmtPrice(item.price)}
            </p>

            {/* Supprimer */}
            {showConfirm ? (
                <div
                    className="flex items-center gap-1.5 rounded-lg px-2 py-1 flex-shrink-0"
                    style={{ background: "rgba(162,45,45,0.15)", border: "0.5px solid rgba(162,45,45,0.3)" }}
                >
                    <span className="text-[10px] text-white/40">Retirer ?</span>
                    <button
                        disabled={removing}
                        onClick={handleRemove}
                        className="text-[10px] font-semibold"
                        style={{ color: "#F09595" }}
                    >
                        {removing ? <span className="w-3 h-3 border border-red-400/40 border-t-red-400 rounded-full animate-spin inline-block" /> : "Oui"}
                    </button>
                    <span className="text-white/20 text-[10px]">·</span>
                    <button onClick={() => setShowConfirm(false)} className="text-[10px] text-white/35 hover:text-white/60">Non</button>
                </div>
            ) : (
                <button
                    onClick={() => setShowConfirm(true)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0 transition-all"
                    style={{ background: "rgba(162,45,45,0.08)", border: "0.5px solid rgba(162,45,45,0.18)", color: "rgba(240,149,149,0.5)" }}
                    onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = "rgba(162,45,45,0.2)";
                        (e.currentTarget as HTMLButtonElement).style.color = "#F09595";
                    }}
                    onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = "rgba(162,45,45,0.08)";
                        (e.currentTarget as HTMLButtonElement).style.color = "rgba(240,149,149,0.5)";
                    }}
                    title="Retirer"
                >
                    <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            )}
        </div>
    );
}

// ── Logo MTN ──────────────────────────────────────────────────────────────────
function MtnLogo({ active }: { active: boolean }) {
    return (
        <div className="flex items-center gap-2">
            {/* Cercle jaune MTN */}
            <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: active ? "#FFCC00" : "rgba(255,204,0,0.3)" }}
            >
                <svg viewBox="0 0 623 361" width="623" height="361">
                    <path fill="#ffcc00" d="M0 0h623v361H0z" />
                    <path
                        fill="#020001"
                        fillRule="evenodd"
                        d="M594.9 180.7c0 78.3-126.9 141.8-283.4 141.8-156.6 0-283.5-63.5-283.5-141.8 0-78.2 126.9-141.7 283.5-141.7 156.5 0 283.4 63.5 283.4 141.7zm-22.4 0c0-65.9-116.8-119.3-261-119.3-144.2 0-261.1 53.4-261.1 119.3 0 65.9 116.9 119.4 261.1 119.4 144.2 0 261-53.5 261-119.4z"
                    />
                </svg>
            </div>
            <div>
                <span className="text-[12px] font-bold tracking-wide" style={{ color: active ? "#FFCC00" : "rgba(255,255,255,0.4)" }}>MTN</span>
                <span className="text-[10px] block leading-none" style={{ color: active ? "rgba(255,204,0,0.7)" : "rgba(255,255,255,0.2)" }}>Mobile Money</span>
            </div>
        </div>
    );
}

// ── Logo Airtel ───────────────────────────────────────────────────────────────
function AirtelLogo({ active }: { active: boolean }) {
    return (
        <div className="flex items-center gap-2">
            <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: active ? "#E4001B" : "rgba(228,0,27,0.2)" }}
            >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <circle cx="6" cy="6" r="4" stroke={active ? "#fff" : "rgba(228,0,27,0.7)"} strokeWidth="1.8" />
                    <circle cx="6" cy="6" r="1.5" fill={active ? "#fff" : "rgba(228,0,27,0.7)"} />
                </svg>
            </div>
            <div>
                <span className="text-[12px] font-bold tracking-wide" style={{ color: active ? "#ff4d5e" : "rgba(255,255,255,0.4)" }}>Airtel</span>
                <span className="text-[10px] block leading-none" style={{ color: active ? "rgba(255,77,94,0.7)" : "rgba(255,255,255,0.2)" }}>Money</span>
            </div>
        </div>
    );
}

// ── Page principale ───────────────────────────────────────────────────────────
export default function CheckoutPage() {
    const router = useRouter();
    const [items, setItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("mtn");
    const [phone, setPhone] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [paying, setPaying] = useState(false);
    const [paid, setPaid] = useState(false);

    // Chargement des items depuis sessionStorage
    useEffect(() => {
        try {
            const raw = sessionStorage.getItem("checkout_items");
            if (raw) setItems(JSON.parse(raw));
        } catch (_) { }
        setLoading(false);
    }, []);

    const total = useMemo(() => items.reduce((s, i) => s + i.price, 0), [items]);

    const handleUpdate = useCallback((id: string, newQty: number, newPrice: number) => {
        setItems((prev) =>
            prev.map((i) => i.id === id ? { ...i, quantity: newQty, price: newPrice } : i)
        );
    }, []);

    const handleRemove = useCallback((id: string) => {
        setItems((prev) => prev.filter((i) => i.id !== id));
    }, []);

    // Validation numéro de téléphone
    const validatePhone = (val: string): boolean => {
        const digits = val.replace(/\s/g, "");
        if (paymentMethod === "mtn") {
            // Congo MTN : commence par 06 ou 05, 10 chiffres
            return /^(06|05)\d{8}$/.test(digits);
        }
        // Airtel Congo : commence par 07, 10 chiffres
        return /^07\d{8}$/.test(digits);
    };

    const handlePay = async () => {
        setPhoneError("");
        if (!validatePhone(phone)) {
            setPhoneError(
                paymentMethod === "mtn"
                    ? "Numéro MTN invalide. Format attendu : 06 ou 05 + 8 chiffres"
                    : "Numéro Airtel invalide. Format attendu : 07 + 8 chiffres"
            );
            return;
        }
        setPaying(true);
        // Simulation d'un appel API de paiement
        await new Promise((r) => setTimeout(r, 2200));
        // Marquer tous les items comme confirmés dans Supabase
        await Promise.all(
            items.map(async (item) => {
                if (item.kind !== "ticket") {
                    const table =
                        item.kind === "car" ? "car_bookings" :
                            item.kind === "hotel" ? "hotel_bookings" : "apartment_bookings";
                    await supabase.from(table).update({ status: "confirmed" }).eq("booking_id", item.id);
                }
            })
        );
        sessionStorage.removeItem("checkout_items");
        setPaying(false);
        setPaid(true);
    };

    // ── État vide ──
    if (!loading && items.length === 0 && !paid) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: "#0c0c0e" }}>
                <div className="text-center px-6">
                    <p className="text-[11px] uppercase tracking-[4px] mb-4" style={{ color: "#8a7560" }}>Paiement</p>
                    <h1 className="text-4xl font-light mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#f0ebe3" }}>
                        Aucun article à <em style={{ color: "#c9a96e", fontStyle: "italic" }}>régler</em>
                    </h1>
                    <button
                        onClick={() => router.push("/panier")}
                        className="mt-6 px-6 py-2.5 rounded-xl text-sm font-medium transition-all"
                        style={{ background: "rgba(201,169,110,0.15)", border: "0.5px solid rgba(201,169,110,0.3)", color: "#c9a96e" }}
                    >
                        ← Retour au panier
                    </button>
                </div>
            </div>
        );
    }

    // ── Succès paiement ──
    if (paid) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: "#0c0c0e" }}>
                <div className="text-center px-6 max-w-sm">
                    {/* Cercle succès */}
                    <div
                        className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                        style={{ background: "rgba(59,109,17,0.15)", border: "1.5px solid rgba(59,109,17,0.4)" }}
                    >
                        <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#97C459" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <p className="text-[11px] uppercase tracking-[4px] mb-3" style={{ color: "#8a7560" }}>Paiement réussi</p>
                    <h1 className="text-4xl font-light mb-2" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#f0ebe3" }}>
                        Merci pour votre <em style={{ color: "#c9a96e", fontStyle: "italic" }}>réservation</em>
                    </h1>
                    <p className="text-white/35 text-sm mt-3 mb-8 leading-relaxed">
                        Vos réservations sont confirmées. Vous recevrez une confirmation sur votre numéro {paymentMethod.toUpperCase()}.
                    </p>
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={() => router.push("/profil")}
                            className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
                            style={{ background: "#c9a96e", color: "#0c0c0e" }}
                        >
                            Voir mes réservations
                        </button>
                        <button
                            onClick={() => router.push("/")}
                            className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
                            style={{ background: "rgba(255,255,255,0.06)", border: "0.5px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.6)" }}
                        >
                            Accueil
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: "#0c0c0e" }}>
                <div className="w-8 h-8 border-2 border-white/10 border-t-[#c9a96e] rounded-full animate-spin" />
            </div>
        );
    }

    // Grouper par catégorie pour l'en-tête du récap
    const kindCounts = (["ticket", "car", "hotel", "apartment"] as const).reduce(
        (acc, k) => {
            const count = items.filter((i) => i.kind === k).length;
            if (count > 0) acc[k] = count;
            return acc;
        },
        {} as Partial<Record<ItemKind, number>>
    );

    return (
        <>
            <link
                href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,400&family=DM+Sans:wght@300;400;500&display=swap"
                rel="stylesheet"
            />

            <main
                className="min-h-screen pt-8 pb-16 px-4 sm:px-6 lg:px-10"
                style={{ background: "#0c0c0e", fontFamily: "'DM Sans', sans-serif" }}
            >
                <div className="max-w-6xl mx-auto">

                    {/* ── En-tête ── */}
                    <div className="mb-8 sm:mb-10">
                        <button
                            onClick={() => router.push("/panier")}
                            className="flex items-center gap-2 text-[11px] text-white/30 hover:text-white/60 transition-colors mb-6 group"
                        >
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="group-hover:-translate-x-0.5 transition-transform">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                            Retour au panier
                        </button>

                        <div className="flex items-end gap-4 flex-wrap justify-between">
                            <div>
                                <p className="text-[11px] font-medium uppercase tracking-[4px] mb-2" style={{ color: "#8a7560" }}>
                                    Finaliser ma commande
                                </p>
                                <h1
                                    className="text-3xl sm:text-4xl font-light leading-none"
                                    style={{ fontFamily: "'Cormorant Garamond', serif", color: "#f0ebe3" }}
                                >
                                    Récapitulatif &{" "}
                                    <em style={{ color: "#c9a96e", fontStyle: "italic" }}>Paiement</em>
                                </h1>
                            </div>
                            {/* Badges catégories */}
                            <div className="flex gap-2 flex-wrap">
                                {(Object.entries(kindCounts) as [ItemKind, number][]).map(([k, count]) => (
                                    <div
                                        key={k}
                                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium"
                                        style={{
                                            background: KIND_CONFIG[k].bg + "33",
                                            border: `0.5px solid ${KIND_CONFIG[k].color}44`,
                                            color: KIND_CONFIG[k].color,
                                        }}
                                    >
                                        {KIND_CONFIG[k].icon}
                                        {count} {KIND_CONFIG[k].label}{count > 1 ? "s" : ""}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div
                            className="mt-5 h-px"
                            style={{ background: "linear-gradient(90deg, rgba(201,169,110,0.4), transparent)" }}
                        />
                    </div>

                    {/* ── Layout 2 colonnes ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 lg:gap-8 items-start">

                        {/* ── Colonne gauche : récapitulatif ── */}
                        <div
                            className="rounded-2xl overflow-hidden"
                            style={{
                                background: "rgba(255,255,255,0.025)",
                                border: "0.5px solid rgba(255,255,255,0.07)",
                            }}
                        >
                            {/* En-tête tableau */}
                            <div
                                className="hidden sm:grid px-5 py-3 text-[10px] uppercase tracking-wider text-white/25 font-medium"
                                style={{
                                    gridTemplateColumns: "1fr auto auto auto auto",
                                    gap: "1rem",
                                    borderBottom: "0.5px solid rgba(255,255,255,0.06)",
                                    background: "rgba(255,255,255,0.02)",
                                }}
                            >
                                <span>Produit</span>
                                <span className="text-center">Qté / Durée</span>
                                <span className="text-right">Prix total</span>
                                <span></span>
                            </div>

                            {/* Lignes items */}
                            <div className="px-4 sm:px-5">
                                {items.length === 0 ? (
                                    <div className="py-12 text-center text-white/20">
                                        <p className="text-sm">Tous les articles ont été retirés.</p>
                                        <button
                                            onClick={() => router.push("/panier")}
                                            className="mt-4 text-xs px-4 py-2 rounded-lg"
                                            style={{ background: "rgba(201,169,110,0.1)", color: "#c9a96e", border: "0.5px solid rgba(201,169,110,0.25)" }}
                                        >
                                            ← Retour au panier
                                        </button>
                                    </div>
                                ) : (
                                    items.map((item) => (
                                        <CheckoutItemRow
                                            key={item.id}
                                            item={item}
                                            onUpdate={handleUpdate}
                                            onRemove={handleRemove}
                                        />
                                    ))
                                )}
                            </div>

                            {/* Sous-total */}
                            {items.length > 0 && (
                                <div
                                    className="px-5 py-4 flex items-center justify-between"
                                    style={{ borderTop: "0.5px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}
                                >
                                    <div className="space-y-1.5">
                                        {(Object.entries(kindCounts) as [ItemKind, number][]).map(([k, count]) => {
                                            const kindTotal = items.filter((i) => i.kind === k).reduce((s, i) => s + i.price, 0);
                                            return (
                                                <div key={k} className="flex items-center gap-3 text-[11px]">
                                                    <span className="text-white/30">{KIND_CONFIG[k].labelPlural}</span>
                                                    <span className="text-white/20">·</span>
                                                    <span className="text-white/20">{count} élément{count > 1 ? "s" : ""}</span>
                                                    <span className="text-white/50 ml-auto pl-6">{fmtPrice(kindTotal)}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="text-right ml-8 pl-6" style={{ borderLeft: "0.5px solid rgba(255,255,255,0.06)" }}>
                                        <p className="text-[10px] text-white/25 uppercase tracking-wider mb-1">Total</p>
                                        <p
                                            className="text-2xl sm:text-3xl font-light"
                                            style={{ fontFamily: "'Cormorant Garamond', serif", color: "#f0ebe3" }}
                                        >
                                            {fmtPrice(total)}
                                        </p>
                                        <p className="text-[10px] text-white/20 mt-0.5">{items.length} élément{items.length > 1 ? "s" : ""}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ── Colonne droite : paiement ── */}
                        <div
                            className="rounded-2xl overflow-hidden sticky top-6"
                            style={{
                                background: "rgba(18,20,26,0.95)",
                                border: "0.5px solid rgba(255,255,255,0.09)",
                            }}
                        >
                            {/* Bande dorée en haut */}
                            <div
                                className="h-[2px]"
                                style={{ background: "linear-gradient(90deg, transparent, #c9a96e, transparent)" }}
                            />

                            <div className="p-5 sm:p-6 space-y-5">
                                <div>
                                    <p
                                        className="text-lg sm:text-xl font-light"
                                        style={{ fontFamily: "'Cormorant Garamond', serif", color: "#f0ebe3" }}
                                    >
                                        Informations de <em style={{ color: "#c9a96e", fontStyle: "italic" }}>paiement</em>
                                    </p>
                                    <p className="text-[10px] text-white/25 mt-0.5">Paiement mobile sécurisé</p>
                                </div>

                                {/* ── Sélection méthode ── */}
                                <div>
                                    <p className="text-[10px] text-white/35 uppercase tracking-wider mb-3">Méthode de paiement</p>
                                    <div className="grid grid-cols-2 gap-2.5">
                                        {/* MTN */}
                                        <button
                                            onClick={() => { setPaymentMethod("mtn"); setPhone(""); setPhoneError(""); }}
                                            className="flex flex-col items-center gap-2.5 py-4 px-3 rounded-xl transition-all duration-200"
                                            style={{
                                                background: paymentMethod === "mtn"
                                                    ? "rgba(255,204,0,0.08)"
                                                    : "rgba(255,255,255,0.03)",
                                                border: paymentMethod === "mtn"
                                                    ? "1px solid rgba(255,204,0,0.35)"
                                                    : "0.5px solid rgba(255,255,255,0.08)",
                                            }}
                                        >
                                            {/* Logo MTN complet */}
                                            <div
                                                className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
                                                style={{ background: paymentMethod === "mtn" ? "#FFCC00" : "rgba(255,204,0,0.15)" }}
                                            >
                                                MTN
                                            </div>
                                            <div className="text-center">
                                                <p
                                                    className="text-[13px] font-bold tracking-wider"
                                                    style={{ color: paymentMethod === "mtn" ? "#FFCC00" : "rgba(255,255,255,0.35)" }}
                                                >
                                                    MTN
                                                </p>
                                                <p
                                                    className="text-[9px] mt-0.5"
                                                    style={{ color: paymentMethod === "mtn" ? "rgba(255,204,0,0.6)" : "rgba(255,255,255,0.18)" }}
                                                >
                                                    Mobile Money
                                                </p>
                                            </div>
                                            {paymentMethod === "mtn" && (
                                                <div
                                                    className="w-4 h-4 rounded-full flex items-center justify-center"
                                                    style={{ background: "#FFCC00" }}
                                                >
                                                    <svg width="8" height="7" fill="none" viewBox="0 0 10 8">
                                                        <path d="M1 4l3 3 5-6" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                            )}
                                        </button>

                                        {/* Airtel */}
                                        <button
                                            onClick={() => { setPaymentMethod("airtel"); setPhone(""); setPhoneError(""); }}
                                            className="flex flex-col items-center gap-2.5 py-4 px-3 rounded-xl transition-all duration-200"
                                            style={{
                                                background: paymentMethod === "airtel"
                                                    ? "rgba(228,0,27,0.08)"
                                                    : "rgba(255,255,255,0.03)",
                                                border: paymentMethod === "airtel"
                                                    ? "1px solid rgba(228,0,27,0.35)"
                                                    : "0.5px solid rgba(255,255,255,0.08)",
                                            }}
                                        >
                                            <div
                                                className="w-10 h-10 rounded-full flex items-center justify-center"
                                                style={{ background: paymentMethod === "airtel" ? "#E4001B" : "rgba(228,0,27,0.15)" }}
                                            >
                                                <svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 972 1056" width="972" height="1056">
                                                    <title>Bharti_Airtel_Limited_logo-svg</title>
                                                    <defs>
                                                        <clipPath clipPathUnits="userSpaceOnUse" id="cp1">
                                                            <path d="m-1765.8-1593.98h23935.55v33895.07h-23935.55z" />
                                                        </clipPath>
                                                    </defs>
                                                    <style>
                                                        {`.s0 { fill: #ed1d24 }`}
                                                    </style>
                                                    <g id="layer1">
                                                        <g id="g4569">
                                                            <g id="Clip-Path: g4571" clipPath="url(#cp1)">
                                                                <g id="g4571">
                                                                    <g id="g4597">
                                                                        <path id="path4599" className="s0" d="m289.6 1055.9c-45.3 0-78.2-16.7-97.9-49.7-49.4-82.4 1.3-185.7 25.3-226.2 16.6-27.9 41.5-57.8 64.9-77.7 23.4-19.6 59.2-43.2 96.9-43.2h2.9c39.4 1.2 81.1 28.5 82.9 72.2 1.3 32.8-20.3 55.7-36.1 72.5l-2.8 3.1c-12.8 13.5-25.4 26-37.6 38.2-21.6 21.1-41.8 41.3-61.7 66.4 0 0-55.1 84.4 35.3 58.7 5-1.7 10.5-4 16.9-6.5l2.9-1.2c21.5-8.5 41.8-20.4 60-31l3.5-2c38.7-22.2 82.2-55.2 129.4-97.9 92.3-83.8 159-171.3 197.7-260 28.4-65.2 33.4-136.3 12.6-181.5-12-25.9-32-42.4-59.4-49-8.7-2.3-17.8-3.1-27.1-3.1-18.8 0-39.2 4-62.6 12.5-90 33.1-170 90-247.2 144.8l-9.2 6.7c-9.6 6.8-18.9 13.5-28.5 20.1-3.5 2.2-6.9 4.7-10.3 7.4-54.4 35.3-133.8 77.1-206.3 77.1-35.4 0-65.7-10.1-89.8-30.2-26.9-22.3-41.5-52.5-43.3-89.4-4.1-87.1 64-189.6 123.8-250.9 25.6-24.1 53.4-46.7 82.3-67.5 4.1-2.5 7.6-5 10.9-7.6 4.5-3.2 8.5-5.9 12.6-8.6l0.7-0.5 4.5-3c141.5-98.4 275-148.1 396.8-148.1 133.3 0 203.8 59.8 210.3 65.6 56.6 42.3 95.5 98.5 115.7 166.5 27.4 93.5 5.1 193-10.8 244.3-39 125.9-107.2 229.2-220.6 334.4-51.3 47.5-101.2 87.3-152.2 121.4l-13.1 8.7c-48.2 32.3-98.3 65.8-161.3 89.9-42.1 16.2-79.5 24.3-111 24.3z" />
                                                                    </g>
                                                                </g>
                                                            </g>
                                                        </g>
                                                    </g>
                                                </svg>
                                            </div>
                                            <div className="text-center">
                                                <p
                                                    className="text-[13px] font-bold tracking-wider"
                                                    style={{ color: paymentMethod === "airtel" ? "#ff4d5e" : "rgba(255,255,255,0.35)" }}
                                                >
                                                    Airtel
                                                </p>
                                                <p
                                                    className="text-[9px] mt-0.5"
                                                    style={{ color: paymentMethod === "airtel" ? "rgba(255,77,94,0.6)" : "rgba(255,255,255,0.18)" }}
                                                >
                                                    Money
                                                </p>
                                            </div>
                                            {paymentMethod === "airtel" && (
                                                <div
                                                    className="w-4 h-4 rounded-full flex items-center justify-center"
                                                    style={{ background: "#E4001B" }}
                                                >
                                                    <svg width="8" height="7" fill="none" viewBox="0 0 10 8">
                                                        <path d="M1 4l3 3 5-6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* ── Numéro de téléphone ── */}
                                <div>
                                    <p className="text-[10px] text-white/35 uppercase tracking-wider mb-2">
                                        Numéro {paymentMethod === "mtn" ? "MTN" : "Airtel"}
                                    </p>
                                    <div className="relative">
                                        {/* Préfixe */}
                                        <div
                                            className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none"
                                        >
                                            <span className="text-[11px] text-white/30">🇨🇬</span>
                                            <span className="text-[12px] text-white/40 font-medium">+242</span>
                                            <div className="w-px h-4 bg-white/10 ml-1" />
                                        </div>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => {
                                                setPhone(e.target.value);
                                                setPhoneError("");
                                            }}
                                            placeholder={paymentMethod === "mtn" ? "06 000 00 00" : "07 000 00 00"}
                                            className="w-full rounded-xl text-[13px] text-white placeholder:text-white/20 outline-none transition-all"
                                            style={{
                                                background: "rgba(255,255,255,0.04)",
                                                border: phoneError
                                                    ? "0.5px solid rgba(240,149,149,0.5)"
                                                    : "0.5px solid rgba(255,255,255,0.1)",
                                                padding: "10px 12px 10px 82px",
                                            }}
                                            onFocus={(e) => {
                                                if (!phoneError)
                                                    (e.target as HTMLInputElement).style.border = `0.5px solid ${paymentMethod === "mtn" ? "rgba(255,204,0,0.4)" : "rgba(228,0,27,0.4)"}`;
                                            }}
                                            onBlur={(e) => {
                                                if (!phoneError)
                                                    (e.target as HTMLInputElement).style.border = "0.5px solid rgba(255,255,255,0.1)";
                                            }}
                                        />
                                    </div>
                                    {phoneError && (
                                        <p className="text-[10px] mt-1.5 flex items-center gap-1" style={{ color: "#F09595" }}>
                                            <span>⚠</span> {phoneError}
                                        </p>
                                    )}
                                    <p className="text-[10px] text-white/20 mt-1.5">
                                        {paymentMethod === "mtn"
                                            ? "Vous recevrez une notification push MTN MoMo pour valider le paiement."
                                            : "Vous recevrez un SMS Airtel Money pour confirmer la transaction."}
                                    </p>
                                </div>

                                {/* ── Séparateur + total ── */}
                                <div
                                    className="flex items-center justify-between py-3 px-4 rounded-xl"
                                    style={{
                                        background: "rgba(255,255,255,0.03)",
                                        border: "0.5px solid rgba(255,255,255,0.06)",
                                    }}
                                >
                                    <div>
                                        <p className="text-[10px] text-white/30 uppercase tracking-wider">Montant total</p>
                                        <p
                                            className="text-2xl font-light mt-0.5"
                                            style={{ fontFamily: "'Cormorant Garamond', serif", color: "#f0ebe3" }}
                                        >
                                            {fmtPrice(total)}
                                        </p>
                                        <p className="text-[10px] text-white/20">{items.length} élément{items.length > 1 ? "s" : ""}</p>
                                    </div>
                                    <div
                                        className="flex flex-col items-end gap-1"
                                        style={{ color: paymentMethod === "mtn" ? "rgba(255,204,0,0.5)" : "rgba(228,0,27,0.5)" }}
                                    >
                                        <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        </svg>
                                        <span className="text-[9px] uppercase tracking-wider opacity-70">
                                            {paymentMethod === "mtn" ? "MoMo" : "A-Money"}
                                        </span>
                                    </div>
                                </div>

                                {/* ── Bouton payer ── */}
                                <button
                                    onClick={handlePay}
                                    disabled={paying || items.length === 0}
                                    className="w-full py-3.5 rounded-xl text-[14px] font-semibold transition-all relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{
                                        background: paying
                                            ? "rgba(201,169,110,0.4)"
                                            : paymentMethod === "mtn"
                                                ? "linear-gradient(135deg, #FFCC00, #e6b800)"
                                                : "linear-gradient(135deg, #E4001B, #c00018)",
                                        color: paymentMethod === "mtn" ? "#0c0c0e" : "#fff",
                                    }}
                                >
                                    {paying ? (
                                        <span className="flex items-center justify-center gap-2.5">
                                            <span
                                                className="w-4 h-4 border-2 rounded-full animate-spin"
                                                style={{
                                                    borderColor: paymentMethod === "mtn" ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.3)",
                                                    borderTopColor: paymentMethod === "mtn" ? "#000" : "#fff",
                                                }}
                                            />
                                            Traitement en cours…
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                            Payer avec {paymentMethod === "mtn" ? "MTN MoMo" : "Airtel Money"}
                                        </span>
                                    )}
                                </button>

                                {/* Mentions sécurité */}
                                <div className="flex items-center justify-center gap-3 text-white/15 text-[10px]">
                                    <span className="flex items-center gap-1">
                                        <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        Paiement sécurisé
                                    </span>
                                    <span>·</span>
                                    <span>Annulation flexible</span>
                                    <span>·</span>
                                    <span>Aucune donnée stockée</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}