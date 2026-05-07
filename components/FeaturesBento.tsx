"use client";

import React, { useState } from "react";
import { FaBus } from "react-icons/fa";
import { MdFlashOn } from "react-icons/md";
import { BsFillCreditCard2FrontFill } from "react-icons/bs";
import { IoStatsChart } from "react-icons/io5";
import { FaHandshakeSimple } from "react-icons/fa6";
import { TbChevronRight, TbCode } from "react-icons/tb";

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
interface BentoCardProps {
  icon: React.ElementType;
  color: string;
  rgb: string;
  title: string;
  desc: string;
  highlight?: boolean;
  children?: React.ReactNode;
  className?: string;
}

/* ─────────────────────────────────────────────
   SECTION LABEL
───────────────────────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2.5 mb-3.5">
      <span className="w-5 h-px bg-[rgba(1,179,217,0.45)]" />
      <span className="text-[10px] tracking-[.14em] uppercase text-[#01b3d9] font-semibold">
        {children}
      </span>
      <span className="w-5 h-px bg-[rgba(1,179,217,0.45)]" />
    </div>
  );
}

/* ─────────────────────────────────────────────
   BASE BENTO CARD
───────────────────────────────────────────── */
function BentoCard({
  icon: Icon,
  color,
  rgb,
  title,
  desc,
  highlight = false,
  children,
  className = "",
}: BentoCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`relative overflow-hidden rounded-[22px] p-7 backdrop-blur-md cursor-default transition-all duration-300 ${className}`}
      style={{
        background: hovered ? "rgba(10,16,36,0.88)" : "rgba(8,12,26,0.72)",
        border: `1px solid ${hovered ? `rgba(${rgb},0.28)` : "rgba(255,255,255,0.07)"}`,
        transform: hovered ? "translateY(-5px)" : "translateY(0)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top shimmer line */}
      <div
        className="absolute top-0 left-0 right-0 h-px transition-opacity duration-300"
        style={{
          background: `linear-gradient(90deg, transparent, rgba(${rgb},0.35), transparent)`,
          opacity: hovered ? 1 : highlight ? 0.6 : 0,
        }}
      />

      {/* Highlight badge */}
      {highlight && (
        <div className="absolute top-4 right-4 px-3 py-0.5 rounded-full text-[10px] tracking-widest text-[#4fdfff] bg-[rgba(1,179,217,0.08)] border border-[rgba(1,179,217,0.2)]">
          POPULAIRE
        </div>
      )}

      {/* Bottom glow */}
      <div
        className="absolute bottom-[-50px] right-[-50px] w-36 h-36 rounded-full pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle, rgba(${rgb},0.1) 0%, transparent 70%)`,
          opacity: hovered ? 1 : highlight ? 0.5 : 0,
        }}
      />

      {/* Icon */}
      <div
        className="w-12 h-12 rounded-[14px] flex items-center justify-center mb-5 transition-all duration-300"
        style={{
          background: `rgba(${rgb},0.1)`,
          border: `1px solid rgba(${rgb},0.22)`,
          boxShadow: hovered ? `0 0 28px rgba(${rgb},0.28)` : "none",
        }}
      >
        <Icon
          style={{
            width: 22,
            height: 22,
            color,
            filter: hovered ? `drop-shadow(0 0 8px rgba(${rgb},0.7))` : "none",
            transition: "all 0.35s ease",
          }}
        />
      </div>

      <h3 className="text-[.95rem] font-semibold text-white mb-2 leading-snug">
        {title}
      </h3>
      <p className="text-[.82rem] text-[rgba(232,234,242,0.45)] leading-relaxed">
        {desc}
      </p>

      {children}

      {/* Learn more */}
      <div
        className="flex items-center gap-1.5 mt-4 text-[11px] transition-all duration-300"
        style={{
          color,
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateY(0)" : "translateY(4px)",
        }}
      >
        <span>En savoir plus</span>
        <TbChevronRight size={13} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   STAT PILL (used in analytics card)
───────────────────────────────────────────── */
function StatPill({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(1,179,217,0.1)] rounded-xl p-2.5">
      <div className="text-[1.2rem] font-bold text-[#4fdfff] leading-none">{value}</div>
      <div className="text-[10px] text-[rgba(232,234,242,0.3)] mt-1">{label}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   FEATURES SECTION
───────────────────────────────────────────── */
export default function FeaturesBento() {
  return (
    <>
      <style>{`
        .bento-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 14px;
          max-width: 1100px;
          margin: 0 auto;
        }
        .b1 { grid-column: span 4; }
        .b2 { grid-column: span 4; }
        .b3 { grid-column: span 4; }
        .b4 { grid-column: span 5; }
        .b5 { grid-column: span 4; }
        .b6 { grid-column: span 3; }

        @media (max-width: 900px) {
          .b1, .b2, .b3 { grid-column: span 6; }
          .b4, .b5      { grid-column: span 6; }
          .b6            { grid-column: span 12; }
          .wide-inner    { flex-direction: row; }
        }
        @media (max-width: 600px) {
          .b1, .b2, .b3,
          .b4, .b5, .b6  { grid-column: span 12; }
          .wide-inner    { flex-direction: column; }
        }
      `}</style>

      <section className="relative px-[5%] py-[100px] overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          <div
            className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(1,99,139,0.06) 0%, transparent 70%)",
            }}
          />
        </div>

        {/* Header */}
        <div
          className="relative z-10 max-w-[580px] mx-auto text-center mb-14"
          style={{ color: "#fff" }}
        >
          <SectionLabel>Fonctionnalités</SectionLabel>
          <h2
            className="font-bold leading-tight mb-3"
            style={{
              fontSize: "clamp(1.7rem, 3vw, 2.4rem)",
              letterSpacing: "-0.025em",
            }}
          >
            Tout ce dont vous avez besoin,{" "}
            <span style={{ color: "#4fdfff" }}>dans un seul outil</span>
          </h2>
          <p className="text-[.875rem] text-[rgba(232,234,242,0.44)] leading-relaxed">
            Une plateforme conçue pour les professionnels du transport —
            intuitive, puissante, évolutive.
          </p>
        </div>

        {/* Bento grid */}
        <div className="bento-grid relative z-10">

          {/* 1 — Visibilité */}
          <BentoCard
            className="b1"
            icon={FaBus}
            color="#4fdfff"
            rgb="79,223,255"
            title="Visibilité maximale"
            desc="Vos trajets exposés à une audience qualifiée prête à réserver, sans effort supplémentaire de votre part."
          />

          {/* 2 — Réservations (highlight) */}
          <BentoCard
            className="b2"
            icon={MdFlashOn}
            color="#01b3d9"
            rgb="1,179,217"
            title="Réservations centralisées"
            desc="Fini jongler entre plusieurs outils. Gérez tout depuis un tableau de bord unique et intuitif."
            highlight
          />

          {/* 3 — Paiements */}
          <BentoCard
            className="b3"
            icon={BsFillCreditCard2FrontFill}
            color="#00cfff"
            rgb="0,207,255"
            title="Paiements sans friction"
            desc="Parcours optimisé pour maximiser votre taux de conversion à chaque étape du tunnel."
          />

          {/* 4 — Analytics (wide, horizontal layout) */}
          <div
            className="b4 relative overflow-hidden rounded-[22px] backdrop-blur-md p-7 cursor-default group transition-all duration-300"
            style={{
              background: "rgba(8,12,26,0.72)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,153,255,0.28)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-5px)";
              (e.currentTarget as HTMLElement).style.background = "rgba(10,16,36,0.88)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLElement).style.background = "rgba(8,12,26,0.72)";
            }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: "linear-gradient(90deg,transparent,rgba(0,153,255,0.35),transparent)" }}
            />
            <div
              className="absolute bottom-[-50px] right-[-50px] w-36 h-36 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{ background: "radial-gradient(circle,rgba(0,153,255,0.1),transparent 70%)" }}
            />

            {/* Horizontal layout */}
            <div className="wide-inner flex gap-6 items-start">
              <div
                className="w-12 h-12 rounded-[14px] flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-300 group-hover:shadow-[0_0_28px_rgba(0,153,255,0.3)]"
                style={{ background: "rgba(0,153,255,0.1)", border: "1px solid rgba(0,153,255,0.22)" }}
              >
                <IoStatsChart style={{ width: 22, height: 22, color: "#0099ff" }} />
              </div>
              <div className="flex-1">
                <h3 className="text-[.95rem] font-semibold text-white mb-2 leading-snug">
                  Analytics en temps réel
                </h3>
                <p className="text-[.82rem] text-[rgba(232,234,242,0.45)] leading-relaxed">
                  Réservations, revenus, taux d'occupation — toutes vos métriques accessibles en un clin d'œil.
                </p>
                <div className="grid grid-cols-2 gap-2.5 mt-4">
                  <StatPill value="+24%" label="Croissance moy." />
                  <StatPill value="99.9%" label="Disponibilité" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 mt-4 text-[11px] text-[#0099ff] opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
              <span>En savoir plus</span>
              <TbChevronRight size={13} />
            </div>
          </div>

          {/* 5 — Partenariat */}
          <BentoCard
            className="b5"
            icon={FaHandshakeSimple}
            color="#5effff"
            rgb="94,255,255"
            title="Partenariat équitable"
            desc="Conditions transparentes, croissance partagée. Nous réussissons ensemble, sans frais cachés."
          />

          {/* 6 — API mini card */}
          <div
            className="b6 relative overflow-hidden rounded-[22px] backdrop-blur-md p-7 cursor-default group transition-all duration-300"
            style={{
              background: "rgba(8,12,26,0.72)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(1,179,217,0.28)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-5px)";
              (e.currentTarget as HTMLElement).style.background = "rgba(10,16,36,0.88)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLElement).style.background = "rgba(8,12,26,0.72)";
            }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: "linear-gradient(90deg,transparent,rgba(1,179,217,0.35),transparent)" }}
            />
            <div className="flex items-center gap-3.5 mb-3.5">
              <div
                className="w-12 h-12 rounded-[14px] flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:shadow-[0_0_28px_rgba(1,179,217,0.3)]"
                style={{ background: "rgba(1,179,217,0.1)", border: "1px solid rgba(1,179,217,0.22)" }}
              >
                <TbCode style={{ width: 22, height: 22, color: "#01b3d9" }} />
              </div>
              <h3 className="text-[.95rem] font-semibold text-white leading-snug">
                API & intégrations
              </h3>
            </div>
            <p className="text-[.82rem] text-[rgba(232,234,242,0.45)] leading-relaxed">
              Connectez vos outils existants via notre API robuste et webhooks temps réel.
            </p>
            <div className="flex flex-wrap gap-1.5 mt-4">
              {["REST API", "Webhooks", "SDK"].map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-full text-[10px] text-[#4fdfff]"
                  style={{
                    background: "rgba(1,179,217,0.08)",
                    border: "1px solid rgba(1,179,217,0.18)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

        </div>
      </section>
    </>
  );
}