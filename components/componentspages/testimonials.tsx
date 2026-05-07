"use client";

import React, { useRef, useState } from "react";
import { motion } from "motion/react";
import { FaStar } from "react-icons/fa";
import DecorativeNumber from "@/components/DecorativeNumber";

// ── Types ──────────────────────────────────────────────────────────────────────
interface TestimonialAuthor {
  name: string;
  handle: string;
  note: number;
  avatar?: string;
}

interface Testimonial {
  author: TestimonialAuthor;
  text: string;
  href?: string;
}

// ── Données ────────────────────────────────────────────────────────────────────
const testimonials: Testimonial[] = [
  {
    author: {
      name: "Emma Thompson",
      handle: "@emmaai",
      note: 5,
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    },
    text: "EasyTrans a totalement changé ma façon de voyager. Réserver un ticket en quelques clics, c'est exactement ce qu'il me fallait.",
    href: "https://twitter.com/emmaai",
  },
  {
    author: {
      name: "David Park",
      handle: "@davidtech",
      note: 3,
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    },
    text: "Les agences partenaires sont sérieuses et réactives. J'ai trouvé un véhicule de location en moins de 5 minutes.",
    href: "https://twitter.com/davidtech",
  },
  {
    author: {
      name: "Sofia Rodriguez",
      handle: "@sofiaml",
      note: 4,
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    },
    text: "L'hôtel trouvé via EasyTrans était parfait. Le prix était compétitif et la réservation s'est faite sans accroc.",
  },
  {
    author: {
      name: "Alain Mbemba",
      handle: "@alainmbemba",
      note: 5,
    },
    text: "Excellente plateforme pour organiser un voyage depuis Brazzaville. Je recommande vivement à tous les voyageurs congolais.",
  },
  {
    author: {
      name: "Larissa Moukouri",
      handle: "@larissam",
      note: 4,
      avatar:
        "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&crop=face",
    },
    text: "Simple, rapide et fiable. Le réseau d'agences est dense et les prix sont transparents. Bravo à l'équipe.",
  },
  {
    author: {
      name: "Yves Nzinga",
      handle: "@yvesnzinga",
      note: 5,
    },
    text: "La location de voiture était un vrai plus pour mon voyage à Pointe-Noire. Tout était prêt à l'heure prévue.",
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────────
const getInitials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

const getAvatarColor = (name: string) => {
  const colors = [
    "#378ADD",
    "#1D9E75",
    "#D85A30",
    "#D4537E",
    "#BA7517",
    "#534AB7",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

// ── Avatar SVG vignette si pas de photo ───────────────────────────────────────
const Avatar = ({
  author,
  size = 44,
}: {
  author: TestimonialAuthor;
  size?: number;
}) => {
  const [imgError, setImgError] = useState(false);
  const color = getAvatarColor(author.name);
  const initials = getInitials(author.name);

  if (author.avatar && !imgError) {
    return (
      <div
        className="rounded-full overflow-hidden border border-white/10 flex-shrink-0"
        style={{ width: size, height: size }}
      >
        <img
          src={author.avatar}
          alt={author.name}
          width={size}
          height={size}
          className="object-cover w-full h-full"
          onError={() => setImgError(true)}
          loading="lazy"
          decoding="async"
        />
      </div>
    );
  }

  return (
    <div
      className="rounded-full border border-white/10 flex-shrink-0 flex items-center justify-center relative overflow-hidden"
      style={{ width: size, height: size, background: `${color}18` }}
    >
      {/* Grille micro */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.08]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id={`av-${author.handle}`}
            width="8"
            height="8"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 8 0 L 0 0 0 8"
              fill="none"
              stroke="white"
              strokeWidth="0.4"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#av-${author.handle})`} />
      </svg>
      <span
        className="relative text-xs font-black tracking-wider"
        style={{ color }}
      >
        {initials}
      </span>
    </div>
  );
};

// ── Étoiles de notation ────────────────────────────────────────────────────────
const StarRating = ({ note }: { note: number }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <FaStar
        key={i}
        className={`w-2.5 h-2.5 ${i < note ? "text-amber-400/80" : "text-white/10"}`}
      />
    ))}
    <span className="ml-1.5 text-[9px] text-white/20 tracking-wider">
      {note}/5
    </span>
  </div>
);

// ── Carte témoignage ───────────────────────────────────────────────────────────
const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  const color = getAvatarColor(testimonial.author.name);

  return (
    <div className="group relative bg-[#0d0d0d] hover:bg-[#0f0f0f] transition-colors duration-300 overflow-hidden w-[320px] flex-shrink-0 mx-px">
      {/* Accent line top animée au hover */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] transition-all duration-500"
        style={{ background: `${color}00` }}
      />
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: color }}
      />

      {/* Grille de fond */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.025] pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id={`tc-${testimonial.author.handle}`}
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="white"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill={`url(#tc-${testimonial.author.handle})`}
        />
      </svg>

      {/* Guillemet décoratif */}
      <div
        className="absolute top-4 right-5 text-5xl font-black leading-none pointer-events-none select-none transition-opacity duration-300 opacity-[0.06] group-hover:opacity-[0.12]"
        style={{ color, fontFamily: "Georgia, serif" }}
        aria-hidden
      >
        "
      </div>

      <div className="relative p-6">
        {/* Étoiles */}
        <StarRating note={testimonial.author.note} />

        {/* Texte */}
        <p className="mt-4 text-sm leading-[1.8] text-white/50 group-hover:text-white/65 transition-colors duration-300">
          {testimonial.text}
        </p>

        {/* Séparateur */}
        <div className="mt-5 h-px bg-white/[0.06]" />

        {/* Auteur */}
        <div className="mt-4 flex items-center gap-3">
          <Avatar author={testimonial.author} size={40} />
          <div className="min-w-0">
            <p className="text-sm font-black text-white tracking-tight truncate">
              {testimonial.author.name}
            </p>
            {testimonial.href ? (
              <a
                href={testimonial.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] tracking-[.2em] text-white/25 hover:text-white/50 transition-colors duration-200 no-underline"
              >
                {testimonial.author.handle}
              </a>
            ) : (
              <p className="text-[10px] tracking-[.2em] text-white/25">
                {testimonial.author.handle}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Marquee CSS-only (double track) ───────────────────────────────────────────
const MarqueeTrack = ({
  items,
  reverse = false,
  paused = false,
}: {
  items: Testimonial[];
  reverse?: boolean;
  paused?: boolean;
}) => (
  <div className="overflow-hidden relative">
    {/* Fondu gauche */}
    <div
      className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
      style={{ background: "linear-gradient(to right, #0a0a0a, transparent)" }}
    />
    {/* Fondu droit */}
    <div
      className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
      style={{ background: "linear-gradient(to left, #0a0a0a, transparent)" }}
    />

    <div
      className="flex gap-px"
      style={{
        animation: `marquee${reverse ? "Reverse" : ""} 40s linear infinite`,
        animationPlayState: paused ? "paused" : "running",
        width: "max-content",
      }}
    >
      {/* Double les items pour le loop */}
      {[...items, ...items].map((t, i) => (
        <TestimonialCard key={`${t.author.handle}-${i}`} testimonial={t} />
      ))}
    </div>

    <style jsx>{`
      @keyframes marquee {
        0% {
          transform: translateX(0);
        }
        100% {
          transform: translateX(-50%);
        }
      }
      @keyframes marqueeReverse {
        0% {
          transform: translateX(-50%);
        }
        100% {
          transform: translateX(0);
        }
      }
    `}</style>
  </div>
);

// ── Composant principal ────────────────────────────────────────────────────────
const Testimonials: React.FC = () => {
  const [paused, setPaused] = useState(false);

  // Divise en deux lignes
  const row1 = testimonials.slice(0, Math.ceil(testimonials.length / 2));
  const row2 = testimonials.slice(Math.ceil(testimonials.length / 2));

  return (
    <section className="relative py-8 md:py-10 overflow-hidden">
      <div className="absolute left-8 top-0 bottom-0 w-px bg-white/[0.08] hidden lg:block" />
      <DecorativeNumber number="06" />

      <div className="relative mx-auto max-w-6xl px-4 lg:px-0">
        {/* ── HEADER ── */}
        <div className="mb-16 md:mb-20">
          <div className="flex items-center gap-5">
            <div className="w-[3px] h-20 bg-white shrink-0" />
            <div>
              <p
                className="text-xs tracking-[0.45em] uppercase text-white/40 mt-1"
                style={{ letterSpacing: "0.45em" }}
              >
                TÉMOIGNAGES
              </p>
              <h2 className="text-sm md:text-base font-black text-white tracking-tight mt-1">
                ILS NOUS FONT CONFIANCE
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

        {/* ── STATS RAPIDES ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-3 gap-px bg-white/[0.06] mb-px"
        >
          {[
            { value: "98%", label: "Satisfaction" },
            { value: "2 400+", label: "Voyageurs" },
            { value: "4.7", label: "Note moyenne" },
          ].map(({ value, label }) => (
            <div key={label} className="bg-[#0d0d0d] px-6 py-5 text-center">
              <p className="text-2xl font-black text-white tracking-tight">
                {value}
              </p>
              <p className="text-[10px] tracking-[.3em] uppercase text-white/25 mt-1">
                {label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── MARQUEE — pleine largeur ── */}
      <div
        className="mt-px"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Ligne 1 → droite */}
        <div className="mb-px">
          <MarqueeTrack items={row1} paused={paused} />
        </div>
        {/* Ligne 2 → gauche */}
        <MarqueeTrack
          items={row2.length ? row2 : row1}
          reverse
          paused={paused}
        />
      </div>

      {/* ── FOOTER note ── */}
      <div className="relative mx-auto max-w-6xl px-4 lg:px-0">
        <div className="mt-px bg-white/[0.06]">
          <div className="bg-[#0d0d0d] px-6 py-4 flex items-center justify-between">
            <p className="text-[10px] tracking-[.3em] uppercase text-white/20">
              Passez votre souris pour pause
            </p>
            <div className="flex items-center gap-2">
              <div
                className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${paused ? "bg-amber-400/60" : "bg-white/20"}`}
              />
              <span className="text-[9px] text-white/20 tracking-widest">
                {paused ? "EN PAUSE" : "EN DIRECT"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
