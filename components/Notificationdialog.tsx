"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

// ── Types ──────────────────────────────────────────────────────────────────────
export interface Notification {
  notification_id: number;
  message: string | null;
  notification_type: string | null;
  status: "read" | "unread";
  created_at: string;
  user_id: string | null;
}

// ── Config type ────────────────────────────────────────────────────────────────
export const TYPE_CONFIG: Record<
  string,
  {
    label: string;
    iconBg: string;
    iconColor: string;
    pillBg: string;
    pillColor: string;
    borderColor: string;
    icon: React.ReactNode;
  }
> = {
  info: {
    label: "Info",
    iconBg: "#E6F1FB",
    iconColor: "#185FA5",
    pillBg: "#E6F1FB",
    pillColor: "#0C447C",
    borderColor: "#85B7EB",
    icon: (
      <svg
        width="20"
        height="20"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  success: {
    label: "Réservation",
    iconBg: "#EAF3DE",
    iconColor: "#3B6D11",
    pillBg: "#EAF3DE",
    pillColor: "#27500A",
    borderColor: "#97C459",
    icon: (
      <svg
        width="20"
        height="20"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  warning: {
    label: "Rappel",
    iconBg: "#FAEEDA",
    iconColor: "#854F0B",
    pillBg: "#FAEEDA",
    pillColor: "#633806",
    borderColor: "#EF9F27",
    icon: (
      <svg
        width="20"
        height="20"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
        />
      </svg>
    ),
  },
  error: {
    label: "Annulation",
    iconBg: "#FCEBEB",
    iconColor: "#A32D2D",
    pillBg: "#FCEBEB",
    pillColor: "#791F1F",
    borderColor: "#F09595",
    icon: (
      <svg
        width="20"
        height="20"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    ),
  },
};

export const fallbackConfig = TYPE_CONFIG["info"];

// ── Helpers date ───────────────────────────────────────────────────────────────
export const fmtDateFull = (d: string) =>
  new Date(d).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export const fmtDateShort = (d: string) => {
  const diff = Date.now() - new Date(d).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "À l'instant";
  if (mins < 60) return `Il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `Il y a ${days}j`;
  return new Date(d).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });
};

// ── Dialog ─────────────────────────────────────────────────────────────────────
interface NotificationDialogProps {
  notif: Notification | null;
  onClose: () => void;
}

export function NotificationDialog({
  notif,
  onClose,
}: NotificationDialogProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Fermeture clic fond
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  // Fermeture Échap
  useEffect(() => {
    if (!notif) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [notif, onClose]);

  // Lock scroll
  useEffect(() => {
    if (notif) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [notif]);

  if (!notif) return null;

  const cfg =
    TYPE_CONFIG[notif.notification_type?.toLowerCase() ?? ""] ?? fallbackConfig;

  // createPortal monte le dialog directement dans <body>
  // → échappe à tout contexte d'empilement (navbar fixed, etc.)
  // → z-[9999] garantit qu'il passe au-dessus de tout
  const dialog = (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center", // centré verticalement sur desktop
        justifyContent: "center",
        background: "rgba(12,12,14,0.8)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        padding: "1rem",
      }}
    >
      {/* Panel centré */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "440px",
          background: "#0c0c0e",
          borderRadius: "20px",
          border: "0.5px solid var(--bg-legebluecalme)",
          boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
          animation: "notifSlideIn 0.25s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        <style>{`
          @keyframes notifSlideIn {
            from { opacity: 0; transform: scale(0.93) translateY(12px); }
            to   { opacity: 1; transform: scale(1)    translateY(0); }
          }
        `}</style>

        {/* Barre colorée top */}
        <div
          style={{
            height: 3,
            margin: "16px 24px 0",
            borderRadius: 99,
            background: cfg.borderColor,
            opacity: 0.8,
          }}
        />

        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 16,
            padding: "20px 24px 16px",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 16,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: cfg.iconBg,
              color: cfg.iconColor,
            }}
          >
            {cfg.icon}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 6,
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.8px",
                  textTransform: "uppercase",
                  padding: "2px 8px",
                  borderRadius: 4,
                  background: cfg.pillBg,
                  color: cfg.pillColor,
                }}
              >
                {cfg.label}
              </span>
              {notif.status === "unread" && (
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 500,
                    color: "#c9a96e",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                  }}
                >
                  • Nouveau
                </span>
              )}
            </div>
            <p
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.35)",
                margin: 0,
              }}
            >
              {fmtDateFull(notif.created_at)}
            </p>
          </div>

          {/* Fermer */}
          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "rgba(255,255,255,0.35)",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(255,255,255,0.1)";
              (e.currentTarget as HTMLButtonElement).style.color =
                "rgba(255,255,255,0.9)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "transparent";
              (e.currentTarget as HTMLButtonElement).style.color =
                "rgba(255,255,255,0.35)";
            }}
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Séparateur */}
        <div
          style={{
            margin: "0 24px",
            height: 1,
            background: "rgba(201,169,110,0.12)",
          }}
        />

        {/* Message */}
        <div style={{ padding: "20px 24px" }}>
          <p
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.78)",
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            {notif.message ?? "Aucun contenu disponible."}
          </p>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "8px 24px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <p
            style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", margin: 0 }}
          >
            #{notif.notification_id}
          </p>
          <button
            onClick={onClose}
            style={{
              fontSize: 12,
              fontWeight: 500,
              padding: "8px 20px",
              borderRadius: 12,
              cursor: "pointer",
              border: "0.5px solid var(--bg-legebluecalme)",
              background: "var(--bg-legebluefort)",
              color: "var(--bg-legebluemoyen)",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "#fff";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "var(--bg-legebluefort)";
            }}
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );

  // Monte dans <body> pour échapper à tout contexte d'empilement
  return createPortal(dialog, document.body);
}
