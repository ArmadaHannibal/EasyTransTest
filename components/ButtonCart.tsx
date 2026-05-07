"use client";

import { useEffect, useState } from "react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

const supabase = createClient();

async function fetchCartCount(userId: string): Promise<number> {
  const [cartRes, carRes, hotelRes, aptRes] = await Promise.all([
    supabase
      .from("cart")
      .select("cart_items(cart_item_id)")
      .eq("user_id", userId)
      .single(),
    supabase
      .from("car_bookings")
      .select("booking_id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("status", "pending"),
    supabase
      .from("hotel_bookings")
      .select("booking_id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("status", "pending"),
    supabase
      .from("apartment_bookings")
      .select("booking_id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("status", "pending"),
  ]);

  const ticketCount = (cartRes.data?.cart_items as any[])?.length ?? 0;
  const carCount = carRes.count ?? 0;
  const hotelCount = hotelRes.count ?? 0;
  const aptCount = aptRes.count ?? 0;

  return ticketCount + carCount + hotelCount + aptCount;
}

export default function ButtonCart() {
  const { profile } = useUserProfile();
  const router = useRouter();
  const [count, setCount] = useState(0);

  const userId = profile?.user_id as string | undefined;

  useEffect(() => {
    if (!userId) {
      setCount(0);
      return;
    }

    fetchCartCount(userId).then(setCount);

    const channel = supabase
      .channel("cart-count-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "cart_items" },
        () => fetchCartCount(userId).then(setCount),
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "car_bookings",
          filter: `user_id=eq.${userId}`,
        },
        () => fetchCartCount(userId).then(setCount),
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "hotel_bookings",
          filter: `user_id=eq.${userId}`,
        },
        () => fetchCartCount(userId).then(setCount),
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "apartment_bookings",
          filter: `user_id=eq.${userId}`,
        },
        () => fetchCartCount(userId).then(setCount),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  // ── Toujours visible, badge doré seulement si connecté + items ──────────────
  return (
    <button
      onClick={() => router.push("/panier")}
      className="relative w-9 h-9 rounded-full cursor-pointer bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
      aria-label="Panier"
    >
      <svg
        width="16"
        height="16"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>

      {/* Badge — affiché seulement si connecté et au moins 1 item */}
      {userId && count > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-white text-[#0c0c0e] text-[10px] font-semibold flex items-center justify-center leading-none">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}
