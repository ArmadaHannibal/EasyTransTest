"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useUserProfile } from "@/hooks/useUserProfile";
import {
  TYPE_CONFIG,
  fallbackConfig,
  fmtDateShort,
  NotificationDialog,
  type Notification,
} from "@/components/Notificationdialog";

const supabase = createClient();

type FilterTab = "all" | "unread" | "system";

const isToday = (d: string) =>
  new Date(d).toDateString() === new Date().toDateString();

// ── Icône cloche ──────────────────────────────────────────────────────────────
function BellSVG({ className }: { className?: string }) {
  return (
    <svg
      className={className}
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
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
      />
    </svg>
  );
}

// ── Séparateur ────────────────────────────────────────────────────────────────
function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5">
      <div className="flex-1 h-px bg-border" />
      <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.8px] whitespace-nowrap">
        {label}
      </span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}

// ── Item ──────────────────────────────────────────────────────────────────────
function NotifItem({
  notif,
  onSelect,
}: {
  notif: Notification;
  onSelect: (n: Notification) => void;
}) {
  const cfg =
    TYPE_CONFIG[notif.notification_type?.toLowerCase() ?? ""] ?? fallbackConfig;
  const isUnread = notif.status === "unread";

  return (
    <button
      type="button"
      onClick={() => onSelect(notif)}
      className={`w-full text-left flex items-start gap-3 cursor-pointer px-3 py-2.5 rounded-xl transition-colors relative group bg-glacev2
        ${isUnread ? "bg-(--bg-legebluemoyen) hover:bg-(--bg-legebluecalme)" : "hover:bg-(--bg-legebluecalme)"}`}
    >
      <div
        className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: cfg.iconBg, color: cfg.iconColor }}
      >
        {cfg.icon}
      </div>
      <div className="flex-1 min-w-0 pr-4">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span
            className="text-[10px] font-medium uppercase tracking-[0.5px] px-1.5 py-[1px] rounded-[4px]"
            style={{ background: cfg.pillBg, color: cfg.pillColor }}
          >
            {cfg.label}
          </span>
          <span className="text-[11px] text-muted-foreground ml-auto">
            {fmtDateShort(notif.created_at)}
          </span>
        </div>
        <p className="text-[13px] text-foreground/75 leading-snug line-clamp-2">
          {notif.message ?? "—"}
        </p>
      </div>
      {isUnread && (
        <span className="absolute top-3.5 right-3 w-[7px] h-[7px] rounded-full bg-blue-500 flex-shrink-0" />
      )}
    </button>
  );
}

// ── Composant principal ───────────────────────────────────────────────────────
export default function Notifications() {
  const { profile } = useUserProfile();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<FilterTab>("all");
  const [selected, setSelected] = useState<Notification | null>(null);

  const unreadCount = notifications.filter((n) => n.status === "unread").length;

  useEffect(() => {
    if (!profile?.user_id) return;
    const fetchNotifications = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("notifications")
        .select(
          "notification_id, message, notification_type, status, created_at, user_id",
        )
        .eq("user_id", profile.user_id)
        .order("created_at", { ascending: false })
        .limit(30);
      setNotifications((data as Notification[]) ?? []);
      setLoading(false);
    };
    fetchNotifications();
  }, [profile?.user_id]);

  useEffect(() => {
    if (!profile?.user_id) return;
    const channel = supabase
      .channel("notifications-realtime")
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
  };

  const handleSelect = (notif: Notification) => {
    setSelected(notif);
    setOpen(false); // ferme le popover
    if (notif.status === "unread") markAsRead(notif.notification_id);
  };

  const SYSTEM_TYPES = ["info", "warning"];
  const filtered = notifications.filter((n) => {
    if (tab === "unread") return n.status === "unread";
    if (tab === "system")
      return SYSTEM_TYPES.includes(n.notification_type?.toLowerCase() ?? "");
    return true;
  });

  const todayNotifs = filtered.filter((n) => isToday(n.created_at));
  const olderNotifs = filtered.filter((n) => !isToday(n.created_at));

  if (!profile?.user_id) return null;

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="relative w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white border-none cursor-pointer"
            aria-label="Notifications"
          >
            <BellSVG />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-(--bg-legebluecalme) text-[#0c0c0e] text-[10px] font-semibold flex items-center justify-center leading-none">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-[340px] p-0 rounded-[20px] border border-border/50 bg-background shadow-xl overflow-hidden"
          align="end"
          sideOffset={8}
        >
          {/* Header */}
          <div className="px-4 pt-4 pb-3 border-b border-border/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-[10px] bg-[#0c1f2e] flex items-center justify-center flex-shrink-0">
                  <BellSVG className="text-(--bg-legebluecalme)" />
                </div>
                <span className="text-[15px] font-medium">Notifications</span>
                {unreadCount > 0 && (
                  <span className="bg-[#0c1f2e] text-(--bg-legebluecalme) text-[11px] font-medium px-2 py-0.5 rounded-full">
                    {unreadCount} nouvelle{unreadCount > 1 ? "s" : ""}
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-[11px] text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
                >
                  Tout lire
                </button>
              )}
            </div>

            {/* Tabs */}
            <div className="flex gap-1">
              {(["all", "unread", "system"] as FilterTab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`text-[12px] font-medium px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    tab === t
                      ? "bg-(--bg-legebluemoyen) text-white"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t === "all"
                    ? "Toutes"
                    : t === "unread"
                      ? "Non lues"
                      : "Système"}
                </button>
              ))}
            </div>
          </div>

          {/* Liste */}
          <div className="max-h-[380px] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <div className="w-5 h-5 border-2 border-border border-t-foreground rounded-full animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground">
                <div className="w-12 h-12 rounded-full bg-(--bg-legebluecalme) flex items-center justify-center">
                  <BellSVG className="opacity-80 text-white" />
                </div>
                <p className="text-[13px]">Aucune notification</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2 p-2">
                {todayNotifs.length > 0 && (
                  <>
                    <SectionDivider label="Aujourd'hui" />
                    {todayNotifs.map((n) => (
                      <NotifItem
                        key={n.notification_id}
                        notif={n}
                        onSelect={handleSelect}
                      />
                    ))}
                  </>
                )}
                {olderNotifs.length > 0 && (
                  <>
                    <SectionDivider label="Plus ancien" />
                    {olderNotifs.map((n) => (
                      <NotifItem
                        key={n.notification_id}
                        notif={n}
                        onSelect={handleSelect}
                      />
                    ))}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Footer → lien vers la page historique */}
          {filtered.length > 0 && (
            <div className="border-t border-border/50 px-4 py-2.5 flex justify-center">
              <button
                onClick={() => {
                  setOpen(false);
                  router.push("/notifications");
                }}
                className="text-[12px] font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                Voir toutes les notifications →
              </button>
            </div>
          )}
        </PopoverContent>
      </Popover>

      {/* Dialog de détail (hors popover pour éviter le z-index conflit) */}
      <NotificationDialog notif={selected} onClose={() => setSelected(null)} />
    </>
  );
}
