import React, { useId } from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

// ── GridPattern (same as apartment/hotel design) ──────────────────────────────
const GridPattern = () => {
  const id = useId();
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.035]"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <pattern id={id} width="20" height="20" patternUnits="userSpaceOnUse">
          <path
            d="M 20 0 L 0 0 0 20"
            fill="none"
            stroke="white"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
};

// ── Types ─────────────────────────────────────────────────────────────────────
interface Footer7Props {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  sections?: Array<{
    title: string;
    links: Array<{ name: string; href: string }>;
  }>;
  description?: string;
  socialLinks?: Array<{
    icon: React.ReactElement;
    href: string;
    label: string;
  }>;
  copyright?: string;
  legalLinks?: Array<{
    name: string;
    href: string;
  }>;
}

// ── Defaults ──────────────────────────────────────────────────────────────────
const defaultSections = [
  {
    title: "Product",
    links: [
      { name: "Overview", href: "#" },
      { name: "Pricing", href: "#" },
      { name: "Marketplace", href: "#" },
      { name: "Features", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About", href: "#" },
      { name: "Team", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Careers", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "Help", href: "#" },
      { name: "Sales", href: "#" },
      { name: "Advertise", href: "#" },
      { name: "Privacy", href: "#" },
    ],
  },
];

const defaultSocialLinks = [
  { icon: <FaInstagram className="w-4 h-4" />, href: "#", label: "Instagram" },
  { icon: <FaFacebook className="w-4 h-4" />, href: "#", label: "Facebook" },
  { icon: <FaTwitter className="w-4 h-4" />, href: "#", label: "Twitter" },
  { icon: <FaLinkedin className="w-4 h-4" />, href: "#", label: "LinkedIn" },
];

const defaultLegalLinks = [
  { name: "Conditions d'utilisation", href: "#" },
  { name: "Politique de confidentialité", href: "#" },
];

// ── Component ─────────────────────────────────────────────────────────────────
export const Footer7 = ({
  logo = {
    url: "/",
    src: "https://www.shadcnblocks.com/images/block/logos/shadcnblockscom-icon.svg",
    alt: "logo",
    title: "EasyTrans",
  },
  sections = defaultSections,
  description = "A collection of components for your startup business or side project.",
  socialLinks = defaultSocialLinks,
  copyright = "© 2024 EasyTrans. Tous droits réservés.",
  legalLinks = defaultLegalLinks,
}: Footer7Props) => {
  return (
    <footer className="relative bg-(--bg-legebluemoyen) text-white">
      <GridPattern />

      {/* ── Ligne décorative teal en haut ── */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-teal-400/0 via-teal-400/50 to-teal-400/0" />

      {/* ══ BODY ══ */}
      <div className="relative z-10 container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-14 pb-0">
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
          {/* ── Brand column ── */}
          <div className="flex flex-col gap-6 lg:max-w-[260px] flex-shrink-0">
            {/* Logo */}
            <a href={logo.url} className="flex items-center gap-3 group w-fit">
              {/* Barre teal style SectionHeader */}
              <span className="w-[3px] h-7 bg-teal-400 rounded-full group-hover:h-8 transition-all duration-200" />
              <img
                src={logo.src}
                alt={logo.alt}
                title={logo.title}
                className="h-7 opacity-90 group-hover:opacity-100 transition-opacity"
              />
              <span className="text-lg font-bold text-white tracking-tight">
                {logo.title}
              </span>
            </a>

            {/* Description */}
            <p className="text-sm text-white/40 leading-relaxed">
              {description}
            </p>

            {/* Social links */}
            <div className="flex items-center gap-2">
              {socialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 text-white/40 hover:text-teal-400 hover:bg-teal-400/10 hover:border-teal-400/25 transition-all duration-200"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* ── Links grid ── */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:flex-1 lg:gap-10">
            {sections.map((section, sectionIdx) => (
              <div key={sectionIdx} className="flex flex-col gap-4">
                {/* Section header style SectionHeader */}
                <div className="flex items-center gap-3">
                  <span className="w-[2px] h-5 bg-teal-400/70 rounded-full" />
                  <p className="text-[10px] tracking-[0.4em] uppercase text-teal-400/60 font-medium">
                    {section.title}
                  </p>
                </div>

                <ul className="flex flex-col gap-2.5">
                  {section.links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <a
                        href={link.href}
                        className="text-sm text-white/40 hover:text-white transition-colors duration-150 flex items-center gap-2 group"
                      >
                        <span className="w-0 group-hover:w-3 h-[1px] bg-teal-400/60 transition-all duration-200 rounded-full" />
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ BOTTOM BAR ══ */}
      <div className="relative z-10 mt-12 mx-auto max-w-6xl">
        {/* Separator */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-white/[0.07]" />
            <span className="text-white/10 text-[10px] tracking-widest">
              EasyTrans
            </span>
            <div className="w-8 h-px bg-white/[0.07]" />
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Copyright */}
            <p className="text-xs text-white/25 order-2 sm:order-1">
              {copyright}
            </p>

            {/* Legal links */}
            <ul className="flex flex-wrap gap-x-5 gap-y-2 order-1 sm:order-2">
              {legalLinks.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    className="text-xs text-white/30 hover:text-teal-400 transition-colors duration-150"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};
