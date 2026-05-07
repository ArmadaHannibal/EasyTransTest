"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { AiFillApple } from "react-icons/ai";
import { AiFillAndroid } from "react-icons/ai";
import DecorativeNumber from "@/components/DecorativeNumber";

/* ─────────────────────────────────────────────
   PHONE MOCKUP SVG
───────────────────────────────────────────── */
const PhoneMockup = () => (
  <svg
    width="160"
    viewBox="0 0 160 320"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      filter: "drop-shadow(0 24px 48px rgba(0,0,0,0.45))",
      position: "relative",
      zIndex: 2,
    }}
  >
    <rect
      x="6"
      y="2"
      width="148"
      height="316"
      rx="22"
      fill="rgba(8,12,26,0.97)"
      stroke="rgba(1,179,217,0.25)"
      strokeWidth="1.5"
    />
    <rect
      x="14"
      y="12"
      width="132"
      height="292"
      rx="16"
      fill="rgba(255,255,255,0.03)"
      stroke="rgba(255,255,255,0.06)"
      strokeWidth="0.8"
    />
    {/* Notch */}
    <rect
      x="54"
      y="16"
      width="52"
      height="10"
      rx="5"
      fill="rgba(255,255,255,0.06)"
    />
    <circle cx="80" cy="21" r="3.5" fill="rgba(255,255,255,0.12)" />
    {/* Status bar */}
    <rect
      x="22"
      y="34"
      width="30"
      height="4"
      rx="2"
      fill="rgba(1,179,217,0.3)"
    />
    <rect
      x="118"
      y="34"
      width="18"
      height="4"
      rx="2"
      fill="rgba(255,255,255,0.12)"
    />
    {/* Search */}
    <rect
      x="20"
      y="48"
      width="120"
      height="24"
      rx="12"
      fill="rgba(255,255,255,0.05)"
      stroke="rgba(1,179,217,0.15)"
      strokeWidth="0.8"
    />
    <circle cx="33" cy="60" r="5" fill="rgba(1,179,217,0.2)" />
    <rect
      x="44"
      y="57"
      width="60"
      height="5"
      rx="2.5"
      fill="rgba(255,255,255,0.08)"
    />
    {/* Card 1 highlighted */}
    <rect
      x="20"
      y="82"
      width="120"
      height="66"
      rx="12"
      fill="rgba(1,179,217,0.07)"
      stroke="rgba(1,179,217,0.2)"
      strokeWidth="0.8"
    />
    <rect
      x="28"
      y="90"
      width="36"
      height="28"
      rx="6"
      fill="rgba(1,179,217,0.15)"
    />
    <rect
      x="30"
      y="95"
      width="32"
      height="14"
      rx="3"
      fill="rgba(1,179,217,0.4)"
    />
    <circle cx="35" cy="110" r="3" fill="rgba(8,12,26,0.8)" />
    <circle cx="57" cy="110" r="3" fill="rgba(8,12,26,0.8)" />
    <rect
      x="72"
      y="92"
      width="58"
      height="6"
      rx="3"
      fill="rgba(255,255,255,0.2)"
    />
    <rect
      x="72"
      y="102"
      width="40"
      height="4"
      rx="2"
      fill="rgba(255,255,255,0.1)"
    />
    <rect
      x="72"
      y="110"
      width="28"
      height="16"
      rx="4"
      fill="rgba(1,179,217,0.5)"
    />
    <rect
      x="76"
      y="113"
      width="20"
      height="5"
      rx="2"
      fill="rgba(255,255,255,0.6)"
    />
    {/* Route dots */}
    <circle cx="28" cy="130" r="2" fill="rgba(1,179,217,0.6)" />
    <line
      x1="28"
      y1="132"
      x2="28"
      y2="138"
      stroke="rgba(1,179,217,0.2)"
      strokeWidth="1"
      strokeDasharray="2 2"
    />
    <circle cx="28" cy="140" r="2" fill="rgba(255,255,255,0.3)" />
    <rect
      x="35"
      y="128"
      width="50"
      height="4"
      rx="2"
      fill="rgba(255,255,255,0.1)"
    />
    <rect
      x="35"
      y="136"
      width="35"
      height="4"
      rx="2"
      fill="rgba(255,255,255,0.07)"
    />
    {/* Card 2 */}
    <rect
      x="20"
      y="158"
      width="120"
      height="60"
      rx="12"
      fill="rgba(255,255,255,0.03)"
      stroke="rgba(255,255,255,0.07)"
      strokeWidth="0.8"
    />
    <rect
      x="28"
      y="166"
      width="36"
      height="26"
      rx="6"
      fill="rgba(255,255,255,0.06)"
    />
    <rect
      x="30"
      y="170"
      width="32"
      height="13"
      rx="3"
      fill="rgba(255,255,255,0.1)"
    />
    <circle cx="35" cy="184" r="2.5" fill="rgba(255,255,255,0.2)" />
    <circle cx="56" cy="184" r="2.5" fill="rgba(255,255,255,0.2)" />
    <rect
      x="72"
      y="168"
      width="48"
      height="5"
      rx="2.5"
      fill="rgba(255,255,255,0.12)"
    />
    <rect
      x="72"
      y="177"
      width="32"
      height="4"
      rx="2"
      fill="rgba(255,255,255,0.07)"
    />
    <rect
      x="72"
      y="186"
      width="24"
      height="14"
      rx="4"
      fill="rgba(255,255,255,0.06)"
    />
    {/* Card 3 */}
    <rect
      x="20"
      y="228"
      width="120"
      height="55"
      rx="12"
      fill="rgba(255,255,255,0.02)"
      stroke="rgba(255,255,255,0.05)"
      strokeWidth="0.8"
    />
    <rect
      x="28"
      y="236"
      width="36"
      height="24"
      rx="6"
      fill="rgba(255,255,255,0.04)"
    />
    <rect
      x="72"
      y="238"
      width="42"
      height="5"
      rx="2.5"
      fill="rgba(255,255,255,0.09)"
    />
    <rect
      x="72"
      y="247"
      width="28"
      height="4"
      rx="2"
      fill="rgba(255,255,255,0.05)"
    />
    {/* Bottom nav */}
    <rect x="14" y="292" width="132" height="1" fill="rgba(255,255,255,0.06)" />
    <rect
      x="14"
      y="293"
      width="132"
      height="18"
      fill="rgba(255,255,255,0.02)"
    />
    <circle cx="44" cy="302" r="5" fill="rgba(1,179,217,0.3)" />
    <circle cx="72" cy="302" r="4" fill="rgba(255,255,255,0.08)" />
    <circle cx="100" cy="302" r="4" fill="rgba(255,255,255,0.08)" />
    <circle cx="128" cy="302" r="4" fill="rgba(255,255,255,0.08)" />
    {/* Side buttons */}
    <rect
      x="154"
      y="90"
      width="3"
      height="26"
      rx="1.5"
      fill="rgba(255,255,255,0.12)"
    />
    <rect
      x="3"
      y="80"
      width="3"
      height="16"
      rx="1.5"
      fill="rgba(255,255,255,0.1)"
    />
    <rect
      x="3"
      y="102"
      width="3"
      height="16"
      rx="1.5"
      fill="rgba(255,255,255,0.1)"
    />
  </svg>
);

/* ─────────────────────────────────────────────
   FEATURES DATA
───────────────────────────────────────────── */
const features = [
  {
    id: "01",
    title: "Réservation instantanée",
    description:
      "Tickets, hôtels et voitures réservés en moins de 2 minutes depuis votre poche.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="#01b3d9"
        strokeWidth="1.8"
        style={{ width: 16, height: 16 }}
      >
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
  {
    id: "02",
    title: "Suivi en temps réel",
    description:
      "Suivez votre trajet et recevez des notifications à chaque étape de votre voyage.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="#01b3d9"
        strokeWidth="1.8"
        style={{ width: 16, height: 16 }}
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    id: "03",
    title: "Paiement mobile",
    description:
      "Mobile Money, carte bancaire ou espèces — payez comme vous le souhaitez.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="#01b3d9"
        strokeWidth="1.8"
        style={{ width: 16, height: 16 }}
      >
        <rect x="1" y="4" width="22" height="16" rx="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
  },
  {
    id: "04",
    title: "Mode hors-ligne",
    description:
      "Accédez à vos billets et réservations même sans connexion internet.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="#01b3d9"
        strokeWidth="1.8"
        style={{ width: 16, height: 16 }}
      >
        <path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z" />
        <line x1="8" y1="2" x2="8" y2="18" />
        <line x1="16" y1="6" x2="16" y2="22" />
      </svg>
    ),
  },
];

/* ─────────────────────────────────────────────
   STATS DATA
───────────────────────────────────────────── */
const stats = [
  { value: "10K+", label: "Téléchargements" },
  { value: "4.8★", label: "Note store" },
  { value: "2 min", label: "Pour réserver" },
  { value: "100%", label: "Gratuit" },
];

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function SmartBanner() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleNotify = () => {
    if (email.trim()) {
      setSent(true);
      setEmail("");
    }
  };

  return (
    <>
      <style>{`
        .feat-item {
          padding: 22px 26px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          position: relative;
          transition: background 0.25s ease;
          cursor: default;
        }
        .feat-item:last-child { border-bottom: none; }
        .feat-item:hover { background: rgba(1,179,217,0.04); }
        .feat-item::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 2px;
          background: #01b3d9;
          opacity: 0;
          transition: opacity 0.25s ease;
        }
        .feat-item:hover::before { opacity: 1; }

        .store-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 13px 16px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.09);
          background: rgba(255,255,255,0.03);
          cursor: pointer;
          transition: all 0.25s ease;
          text-align: left;
          width: 100%;
        }
        .store-btn:hover {
          border-color: rgba(1,179,217,0.28);
          background: rgba(1,179,217,0.04);
        }

        .notify-submit {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          background: linear-gradient(135deg, #01b3d9, #0099cc);
          border: none;
          color: #fff;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .notify-submit:hover {
          transform: translateY(-1px);
          box-shadow: 0 0 28px rgba(1,179,217,0.28);
        }

        .app-grid {
          display: grid;
          grid-template-columns: 1fr 360px 1fr;
          max-width: 1100px;
          margin: 0 auto;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 28px;
          overflow: hidden;
        }
        .app-footer-bar {
          max-width: 1100px;
          margin: 0 auto;
          border: 1px solid rgba(255,255,255,0.07);
          border-top: none;
          border-radius: 0 0 28px 28px;
          padding: 13px 26px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
        }

        @media (max-width: 900px) {
          .app-grid { grid-template-columns: 1fr 1fr; }
          .col-phone-center {
            grid-column: span 2;
            order: -1;
            border-right: none !important;
            border-bottom: 1px solid rgba(255,255,255,0.07);
            min-height: 280px;
          }
        }
        @media (max-width: 580px) {
          .app-grid { grid-template-columns: 1fr; }
          .col-phone-center {
            grid-column: span 1;
            min-height: 260px;
          }
          .app-footer-bar { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <section className="relative py-8 md:py-10 overflow-hidden">
        {/* Left vertical line (same as original) */}
        <div className="absolute left-8 top-0 bottom-0 w-px bg-white/[0.08] hidden lg:block" />
        {/* Decorative big number */}
        <DecorativeNumber number="05" />

        <div className="relative mx-auto max-w-6xl px-4 lg:px-0">
          {/* ── HEADER (identique à l'original) ── */}
          <div className="mb-16 md:mb-20">
            <div className="flex items-center gap-5">
              <div className="w-[3px] h-20 bg-white shrink-0" />
              <div>
                <p
                  className="text-xs text-white/40 mt-1 uppercase"
                  style={{ letterSpacing: "0.45em" }}
                >
                  Application mobile
                </p>
                <h2 className="text-sm md:text-base font-black text-white tracking-tight mt-1">
                  PASSEZ À L'APPLICATION MOBILE
                </h2>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-white/20 text-xs tracking-widest">
                EasyTrans
              </span>
              <div className="w-8 h-px bg-white/10" />
            </div>
          </div>

          {/* ── GRILLE PRINCIPALE ── */}
          <div className="app-grid">
            {/* Colonne gauche — features */}
            <div className="flex flex-col">
              {features.map((f, i) => (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="feat-item"
                >
                  <p
                    className="text-[10px] font-semibold text-white/20 mb-2"
                    style={{ letterSpacing: ".25em" }}
                  >
                    {f.id}
                  </p>
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 10,
                      background: "rgba(1,179,217,0.08)",
                      border: "1px solid rgba(1,179,217,0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 10,
                    }}
                  >
                    {f.icon}
                  </div>
                  <h3 className="text-[.85rem] font-semibold text-white mb-1.5 leading-snug">
                    {f.title}
                  </h3>
                  <p className="text-[.77rem] text-white/38 leading-relaxed">
                    {f.description}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Colonne centrale — téléphone */}
            <div
              className="col-phone-center relative flex flex-col items-center justify-center overflow-hidden min-h-[480px]"
              style={{
                borderLeft: "1px solid rgba(255,255,255,0.07)",
                borderRight: "1px solid rgba(255,255,255,0.07)",
                padding: "36px 24px",
              }}
            >
              {/* Badge flottant haut droite */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 }}
                style={{
                  position: "absolute",
                  top: 22,
                  right: 18,
                  background: "rgba(8,12,26,0.92)",
                  border: "1px solid rgba(1,179,217,0.2)",
                  borderRadius: 12,
                  padding: "10px 14px",
                  zIndex: 3,
                }}
              >
                <p
                  style={{
                    fontSize: 9,
                    letterSpacing: ".18em",
                    color: "rgba(232,234,242,0.28)",
                    textTransform: "uppercase",
                    marginBottom: 3,
                  }}
                >
                  Ce mois
                </p>
                <p
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: "#4fdfff",
                    lineHeight: 1,
                  }}
                >
                  +24%
                </p>
                <p
                  style={{
                    fontSize: 10,
                    color: "rgba(232,234,242,0.32)",
                    marginTop: 2,
                  }}
                >
                  réservations
                </p>
              </motion.div>

              {/* Phone */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <PhoneMockup />
              </motion.div>

              {/* Badge flottant bas gauche */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.35 }}
                style={{
                  position: "absolute",
                  bottom: 26,
                  left: 18,
                  background: "rgba(8,12,26,0.92)",
                  border: "1px solid rgba(79,223,255,0.15)",
                  borderRadius: 12,
                  padding: "10px 14px",
                  zIndex: 3,
                }}
              >
                <p style={{ color: "#FFCC66", fontSize: 10, marginBottom: 2 }}>
                  ★★★★★
                </p>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>
                  10K+ téléchargements
                </p>
                <p
                  style={{
                    fontSize: 9,
                    color: "rgba(232,234,242,0.3)",
                    marginTop: 1,
                  }}
                >
                  Note 4.8 / 5
                </p>
              </motion.div>
            </div>

            {/* Colonne droite — CTA */}
            <div
              style={{
                padding: 26,
                display: "flex",
                flexDirection: "column",
                gap: 18,
              }}
            >
              {/* Stats */}
              <div>
                <p
                  style={{
                    fontSize: 10,
                    letterSpacing: ".12em",
                    textTransform: "uppercase",
                    color: "rgba(232,234,242,0.22)",
                    marginBottom: 12,
                  }}
                >
                  Chiffres clés
                </p>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 10,
                  }}
                >
                  {stats.map(({ value, label }) => (
                    <div
                      key={label}
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        borderRadius: 14,
                        padding: "14px 16px",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "1.4rem",
                          fontWeight: 800,
                          color: "#4fdfff",
                          lineHeight: 1,
                        }}
                      >
                        {value}
                      </p>
                      <p
                        style={{
                          fontSize: 10,
                          color: "rgba(232,234,242,0.3)",
                          marginTop: 5,
                        }}
                      >
                        {label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{ height: 1, background: "rgba(255,255,255,0.05)" }}
              />

              {/* Store buttons */}
              <div>
                <p
                  style={{
                    fontSize: 10,
                    letterSpacing: ".12em",
                    textTransform: "uppercase",
                    color: "rgba(232,234,242,0.22)",
                    marginBottom: 12,
                  }}
                >
                  Télécharger l'app
                </p>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  {/* App Store */}
                  <button className="store-btn">
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: "rgba(0,0,0,0.3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <AiFillApple
                        style={{
                          width: 20,
                          height: 20,
                          color: "rgba(255,255,255,0.8)",
                        }}
                      />
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: 9,
                          color: "rgba(232,234,242,0.3)",
                          letterSpacing: ".08em",
                          marginBottom: 2,
                        }}
                      >
                        Télécharger sur
                      </p>
                      <p
                        style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}
                      >
                        App Store
                      </p>
                    </div>
                  </button>

                  {/* Google Play */}
                  <button className="store-btn">
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: "rgba(1,179,217,0.12)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <AiFillAndroid
                        style={{ width: 20, height: 20, color: "#01b3d9" }}
                      />
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: 9,
                          color: "rgba(232,234,242,0.3)",
                          letterSpacing: ".08em",
                          marginBottom: 2,
                        }}
                      >
                        Disponible sur
                      </p>
                      <p
                        style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}
                      >
                        Google Play
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              <div
                style={{ height: 1, background: "rgba(255,255,255,0.05)" }}
              />

              {/* Notification form */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                <p
                  style={{
                    fontSize: 10,
                    letterSpacing: ".12em",
                    textTransform: "uppercase",
                    color: "rgba(232,234,242,0.25)",
                  }}
                >
                  Être notifié au lancement
                </p>
                <p
                  style={{
                    fontSize: ".77rem",
                    color: "rgba(232,234,242,0.35)",
                    lineHeight: 1.65,
                  }}
                >
                  Recevez un lien de téléchargement dès la sortie officielle de
                  l'app.
                </p>

                {sent ? (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      padding: 13,
                      borderRadius: 10,
                      background: "rgba(34,197,94,0.07)",
                      border: "1px solid rgba(34,197,94,0.18)",
                      fontSize: ".8rem",
                      color: "rgba(34,197,94,0.8)",
                    }}
                  >
                    ✓ Parfait ! Vous recevrez le lien dès le lancement.
                  </motion.div>
                ) : (
                  <>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleNotify()}
                      placeholder="votre@email.com"
                      style={{
                        width: "100%",
                        padding: "11px 14px",
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 10,
                        fontSize: ".8rem",
                        color: "rgba(232,234,242,0.65)",
                        outline: "none",
                      }}
                    />
                    <button className="notify-submit" onClick={handleNotify}>
                      M'envoyer le lien de téléchargement
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* ── FOOTER BAR ── */}
          <div className="app-footer-bar">
            <p
              style={{
                fontSize: ".72rem",
                color: "rgba(232,234,242,0.2)",
                letterSpacing: ".05em",
              }}
            >
              Votre voyage. Votre poche. Partout au Congo.
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              {["iOS", "Android", "2025"].map((t) => (
                <span
                  key={t}
                  style={{
                    padding: "3px 10px",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 100,
                    fontSize: ".68rem",
                    color: "rgba(232,234,242,0.2)",
                    letterSpacing: ".08em",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
