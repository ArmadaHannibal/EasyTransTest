"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";
import { useUserProfile } from "@/hooks/useUserProfile";
import { NotificationDialog } from "@/components/Notificationdialog";
import {
  TYPE_CONFIG,
  fallbackConfig,
  fmtDateShort,
  fmtDateFull,
  type Notification,
} from "@/components/Notificationdialog";

const supabase = createClient();

type FilterTab = "all" | "unread" | "info" | "success" | "warning" | "error";

// ── Helpers ────────────────────────────────────────────────────────────────────
const isToday = (d: string) =>
  new Date(d).toDateString() === new Date().toDateString();

const isThisWeek = (d: string) => {
  const diff = Date.now() - new Date(d).getTime();
  return diff < 7 * 24 * 60 * 60 * 1000 && !isToday(d);
};

const groupByPeriod = (notifs: Notification[]) => ({
  today: notifs.filter((n) => isToday(n.created_at)),
  week: notifs.filter((n) => isThisWeek(n.created_at)),
  older: notifs.filter(
    (n) => !isToday(n.created_at) && !isThisWeek(n.created_at),
  ),
});

// ── Icônes ────────────────────────────────────────────────────────────────────
function BellSVG({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
      />
    </svg>
  );
}

function CheckSVG() {
  return (
    <svg
      width="14"
      height="14"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function TrashSVG() {
  return (
    <svg
      width="14"
      height="14"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  );
}

// ── Section divider ───────────────────────────────────────────────────────────
function SectionLabel({ label, count }: { label: string; count: number }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <span
        className="text-[11px] font-semibold uppercase tracking-[1.2px] whitespace-nowrap"
        style={{ color: "var(--bg-legebluemoyen)" }}
      >
        {label}
      </span>
      <div
        className="flex-1 h-px"
        style={{ background: "rgba(201,169,110,0.15)" }}
      />
      <span className="text-[11px] text-white/30">{count}</span>
    </div>
  );
}

// ── Notification row ──────────────────────────────────────────────────────────
function NotifRow({
  notif,
  onSelect,
  onMarkRead,
}: {
  notif: Notification;
  onSelect: (n: Notification) => void;
  onMarkRead: (id: number) => void;
}) {
  const cfg =
    TYPE_CONFIG[notif.notification_type?.toLowerCase() ?? ""] ?? fallbackConfig;
  const isUnread = notif.status === "unread";

  return (
    <div
      className="group relative flex items-start gap-4 px-5 py-4 rounded-2xl cursor-pointer transition-all duration-200"
      style={{
        background: isUnread
          ? "rgba(201,169,110,0.06)"
          : "rgba(255,255,255,0.03)",
        border: isUnread
          ? "0.5px solid rgba(201,169,110,0.2)"
          : "0.5px solid rgba(255,255,255,0.06)",
      }}
      onClick={() => onSelect(notif)}
    >
      {/* Barre latérale gauche */}
      {isUnread && (
        <div
          className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full"
          style={{ background: cfg.borderColor }}
        />
      )}

      {/* Icône */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: cfg.iconBg, color: cfg.iconColor }}
      >
        {cfg.icon}
      </div>

      {/* Contenu */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span
            className="text-[10px] font-semibold uppercase tracking-[0.5px] px-2 py-[2px] rounded-[4px]"
            style={{ background: cfg.pillBg, color: cfg.pillColor }}
          >
            {cfg.label}
          </span>
          {isUnread && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#c9a96e] flex-shrink-0" />
          )}
          <span className="text-[11px] text-white/30 ml-auto">
            {fmtDateShort(notif.created_at)}
          </span>
        </div>
        <p className="text-[13px] text-white/65 leading-relaxed line-clamp-2">
          {notif.message ?? "—"}
        </p>
      </div>

      {/* Actions au hover */}
      <div
        className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {isUnread && (
          <button
            onClick={() => onMarkRead(notif.notification_id)}
            title="Marquer comme lu"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
          >
            <CheckSVG />
          </button>
        )}
      </div>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <div
      className="flex items-start gap-4 px-5 py-4 rounded-2xl animate-pulse"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "0.5px solid rgba(255,255,255,0.06)",
      }}
    >
      <div
        className="w-10 h-10 rounded-xl flex-shrink-0"
        style={{ background: "rgba(255,255,255,0.08)" }}
      />
      <div className="flex-1 space-y-2">
        <div
          className="h-3 rounded-full w-24"
          style={{ background: "rgba(255,255,255,0.08)" }}
        />
        <div
          className="h-3 rounded-full w-4/5"
          style={{ background: "rgba(255,255,255,0.05)" }}
        />
        <div
          className="h-3 rounded-full w-3/5"
          style={{ background: "rgba(255,255,255,0.04)" }}
        />
      </div>
    </div>
  );
}

// ── Stats card ────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div
      className="flex-1 px-4 py-3 rounded-2xl"
      style={{
        background: accent ? "rgba(201,169,110,0.1)" : "rgba(255,255,255,0.04)",
        border: accent
          ? "0.5px solid rgba(201,169,110,0.3)"
          : "0.5px solid rgba(255,255,255,0.07)",
      }}
    >
      <p
        className="text-[11px] font-medium uppercase tracking-[0.8px] mb-1"
        style={{ color: accent ? "#c9a96e" : "rgba(255,255,255,0.35)" }}
      >
        {label}
      </p>
      <p
        className="text-2xl font-light"
        style={{
          color: accent ? "#c9a96e" : "rgba(255,255,255,0.85)",
          fontFamily: "'Cormorant Garamond', serif",
        }}
      >
        {value}
      </p>
    </div>
  );
}

// ── Page principale ───────────────────────────────────────────────────────────
export default function NotificationsPage() {
  const { profile } = useUserProfile();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<FilterTab>("all");
  const [selected, setSelected] = useState<Notification | null>(null);

  // ── Fetch ──
  useEffect(() => {
    if (!profile?.user_id) return;
    const load = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("notifications")
        .select(
          "notification_id, message, notification_type, status, created_at, user_id",
        )
        .eq("user_id", profile.user_id)
        .order("created_at", { ascending: false });
      setNotifications((data as Notification[]) ?? []);
      setLoading(false);
    };
    load();
  }, [profile?.user_id]);

  // ── Realtime ──
  useEffect(() => {
    if (!profile?.user_id) return;
    const channel = supabase
      .channel("notif-page-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${profile.user_id}`,
        },
        (payload) => {
          setNotifications((prev) => [payload.new as Notification, ...prev]);
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.user_id]);

  // ── Actions ──
  const markAsRead = async (id: number) => {
    await supabase
      .from("notifications")
      .update({ status: "read" })
      .eq("notification_id", id);
    setNotifications((prev) =>
      prev.map((n) =>
        n.notification_id === id ? { ...n, status: "read" as const } : n,
      ),
    );
    if (selected?.notification_id === id) {
      setSelected((prev) => (prev ? { ...prev, status: "read" } : null));
    }
  };

  const markAllAsRead = async () => {
    if (!profile?.user_id) return;
    await supabase
      .from("notifications")
      .update({ status: "read" })
      .eq("user_id", profile.user_id)
      .eq("status", "unread");
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, status: "read" as const })),
    );
  };

  // ── Ouverture notif + auto-mark-read ──
  const handleSelect = (notif: Notification) => {
    setSelected(notif);
    if (notif.status === "unread") markAsRead(notif.notification_id);
  };

  // ── Filtrage ──
  const filtered = useMemo(() => {
    if (tab === "all") return notifications;
    if (tab === "unread")
      return notifications.filter((n) => n.status === "unread");
    return notifications.filter(
      (n) => n.notification_type?.toLowerCase() === tab,
    );
  }, [notifications, tab]);

  const groups = useMemo(() => groupByPeriod(filtered), [filtered]);

  const unreadCount = notifications.filter((n) => n.status === "unread").length;
  const totalCount = notifications.length;

  const TABS: { key: FilterTab; label: string }[] = [
    { key: "all", label: "Toutes" },
    { key: "unread", label: "Non lues" },
    { key: "success", label: "Réservations" },
    { key: "warning", label: "Rappels" },
    { key: "error", label: "Annulations" },
    { key: "info", label: "Info" },
  ];

  return (
    <>
      {/* ── Fonts ── */}
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,400&family=DM+Sans:wght@300;400;500&display=swap"
        rel="stylesheet"
      />

      <main
        className="min-h-screen px-4 py-10 sm:px-8 lg:px-16"
        style={{ background: "#0c0c0e", fontFamily: "'DM Sans', sans-serif" }}
      >
        <div className="max-w-3xl mx-auto">
          {/* ── Header ── */}
          <div className="mb-10">
            <p
              className="text-[11px] font-medium uppercase tracking-[4px] mb-3"
              style={{ color: "#8a7560" }}
            >
              Votre compte
            </p>
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <h1
                className="text-4xl sm:text-5xl font-light leading-none"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  color: "#f0ebe3",
                }}
              >
                Mes{" "}
                <em style={{ color: "var(--bg-legebluecalme)", fontStyle: "italic" }}>
                  Notifications
                </em>
              </h1>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-2 text-[12px] font-medium px-4 py-2 rounded-xl transition-all"
                  style={{
                    background: "rgba(201,169,110,0.1)",
                    color: "var(--bg-legebluecalme)",
                    border: "0.5px solid rgba(201,169,110,0.3)",
                  }}
                >
                  <CheckSVG />
                  Tout marquer lu
                </button>
              )}
            </div>
            <div
              className="mt-4 h-px"
              style={{
                background:
                  "linear-gradient(90deg, var(--bg-legebluecalme), transparent)",
              }}
            />
          </div>

          {/* ── Stats ── */}
          {!loading && (
            <div className="flex gap-3 mb-8 flex-wrap">
              <StatCard label="Total" value={totalCount} />
              <StatCard
                label="Non lues"
                value={unreadCount}
                accent={unreadCount > 0}
              />
              <StatCard label="Aujourd'hui" value={groups.today.length} />
              <StatCard label="Cette semaine" value={groups.week.length} />
            </div>
          )}

          {/* ── Tabs ── */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
            {TABS.map((t) => {
              const count =
                t.key === "all"
                  ? totalCount
                  : t.key === "unread"
                    ? unreadCount
                    : notifications.filter(
                        (n) => n.notification_type?.toLowerCase() === t.key,
                      ).length;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className="flex items-center cursor-pointer gap-1.5 whitespace-nowrap text-[12px] font-medium px-4 py-2 rounded-xl transition-all"
                  style={{
                    background:
                      tab === t.key
                        ? "var(--bg-legebluefort)"
                        : "rgba(255,255,255,0.04)",
                    color: tab === t.key ? "var(--bg-legebluecalme)" : "rgba(255,255,255,0.45)",
                    border:
                      tab === t.key
                        ? "0.5px solid var(--bg-legebluemoyen)"
                        : "0.5px solid rgba(255,255,255,0.07)",
                  }}
                >
                  {t.label}
                  {count > 0 && (
                    <span
                      className="text-[10px] px-1.5 py-[1px] rounded-full"
                      style={{
                        background:
                          tab === t.key
                            ? "rgba(201,169,110,0.2)"
                            : "rgba(255,255,255,0.08)",
                        color:
                          tab === t.key ? "var(--bg-legebluecalme)" : "rgba(255,255,255,0.35)",
                      }}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* ── Liste ── */}
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonRow key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "0.5px solid rgba(255,255,255,0.1)",
                }}
              >
                <BellSVG className="text-white/20" />
              </div>
              <p className="text-white/30 text-[14px]">Aucune notification</p>
            </div>
          ) : (
            <div className="space-y-6">
              {groups.today.length > 0 && (
                <div>
                  <SectionLabel
                    label="Aujourd'hui"
                    count={groups.today.length}
                  />
                  <div className="space-y-2">
                    {groups.today.map((n) => (
                      <NotifRow
                        key={n.notification_id}
                        notif={n}
                        onSelect={handleSelect}
                        onMarkRead={markAsRead}
                      />
                    ))}
                  </div>
                </div>
              )}
              {groups.week.length > 0 && (
                <div>
                  <SectionLabel
                    label="Cette semaine"
                    count={groups.week.length}
                  />
                  <div className="space-y-2">
                    {groups.week.map((n) => (
                      <NotifRow
                        key={n.notification_id}
                        notif={n}
                        onSelect={handleSelect}
                        onMarkRead={markAsRead}
                      />
                    ))}
                  </div>
                </div>
              )}
              {groups.older.length > 0 && (
                <div>
                  <SectionLabel
                    label="Plus ancien"
                    count={groups.older.length}
                  />
                  <div className="space-y-2">
                    {groups.older.map((n) => (
                      <NotifRow
                        key={n.notification_id}
                        notif={n}
                        onSelect={handleSelect}
                        onMarkRead={markAsRead}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* ── Dialog detail ── */}
      <NotificationDialog notif={selected} onClose={() => setSelected(null)} />
    </>
  );
}
