"use client";
import React from "react";
import {
  FiFile,
  FiCheckCircle,
  FiUpload,
  FiCalendar,
  FiTrendingUp,
} from "react-icons/fi";

const steps = [
  {
    num: "01",
    icon: FiFile,
    title: "Inscription",
    desc: "Créez votre compte partenaire en quelques minutes.",
  },
  {
    num: "02",
    icon: FiCheckCircle,
    title: "Validation du profil",
    desc: "Vérification et activation de votre compte.",
  },
  {
    num: "03",
    icon: FiUpload,
    title: "Ajout de vos offres",
    desc: "Publiez vos trajets, horaires et tarifs facilement.",
  },
  {
    num: "04",
    icon: FiCalendar,
    title: "Mise en ligne",
    desc: "Vos trajets visibles et réservables immédiatement.",
  },
  {
    num: "05",
    icon: FiTrendingUp,
    title: "Suivi & gestion",
    desc: "Gérez et optimisez depuis votre dashboard.",
  },
];

const glow = {
  filter:
    "drop-shadow(0 0 12px rgba(1,179,217,0.8)) drop-shadow(0 0 28px rgba(1,179,217,0.45))",
};

export default function Commentdevenirpartenaire() {
  return (
    <>
      <style>{`
        .steps-horiz {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 0;
          width: 100%;
          max-width: 1100px;
        }
        .steps-vert { display: none; }

        @media (max-width: 900px) {
          .steps-horiz { display: none; }
          .steps-vert  { display: flex; flex-direction: column; gap: 0; width: 100%; max-width: 480px; }
        }
      `}</style>

      {/* ── Desktop : horizontal ── */}
      <div className="steps-horiz">
        {steps.map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={s.num}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "0 8px",
              }}
            >
              {/* connector + dot */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    flex: 1,
                    height: 1,
                    background: i === 0 ? "transparent" : "rgba(1,179,217,0.3)",
                  }}
                />
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: "rgba(8,12,26,0.9)",
                    border: "1px solid rgba(1,179,217,0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    ...glow,
                  }}
                >
                  <Icon style={{ width: 18, height: 18, color: "#4fdfff" }} />
                </div>
                <div
                  style={{
                    flex: 1,
                    height: 1,
                    background:
                      i === steps.length - 1
                        ? "transparent"
                        : "rgba(1,179,217,0.3)",
                  }}
                />
              </div>
              {/* text */}
              <p
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: ".1em",
                  color: "rgba(1,179,217,0.55)",
                  textTransform: "uppercase",
                  marginBottom: 6,
                  textAlign: "center",
                }}
              >
                {s.num}
              </p>
              <h3
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#fff",
                  marginBottom: 4,
                  textAlign: "center",
                  lineHeight: 1.3,
                }}
              >
                {s.title}
              </h3>
              <p
                style={{
                  fontSize: 11,
                  color: "rgba(232,234,242,0.4)",
                  lineHeight: 1.65,
                  textAlign: "center",
                }}
              >
                {s.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* ── Mobile : vertical timeline ── */}
      <div className="steps-vert">
        {steps.map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={s.num}
              style={{
                display: "grid",
                gridTemplateColumns: "44px 1fr",
                gap: "0 16px",
              }}
            >
              {/* spine */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: "rgba(8,12,26,0.85)",
                    border: "1px solid rgba(1,179,217,0.35)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    position: "relative",
                    zIndex: 1,
                    ...glow,
                  }}
                >
                  <Icon style={{ width: 18, height: 18, color: "#4fdfff" }} />
                </div>
                {i < steps.length - 1 && (
                  <div
                    style={{
                      width: 1,
                      flex: 1,
                      minHeight: 20,
                      background:
                        "linear-gradient(to bottom, rgba(1,179,217,0.3), rgba(1,179,217,0.04))",
                      margin: "4px 0",
                    }}
                  />
                )}
              </div>
              {/* card */}
              <div
                style={{
                  background: "rgba(8,12,26,0.65)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 14,
                  padding: "14px 16px",
                  marginBottom: 12,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    right: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: 52,
                    fontWeight: 800,
                    color: "rgba(1,179,217,0.05)",
                    lineHeight: 1,
                    pointerEvents: "none",
                  }}
                >
                  {s.num}
                </span>
                <p
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: ".1em",
                    color: "rgba(1,179,217,0.55)",
                    textTransform: "uppercase",
                    marginBottom: 5,
                  }}
                >
                  {s.num}
                </p>
                <h3
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#fff",
                    marginBottom: 4,
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    fontSize: 12,
                    color: "rgba(232,234,242,0.42)",
                    lineHeight: 1.65,
                  }}
                >
                  {s.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
