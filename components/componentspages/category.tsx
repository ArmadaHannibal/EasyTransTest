"use client";

import React from "react";
import { Link } from "@heroui/link";
import DecorativeNumber from "@/components/DecorativeNumber";

/* ─────────────────────────────────────────────
   VECTEURS SVG CUSTOM — un par service
   Chaque illustration est géométrique, épurée,
   cohérente avec l'esthétique dark du site.
───────────────────────────────────────────── */

const IllustrationAgences = () => (
  <svg
    viewBox="0 0 200 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full"
  >
    {/* Bâtiment principal */}
    <rect
      x="60"
      y="50"
      width="80"
      height="90"
      stroke="white"
      strokeOpacity="0.15"
      strokeWidth="1"
    />
    <rect
      x="60"
      y="50"
      width="80"
      height="90"
      fill="white"
      fillOpacity="0.02"
    />
    {/* Colonnes */}
    <line
      x1="82"
      y1="50"
      x2="82"
      y2="140"
      stroke="white"
      strokeOpacity="0.08"
      strokeWidth="1"
    />
    <line
      x1="104"
      y1="50"
      x2="104"
      y2="140"
      stroke="white"
      strokeOpacity="0.08"
      strokeWidth="1"
    />
    <line
      x1="126"
      y1="50"
      x2="126"
      y2="140"
      stroke="white"
      strokeOpacity="0.08"
      strokeWidth="1"
    />
    {/* Toit / fronton */}
    <polygon
      points="50,50 100,20 150,50"
      stroke="white"
      strokeOpacity="0.25"
      strokeWidth="1"
      fill="white"
      fillOpacity="0.04"
    />
    {/* Porte */}
    <rect
      x="88"
      y="108"
      width="24"
      height="32"
      stroke="white"
      strokeOpacity="0.3"
      strokeWidth="1"
      fill="white"
      fillOpacity="0.05"
    />
    {/* Fenêtres */}
    <rect
      x="68"
      y="64"
      width="14"
      height="14"
      stroke="white"
      strokeOpacity="0.2"
      strokeWidth="1"
      fill="white"
      fillOpacity="0.04"
    />
    <rect
      x="92"
      y="64"
      width="14"
      height="14"
      stroke="white"
      strokeOpacity="0.2"
      strokeWidth="1"
      fill="white"
      fillOpacity="0.04"
    />
    <rect
      x="116"
      y="64"
      width="14"
      height="14"
      stroke="white"
      strokeOpacity="0.2"
      strokeWidth="1"
      fill="white"
      fillOpacity="0.04"
    />
    <rect
      x="68"
      y="86"
      width="14"
      height="14"
      stroke="white"
      strokeOpacity="0.2"
      strokeWidth="1"
      fill="white"
      fillOpacity="0.04"
    />
    <rect
      x="116"
      y="86"
      width="14"
      height="14"
      stroke="white"
      strokeOpacity="0.2"
      strokeWidth="1"
      fill="white"
      fillOpacity="0.04"
    />
    {/* Sol */}
    <line
      x1="40"
      y1="140"
      x2="160"
      y2="140"
      stroke="white"
      strokeOpacity="0.12"
      strokeWidth="1"
    />
    {/* Nodes réseau */}
    <circle
      cx="20"
      cy="80"
      r="4"
      stroke="white"
      strokeOpacity="0.3"
      strokeWidth="1"
      fill="none"
    />
    <circle
      cx="180"
      cy="60"
      r="4"
      stroke="white"
      strokeOpacity="0.3"
      strokeWidth="1"
      fill="none"
    />
    <circle
      cx="175"
      cy="115"
      r="4"
      stroke="white"
      strokeOpacity="0.3"
      strokeWidth="1"
      fill="none"
    />
    <line
      x1="24"
      y1="80"
      x2="60"
      y2="90"
      stroke="white"
      strokeOpacity="0.08"
      strokeWidth="1"
      strokeDasharray="3 3"
    />
    <line
      x1="176"
      y1="63"
      x2="150"
      y2="75"
      stroke="white"
      strokeOpacity="0.08"
      strokeWidth="1"
      strokeDasharray="3 3"
    />
    <line
      x1="172"
      y1="115"
      x2="140"
      y2="110"
      stroke="white"
      strokeOpacity="0.08"
      strokeWidth="1"
      strokeDasharray="3 3"
    />
  </svg>
);

const IllustrationPartenaire = () => (
  <svg
    viewBox="0 0 200 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full"
  >
    {/* Deux mains / handshake stylisé */}
    {/* Main gauche */}
    <path
      d="M20 100 L70 70 L90 80 L60 110 Z"
      stroke="white"
      strokeOpacity="0.15"
      strokeWidth="1"
      fill="white"
      fillOpacity="0.03"
    />
    <path
      d="M20 100 L70 70"
      stroke="white"
      strokeOpacity="0.25"
      strokeWidth="1.5"
    />
    {/* Main droite */}
    <path
      d="M180 100 L130 70 L110 80 L140 110 Z"
      stroke="white"
      strokeOpacity="0.15"
      strokeWidth="1"
      fill="white"
      fillOpacity="0.03"
    />
    <path
      d="M180 100 L130 70"
      stroke="white"
      strokeOpacity="0.25"
      strokeWidth="1.5"
    />
    {/* Point de contact central */}
    <circle
      cx="100"
      cy="80"
      r="12"
      stroke="white"
      strokeOpacity="0.35"
      strokeWidth="1"
      fill="white"
      fillOpacity="0.06"
    />
    <circle cx="100" cy="80" r="4" fill="white" fillOpacity="0.4" />
    {/* Lignes de connexion rayonnantes */}
    <line
      x1="100"
      y1="68"
      x2="100"
      y2="30"
      stroke="white"
      strokeOpacity="0.1"
      strokeWidth="1"
      strokeDasharray="2 4"
    />
    <line
      x1="112"
      y1="72"
      x2="145"
      y2="45"
      stroke="white"
      strokeOpacity="0.1"
      strokeWidth="1"
      strokeDasharray="2 4"
    />
    <line
      x1="88"
      y1="72"
      x2="55"
      y2="45"
      stroke="white"
      strokeOpacity="0.1"
      strokeWidth="1"
      strokeDasharray="2 4"
    />
    {/* Étoiles / badges partenaire */}
    <polygon
      points="100,22 102,28 108,28 103,32 105,38 100,34 95,38 97,32 92,28 98,28"
      stroke="white"
      strokeOpacity="0.3"
      strokeWidth="0.8"
      fill="white"
      fillOpacity="0.08"
    />
    <polygon
      points="55,37 56.5,42 61,42 57.5,45 59,50 55,47 51,50 52.5,45 49,42 53.5,42"
      stroke="white"
      strokeOpacity="0.2"
      strokeWidth="0.8"
      fill="none"
    />
    <polygon
      points="145,37 146.5,42 151,42 147.5,45 149,50 145,47 141,50 142.5,45 139,42 143.5,42"
      stroke="white"
      strokeOpacity="0.2"
      strokeWidth="0.8"
      fill="none"
    />
    {/* Sol */}
    <line
      x1="20"
      y1="130"
      x2="180"
      y2="130"
      stroke="white"
      strokeOpacity="0.06"
      strokeWidth="1"
    />
    <ellipse cx="100" cy="130" rx="50" ry="4" fill="white" fillOpacity="0.03" />
  </svg>
);

const IllustrationTicket = () => (
  <svg
    viewBox="0 0 200 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full"
  >
    {/* Bus de profil */}
    {/* Carrosserie */}
    <rect
      x="20"
      y="65"
      width="140"
      height="55"
      rx="6"
      stroke="white"
      strokeOpacity="0.2"
      strokeWidth="1"
      fill="white"
      fillOpacity="0.03"
    />
    {/* Toit arrondi */}
    <path
      d="M26 65 Q26 45 46 45 L154 45 Q174 45 174 65"
      stroke="white"
      strokeOpacity="0.15"
      strokeWidth="1"
      fill="white"
      fillOpacity="0.02"
    />
    {/* Fenêtres */}
    <rect
      x="50"
      y="50"
      width="20"
      height="16"
      rx="2"
      stroke="white"
      strokeOpacity="0.25"
      strokeWidth="1"
      fill="white"
      fillOpacity="0.05"
    />
    <rect
      x="78"
      y="50"
      width="20"
      height="16"
      rx="2"
      stroke="white"
      strokeOpacity="0.25"
      strokeWidth="1"
      fill="white"
      fillOpacity="0.05"
    />
    <rect
      x="106"
      y="50"
      width="20"
      height="16"
      rx="2"
      stroke="white"
      strokeOpacity="0.25"
      strokeWidth="1"
      fill="white"
      fillOpacity="0.05"
    />
    <rect
      x="134"
      y="50"
      width="20"
      height="16"
      rx="2"
      stroke="white"
      strokeOpacity="0.2"
      strokeWidth="1"
      fill="white"
      fillOpacity="0.05"
    />
    {/* Porte */}
    <rect
      x="28"
      y="72"
      width="18"
      height="35"
      rx="1"
      stroke="white"
      strokeOpacity="0.2"
      strokeWidth="1"
      fill="white"
      fillOpacity="0.04"
    />
    <line
      x1="37"
      y1="72"
      x2="37"
      y2="107"
      stroke="white"
      strokeOpacity="0.1"
      strokeWidth="1"
    />
    {/* Roues */}
    <circle
      cx="55"
      cy="122"
      r="14"
      stroke="white"
      strokeOpacity="0.2"
      strokeWidth="1"
      fill="white"
      fillOpacity="0.03"
    />
    <circle
      cx="55"
      cy="122"
      r="6"
      stroke="white"
      strokeOpacity="0.15"
      strokeWidth="1"
      fill="none"
    />
    <circle cx="55" cy="122" r="2" fill="white" fillOpacity="0.3" />
    <circle
      cx="140"
      cy="122"
      r="14"
      stroke="white"
      strokeOpacity="0.2"
      strokeWidth="1"
      fill="white"
      fillOpacity="0.03"
    />
    <circle
      cx="140"
      cy="122"
      r="6"
      stroke="white"
      strokeOpacity="0.15"
      strokeWidth="1"
      fill="none"
    />
    <circle cx="140" cy="122" r="2" fill="white" fillOpacity="0.3" />
    {/* Ticket flottant */}
    <rect
      x="148"
      y="28"
      width="38"
      height="22"
      rx="2"
      stroke="white"
      strokeOpacity="0.35"
      strokeWidth="1"
      fill="white"
      fillOpacity="0.08"
    />
    <line
      x1="160"
      y1="28"
      x2="160"
      y2="50"
      stroke="white"
      strokeOpacity="0.15"
      strokeWidth="1"
      strokeDasharray="2 2"
    />
    <line
      x1="152"
      y1="35"
      x2="184"
      y2="35"
      stroke="white"
      strokeOpacity="0.2"
      strokeWidth="0.8"
    />
    <line
      x1="163"
      y1="41"
      x2="184"
      y2="41"
      stroke="white"
      strokeOpacity="0.15"
      strokeWidth="0.8"
    />
    {/* Route */}
    <line
      x1="0"
      y1="136"
      x2="200"
      y2="136"
      stroke="white"
      strokeOpacity="0.08"
      strokeWidth="1"
    />
    <line
      x1="80"
      y1="136"
      x2="120"
      y2="136"
      stroke="white"
      strokeOpacity="0.2"
      strokeWidth="1.5"
      strokeDasharray="6 6"
    />
  </svg>
);

const IllustrationHotel = () => (
  <svg
    viewBox="0 0 200 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full"
  >
    {/* Tour hôtel */}
    <rect
      x="55"
      y="30"
      width="90"
      height="110"
      stroke="white"
      strokeOpacity="0.15"
      strokeWidth="1"
      fill="white"
      fillOpacity="0.02"
    />
    {/* Grille fenêtres */}
    {[0, 1, 2, 3, 4, 5].map((row) =>
      [0, 1, 2].map((col) => (
        <rect
          key={`${row}-${col}`}
          x={65 + col * 24}
          y={38 + row * 16}
          width="14"
          height="10"
          rx="1"
          stroke="white"
          strokeOpacity={row < 2 ? "0.25" : "0.12"}
          strokeWidth="0.8"
          fill="white"
          fillOpacity={row < 2 ? "0.06" : "0.02"}
        />
      )),
    )}
    {/* Entrée */}
    <rect
      x="85"
      y="118"
      width="30"
      height="22"
      stroke="white"
      strokeOpacity="0.25"
      strokeWidth="1"
      fill="white"
      fillOpacity="0.05"
    />
    <path
      d="M85 118 Q100 112 115 118"
      stroke="white"
      strokeOpacity="0.2"
      strokeWidth="0.8"
      fill="none"
    />
    {/* Marquise */}
    <path
      d="M70 108 L130 108 L125 114 L75 114 Z"
      stroke="white"
      strokeOpacity="0.15"
      strokeWidth="0.8"
      fill="white"
      fillOpacity="0.04"
    />
    {/* Étoiles hôtel */}
    {[0, 1, 2, 3, 4].map((i) => (
      <polygon
        key={i}
        points={`${84 + i * 9},22 ${85 + i * 9},25 ${88 + i * 9},25 ${86 + i * 9},27 ${87 + i * 9},30 ${84 + i * 9},28 ${81 + i * 9},30 ${82 + i * 9},27 ${80 + i * 9},25 ${83 + i * 9},25`}
        stroke="white"
        strokeOpacity="0.3"
        strokeWidth="0.6"
        fill="white"
        fillOpacity="0.12"
      />
    ))}
    {/* Sol */}
    <line
      x1="30"
      y1="140"
      x2="170"
      y2="140"
      stroke="white"
      strokeOpacity="0.1"
      strokeWidth="1"
    />
    {/* Arbres déco */}
    <line
      x1="35"
      y1="140"
      x2="35"
      y2="110"
      stroke="white"
      strokeOpacity="0.1"
      strokeWidth="1"
    />
    <ellipse
      cx="35"
      cy="105"
      rx="10"
      ry="14"
      stroke="white"
      strokeOpacity="0.12"
      strokeWidth="0.8"
      fill="white"
      fillOpacity="0.02"
    />
    <line
      x1="165"
      y1="140"
      x2="165"
      y2="110"
      stroke="white"
      strokeOpacity="0.1"
      strokeWidth="1"
    />
    <ellipse
      cx="165"
      cy="105"
      rx="10"
      ry="14"
      stroke="white"
      strokeOpacity="0.12"
      strokeWidth="0.8"
      fill="white"
      fillOpacity="0.02"
    />
  </svg>
);

const IllustrationVoiture = () => (
  <svg
    viewBox="0 0 320 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full"
  >
    {/* Carrosserie principale */}
    <path
      d="M40 110 L40 85 Q40 75 50 75 L90 75 L120 50 L220 50 L250 75 L280 75 Q290 75 290 85 L290 110 Z"
      stroke="white"
      strokeOpacity="0.2"
      strokeWidth="1.2"
      fill="white"
      fillOpacity="0.03"
    />
    {/* Toit */}
    <path
      d="M100 75 L125 52 L215 52 L240 75"
      stroke="white"
      strokeOpacity="0.15"
      strokeWidth="1"
      fill="white"
      fillOpacity="0.04"
    />
    {/* Pare-brise avant */}
    <path
      d="M215 52 L240 75 L220 75 L205 55 Z"
      stroke="white"
      strokeOpacity="0.25"
      strokeWidth="0.8"
      fill="white"
      fillOpacity="0.06"
    />
    {/* Vitre arrière */}
    <path
      d="M100 75 L120 55 L140 55 L130 75 Z"
      stroke="white"
      strokeOpacity="0.2"
      strokeWidth="0.8"
      fill="white"
      fillOpacity="0.05"
    />
    {/* Vitre centrale */}
    <path
      d="M132 75 L143 55 L205 55 L204 75 Z"
      stroke="white"
      strokeOpacity="0.25"
      strokeWidth="0.8"
      fill="white"
      fillOpacity="0.06"
    />
    {/* Portières */}
    <line
      x1="162"
      y1="75"
      x2="165"
      y2="110"
      stroke="white"
      strokeOpacity="0.12"
      strokeWidth="1"
    />
    <line
      x1="218"
      y1="75"
      x2="220"
      y2="110"
      stroke="white"
      strokeOpacity="0.12"
      strokeWidth="1"
    />
    {/* Poignées */}
    <rect
      x="175"
      y="89"
      width="18"
      height="4"
      rx="2"
      stroke="white"
      strokeOpacity="0.2"
      strokeWidth="0.8"
      fill="none"
    />
    <rect
      x="228"
      y="89"
      width="18"
      height="4"
      rx="2"
      stroke="white"
      strokeOpacity="0.2"
      strokeWidth="0.8"
      fill="none"
    />
    {/* Roues */}
    <circle
      cx="95"
      cy="114"
      r="20"
      stroke="white"
      strokeOpacity="0.2"
      strokeWidth="1.2"
      fill="white"
      fillOpacity="0.03"
    />
    <circle
      cx="95"
      cy="114"
      r="10"
      stroke="white"
      strokeOpacity="0.15"
      strokeWidth="1"
      fill="none"
    />
    <circle cx="95" cy="114" r="3" fill="white" fillOpacity="0.35" />
    {/* Rayons roue gauche */}
    {[0, 60, 120, 180, 240, 300].map((a) => (
      <line
        key={a}
        x1={95 + 3 * Math.cos((a * Math.PI) / 180)}
        y1={114 + 3 * Math.sin((a * Math.PI) / 180)}
        x2={95 + 10 * Math.cos((a * Math.PI) / 180)}
        y2={114 + 10 * Math.sin((a * Math.PI) / 180)}
        stroke="white"
        strokeOpacity="0.15"
        strokeWidth="0.8"
      />
    ))}
    <circle
      cx="235"
      cy="114"
      r="20"
      stroke="white"
      strokeOpacity="0.2"
      strokeWidth="1.2"
      fill="white"
      fillOpacity="0.03"
    />
    <circle
      cx="235"
      cy="114"
      r="10"
      stroke="white"
      strokeOpacity="0.15"
      strokeWidth="1"
      fill="none"
    />
    <circle cx="235" cy="114" r="3" fill="white" fillOpacity="0.35" />
    {[0, 60, 120, 180, 240, 300].map((a) => (
      <line
        key={a}
        x1={235 + 3 * Math.cos((a * Math.PI) / 180)}
        y1={114 + 3 * Math.sin((a * Math.PI) / 180)}
        x2={235 + 10 * Math.cos((a * Math.PI) / 180)}
        y2={114 + 10 * Math.sin((a * Math.PI) / 180)}
        stroke="white"
        strokeOpacity="0.15"
        strokeWidth="0.8"
      />
    ))}
    {/* Phares */}
    <rect
      x="278"
      y="88"
      width="12"
      height="8"
      rx="2"
      stroke="white"
      strokeOpacity="0.3"
      strokeWidth="0.8"
      fill="white"
      fillOpacity="0.08"
    />
    <line
      x1="290"
      y1="90"
      x2="310"
      y2="85"
      stroke="white"
      strokeOpacity="0.12"
      strokeWidth="0.8"
      strokeDasharray="2 3"
    />
    <line
      x1="290"
      y1="94"
      x2="310"
      y2="94"
      stroke="white"
      strokeOpacity="0.12"
      strokeWidth="0.8"
      strokeDasharray="2 3"
    />
    {/* Feux arrière */}
    <rect
      x="38"
      y="88"
      width="6"
      height="8"
      rx="1"
      stroke="white"
      strokeOpacity="0.2"
      strokeWidth="0.8"
      fill="white"
      fillOpacity="0.05"
    />
    {/* Route */}
    <line
      x1="0"
      y1="134"
      x2="320"
      y2="134"
      stroke="white"
      strokeOpacity="0.08"
      strokeWidth="1"
    />
    <line
      x1="100"
      y1="134"
      x2="220"
      y2="134"
      stroke="white"
      strokeOpacity="0.15"
      strokeWidth="1.5"
      strokeDasharray="8 8"
    />
    {/* Ombre portée */}
    <ellipse
      cx="165"
      cy="135"
      rx="120"
      ry="5"
      fill="white"
      fillOpacity="0.025"
    />
  </svg>
);

/* ─────────────────────────────────────────────
   DONNÉES SERVICES
───────────────────────────────────────────── */

const services = [
  {
    id: "01",
    title: "Réseau d'Agences",
    description:
      "Trouvez et collaborez avec les meilleures agences de transport partenaires.",
    cta: "Découvrir les agences",
    href: "/transports",
    illustration: IllustrationAgences,
  },
  {
    id: "02",
    title: "Devenir Partenaire",
    description:
      "Inscrivez votre agence et boostez votre visibilité auprès des voyageurs.",
    cta: "S'inscrire comme agence",
    href: "/entreprises",
    illustration: IllustrationPartenaire,
  },
  {
    id: "03",
    title: "Réserver un Ticket",
    description:
      "Réservez votre ticket en quelques clics et accédez aux meilleures offres.",
    cta: "Réservez votre ticket",
    href: "/transports",
    illustration: IllustrationTicket,
  },
  {
    id: "04",
    title: "Hébergement",
    description:
      "De l'hôtel à l'appartement, adapté à tous les budgets et envies.",
    cta: "Trouver un hébergement",
    href: "/hebergements",
    illustration: IllustrationHotel,
  },
];

/* ─────────────────────────────────────────────
   COMPOSANT CARTE (4 premières)
───────────────────────────────────────────── */

type ServiceDef = (typeof services)[0];

const ServiceCard: React.FC<{ service: ServiceDef; featured?: boolean }> = ({
  service,
  featured,
}) => {
  const Illustration = service.illustration;
  return (
    <div className="group relative bg-[#0d0d0d] hover:bg-[#0f0f0f] cursor-pointer transition-colors duration-300 overflow-hidden">
      {/* Accent top */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/0 group-hover:bg-white/20 transition-all duration-500 z-10" />

      {/* Illustration SVG — zone dédiée */}
      <div
        className={`
          relative flex items-center justify-center overflow-hidden
          ${featured ? "h-52" : "h-40"}
          bg-[#080808]
        `}
      >
        {/* Grille décorative de fond */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.03]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id={`grid-${service.id}`}
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
          <rect width="100%" height="100%" fill={`url(#grid-${service.id})`} />
        </svg>

        {/* Halo central */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-32 h-32 rounded-full bg-white/[0.02] group-hover:bg-white/[0.04] blur-2xl transition-all duration-500" />
        </div>

        <div className="relative w-full h-full p-4 opacity-60 group-hover:opacity-100 transition-opacity duration-500">
          <Illustration />
        </div>
      </div>

      {/* Séparateur */}
      <div className="h-px bg-white/[0.06]" />

      {/* Body */}
      <div className="px-5 pt-4 pb-6">
        <p className="text-[10px] tracking-[.35em] text-white/20 font-bold mb-2">
          {service.id}
        </p>
        <h3
          className={`font-black text-white tracking-tight mb-2 ${featured ? "text-xl" : "text-base"}`}
        >
          {service.title}
        </h3>
        <p className="text-xs leading-[1.75] text-white/35 mb-5">
          {service.description}
        </p>

        <div className="flex items-center justify-between border-t border-white/[0.06] pt-4">
          <Link
            href={service.href}
            className="flex items-center gap-2 text-[10px] tracking-[.25em] uppercase text-white/40 group-hover:text-white group-hover:gap-3 transition-all duration-300 no-underline"
          >
            {service.cta}
            <span className="inline-block w-4 h-px bg-current group-hover:w-7 transition-all duration-300" />
          </Link>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   COMPOSANT PRINCIPAL
───────────────────────────────────────────── */

const Categoryhome: React.FC = () => {
  return (
    <section className="relative py-8 md:py-10">
      <div className="absolute left-8 top-0 bottom-0 w-px bg-white/[0.08] hidden lg:block" />
      <DecorativeNumber number="03" />

      <div className="relative mx-auto max-w-6xl">
        {/* ── HEADER ── */}
        <div className="mb-16 md:mb-20">
          <div className="flex items-center gap-5">
            <div className="w-[3px] h-20 bg-white shrink-0" />
            <div>
              <p className="text-xs tracking-[0.45em] uppercase text-white/40 mt-1">
                SERVICES
              </p>
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

        {/* ── GRILLE 4 CARTES ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.06]">
          {services.map((s, i) => (
            <ServiceCard key={s.id} service={s} featured={i === 0} />
          ))}
        </div>

        {/* ── CARTE VOITURE — FULL WIDTH ── */}
        <div className="mt-px bg-white/[0.06]">
          <div className="group relative bg-[#0d0d0d] hover:bg-[#0f0f0f] cursor-pointer transition-colors duration-300 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/0 group-hover:bg-white/20 transition-all duration-500 z-10" />

            <div className="flex flex-col lg:flex-row">
              {/* Illustration voiture — large */}
              <div className="relative lg:w-1/2 h-48 lg:h-auto bg-[#080808] flex items-center justify-center overflow-hidden">
                <svg
                  className="absolute inset-0 w-full h-full opacity-[0.03]"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <pattern
                      id="grid-car"
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
                  <rect width="100%" height="100%" fill="url(#grid-car)" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-64 h-32 rounded-full bg-white/[0.025] group-hover:bg-white/[0.05] blur-3xl transition-all duration-500" />
                </div>
                <div className="relative w-full h-full p-6 opacity-50 group-hover:opacity-90 transition-opacity duration-500">
                  <IllustrationVoiture />
                </div>
              </div>

              {/* Séparateur vertical */}
              <div className="hidden lg:block w-px bg-white/[0.06]" />
              <div className="lg:hidden h-px bg-white/[0.06]" />

              {/* Contenu */}
              <div className="flex flex-col justify-between p-8 lg:p-10 lg:w-1/2">
                <div>
                  <p className="text-[10px] tracking-[.35em] text-white/20 font-bold mb-4">
                    05
                  </p>
                  <h3 className="text-3xl lg:text-4xl font-black text-white tracking-tight mb-3">
                    Voitures
                  </h3>
                  <p className="text-sm leading-[1.75] text-white/35 max-w-sm">
                    Louez facilement un véhicule adapté à vos besoins, avec des
                    options flexibles pour tous les budgets et toutes les
                    destinations.
                  </p>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-white/[0.06] pt-6">
                  <Link
                    href="/voitures"
                    className="flex items-center gap-3 text-[11px] tracking-[.3em] uppercase text-white/40 group-hover:text-white group-hover:gap-4 transition-all duration-300 no-underline"
                  >
                    Louer un véhicule
                    <span className="inline-block w-6 h-px bg-current group-hover:w-10 transition-all duration-300" />
                  </Link>
                  <span className="text-[9px] tracking-[.2em] uppercase text-white/20 border border-white/[0.08] px-2 py-0.5 font-mono">
                    Location
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categoryhome;
