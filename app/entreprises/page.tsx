"use client";

import LaserFlow from "@/components/LaserFlow";
import { Button } from "@heroui/button";
import React, { useState, useEffect, useRef } from "react";
import { Link } from "@heroui/link";
import LightPillar from "@/components/LightPillar";
import { FaBus } from "react-icons/fa";
import { MdFlashOn } from "react-icons/md";
import { BsFillCreditCard2FrontFill } from "react-icons/bs";
import { IoStatsChart } from "react-icons/io5";
import { FaHandshakeSimple } from "react-icons/fa6";
import { Chip } from "@heroui/chip";
import Commentdevenirpartenaire from "@/components/componentspages/entrepriseCommentdevenirpartenaire";
import PageEntreprisePricing from "@/components/componentspages/entreprisepricing";
import FeaturesBento from "@/components/FeaturesBento";
import { SparklesCore } from "@/components/ui/sparkles";
import { IoIosLock } from "react-icons/io";
import { GiGearHammer } from "react-icons/gi";
import { FaPhone } from "react-icons/fa";
import { FaCaretLeft, FaCaretRight, FaStar } from "react-icons/fa6";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { HiBuildingOffice } from "react-icons/hi2";
import { TbArrowRight, TbChevronRight } from "react-icons/tb";
import {
  RiShieldCheckLine,
  RiLineChartLine,
  RiCustomerServiceLine,
} from "react-icons/ri";
import { IoIosStats } from "react-icons/io";

/* ─────────────────────────────────────────────
   HOOKS
───────────────────────────────────────────── */
function useScrollReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function FadeUp({
  children,
  delay = 0,
  className = "",
  style,
  onMouseEnter,
  onMouseLeave,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) {
  const { ref, visible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={className}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        ...style,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.9s cubic-bezier(.16,1,.3,1) ${delay}ms, transform 0.9s cubic-bezier(.16,1,.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────
   ORGANIC LIGHT CANVAS
───────────────────────────────────────────── */
function OrganicLight({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf: number;
    let t = 0;
    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);
    const blobs = [
      { x: 0.5, y: 0.4, r: 0.38, hue: 190, speed: 0.0007, ox: 0.12, oy: 0.08 },
      { x: 0.3, y: 0.6, r: 0.28, hue: 210, speed: 0.0011, ox: 0.09, oy: 0.13 },
      { x: 0.7, y: 0.3, r: 0.22, hue: 175, speed: 0.0009, ox: 0.14, oy: 0.07 },
    ];
    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      t += 1;
      for (const b of blobs) {
        const cx = (b.x + Math.sin(t * b.speed * 1.7) * b.ox) * w;
        const cy = (b.y + Math.cos(t * b.speed * 1.3) * b.oy) * h;
        const r = b.r * Math.min(w, h);
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        grad.addColorStop(0, `hsla(${b.hue},100%,60%,0.18)`);
        grad.addColorStop(0.4, `hsla(${b.hue},90%,50%,0.09)`);
        grad.addColorStop(1, `hsla(${b.hue},80%,40%,0)`);
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}

/* ─────────────────────────────────────────────
   GRID BACKGROUND
───────────────────────────────────────────── */
function GridBackground() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
        backgroundImage: `
        linear-gradient(rgba(1,179,217,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(1,179,217,0.04) 1px, transparent 1px)
      `,
        backgroundSize: "60px 60px",
        maskImage:
          "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
      }}
    />
  );
}

/* ─────────────────────────────────────────────
   ANIMATED COUNTER
───────────────────────────────────────────── */
function AnimatedCounter({
  target,
  suffix = "",
  duration = 1800,
}: {
  target: number;
  suffix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const { ref, visible } = useScrollReveal();
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [visible, target, duration]);
  return (
    <span ref={ref as React.RefObject<HTMLSpanElement>}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ─────────────────────────────────────────────
   SECTION LABEL
───────────────────────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 16,
      }}
    >
      <span
        style={{
          width: 24,
          height: 1,
          background: "rgba(1,179,217,0.5)",
          display: "inline-block",
        }}
      />
      <span
        style={{
          fontSize: 11,
          letterSpacing: ".14em",
          textTransform: "uppercase" as const,
          color: "#01b3d9",
          fontWeight: 600,
        }}
      >
        {children}
      </span>
      <span
        style={{
          width: 24,
          height: 1,
          background: "rgba(1,179,217,0.5)",
          display: "inline-block",
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   FEATURE CARD
───────────────────────────────────────────── */
function FeatureCard({
  icon: Icon,
  color,
  rgb,
  title,
  desc,
  delay,
  wide = false,
  highlight = false,
}: {
  icon: React.ElementType;
  color: string;
  rgb: string;
  title: string;
  desc: string;
  delay: number;
  wide?: boolean;
  highlight?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <FadeUp
      delay={delay}
      style={{
        gridColumn: wide ? "span 2" : "span 1",
        background: hovered ? "rgba(10,16,36,0.9)" : "rgba(8,12,26,0.65)",
        border: `1px solid ${hovered ? `rgba(${rgb},0.28)` : "rgba(255,255,255,0.06)"}`,
        borderRadius: 24,
        padding: "36px 32px",
        backdropFilter: "blur(12px)",
        cursor: "default",
        transition: "all 0.4s cubic-bezier(.16,1,.3,1)",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hovered
          ? `0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(${rgb},0.06)`
          : "none",
        position: "relative" as const,
        overflow: "hidden",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {highlight && (
        <div
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            padding: "3px 12px",
            background: "rgba(1,179,217,0.1)",
            border: "1px solid rgba(1,179,217,0.22)",
            borderRadius: 100,
            fontSize: 10,
            color: "#4fdfff",
            letterSpacing: ".1em",
          }}
        >
          POPULAIRE
        </div>
      )}
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 14,
          background: `rgba(${rgb},0.1)`,
          border: `1px solid rgba(${rgb},0.18)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 22,
          boxShadow: hovered ? `0 0 28px rgba(${rgb},0.22)` : "none",
          transition: "all 0.4s ease",
        }}
      >
        <Icon
          style={{
            width: 24,
            height: 24,
            color,
            filter: hovered ? `drop-shadow(0 0 8px rgba(${rgb},0.7))` : "none",
            transition: "all 0.4s ease",
          }}
        />
      </div>
      <h3
        style={{
          fontSize: "1rem",
          fontWeight: 600,
          color: "#fff",
          marginBottom: 10,
          lineHeight: 1.3,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: "0.875rem",
          color: "rgba(232,234,242,0.45)",
          lineHeight: 1.75,
        }}
      >
        {desc}
      </p>
      {hovered && (
        <div
          style={{
            marginTop: 18,
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            color,
          }}
        >
          <span>En savoir plus</span>
          <TbChevronRight size={13} />
        </div>
      )}
      <div
        style={{
          position: "absolute",
          bottom: -40,
          right: -40,
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(${rgb},0.07) 0%, transparent 70%)`,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.4s ease",
          pointerEvents: "none",
        }}
      />
    </FadeUp>
  );
}

/* ─────────────────────────────────────────────
   TESTIMONIAL CARD
───────────────────────────────────────────── */
function TestimonialCard({
  quote,
  name,
  role,
  company,
  delay,
}: {
  quote: string;
  name: string;
  role: string;
  company: string;
  delay: number;
}) {
  return (
    <FadeUp
      delay={delay}
      style={{
        background: "rgba(8,12,26,0.7)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 20,
        padding: "28px",
        backdropFilter: "blur(10px)",
        position: "relative" as const,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background:
            "linear-gradient(90deg, transparent, rgba(1,179,217,0.25), transparent)",
        }}
      />
      <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            style={{
              width: 11,
              height: 11,
              color: "#FFCC66",
              filter: "drop-shadow(0 0 5px rgba(255,204,102,0.6))",
            }}
          />
        ))}
      </div>
      <p
        style={{
          fontSize: "0.875rem",
          color: "rgba(232,234,242,0.6)",
          lineHeight: 1.8,
          marginBottom: 20,
          fontStyle: "italic",
        }}
      >
        "{quote}"
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            background:
              "linear-gradient(135deg, rgba(1,179,217,0.28), rgba(1,99,139,0.5))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            fontWeight: 700,
            color: "#4fdfff",
          }}
        >
          {name[0]}
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>
            {name}
          </div>
          <div style={{ fontSize: 11, color: "rgba(232,234,242,0.35)" }}>
            {role} · {company}
          </div>
        </div>
      </div>
    </FadeUp>
  );
}

/* ─────────────────────────────────────────────
   METRIC CARD
───────────────────────────────────────────── */
function MetricCard({
  value,
  suffix,
  label,
  delay,
}: {
  value: number;
  suffix: string;
  label: string;
  delay: number;
}) {
  return (
    <FadeUp
      delay={delay}
      style={{
        padding: "28px 24px",
        background: "rgba(8,12,26,0.7)",
        border: "1px solid rgba(1,179,217,0.1)",
        borderRadius: 20,
        backdropFilter: "blur(12px)",
        position: "relative" as const,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background:
            "linear-gradient(90deg, transparent, rgba(1,179,217,0.4), transparent)",
        }}
      />
      <div
        style={{
          fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
          fontWeight: 800,
          color: "#4fdfff",
          lineHeight: 1,
          filter: "drop-shadow(0 0 18px rgba(79,223,255,0.35))",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        <AnimatedCounter target={value} suffix={suffix} />
      </div>
      <div
        style={{
          fontSize: 11,
          color: "rgba(232,234,242,0.38)",
          marginTop: 8,
          letterSpacing: ".07em",
          textTransform: "uppercase" as const,
        }}
      >
        {label}
      </div>
    </FadeUp>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function EntreprisesPage() {
  const revealImgRef = useRef<HTMLImageElement | null>(null);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <style>{`
        @keyframes blink     { 0%,100%{opacity:1} 50%{opacity:.2} }
        @keyframes shimmer   { 0%{transform:translateX(-120%)} 100%{transform:translateX(120%)} }
        @keyframes floatY    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes ticker    { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes gradMove  { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes scanLine  { 0%{top:-2px} 100%{top:100%} }

        .hero-title-gradient {
          background: linear-gradient(135deg,#fff 0%,#a8e8ff 40%,#4fdfff 70%,#01b3d9 100%);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradMove 6s ease infinite;
        }
        .cta-btn-primary {
          position: relative; overflow: hidden;
          background: linear-gradient(135deg,#01b3d9 0%,#0099cc 100%) !important;
          box-shadow: 0 0 40px rgba(1,179,217,0.28),0 4px 20px rgba(0,0,0,0.3) !important;
          transition: all 0.3s ease !important;
        }
        .cta-btn-primary:hover {
          box-shadow: 0 0 60px rgba(1,179,217,0.45),0 8px 30px rgba(0,0,0,0.4) !important;
          transform: translateY(-2px) !important;
        }
        .cta-btn-primary::after {
          content:''; position:absolute; inset:0;
          background:linear-gradient(105deg,transparent 30%,rgba(255,255,255,0.22),transparent 70%);
          animation:shimmer 2.8s ease infinite 0.8s;
        }
        .section-divider {
          height: 1px;
          background: linear-gradient(90deg,transparent,rgba(1,179,217,0.15),transparent);
        }

        .bento-wide { grid-column: span 2; }

        /* ══ RESPONSIVE ══ */

        /* ── Tablette (≤1024px) ── */
        @media (max-width: 1024px) {
          /* Hero */
          .hero-visual-col { display: none !important; }
          .hero-text-col   {
            position: relative !important; top: auto !important; left: auto !important;
            transform: none !important; max-width: 100% !important;
            padding: 7rem 6% 5rem !important;
          }
          /* Grids */
          .metrics-grid      { grid-template-columns: 1fr 1fr !important; }
          .bento-grid        { grid-template-columns: repeat(2, 1fr) !important; }
          .bento-wide        { grid-column: span 2 !important; }
          .testimonials-grid { grid-template-columns: 1fr 1fr !important; }
          /* CTA */
          .cta-inner { flex-direction: column !important; gap: 2rem !important; }
          .cta-h2    { width: auto !important; }
          /* Enterprise: masquer les étiquettes latérales, afficher celles du bas */
          .enterprise-labels       { display: none !important; }
          .enterprise-label-mobile { display: block !important; }
        }

        /* ── Mobile (≤640px) ── */
        @media (max-width: 640px) {
          /* Hero */
          .hero-text-col { padding: 5.5rem 1.25rem 3rem !important; }
          .hero-cta-row  { flex-direction: column !important; align-items: flex-start !important; }
          .hero-badges   { flex-wrap: wrap !important; }
          /* Grids */
          .metrics-grid      { grid-template-columns: 1fr 1fr !important; }
          .bento-grid        { grid-template-columns: 1fr !important; }
          .bento-wide        { grid-column: span 1 !important; }
          .testimonials-grid { grid-template-columns: 1fr !important; }
          /* Divers */
          .ticker-belt  { display: none !important; }
          .section-outer { padding-left: 1.25rem !important; padding-right: 1.25rem !important; }
          /* CTA box */
          .cta-free-box { min-width: unset !important; width: 100% !important; }
          .cta-actions  { flex-direction: column !important; }
          .cta-actions > * { width: 100% !important; justify-content: center !important; }
        }

        /* ── Très petit (≤400px) ── */
        @media (max-width: 400px) {
          .metrics-grid { grid-template-columns: 1fr !important; }
          .hero-text-col { padding: 5rem 1rem 2.5rem !important; }
        }
      `}</style>

      {/* ══════════════════ HERO ══════════════════ */}
      <section
        style={{
          position: "relative",
          width: "100%",
          overflow: "hidden",
          minHeight: "min(900px,100svh)",
          display: "flex",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 0 }}
        >
          <OrganicLight className="absolute inset-0" />
        </div>
        <GridBackground />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 1,
            background:
              "radial-gradient(ellipse 70% 60% at 28% 50%,transparent 30%,rgba(6,0,16,0.75) 100%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 2,
            opacity: 0.024,
            mixBlendMode: "overlay" as const,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
        <LightPillar
          topColor="#01638b"
          bottomColor="#01b3d9"
          intensity={1.0}
          rotationSpeed={0.3}
          glowAmount={0.005}
          pillarWidth={3.0}
          pillarHeight={0.4}
          noiseIntensity={0.5}
          pillarRotation={0}
          interactive={false}
          mixBlendMode="normal"
        />

        {/* Right visual */}
        <div
          className="hero-visual-col"
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: "52%",
            overflow: "hidden",
            zIndex: 3,
          }}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const el = revealImgRef.current;
            if (el) {
              el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
              el.style.setProperty(
                "--my",
                `${e.clientY - rect.top + rect.height * 0.5}px`,
              );
            }
          }}
          onMouseLeave={() => {
            const el = revealImgRef.current;
            if (el) {
              el.style.setProperty("--mx", "-9999px");
              el.style.setProperty("--my", "-9999px");
            }
          }}
        >
          <LaserFlow
            horizontalBeamOffset={0.1}
            verticalBeamOffset={0.0}
            color="#01638b"
          />

          {/* Dashboard */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform:
                "translate(-42%,-50%) perspective(1200px) rotateY(-6deg) rotateX(2deg)",
              width: "88%",
              background: "rgba(6,0,16,0.82)",
              backdropFilter: "blur(20px)",
              borderRadius: 28,
              border: "1px solid rgba(1,179,217,0.18)",
              boxShadow:
                "0 0 0 1px rgba(1,179,217,0.07),0 40px 100px rgba(0,0,0,0.6),-40px 0 80px rgba(1,179,217,0.04)",
              overflow: "hidden",
              zIndex: 5,
            }}
          >
            <div
              style={{
                padding: "12px 18px",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              {["#ff5f57", "#febc2e", "#28c840"].map((c, i) => (
                <div
                  key={i}
                  style={{
                    width: 9,
                    height: 9,
                    borderRadius: "50%",
                    background: c,
                  }}
                />
              ))}
              <div
                style={{
                  marginLeft: 10,
                  flex: 1,
                  height: 20,
                  borderRadius: 6,
                  background: "rgba(255,255,255,0.04)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.18)" }}>
                  easytrans.pro/dashboard
                </span>
              </div>
            </div>
            <div
              style={{
                aspectRatio: "16/9",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                className="bg-cover w-full h-full"
                style={{
                  backgroundImage:
                    "url(https://res.cloudinary.com/dtrpkegss/image/upload/v1767741504/3199747_ajeemh.webp)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  height: 2,
                  background:
                    "linear-gradient(90deg,transparent,rgba(1,179,217,0.4),transparent)",
                  animation: "scanLine 3s linear infinite",
                  pointerEvents: "none",
                }}
              />
            </div>
            <div
              style={{
                padding: "14px 18px",
                display: "flex",
                gap: 10,
                borderTop: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              {[
                ["138", "lignes actives"],
                ["2.4k", "voyageurs"],
                ["99.9%", "uptime"],
              ].map(([v, l]) => (
                <div
                  key={l}
                  style={{
                    flex: 1,
                    padding: "10px 12px",
                    background: "rgba(1,179,217,0.04)",
                    borderRadius: 10,
                    border: "1px solid rgba(1,179,217,0.08)",
                  }}
                >
                  <div
                    style={{ fontSize: 15, fontWeight: 700, color: "#4fdfff" }}
                  >
                    {v}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "rgba(255,255,255,0.28)",
                      marginTop: 2,
                    }}
                  >
                    {l}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Floating stat */}
          <div
            style={{
              position: "absolute",
              bottom: "16%",
              right: "7%",
              background: "rgba(4,5,15,0.92)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(1,179,217,0.2)",
              borderRadius: 16,
              padding: "14px 20px",
              animation: "floatY 4s ease-in-out infinite",
              boxShadow:
                "0 0 40px rgba(1,179,217,0.1),0 20px 40px rgba(0,0,0,0.5)",
              zIndex: 6,
            }}
          >
            <div
              style={{
                fontSize: 9,
                color: "rgba(255,255,255,0.28)",
                letterSpacing: ".12em",
                marginBottom: 5,
              }}
            >
              CE MOIS
            </div>
            <div
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: "#4fdfff",
                lineHeight: 1,
                filter: "drop-shadow(0 0 12px rgba(79,223,255,0.5))",
              }}
            >
              +24%
            </div>
            <div
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.35)",
                marginTop: 3,
              }}
            >
              réservations
            </div>
          </div>

          {/* Notification */}
          <div
            style={{
              position: "absolute",
              top: "18%",
              right: "9%",
              background: "rgba(4,5,15,0.9)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(79,223,255,0.14)",
              borderRadius: 14,
              padding: "12px 16px",
              animation: "floatY 5.5s ease-in-out infinite 2s",
              zIndex: 6,
              maxWidth: 210,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 5,
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#22c55e",
                  display: "block",
                  boxShadow: "0 0 8px #22c55e",
                  animation: "blink 2s ease-in-out infinite",
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.8)",
                }}
              >
                Nouvelle réservation
              </span>
            </div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.32)" }}>
              Paris → Lyon · 3 passagers
            </div>
          </div>
        </div>

        {/* Hero text */}
        <div
          className="hero-text-col"
          style={{
            position: "absolute",
            top: "50%",
            left: "8%",
            transform: "translateY(-50%)",
            maxWidth: 560,
            zIndex: 10,
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            gap: 22,
          }}
        >
          <div
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "none" : "translateY(10px)",
              transition: "all .5s cubic-bezier(.16,1,.3,1)",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(1,179,217,0.07)",
                border: "1px solid rgba(1,179,217,0.2)",
                borderRadius: 100,
                padding: "6px 18px 6px 10px",
                fontSize: 11,
                color: "#4fdfff",
                letterSpacing: ".06em",
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#01b3d9",
                  boxShadow: "0 0 8px #01b3d9",
                  display: "inline-block",
                  animation: "blink 1.8s ease-in-out infinite",
                }}
              />
              Plateforme partenaires · Bêta ouverte
            </div>
          </div>

          <div
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "none" : "translateY(24px)",
              transition: "all .75s cubic-bezier(.16,1,.3,1) 80ms",
            }}
          >
            <h1
              style={{
                fontSize: "clamp(2rem,4.5vw,3.6rem)",
                fontWeight: 800,
                lineHeight: 1.08,
                letterSpacing: "-0.032em",
                margin: 0,
              }}
            >
              La plateforme qui{" "}
              <span className="hero-title-gradient">
                accélère votre activité
              </span>{" "}
              de transport
            </h1>
          </div>

          <div
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "none" : "translateY(20px)",
              transition: "all .75s cubic-bezier(.16,1,.3,1) 160ms",
            }}
          >
            <p
              style={{
                fontSize: "1rem",
                color: "rgba(232,234,242,0.48)",
                lineHeight: 1.75,
                margin: 0,
                maxWidth: 440,
              }}
            >
              Centralisez vos offres, gérez vos réservations en temps réel et
              touchez plus de voyageurs depuis un seul tableau de bord conçu
              pour les pros.
            </p>
          </div>

          <div
            className="hero-cta-row"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "none" : "translateY(20px)",
              transition: "all .75s cubic-bezier(.16,1,.3,1) 240ms",
              display: "flex",
              gap: 12,
              alignItems: "center",
              flexWrap: "wrap" as const,
            }}
          >
            <Button
              as={Link}
              href="/demandepartenaire"
              className="cta-btn-primary"
              radius="full"
              startContent={<HiBuildingOffice />}
              endContent={<TbArrowRight />}
            >
              Devenir partenaire
            </Button>
            <Button
              as={Link}
              href="#comment"
              variant="bordered"
              radius="full"
              style={{
                borderColor: "rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.58)",
                background: "rgba(255,255,255,0.02)",
              }}
            >
              Voir la démo
            </Button>
          </div>

          {/* Social proof */}
          <div
            style={{
              opacity: heroVisible ? 1 : 0,
              transition: "opacity .8s ease 340ms",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ display: "flex" }}>
                {["#ff7875", "#4fdfff", "#22c55e", "#FFCC66"].map((c, i) => (
                  <div
                    key={i}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: `linear-gradient(135deg,${c}33,${c}77)`,
                      border: "2px solid rgba(6,0,16,0.85)",
                      marginLeft: i > 0 ? -8 : 0,
                      fontSize: 10,
                      fontWeight: 700,
                      color: c,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {["A", "B", "C", "D"][i]}
                  </div>
                ))}
              </div>
              <div>
                <div style={{ display: "flex", gap: 2, marginBottom: 2 }}>
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      style={{ width: 11, height: 11, color: "#FFCC66" }}
                    />
                  ))}
                </div>
                <div style={{ fontSize: 11, color: "rgba(232,234,242,0.33)" }}>
                  Rejoint par{" "}
                  <strong style={{ color: "rgba(232,234,242,0.58)" }}>
                    +120
                  </strong>{" "}
                  entreprises
                </div>
              </div>
            </div>
          </div>

          {/* Trust badges */}
          <div
            className="hero-badges"
            style={{
              opacity: heroVisible ? 1 : 0,
              transition: "opacity .8s ease 420ms",
              display: "flex",
              gap: 8,
            }}
          >
            {[
              { icon: IoIosLock, label: "Paiements sécurisés" },
              { icon: RiShieldCheckLine, label: "Sans engagement" },
            ].map(({ icon: I, label }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "7px 14px",
                  background: "rgba(1,179,217,0.05)",
                  border: "1px solid rgba(1,179,217,0.12)",
                  borderRadius: 100,
                }}
              >
                <I style={{ width: 13, height: 13, color: "#01b3d9" }} />
                <span
                  style={{
                    fontSize: 11,
                    color: "rgba(232,234,242,0.45)",
                    letterSpacing: ".04em",
                  }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ TICKER ══════════════════ */}
      <div
        className="ticker-belt"
        style={{
          overflow: "hidden",
          borderTop: "1px solid rgba(255,255,255,0.04)",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
          padding: "11px 0",
          background: "rgba(1,179,217,0.018)",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 56,
            width: "max-content",
            animation: "ticker 28s linear infinite",
          }}
        >
          {(
            [
              "Inscription gratuite",
              "Sans engagement",
              "Support 7j/7",
              "Mise en ligne rapide",
              "Paiements sécurisés",
              "Tableau de bord temps réel",
              "API & intégrations",
            ] as string[]
          )
            .concat([
              "Inscription gratuite",
              "Sans engagement",
              "Support 7j/7",
              "Mise en ligne rapide",
              "Paiements sécurisés",
              "Tableau de bord temps réel",
              "API & intégrations",
            ])
            .map((item, i) => (
              <span
                key={i}
                style={{
                  fontSize: 10,
                  color: "rgba(232,234,242,0.26)",
                  letterSpacing: ".1em",
                  whiteSpace: "nowrap" as const,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span
                  style={{
                    width: 3,
                    height: 3,
                    borderRadius: "50%",
                    background: "rgba(1,179,217,0.5)",
                    display: "inline-block",
                  }}
                />
                {item.toUpperCase()}
              </span>
            ))}
        </div>
      </div>

      {/* ══════════════════ METRICS ══════════════════ */}
      <section className="section-outer" style={{ padding: "80px 5% 0" }}>
        <div className="section-divider" style={{ marginBottom: 64 }} />
        <div
          className="metrics-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 14,
            maxWidth: 1100,
            margin: "0 auto",
          }}
        >
          <MetricCard
            value={2400}
            suffix="+"
            label="Voyageurs / mois"
            delay={0}
          />
          <MetricCard
            value={120}
            suffix="+"
            label="Entreprises partenaires"
            delay={100}
          />
          <MetricCard
            value={99}
            suffix=".9%"
            label="Disponibilité"
            delay={200}
          />
          <MetricCard
            value={24}
            suffix="%"
            label="Croissance moyenne"
            delay={300}
          />
        </div>
      </section>

      {/* ══════════════════ FEATURES BENTO ══════════════════ */}
      <FeaturesBento />

      <div
        className="section-outer section-divider"
        style={{ maxWidth: 1100, margin: "0 auto" }}
      />

      {/* ══════════════════ HOW IT WORKS ══════════════════ */}
      <section
        id="comment"
        className="section-outer"
        style={{ padding: "120px 5%", position: "relative" }}
      >
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{ zIndex: 0 }}
        >
          <div
            style={{
              position: "absolute",
              top: "30%",
              left: "50%",
              transform: "translateX(-50%)",
              width: 900,
              height: 600,
              borderRadius: "50%",
              background:
                "radial-gradient(ellipse,rgba(1,99,139,0.055) 0%,transparent 65%)",
            }}
          />
        </div>
        <div
          className="relative z-10"
          style={{
            maxWidth: 640,
            margin: "0 auto 80px",
            textAlign: "center",
            color: "#fff",
          }}
        >
          <FadeUp>
            <SectionLabel>Processus</SectionLabel>
            <h2
              style={{
                fontSize: "clamp(1.8rem,3vw,2.6rem)",
                fontWeight: 700,
                lineHeight: 1.15,
                letterSpacing: "-0.025em",
              }}
            >
              Devenez partenaire en{" "}
              <span style={{ color: "#4fdfff" }}>3 étapes simples</span>
            </h2>
          </FadeUp>
          <div
            style={{
              width: "min(40rem,100%)",
              height: 80,
              position: "relative",
              margin: "0 auto",
            }}
          >
            <SparklesCore
              background="transparent"
              minSize={0.4}
              maxSize={1}
              particleDensity={800}
              className="w-full h-full"
              particleColor="#FFFFFF"
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to bottom,transparent,#060010)",
              }}
            />
          </div>
        </div>
        <div className="relative flex justify-center w-full z-10">
          <Commentdevenirpartenaire />
        </div>
      </section>

      {/* ══════════════════ PRICING ══════════════════ */}
      <section className="section-outer" style={{ padding: "0 5% 120px" }}>
        <PageEntreprisePricing />
      </section>

      <div
        className="section-outer section-divider"
        style={{ maxWidth: 1100, margin: "0 auto" }}
      />

      {/* ══════════════════ TESTIMONIALS ══════════════════ */}
      <section
        className="section-outer"
        style={{ padding: "120px 5%", position: "relative" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 0, opacity: 0.3 }}
        >
          <OrganicLight />
        </div>
        <FadeUp
          style={{
            maxWidth: 560,
            margin: "0 auto 60px",
            textAlign: "center",
            color: "#fff",
            position: "relative",
            zIndex: 10,
          }}
        >
          <SectionLabel>Témoignages</SectionLabel>
          <h2
            style={{
              fontSize: "clamp(1.8rem,3vw,2.6rem)",
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: "-0.025em",
            }}
          >
            Ce que disent nos{" "}
            <span style={{ color: "#4fdfff" }}>partenaires</span>
          </h2>
        </FadeUp>
        <div
          className="testimonials-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 14,
            maxWidth: 1100,
            margin: "0 auto",
            position: "relative",
            zIndex: 10,
          }}
        >
          <TestimonialCard
            quote="EasyTrans a transformé notre gestion. +30% de réservations en 2 mois, sans effort supplémentaire de notre part."
            name="Karim Benali"
            role="Directeur"
            company="TransAlp"
            delay={0}
          />
          <TestimonialCard
            quote="Le tableau de bord est ultra intuitif. Mes équipes étaient opérationnelles en une journée. Je recommande à 100%."
            name="Sophie Martin"
            role="CEO"
            company="BusConnect"
            delay={120}
          />
          <TestimonialCard
            quote="La visibilité gagnée est incroyable. Nos lignes sont désormais visibles par des milliers de voyageurs qu'on n'atteignait pas avant."
            name="Ahmed Ouali"
            role="Fondateur"
            company="MobiLine"
            delay={240}
          />
        </div>
      </section>

      {/* ══════════════════ ENTERPRISE FEATURES ══════════════════ */}
      <section
        className="section-outer"
        style={{ padding: "0 5% 120px", position: "relative" }}
      >
        <FadeUp
          style={{
            maxWidth: 600,
            margin: "0 auto 80px",
            textAlign: "center",
            color: "#fff",
            position: "relative",
            zIndex: 10,
          }}
        >
          <SectionLabel>Pour les entreprises</SectionLabel>
          <h2
            style={{
              fontSize: "clamp(1.8rem,3vw,2.6rem)",
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: "-0.025em",
            }}
          >
            Pensé pour les{" "}
            <span style={{ color: "#4fdfff" }}>professionnels</span>
          </h2>
        </FadeUp>

        <div
          style={{
            maxWidth: 440,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
            zIndex: 10,
          }}
        >
          {[
            {
              icon: IoIosLock,
              bg: "#FFFFFF",
              rgb: "255,255,255",
              label: "Sécurité des données certifiée",
              side: "left" as const,
            },
            {
              icon: GiGearHammer,
              bg: "#F5F5F5",
              rgb: "240,240,240",
              label: "Plateforme fiable et évolutive",
              side: "right" as const,
            },
            {
              icon: RiCustomerServiceLine,
              bg: "#EEF2F4",
              rgb: "220,230,235",
              label: "Support dédié 7j/7",
              side: "left" as const,
            },
            {
              icon: RiLineChartLine,
              bg: "#FFF6EB",
              rgb: "255,235,210",
              label: "Solution scalable pour votre croissance",
              side: "right" as const,
            },
          ].map(({ icon: Icon, bg, rgb, label, side }, idx) => (
            <FadeUp key={label} delay={idx * 100}>
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {side === "left" && (
                    <div
                      className="enterprise-labels"
                      style={{
                        position: "absolute",
                        right: "calc(100% + 6px)",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        whiteSpace: "nowrap" as const,
                      }}
                    >
                      <div
                        style={{
                          padding: "8px 16px",
                          borderRadius: 100,
                          background: bg,
                          color: "rgba(0,0,0,0.78)",
                          fontWeight: 600,
                          fontSize: 13,
                          filter: `drop-shadow(0 0 16px rgba(${rgb},0.9))`,
                        }}
                      >
                        {label}
                      </div>
                      <FaCaretRight
                        style={{
                          color: bg,
                          filter: `drop-shadow(0 0 8px rgba(${rgb},0.8))`,
                          flexShrink: 0,
                        }}
                      />
                      <div
                        style={{
                          width: 48,
                          height: 1,
                          background: "rgba(255,255,255,0.18)",
                        }}
                      />
                    </div>
                  )}
                  <div
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: "50%",
                      background: bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      filter: `drop-shadow(0 0 20px rgba(${rgb},0.9)) drop-shadow(0 0 45px rgba(${rgb},0.4))`,
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    <Icon className="text-black w-6 h-6" />
                  </div>
                  {side === "right" && (
                    <div
                      className="enterprise-labels"
                      style={{
                        position: "absolute",
                        left: "calc(100% + 6px)",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        whiteSpace: "nowrap" as const,
                      }}
                    >
                      <div
                        style={{
                          width: 48,
                          height: 1,
                          background: "rgba(255,255,255,0.18)",
                        }}
                      />
                      <FaCaretLeft
                        style={{
                          color: bg,
                          filter: `drop-shadow(0 0 8px rgba(${rgb},0.8))`,
                          flexShrink: 0,
                        }}
                      />
                      <div
                        style={{
                          padding: "8px 16px",
                          borderRadius: 100,
                          background: bg,
                          color: "rgba(0,0,0,0.78)",
                          fontWeight: 600,
                          fontSize: 13,
                          filter: `drop-shadow(0 0 16px rgba(${rgb},0.9))`,
                        }}
                      >
                        {label}
                      </div>
                    </div>
                  )}
                </div>
                {/* Mobile label — hidden by default, revealed via CSS at ≤1024px */}
                <div
                  className="enterprise-label-mobile"
                  style={{
                    marginTop: 10,
                    fontSize: 13,
                    fontWeight: 500,
                    color: "rgba(232,234,242,0.55)",
                    letterSpacing: ".03em",
                    textAlign: "center",
                    display: "none",
                  }}
                >
                  {label}
                </div>
                {idx < 3 && (
                  <div
                    style={{
                      width: 1,
                      height: 80,
                      background:
                        "linear-gradient(to bottom,rgba(255,255,255,0.32),rgba(255,255,255,0.03))",
                      margin: "0 auto",
                    }}
                  />
                )}
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ══════════════════ CTA FINAL ══════════════════ */}
      <section
        className="section-outer"
        style={{ padding: "0 5% 120px", position: "relative" }}
      >
        <FadeUp style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              background:
                "linear-gradient(135deg,rgba(6,0,16,0.97) 0%,rgba(1,10,30,0.99) 50%,rgba(6,0,16,0.97) 100%)",
              border: "1px solid rgba(1,179,217,0.14)",
              borderRadius: 32,
              padding: "clamp(2.5rem,5%,4.5rem)",
              boxShadow:
                "0 0 120px rgba(1,179,217,0.04),0 60px 120px rgba(0,0,0,0.5)",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "10%",
                right: "10%",
                height: 1,
                background:
                  "linear-gradient(90deg,transparent,rgba(1,179,217,0.65),transparent)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: "20%",
                right: "20%",
                height: 1,
                background:
                  "linear-gradient(90deg,transparent,rgba(1,179,217,0.28),transparent)",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 32,
                overflow: "hidden",
                opacity: 0.28,
                pointerEvents: "none",
              }}
            >
              <OrganicLight />
            </div>
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 32,
                overflow: "hidden",
                pointerEvents: "none",
                backgroundImage: `linear-gradient(rgba(1,179,217,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(1,179,217,0.025) 1px,transparent 1px)`,
                backgroundSize: "40px 40px",
              }}
            />

            <div
              className="cta-inner"
              style={{
                position: "relative",
                zIndex: 2,
                display: "flex",
                gap: 60,
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ marginBottom: 18 }}>
                  <Chip
                    color="default"
                    startContent={
                      <FaStar
                        size={13}
                        className="text-[#FFCC66]"
                        style={{
                          filter: "drop-shadow(0 0 8px rgba(255,204,102,0.8))",
                        }}
                      />
                    }
                    variant="dot"
                  >
                    <span className="text-white text-xs">
                      EasyTrans · Bêta ouverte
                    </span>
                  </Chip>
                </div>
                <h2
                  className="cta-h2"
                  style={{
                    fontSize: "clamp(1.7rem,3vw,2.5rem)",
                    fontWeight: 700,
                    color: "#fff",
                    lineHeight: 1.18,
                    letterSpacing: "-0.025em",
                    marginBottom: 14,
                    width: "28rem",
                    maxWidth: "100%",
                  }}
                >
                  Prêt à développer votre activité avec{" "}
                  <strong
                    style={{
                      color: "#FFCC66",
                      filter: "drop-shadow(0 0 20px rgba(255,204,102,0.55))",
                    }}
                  >
                    EasyTrans
                  </strong>{" "}
                  ?
                </h2>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "rgba(232,234,242,0.38)",
                    lineHeight: 1.75,
                    maxWidth: "34rem",
                  }}
                >
                  Rejoignez une plateforme conçue pour les pros du transport.
                  Visibilité, gestion simplifiée, croissance durable — sans
                  engagement.
                </p>
                <div
                  className="cta-actions"
                  style={{
                    display: "flex",
                    gap: 12,
                    marginTop: 26,
                    flexWrap: "wrap" as const,
                  }}
                >
                  <Button
                    as={Link}
                    href="/demandepartenaire"
                    className="cta-btn-primary"
                    endContent={<TbArrowRight />}
                  >
                    Devenir partenaire gratuitement
                  </Button>
                  <Button color="primary" variant="ghost">
                    Demander une démo
                  </Button>
                </div>
              </div>

              <div style={{ flexShrink: 0 }}>
                <div
                  className="cta-free-box"
                  style={{
                    padding: "28px 32px",
                    background: "rgba(1,179,217,0.04)",
                    border: "1px solid rgba(1,179,217,0.1)",
                    borderRadius: 22,
                    minWidth: 230,
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      color: "rgba(232,234,242,0.32)",
                      letterSpacing: ".1em",
                      textTransform: "uppercase" as const,
                      marginBottom: 18,
                    }}
                  >
                    Inclus gratuitement
                  </div>
                  <ul
                    style={{
                      listStyle: "none",
                      padding: 0,
                      margin: 0,
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                    }}
                  >
                    {[
                      "Inscription & mise en ligne",
                      "Sans engagement",
                      "Support dédié partenaires",
                      "Tableau de bord analytics",
                    ].map((item) => (
                      <li
                        key={item}
                        style={{
                          display: "flex",
                          gap: 10,
                          alignItems: "center",
                        }}
                      >
                        <IoCheckmarkDoneSharp
                          style={{
                            color: "#01b3d9",
                            filter: "drop-shadow(0 0 5px rgba(1,179,217,0.65))",
                            flexShrink: 0,
                          }}
                        />
                        <span
                          style={{
                            fontSize: "0.85rem",
                            color: "rgba(232,234,242,0.6)",
                          }}
                        >
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </FadeUp>
      </section>
    </>
  );
}
