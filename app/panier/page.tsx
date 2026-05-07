"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";

const supabase = createClient();

// ── Types ──────────────────────────────────────────────────────────────────────
interface CartTicketItem {
  kind: "ticket";
  id: string;
  quantity: number;
  label: string;
  sublabel: string;
  price: number;
  agencyId: string;
  agencyName: string;
  raw: any;
}
interface CarBookingItem {
  kind: "car";
  id: string;
  quantity: number;
  label: string;
  sublabel: string;
  price: number;
  agencyId: string;
  agencyName: string;
  raw: any;
}
interface HotelBookingItem {
  kind: "hotel";
  id: string;
  quantity: number;
  label: string;
  sublabel: string;
  price: number;
  agencyId: string;
  agencyName: string;
  raw: any;
}
interface AptBookingItem {
  kind: "apartment";
  id: string;
  quantity: number;
  label: string;
  sublabel: string;
  price: number;
  agencyId: string;
  agencyName: string;
  raw: any;
}
type CartItem = CartTicketItem | CarBookingItem | HotelBookingItem | AptBookingItem;
type ItemKind = CartItem["kind"];

// ── Config visuelle ────────────────────────────────────────────────────────────
const KIND_CONFIG: Record<ItemKind, { label: string; labelPlural: string; color: string; bg: string; icon: React.ReactNode }> = {
  ticket: {
    label: "Ticket bus",
    labelPlural: "Tickets bus",
    color: "#185FA5",
    bg: "#E6F1FB",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  car: {
    label: "Location voiture",
    labelPlural: "Locations voiture",
    color: "#3B6D11",
    bg: "#EAF3DE",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
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
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0h2M5 21H3M9 7h1m-1 4h1m4-4h1m-1 4h1" />
      </svg>
    ),
  },
  apartment: {
    label: "Appartement",
    labelPlural: "Appartements",
    color: "#534AB7",
    bg: "#EEEDFE",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
};

// ── Helpers ────────────────────────────────────────────────────────────────────
const fmtPrice = (n: number) => new Intl.NumberFormat("fr-FR").format(Math.round(n)) + " FCFA";
const fmtDate = (d: string) => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
const nights = (a: string, b: string) => Math.max(1, Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000));

// ── Actions Supabase ───────────────────────────────────────────────────────────
const TABLE: Record<ItemKind, string> = {
  ticket: "cart_items",
  car: "car_bookings",
  hotel: "hotel_bookings",
  apartment: "apartment_bookings",
};

async function confirmOne(item: CartItem) {
  if (item.kind === "ticket") return;
  await supabase.from(TABLE[item.kind]).update({ status: "confirmed" }).eq("booking_id", item.id);
}

async function confirmMany(items: CartItem[]) {
  await Promise.all(items.map(confirmOne));
}

async function removeOne(item: CartItem) {
  if (item.kind === "ticket") {
    await supabase.from("cart_items").delete().eq("cart_item_id", item.id);
  } else {
    await supabase.from(TABLE[item.kind]).update({ status: "cancelled" }).eq("booking_id", item.id);
  }
}

async function removeMany(items: CartItem[]) {
  await Promise.all(items.map(removeOne));
}

async function updateQuantity(item: CartItem, newQty: number): Promise<void> {
  if (newQty < 1) return;
  if (item.kind === "ticket") {
    await supabase
      .from("cart_items")
      .update({ quantity: newQty })
      .eq("cart_item_id", item.id);
  } else if (item.kind === "car") {
    const startDate = new Date(item.raw.start_date);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + newQty);
    const unitPrice = item.price / item.quantity;
    await supabase
      .from("car_bookings")
      .update({
        days: newQty,
        end_date: endDate.toISOString().split("T")[0],
        total_price: unitPrice * newQty,
      })
      .eq("booking_id", item.id);
  } else if (item.kind === "hotel") {
    const checkIn = new Date(item.raw.check_in);
    const checkOut = new Date(checkIn);
    checkOut.setDate(checkOut.getDate() + newQty);
    const unitPrice = item.price / item.quantity;
    await supabase
      .from("hotel_bookings")
      .update({
        check_out: checkOut.toISOString().split("T")[0],
        total_price: unitPrice * newQty,
      })
      .eq("booking_id", item.id);
  } else if (item.kind === "apartment") {
    const checkIn = new Date(item.raw.check_in);
    const checkOut = new Date(checkIn);
    checkOut.setDate(checkOut.getDate() + newQty);
    const unitPrice = item.price / item.quantity;
    await supabase
      .from("apartment_bookings")
      .update({
        check_out: checkOut.toISOString().split("T")[0],
        total_price: unitPrice * newQty,
      })
      .eq("booking_id", item.id);
  }
}

// ── Hook de chargement ─────────────────────────────────────────────────────────
function useUnifiedCart(userId: string | undefined) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!userId) { setLoading(false); return; }
    setLoading(true);

    const [cartRes, carRes, hotelRes, aptRaw] = await Promise.all([
      supabase.from("cart").select(`cart_id, cart_items ( cart_item_id, quantity, tickets ( ticket_id, departure_location, destination, ticket_price, departure_date, bus_id ) )`).eq("user_id", userId).single(),
      supabase.from("car_bookings").select(`booking_id, start_date, end_date, days, total_price, status, car_rentals ( brand, model, agency_id, agencies(name) )`).eq("user_id", userId).eq("status", "pending"),
      supabase.from("hotel_bookings").select(`booking_id, check_in, check_out, guests, total_price, status, hotels ( name, agency_id, agencies(name) ), hotel_rooms ( room_type )`).eq("user_id", userId).eq("status", "pending"),
      supabase.from("apartment_bookings").select(`booking_id, apartment_id, check_in, check_out, guests, total_price, status`).eq("user_id", userId).eq("status", "pending"),
    ]);

    const result: CartItem[] = [];

    // Tickets
    for (const ci of (cartRes.data?.cart_items ?? []) as any[]) {
      if (!ci.tickets) continue;
      result.push({
        kind: "ticket",
        id: ci.cart_item_id,
        quantity: ci.quantity,
        label: `${ci.tickets.departure_location} → ${ci.tickets.destination}`,
        sublabel: `Départ : ${fmtDate(ci.tickets.departure_date)} · Bus ${ci.tickets.bus_id}`,
        price: ci.tickets.ticket_price * ci.quantity,
        agencyId: ci.tickets.agency_id ?? "default",
        agencyName: ci.tickets.agency_name ?? "Agence",
        raw: ci,
      });
    }

    // Voitures
    for (const b of (carRes.data ?? []) as any[]) {
      result.push({
        kind: "car",
        id: b.booking_id,
        quantity: b.days,
        label: b.car_rentals ? `${b.car_rentals.brand} ${b.car_rentals.model}` : "Véhicule",
        sublabel: `${fmtDate(b.start_date)} → ${fmtDate(b.end_date)} · ${b.days} jour${b.days > 1 ? "s" : ""}`,
        price: Number(b.total_price),
        agencyId: b.car_rentals?.agency_id ?? "default",
        agencyName: b.car_rentals?.agencies?.name ?? "Agence",
        raw: b,
      });
    }

    // Hôtels
    for (const b of (hotelRes.data ?? []) as any[]) {
      result.push({
        kind: "hotel",
        id: b.booking_id,
        quantity: nights(b.check_in, b.check_out),
        label: `${b.hotels?.name ?? "Hôtel"} · ${b.hotel_rooms?.room_type ?? "Chambre"}`,
        sublabel: `${fmtDate(b.check_in)} → ${fmtDate(b.check_out)} · ${b.guests} voyageur${b.guests > 1 ? "s" : ""}`,
        price: Number(b.total_price),
        agencyId: b.hotels?.agency_id ?? "default",
        agencyName: b.hotels?.agencies?.name ?? "Agence",
        raw: b,
      });
    }

    // Appartements
    for (const b of (aptRaw.data ?? []) as any[]) {
      const aptDetails = await supabase
        .from("apartments")
        .select("title, agency_id, agencies(name)")
        .eq("apartment_id", b.apartment_id)
        .single();
      result.push({
        kind: "apartment",
        id: b.booking_id,
        quantity: nights(b.check_in, b.check_out),
        label: aptDetails.data?.title ?? `Appartement`,
        sublabel: `${fmtDate(b.check_in)} → ${fmtDate(b.check_out)} · ${b.guests} voyageur${b.guests > 1 ? "s" : ""}`,
        price: Number(b.total_price),
        agencyId: (aptDetails.data as any)?.agency_id ?? "default",
        agencyName: (aptDetails.data as any)?.agencies?.name ?? "Agence",
        raw: b,
      });
    }

    setItems(result);
    setLoading(false);
  }, [userId]);

  useEffect(() => { load(); }, [load]);
  return { items, loading, refetch: load };
}

// ── Checkbox custom ────────────────────────────────────────────────────────────
function Checkbox({ checked, indeterminate, onChange }: { checked: boolean; indeterminate?: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className="flex-shrink-0 w-5 h-5 cursor-pointer rounded-md border transition-all duration-150 flex items-center justify-center"
      style={{
        background: checked || indeterminate ? "rgba(201,169,110,0.25)" : "rgba(255,255,255,0.05)",
        borderColor: checked || indeterminate ? "rgba(201,169,110,0.7)" : "rgba(255,255,255,0.15)",
      }}
    >
      {indeterminate && !checked ? (
        <svg width="10" height="2" viewBox="0 0 10 2" fill="none">
          <rect width="10" height="2" rx="1" fill="#c9a96e" />
        </svg>
      ) : checked ? (
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
          <path d="M1 4l3 3 5-6" stroke="#c9a96e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : null}
    </button>
  );
}

// ── Radio dot custom ───────────────────────────────────────────────────────────
function RadioDot({ checked }: { checked: boolean }) {
  return (
    <div
      className="flex-shrink-0 w-5 h-5 rounded-full border transition-all duration-150 flex items-center justify-center"
      style={{
        background: checked ? "rgba(201,169,110,0.2)" : "rgba(255,255,255,0.05)",
        borderColor: checked ? "rgba(201,169,110,0.8)" : "rgba(255,255,255,0.15)",
      }}
    >
      {checked && (
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#c9a96e" }} />
      )}
    </div>
  );
}

// ── Action button ──────────────────────────────────────────────────────────────
function ActionBtn({ onClick, loading: isLoading, color, children }: { onClick: () => void; loading: boolean; color: "green" | "red" | "gold"; children: React.ReactNode }) {
  const styles = {
    green: { background: "rgba(59,109,17,0.15)", color: "#97C459", border: "0.5px solid rgba(59,109,17,0.3)" },
    red: { background: "rgba(162,45,45,0.12)", color: "#F09595", border: "0.5px solid rgba(162,45,45,0.25)" },
    gold: { background: "rgba(201,169,110,0.12)", color: "#c9a96e", border: "0.5px solid rgba(201,169,110,0.3)" },
  };
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-lg transition-all whitespace-nowrap disabled:opacity-50"
      style={styles[color]}
    >
      {isLoading ? (
        <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
      ) : children}
    </button>
  );
}

// ── Stepper de quantité ────────────────────────────────────────────────────────
function QuantityStepper({ item, onRefresh }: { item: CartItem; onRefresh: () => void }) {
  const [qty, setQty] = useState(item.quantity);
  const [loading, setLoading] = useState(false);

  const unit = item.kind === "ticket" ? "billet" : item.kind === "car" ? "jour" : "nuit";

  const change = async (delta: number) => {
    const next = qty + delta;
    if (next < 1) return;
    setQty(next);
    setLoading(true);
    await updateQuantity(item, next);
    setLoading(false);
    onRefresh();
  };

  return (
    <div
      className="flex items-center gap-0 rounded-lg overflow-hidden flex-shrink-0"
      style={{ border: "0.5px solid rgba(255,255,255,0.12)", background: "rgba(0,0,0,0.25)" }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        disabled={qty <= 1 || loading}
        onClick={() => change(-1)}
        className="w-7 h-7 flex items-center justify-center transition-all disabled:opacity-30"
        style={{ color: "rgba(255,255,255,0.5)" }}
        onMouseEnter={(e) => { if (qty > 1) (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
      >
        <svg width="10" height="2" viewBox="0 0 10 2" fill="none">
          <rect width="10" height="1.5" rx="0.75" fill="currentColor" />
        </svg>
      </button>

      <div
        className="flex flex-col items-center justify-center px-2 min-w-[36px]"
        style={{ borderLeft: "0.5px solid rgba(255,255,255,0.08)", borderRight: "0.5px solid rgba(255,255,255,0.08)" }}
      >
        {loading ? (
          <span className="w-3 h-3 border border-white/30 border-t-white/80 rounded-full animate-spin" />
        ) : (
          <>
            <span className="text-[13px] font-semibold text-white/90 leading-none">{qty}</span>
            <span className="text-[9px] text-white/25 mt-0.5 leading-none">{unit}{qty > 1 ? "s" : ""}</span>
          </>
        )}
      </div>

      <button
        disabled={loading}
        onClick={() => change(+1)}
        className="w-7 h-7 flex items-center justify-center transition-all disabled:opacity-30"
        style={{ color: "rgba(201,169,110,0.8)" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(201,169,110,0.08)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <rect x="4.25" width="1.5" height="10" rx="0.75" fill="currentColor" />
          <rect y="4.25" width="10" height="1.5" rx="0.75" fill="currentColor" />
        </svg>
      </button>
    </div>
  );
}

// ── Carte item ─────────────────────────────────────────────────────────────────
function CartItemCard({
  item,
  selected,
  selectionMode,
  onToggle,
  onRefresh,
}: {
  item: CartItem;
  selected: boolean;
  selectionMode: "single" | "multi";
  onToggle: () => void;
  onRefresh: () => void;
}) {
  const cfg = KIND_CONFIG[item.kind];
  const router = useRouter();
  const [removing, setRemoving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleCheckoutNow = () => {
    sessionStorage.setItem("checkout_items", JSON.stringify([item]));
    router.push("/paiement");
  };

  return (
    <div
      className="flex gap-3 p-3 sm:p-4 rounded-xl transition-all duration-200 cursor-pointer"
      style={{
        background: selected ? "rgba(201,169,110,0.06)" : "rgba(255,255,255,0.025)",
        border: selected
          ? "0.5px solid rgba(201,169,110,0.25)"
          : "0.5px solid rgba(255,255,255,0.07)",
      }}
      onClick={onToggle}
    >
      <div
        className="flex items-start pt-0.5"
        onClick={(e) => { e.stopPropagation(); onToggle(); }}
      >
        {selectionMode === "single" ? (
          <RadioDot checked={selected} />
        ) : (
          <Checkbox checked={selected} onChange={onToggle} />
        )}
      </div>

      <div
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: cfg.bg, color: cfg.color }}
      >
        {cfg.icon}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-medium text-white/90 leading-tight truncate">{item.label}</p>
            <p className="text-[11px] text-white/35 mt-0.5">{item.sublabel}</p>
          </div>
          <p
            className="text-[15px] sm:text-[16px] font-light text-white/85 flex-shrink-0"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {fmtPrice(item.price)}
          </p>
        </div>

        <div
          className="flex items-center gap-2 mt-3 flex-wrap"
          onClick={(e) => e.stopPropagation()}
        >
          <QuantityStepper item={item} onRefresh={onRefresh} />

          <ActionBtn color="green" loading={false} onClick={handleCheckoutNow}>
            <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Payer
          </ActionBtn>

          {showDeleteConfirm ? (
            <div
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium animate-in fade-in duration-150"
              style={{ background: "rgba(162,45,45,0.15)", border: "0.5px solid rgba(162,45,45,0.35)" }}
            >
              <span className="text-white/50">Supprimer ?</span>
              <button
                disabled={removing}
                onClick={async () => {
                  setRemoving(true);
                  await removeOne(item);
                  onRefresh();
                }}
                className="font-semibold transition-colors"
                style={{ color: "#F09595" }}
              >
                {removing ? (
                  <span className="w-3 h-3 border border-red-400/50 border-t-red-400 rounded-full animate-spin inline-block" />
                ) : "Oui"}
              </button>
              <span className="text-white/20">·</span>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="text-white/40 hover:text-white/70 transition-colors"
              >
                Non
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-1.5 w-7 h-7 rounded-lg items-center justify-center transition-all"
              title="Supprimer"
              style={{
                background: "rgba(162,45,45,0.10)",
                border: "0.5px solid rgba(162,45,45,0.2)",
                color: "rgba(240,149,149,0.6)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(162,45,45,0.22)";
                (e.currentTarget as HTMLButtonElement).style.color = "#F09595";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(162,45,45,0.10)";
                (e.currentTarget as HTMLButtonElement).style.color = "rgba(240,149,149,0.6)";
              }}
            >
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Section par agence ─────────────────────────────────────────────────────────
function AgencySection({
  agencyId,
  agencyName,
  items,
  selectedIds,
  onToggleItem,
  onToggleAll,
  onRefresh,
}: {
  agencyId: string;
  agencyName: string;
  items: CartItem[];
  selectedIds: Set<string>;
  onToggleItem: (id: string) => void;
  onToggleAll: (ids: string[]) => void;
  onRefresh: () => void;
}) {
  const [selectionMode, setSelectionMode] = useState<"single" | "multi">("multi");

  const allSelected = items.every((i) => selectedIds.has(i.id));
  const someSelected = items.some((i) => selectedIds.has(i.id));
  const selectedCount = items.filter((i) => selectedIds.has(i.id)).length;
  const subtotal = items.reduce((s, i) => s + i.price, 0);
  const selectedSubtotal = items.filter((i) => selectedIds.has(i.id)).reduce((s, i) => s + i.price, 0);

  const switchToSingle = () => {
    setSelectionMode("single");
    const agencySelected = items.filter((i) => selectedIds.has(i.id));
    if (agencySelected.length > 1) {
      const toDeselect = agencySelected.slice(1).map((i) => i.id);
      onToggleAll(toDeselect);
    }
  };

  const switchToMulti = () => setSelectionMode("multi");

  const handleToggleItem = (id: string) => {
    if (selectionMode === "single") {
      const isCurrentlySelected = selectedIds.has(id);
      if (isCurrentlySelected) {
        onToggleItem(id);
      } else {
        const othersSelected = items.filter((i) => i.id !== id && selectedIds.has(i.id));
        othersSelected.forEach((i) => onToggleItem(i.id));
        onToggleItem(id);
      }
    } else {
      onToggleItem(id);
    }
  };

  const byKind = useMemo(() => {
    const map: Partial<Record<ItemKind, CartItem[]>> = {};
    for (const item of items) {
      if (!map[item.kind]) map[item.kind] = [];
      map[item.kind]!.push(item);
    }
    return map;
  }, [items]);

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: "0.5px solid rgba(255,255,255,0.08)" }}>
      {/* En-tête agence */}
      <div
        className="flex items-center justify-between px-4 py-3 gap-3 flex-wrap"
        style={{ background: "rgba(255,255,255,0.04)", borderBottom: "0.5px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-3 min-w-0">
          {selectionMode === "multi" && (
            <div onClick={(e) => e.stopPropagation()}>
              <Checkbox
                checked={allSelected}
                indeterminate={someSelected && !allSelected}
                onChange={() => onToggleAll(items.map((i) => i.id))}
              />
            </div>
          )}
          <div className="min-w-0">
            <p className="text-[12px] font-semibold text-white/80 truncate">{agencyName}</p>
            <p className="text-[10px] text-white/35">
              {items.length} élément{items.length > 1 ? "s" : ""} · {fmtPrice(subtotal)}
              {someSelected && selectedSubtotal > 0 && (
                <span style={{ color: "#c9a96e" }}>
                  {" "}· {selectedCount} sélectionné{selectedCount > 1 ? "s" : ""} ({fmtPrice(selectedSubtotal)})
                </span>
              )}
            </p>
          </div>
        </div>

        {items.length > 1 && (
          <div className="flex items-center gap-2 flex-wrap flex-shrink-0">
            <div
              className="flex items-center rounded-lg overflow-hidden"
              style={{ border: "0.5px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.2)" }}
            >
              <button
                onClick={switchToSingle}
                className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-medium transition-all"
                style={{
                  background: selectionMode === "single" ? "rgba(201,169,110,0.2)" : "transparent",
                  color: selectionMode === "single" ? "#c9a96e" : "rgba(255,255,255,0.3)",
                  borderRight: "0.5px solid rgba(255,255,255,0.08)",
                }}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.2" />
                  <circle cx="5" cy="5" r="2" fill="currentColor" />
                </svg>
                1 seul
              </button>
              <button
                onClick={switchToMulti}
                className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-medium transition-all"
                style={{
                  background: selectionMode === "multi" ? "rgba(201,169,110,0.2)" : "transparent",
                  color: selectionMode === "multi" ? "#c9a96e" : "rgba(255,255,255,0.3)",
                }}
              >
                <svg width="11" height="10" viewBox="0 0 11 10" fill="none">
                  <circle cx="3" cy="5" r="2" stroke="currentColor" strokeWidth="1.2" />
                  <circle cx="8" cy="5" r="2" stroke="currentColor" strokeWidth="1.2" />
                  <circle cx="3" cy="5" r="0.8" fill="currentColor" />
                  <circle cx="8" cy="5" r="0.8" fill="currentColor" />
                </svg>
                Plusieurs
              </button>
            </div>

            {selectionMode === "multi" && (
              <ActionBtn color="gold" loading={false} onClick={() => onToggleAll(items.map((i) => i.id))}>
                {allSelected ? (
                  <>
                    <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    Désélect. tous
                  </>
                ) : (
                  <>
                    <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    Sélect. tous
                  </>
                )}
              </ActionBtn>
            )}

            {selectionMode === "single" && someSelected && (
              <ActionBtn color="red" loading={false} onClick={() => onToggleAll(items.filter((i) => selectedIds.has(i.id)).map((i) => i.id))}>
                <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                Désélectionner
              </ActionBtn>
            )}
          </div>
        )}
      </div>

      {/* Indicateur de mode */}
      {items.length > 1 && (
        <div
          className="px-4 py-1.5 flex items-center gap-2"
          style={{ background: selectionMode === "single" ? "rgba(201,169,110,0.04)" : "rgba(255,255,255,0.02)", borderBottom: "0.5px solid rgba(255,255,255,0.04)" }}
        >
          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: selectionMode === "single" ? "#c9a96e" : "rgba(255,255,255,0.2)" }} />
          <p className="text-[10px]" style={{ color: selectionMode === "single" ? "rgba(201,169,110,0.7)" : "rgba(255,255,255,0.2)" }}>
            {selectionMode === "single"
              ? "Mode 1 élément — cliquez sur un item pour le sélectionner seul"
              : "Mode multi-sélection — cochez librement autant d'éléments que vous souhaitez"}
          </p>
        </div>
      )}

      {/* Items */}
      <div className="divide-y" style={{ background: "rgba(0,0,0,0.15)", borderColor: "rgba(255,255,255,0.04)" }}>
        {(Object.entries(byKind) as [ItemKind, CartItem[]][]).map(([kind, kindItems]) => (
          <div key={kind}>
            {Object.keys(byKind).length > 1 && (
              <div
                className="flex items-center justify-between px-4 py-2"
                style={{ background: "rgba(255,255,255,0.02)", borderBottom: "0.5px solid rgba(255,255,255,0.04)" }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: KIND_CONFIG[kind].bg, color: KIND_CONFIG[kind].color }}>
                    <span style={{ transform: "scale(0.7)" }}>{KIND_CONFIG[kind].icon}</span>
                  </div>
                  <span className="text-[11px] text-white/40 font-medium">{KIND_CONFIG[kind].labelPlural}</span>
                  <span className="text-[10px] text-white/25">({kindItems.length})</span>
                </div>
                {kindItems.length > 1 && selectionMode === "multi" && (
                  <button
                    className="text-[10px] text-white/30 hover:text-white/60 transition-colors"
                    onClick={() => onToggleAll(kindItems.map((i) => i.id))}
                  >
                    {kindItems.every((i) => selectedIds.has(i.id)) ? "Tout désélect." : "Tout sélect."}
                  </button>
                )}
              </div>
            )}
            <div className="p-2 space-y-1.5">
              {kindItems.map((item) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  selected={selectedIds.has(item.id)}
                  selectionMode={selectionMode}
                  onToggle={() => handleToggleItem(item.id)}
                  onRefresh={onRefresh}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Page principale ────────────────────────────────────────────────────────────
export default function CartPage() {
  const { profile, loading: profileLoading } = useUserProfile();
  const router = useRouter();
  const userId = profile?.user_id as string | undefined;
  const { items, loading, refetch } = useUnifiedCart(userId);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [globalConfirming, setGlobalConfirming] = useState(false);

  useEffect(() => { setSelectedIds(new Set()); }, [items]);

  const total = useMemo(() => items.reduce((s, i) => s + i.price, 0), [items]);
  const selectedItems = useMemo(() => items.filter((i) => selectedIds.has(i.id)), [items, selectedIds]);
  const selectedTotal = useMemo(() => selectedItems.reduce((s, i) => s + i.price, 0), [selectedItems]);

  const byAgency = useMemo(() => {
    const map = new Map<string, { name: string; items: CartItem[] }>();
    for (const item of items) {
      if (!map.has(item.agencyId)) map.set(item.agencyId, { name: item.agencyName, items: [] });
      map.get(item.agencyId)!.items.push(item);
    }
    return map;
  }, [items]);

  const toggleItem = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleGroup = useCallback((ids: string[]) => {
    setSelectedIds((prev) => {
      const allSelected = ids.every((id) => prev.has(id));
      const next = new Set(prev);
      if (allSelected) ids.forEach((id) => next.delete(id));
      else ids.forEach((id) => next.add(id));
      return next;
    });
  }, []);

  const deselectAll = useCallback(() => setSelectedIds(new Set()), []);

  // ── Non connecté ──
  if (!profileLoading && !userId) {
    return (
      <div className="relative min-h-screen flex items-center justify-center" style={{ background: "#0c0c0e" }}>
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: "url(https://res.cloudinary.com/dtrpkegss/image/upload/v1764756776/portrait-d-une-personne-souffrant-de-depression_q3tkfm.jpg)" }} />
        <div className="relative text-center px-6 max-w-md">
          <p className="text-[11px] font-medium uppercase tracking-[4px] mb-4" style={{ color: "var(--bg-legebluecalme)" }}>Panier</p>
          <h1 className="text-4xl font-light mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#f0ebe3" }}>
            Connexion <em style={{ color: "var(--bg-legebluecalme)", fontStyle: "italic" }}>requise</em>
          </h1>
          <p className="text-white/40 text-sm mb-8 leading-relaxed">Connectez-vous pour accéder à votre panier.</p>
          <Button as={Link} href="/connexion" className="bg-(--bg-legebluemoyen) text-white font-medium px-8">Se connecter</Button>
        </div>
      </div>
    );
  }

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0c0c0e" }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-white/10 border-t-[#c9a96e] rounded-full animate-spin" />
          <p className="text-white/30 text-sm">Chargement de votre panier…</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="relative min-h-screen flex items-center justify-center" style={{ background: "#0c0c0e" }}>
        <div className="absolute inset-0 bg-cover bg-center opacity-15" style={{ backgroundImage: "url(https://res.cloudinary.com/dtrpkegss/image/upload/v1764756776/portrait-d-une-personne-souffrant-de-depression_q3tkfm.jpg)" }} />
        <div className="relative text-center px-6 max-w-md">
          <p className="text-[11px] font-medium uppercase tracking-[4px] mb-4" style={{ color: "#8a7560" }}>Panier vide</p>
          <h1 className="text-4xl font-light mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#f0ebe3" }}>
            Rien à <em style={{ color: "#c9a96e", fontStyle: "italic" }}>réserver</em>
          </h1>
          <p className="text-white/40 text-sm mb-8 leading-relaxed">Explorez nos voitures, hôtels, appartements et billets de bus.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button as={Link} href="/voitures" size="sm" className="bg-white/10 text-white border border-white/20">Voitures</Button>
            <Button as={Link} href="/hotels" size="sm" className="bg-white/10 text-white border border-white/20">Hôtels</Button>
            <Button as={Link} href="/appartements" size="sm" className="bg-white/10 text-white border border-white/20">Appartements</Button>
          </div>
        </div>
      </div>
    );
  }

  const allSelected = items.length > 0 && items.every((i) => selectedIds.has(i.id));
  const someSelected = items.some((i) => selectedIds.has(i.id));

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,400&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      <main className="min-h-screen px-4 py-10 sm:px-8 lg:px-16" style={{ background: "#0c0c0e", fontFamily: "'DM Sans', sans-serif" }}>
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <p className="text-[11px] font-medium uppercase tracking-[4px] mb-3" style={{ color: "#8a7560" }}>Récapitulatif</p>
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <h1 className="text-3xl sm:text-5xl font-light leading-none" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#f0ebe3" }}>
                Mon <em style={{ color: "#c9a96e", fontStyle: "italic" }}>Panier</em>
              </h1>
              {items.length > 1 && (
                <ActionBtn color="gold" loading={globalConfirming} onClick={async () => { setGlobalConfirming(true); await confirmMany(items); refetch(); setGlobalConfirming(false); }}>
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  Tout confirmer ({items.length})
                </ActionBtn>
              )}
            </div>
            <div className="mt-4 h-px" style={{ background: "linear-gradient(90deg, rgba(201,169,110,0.4), transparent)" }} />
          </div>

          {/* Barre de sélection globale */}
          <div
            className="flex items-center gap-3 mb-4 px-3 py-2.5 rounded-xl"
            style={{ background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.07)" }}
          >
            <Checkbox
              checked={allSelected}
              indeterminate={someSelected && !allSelected}
              onChange={() => {
                if (allSelected) deselectAll();
                else setSelectedIds(new Set(items.map((i) => i.id)));
              }}
            />
            <span className="text-[12px] text-white/40 flex-1">
              {selectedIds.size > 0
                ? `${selectedIds.size} / ${items.length} élément${selectedIds.size > 1 ? "s" : ""} sélectionné${selectedIds.size > 1 ? "s" : ""}`
                : "Sélectionner tout"}
            </span>
            {selectedIds.size > 0 && (
              <span className="text-[12px] font-medium" style={{ color: "#c9a96e", fontFamily: "'Cormorant Garamond', serif" }}>
                {fmtPrice(selectedTotal)}
              </span>
            )}
          </div>

          {/* Layout 2 colonnes : liste + recap sticky */}
          <div className="flex gap-6 items-start">

            {/* Colonne gauche : sections agences */}
            <div className="flex-1 min-w-0 space-y-4">
              {Array.from(byAgency.entries()).map(([agencyId, { name, items: agencyItems }]) => (
                <AgencySection
                  key={agencyId}
                  agencyId={agencyId}
                  agencyName={name}
                  items={agencyItems}
                  selectedIds={selectedIds}
                  onToggleItem={toggleItem}
                  onToggleAll={toggleGroup}
                  onRefresh={refetch}
                />
              ))}
            </div>

            {/* Colonne droite : récap sticky */}
            <div
              className="w-72 flex-shrink-0 rounded-2xl p-5"
              style={{
                position: "sticky",
                top: "100px",
                background: "rgba(255,255,255,0.03)",
                border: "0.5px solid rgba(201,169,110,0.2)",
                overflow: "hidden",
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, transparent, #c9a96e, transparent)" }} />

              <div className="flex items-start justify-between mb-4">
                <span className="text-white/50 text-sm">Total à régler</span>
                <div className="text-right">
                  <p className="text-2xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#f0ebe3" }}>
                    {selectedIds.size > 0 ? fmtPrice(selectedTotal) : fmtPrice(total)}
                  </p>
                  <p className="text-[11px] text-white/30">
                    {selectedIds.size > 0
                      ? `${selectedIds.size} élément${selectedIds.size > 1 ? "s" : ""} sélectionné${selectedIds.size > 1 ? "s" : ""}`
                      : `${items.length} élément${items.length > 1 ? "s" : ""}`}
                  </p>
                </div>
              </div>

              {selectedIds.size > 0 && selectedTotal !== total && (
                <div className="mb-4 px-3 py-2 rounded-lg text-[11px] text-white/40" style={{ background: "rgba(201,169,110,0.06)", border: "0.5px solid rgba(201,169,110,0.15)" }}>
                  Total panier complet : <span className="text-white/60">{fmtPrice(total)}</span>
                </div>
              )}

              <div className="space-y-1.5 mb-6 pt-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                {(["ticket", "car", "hotel", "apartment"] as const).map((k) => {
                  const kindItems = items.filter((i) => i.kind === k);
                  if (kindItems.length === 0) return null;
                  const kindSelectedItems = selectedIds.size > 0 ? kindItems.filter((i) => selectedIds.has(i.id)) : kindItems;
                  const kindTotal = kindSelectedItems.reduce((s, i) => s + i.price, 0);
                  if (selectedIds.size > 0 && kindSelectedItems.length === 0) return null;
                  return (
                    <div key={k} className="flex justify-between text-[12px]">
                      <div className="flex items-center gap-2">
                        <span className="text-white/40">{KIND_CONFIG[k].labelPlural}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full text-white/30" style={{ background: "rgba(255,255,255,0.06)" }}>
                          {kindSelectedItems.length}
                        </span>
                      </div>
                      <span className="text-white/60">{fmtPrice(kindTotal)}</span>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => {
                  const itemsToCheckout = selectedIds.size > 0 ? selectedItems : items;
                  sessionStorage.setItem("checkout_items", JSON.stringify(itemsToCheckout));
                  router.push("/paiement");
                }}
                className="w-full py-3 cursor-pointer rounded-xl text-[13px] font-medium transition-all"
                style={{ background: "#c9a96e", color: "#0c0c0e" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#dfc082"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#c9a96e"; }}
              >
                {selectedIds.size > 0
                  ? `Payer la sélection (${fmtPrice(selectedTotal)}) →`
                  : `Procéder au paiement →`}
              </button>
              <p className="text-center text-[11px] text-white/25 mt-3">Paiement sécurisé · Annulation flexible</p>
            </div>

          </div>
        </div>
      </main>
    </>
  );
}