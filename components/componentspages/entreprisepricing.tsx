"use client";

import React from "react";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { IoRocketSharp } from "react-icons/io5";
import { MdTrendingUp } from "react-icons/md";
import { GiQueenCrown } from "react-icons/gi";
import { FaCheckCircle } from "react-icons/fa";

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
interface PlanFeature {
  text: string;
}

interface PlanConfig {
  id: string;
  icon: React.ElementType;
  name: string;
  price: string;
  tagline: string;
  color: string;
  rgb: string;
  features: PlanFeature[];
  commissionLabel: string;
  btnLabel: string;
  btnVariant: "ghost" | "primary" | "gold";
  featured?: boolean;
  href?: string;
}

/* ─────────────────────────────────────────────
   PLAN DATA
───────────────────────────────────────────── */
const PLANS: PlanConfig[] = [
  {
    id: "starter",
    icon: IoRocketSharp,
    name: "Starter",
    price: "0",
    tagline: "Lancez votre activité sans risque. Idéal pour démarrer.",
    color: "#01b3d9",
    rgb: "1,179,217",
    commissionLabel: "Commission sur réservations uniquement",
    btnLabel: "Commencer gratuitement",
    btnVariant: "ghost",
    href: "/demandepartenaire",
    features: [
      { text: "Mise en ligne de vos offres" },
      { text: "Accès tableau de bord partenaire" },
      { text: "Gestion des réservations" },
      { text: "Support standard" },
    ],
  },
  {
    id: "business",
    icon: MdTrendingUp,
    name: "Business",
    price: "15 000",
    tagline: "Développez votre visibilité et augmentez vos réservations.",
    color: "#4DA6FF",
    rgb: "77,166,255",
    commissionLabel: "Commission réduite sur chaque réservation",
    btnLabel: "Commencer",
    btnVariant: "primary",
    featured: true,
    href: "/demandepartenaire",
    features: [
      { text: "Tout le plan Starter" },
      { text: "Mise en avant de vos offres" },
      { text: "Statistiques réservations & CA" },
      { text: "Priorité dans les résultats" },
      { text: "Support réactif dédié" },
    ],
  },
  {
    id: "pro-plus",
    icon: GiQueenCrown,
    name: "Pro Plus",
    price: "35 000",
    tagline: "Accélérez votre croissance avec une solution complète.",
    color: "#FFCC66",
    rgb: "255,204,102",
    commissionLabel: "Commission minimale garantie",
    btnLabel: "Commencer",
    btnVariant: "gold",
    href: "/demandepartenaire",
    features: [
      { text: "Tout le plan Business" },
      { text: "Mise en avant premium (positions stratégiques)" },
      { text: "Statistiques avancées & rapports détaillés" },
      { text: "Multi-véhicules / multi-agences" },
      { text: "Support prioritaire & accompagnement perso" },
    ],
  },
];

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
   PLAN CARD
───────────────────────────────────────────── */
function PlanCard({ plan }: { plan: PlanConfig }) {
  const { icon: Icon, color, rgb, featured } = plan;

  return (
    <div
      className="relative overflow-hidden rounded-[24px] backdrop-blur-md p-9 pt-10 flex flex-col transition-transform duration-300 hover:-translate-y-1.5"
      style={{
        background: featured ? "rgba(8,16,36,0.88)" : "rgba(8,12,26,0.72)",
        border: `1px solid ${featured ? `rgba(${rgb},0.28)` : "rgba(255,255,255,0.07)"}`,
      }}
    >
      {/* Featured top line */}
      {featured && (
        <div
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{
            background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          }}
        />
      )}

      {/* Featured badge */}
      {featured && (
        <div
          className="absolute -top-px left-1/2 -translate-x-1/2 px-4 py-1 rounded-b-xl text-[10px] font-semibold text-white tracking-widest whitespace-nowrap"
          style={{ background: color }}
        >
          LE PLUS POPULAIRE
        </div>
      )}

      {/* Icon */}
      <div
        className="w-14 h-14 rounded-[18px] flex items-center justify-center mx-auto mb-5 mt-2"
        style={{
          background: `rgba(${rgb},0.12)`,
          border: `1px solid rgba(${rgb},0.25)`,
          boxShadow: featured ? `0 0 32px rgba(${rgb},0.2)` : "none",
        }}
      >
        <Icon style={{ width: 26, height: 26, color }} />
      </div>

      {/* Plan name */}
      <p
        className="text-center text-[11px] font-semibold tracking-[.12em] uppercase mb-1.5"
        style={{ color }}
      >
        {plan.name}
      </p>

      {/* Price */}
      <div className="text-center mb-1.5">
        <span
          className="font-extrabold leading-none"
          style={{
            fontSize: "clamp(2rem, 4vw, 2.6rem)",
            color: plan.id === "starter" ? "#4fdfff" : color,
            filter:
              plan.id === "starter"
                ? "drop-shadow(0 0 14px rgba(79,223,255,0.35))"
                : "none",
          }}
        >
          {plan.price}
        </span>
        <span className="text-[.78rem] text-[rgba(232,234,242,0.3)] ml-1">
          FCFA / mois
        </span>
      </div>

      {/* Tagline */}
      <p className="text-center text-[.78rem] text-[rgba(232,234,242,0.48)] leading-relaxed mb-5 min-h-[40px]">
        {plan.tagline}
      </p>

      {/* Divider */}
      <div
        className="h-px mb-5"
        style={{
          background: `linear-gradient(90deg, transparent, rgba(${rgb},0.2), transparent)`,
        }}
      />

      {/* Features */}
      <ul className="flex flex-col gap-2.5 mb-6 flex-1">
        {plan.features.map((f, i) => (
          <li
            key={i}
            className="flex items-start gap-2.5 text-[.8rem] text-[rgba(232,234,242,0.85)] leading-snug"
          >
            <FaCheckCircle
              className="flex-shrink-0 mt-0.5"
              style={{
                width: 14,
                height: 14,
                color,
                filter: `drop-shadow(0 0 6px rgba(${rgb},0.6))`,
              }}
            />
            {f.text}
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      {plan.btnVariant === "ghost" && (
        <Button
          as={Link}
          href={plan.href}
          variant="bordered"
          radius="full"
          className="w-full font-semibold"
          style={{
            borderColor: "rgba(255,255,255,0.12)",
            color: "rgba(232,234,242,0.65)",
            background: "rgba(255,255,255,0.04)",
          }}
        >
          {plan.btnLabel}
        </Button>
      )}
      {plan.btnVariant === "primary" && (
        <Button
          as={Link}
          href={plan.href}
          radius="full"
          className="w-full font-semibold text-white"
          style={{
            background: `linear-gradient(135deg, #01b3d9, #0099cc)`,
            boxShadow: "0 0 32px rgba(1,179,217,0.25)",
          }}
        >
          {plan.btnLabel}
        </Button>
      )}
      {plan.btnVariant === "gold" && (
        <Button
          as={Link}
          href={plan.href}
          radius="full"
          className="w-full font-semibold"
          style={{
            background: "linear-gradient(135deg, #FFCC66, #e6a800)",
            color: "rgba(0,0,0,0.78)",
          }}
        >
          {plan.btnLabel}
        </Button>
      )}

      {/* Commission footer */}
      <div className="mt-4 text-center">
        <p className="text-[.72rem] text-[rgba(232,234,242,0.3)] mb-2">
          {plan.commissionLabel}
        </p>
        <div className="flex items-center justify-center gap-2">
          <div
            className="flex-1 h-px max-w-[40px]"
            style={{ background: `rgba(${rgb},0.3)` }}
          />
          <span className="text-[.72rem]" style={{ color }}>
            EasyTrans
          </span>
          <div
            className="flex-1 h-px max-w-[40px]"
            style={{ background: `rgba(${rgb},0.3)` }}
          />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PRICING SECTION
───────────────────────────────────────────── */
export default function PricingSection() {
  return (
    <>
      <style>{`
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          max-width: 1050px;
          margin: 0 auto;
          align-items: start;
        }
        @media (max-width: 900px) {
          .pricing-grid {
            grid-template-columns: 1fr 1fr;
          }
          .pricing-featured {
            order: -1;
            grid-column: span 2;
            max-width: 420px;
            margin-left: auto;
            margin-right: auto;
            width: 100%;
          }
        }
        @media (max-width: 600px) {
          .pricing-grid {
            grid-template-columns: 1fr;
          }
          .pricing-featured {
            order: 0;
            grid-column: span 1;
            max-width: 100%;
          }
        }
      `}</style>

      <section className="relative px-[5%] pt-[100px] pb-[120px] overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full"
            style={{
              background:
                "radial-gradient(ellipse, rgba(1,99,139,0.05) 0%, transparent 65%)",
            }}
          />
        </div>

        {/* Header */}
        <div
          className="relative z-10 max-w-[540px] mx-auto text-center mb-16"
          style={{ color: "#fff" }}
        >
          <SectionLabel>Tarifs</SectionLabel>
          <h2
            className="font-bold leading-tight mb-3"
            style={{
              fontSize: "clamp(1.7rem, 3vw, 2.4rem)",
              letterSpacing: "-0.025em",
            }}
          >
            Des tarifs pensés pour{" "}
            <span style={{ color: "#4fdfff" }}>les partenaires</span>
          </h2>
          <p className="text-[.875rem] text-[rgba(232,234,242,0.44)] leading-relaxed">
            Des formules conçues pour vous aider à développer votre activité, à
            votre rythme — sans engagement.
          </p>
        </div>

        {/* Cards */}
        <div className="pricing-grid relative z-10">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={plan.featured ? "pricing-featured" : ""}
            >
              <PlanCard plan={plan} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
