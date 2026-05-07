"use client";

import { useState, useEffect, useId } from "react";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

const STATIC_CATEGORIES = [
  {
    title: "Mini / Citadines",
    cover:
      "https://res.cloudinary.com/dtrpkegss/image/upload/v1768430012/Mini_-_Citadine_11zon_kihztv.webp",
    description:
      "Petites voitures urbaines, idéales pour la ville et les courts trajets.",
    accent: "#378ADD",
  },
  {
    title: "Économique",
    cover:
      "https://res.cloudinary.com/dtrpkegss/image/upload/v1768430142/%C3%89conomique_ztplgc.webp",
    description:
      "Un peu plus spacieuses que les mini, parfaites pour voyages courts à moyens.",
    accent: "#1D9E75",
  },
  {
    title: "Compacte / Intermédiaire",
    cover:
      "https://res.cloudinary.com/dtrpkegss/image/upload/v1768429236/Compacte_Interm%C3%A9diaire_7_tcxihx.webp",
    description:
      "Bon compromis entre confort, espace et économie. Adaptées pour 4-5 personnes.",
    accent: "#BA7517",
  },
  {
    title: "Standard / Full-Size",
    cover:
      "https://res.cloudinary.com/dtrpkegss/image/upload/v1768429236/Standard_Full_Size_3_11zon_wk3x4w.webp",
    description:
      "Plus grandes et confortables. Idéales pour les longs trajets.",
    accent: "#D4537E",
  },
  {
    title: "SUV / Crossovers",
    cover:
      "https://res.cloudinary.com/dtrpkegss/image/upload/v1768429224/SUV_toutes_tailles__4_11zon_onpdm4.webp",
    description:
      "Véhicules plus hauts, grand coffre, parfaits pour la route et les vacances.",
    accent: "#7F77DD",
  },
  {
    title: "Monospaces",
    cover:
      "https://res.cloudinary.com/dtrpkegss/image/upload/v1768429236/Monospace_2_11zon_czecui.webp",
    description: "Pour groupes et familles nombreuses. 7 à 9 places.",
    accent: "#D85A30",
  },
  {
    title: "Vans",
    cover:
      "https://res.cloudinary.com/dtrpkegss/image/upload/v1768429224/Van_5_11zon_gvfxem.webp",
    description: "Capacité maximale pour groupes et longs trajets en famille.",
    accent: "#639922",
  },
  {
    title: "Premium / Luxe",
    cover:
      "https://res.cloudinary.com/dtrpkegss/image/upload/v1768429260/Premium_Luxe_kozikw.webp",
    description:
      "Voitures haut de gamme. Confort, technologie et performance au rendez-vous.",
    accent: "#C9A227",
  },
  {
    title: "Électrique / Hybride",
    cover:
      "https://res.cloudinary.com/dtrpkegss/image/upload/v1768429235/%C3%89lectrique_Hybride_6_rkyif9.webp",
    description: "Véhicules électriques ou hybrides modernes et écologiques.",
    accent: "#1D9E75",
  },
];

type TitleToIdMap = Record<string, string>;
const supabase = createClient();

interface ExpandOnHoverProps {
  onCategorySelect?: (categoryId: string | null, label: string) => void;
}

// ── GridPattern ────────────────────────────────────────────────────────────────
const GridPattern = () => {
  const id = useId();
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.04]"
      xmlns="http://www.w3.org/2000/svg"
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

// ── CategoryRow ────────────────────────────────────────────────────────────────
interface CategoryRowProps {
  cat: (typeof STATIC_CATEGORIES)[0];
  index: number;
  isActive: boolean;
  isResolvable: boolean;
  onSelect: () => void;
}

const CategoryRow = ({
  cat,
  index,
  isActive,
  isResolvable,
  onSelect,
}: CategoryRowProps) => (
  <div
    onClick={isResolvable ? onSelect : undefined}
    className={`group relative flex items-center gap-5 px-6 py-5 bg-[#0a0a0a] transition-colors duration-300 overflow-hidden
      ${isResolvable ? "cursor-pointer hover:bg-[#0f0f0f]" : "cursor-not-allowed opacity-30"}
    `}
    title={
      !isResolvable ? `Catégorie "${cat.title}" introuvable en base` : undefined
    }
  >
    {/* Index */}
    <span className="text-[9px] font-mono tracking-[.1em] text-white/15 w-6 shrink-0 text-right">
      {String(index + 1).padStart(2, "0")}
    </span>

    {/* Thumb */}
    <div className="w-14 h-10 overflow-hidden shrink-0">
      <img
        src={cat.cover}
        alt={cat.title}
        className={`w-full h-full object-cover transition-all duration-500
          ${isActive ? "brightness-90 grayscale-0 scale-105" : "brightness-50 grayscale-[.4] group-hover:brightness-75 group-hover:scale-105"}
        `}
      />
    </div>

    {/* Info */}
    <div className="flex-1 min-w-0">
      <p
        className="font-['Cormorant_Garamond',serif] text-xl font-normal tracking-[-0.01em] text-white leading-tight mb-0.5"
        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
      >
        {cat.title}
      </p>
      <p className="text-[11px] text-white/20 leading-relaxed truncate">
        {cat.description}
      </p>
    </div>

    {/* Accent dot */}
    <div
      className="w-2 h-2 rounded-full shrink-0"
      style={{
        background: isActive ? cat.accent : `${cat.accent}40`,
        border: `1px solid ${cat.accent}${isActive ? "cc" : "50"}`,
        boxShadow: isActive ? `0 0 8px ${cat.accent}60` : "none",
        transition: "all .3s",
      }}
    />

    {/* Tag */}
    <span
      className={`text-[8px] font-mono tracking-[.15em] uppercase text-white/20 whitespace-nowrap transition-opacity duration-300
        ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
      `}
    >
      {isActive ? "Sélectionné ×" : "Filtrer →"}
    </span>

    {/* Active accent bar left */}
    <div
      className="absolute left-0 top-0 bottom-0 w-[2px] transition-all duration-300"
      style={{ background: isActive ? cat.accent : "transparent" }}
    />

    {/* Bottom line slide */}
    <div
      className="absolute bottom-0 left-6 right-0 h-px transition-all duration-500 origin-left"
      style={{
        background: `linear-gradient(to right, ${cat.accent}30, transparent)`,
        transform: isActive ? "scaleX(1)" : "scaleX(0)",
        transformOrigin: "left",
      }}
    />
  </div>
);

// ── Composant principal ────────────────────────────────────────────────────────
const ExpandOnHover = ({ onCategorySelect }: ExpandOnHoverProps) => {
  const [titleToId, setTitleToId] = useState<TitleToIdMap>({});
  const [activeTitle, setActiveTitle] = useState<string | null>(null);

  useEffect(() => {
    const resolve = async () => {
      const { data } = await supabase
        .from("categories_car")
        .select("id, title");
      if (!data) return;
      const map: TitleToIdMap = {};
      data.forEach((row: { id: string; title: string }) => {
        map[row.title.trim().toLowerCase()] = row.id;
      });
      setTitleToId(map);
    };
    resolve();
  }, []);

  const getIdForTitle = (title: string): string | null =>
    titleToId[title.trim().toLowerCase()] ?? null;

  const handleSelect = (title: string) => {
    const id = getIdForTitle(title);
    if (!id) return;
    if (activeTitle === title) {
      setActiveTitle(null);
      onCategorySelect?.(null, "");
    } else {
      setActiveTitle(title);
      onCategorySelect?.(id, title);
    }
  };

  const handleClear = () => {
    setActiveTitle(null);
    onCategorySelect?.(null, "");
  };

  const activeCat =
    STATIC_CATEGORIES.find((c) => c.title === activeTitle) ?? null;

  return (
    <div className="relative overflow-hidden">
      <div className="absolute left-8 top-0 bottom-0 w-px bg-white/[0.06] hidden lg:block" />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-0">
        {/* Header */}
        <div className="mb-10 md:mb-14 w-full">
          <div className="flex items-center gap-5">
            <div className="w-[3px] h-20 bg-white shrink-0" />
            <div>
              <p className="text-[10px] tracking-[0.45em] uppercase text-white/40 mt-1">
                Sélectionnez votre véhicule
              </p>
              <h2 className="text-sm md:text-base font-black text-white tracking-tight mt-1">
                NOTRE COLLECTION
              </h2>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-white/20 text-xs font-mono tracking-widest">
              EasyTrans
            </span>
            <div className="w-8 h-px bg-white/10" />
          </div>
        </div>

        {/* Header de liste avec compteur */}
        <div className="flex items-end justify-between mb-px">
          <span className="text-[9px] font-mono tracking-[.35em] uppercase text-white/15 pb-3">
            Catégories disponibles
          </span>
          <span
            className="font-['Cormorant_Garamond',serif] text-[64px] font-light leading-none text-white/[0.04] select-none"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            09
          </span>
        </div>

        {/* Liste */}
        <div className="flex flex-col gap-px bg-white/[0.05]">
          {STATIC_CATEGORIES.map((cat, i) => (
            <CategoryRow
              key={cat.title}
              cat={cat}
              index={i}
              isActive={activeTitle === cat.title}
              isResolvable={getIdForTitle(cat.title) !== null}
              onSelect={() => handleSelect(cat.title)}
            />
          ))}
        </div>

        {/* Panneau de détail */}
        <AnimatePresence>
          {activeCat && (
            <motion.div
              key={activeCat.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="max-w-xl mx-auto mt-10"
            >
              <div
                className="relative border bg-[#0d0d0d] overflow-hidden"
                style={{ borderColor: `${activeCat.accent}25` }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-[1.5px]"
                  style={{
                    background: `linear-gradient(to right, transparent, ${activeCat.accent}, transparent)`,
                  }}
                />
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-20 blur-3xl opacity-15 pointer-events-none"
                  style={{ backgroundColor: activeCat.accent }}
                />
                <GridPattern />
                <div className="relative z-10 flex items-start gap-6 px-8 py-6">
                  <div className="w-16 h-12 overflow-hidden shrink-0 opacity-80">
                    <img
                      src={activeCat.cover}
                      alt={activeCat.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-[9px] tracking-[.4em] uppercase font-mono mb-1"
                      style={{ color: activeCat.accent }}
                    >
                      Catégorie sélectionnée
                    </p>
                    <p
                      className="text-lg font-normal text-white tracking-tight mb-2"
                      style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                      }}
                    >
                      {activeCat.title}
                    </p>
                    <p className="text-[11px] text-white/35 leading-relaxed">
                      {activeCat.description}
                    </p>
                  </div>
                </div>
                <div
                  className="h-px"
                  style={{
                    background: `linear-gradient(to right, transparent, ${activeCat.accent}25, transparent)`,
                  }}
                />
              </div>

              <button
                onClick={handleClear}
                className="block mx-auto mt-4 bg-transparent border-none text-[10px] tracking-[.25em] uppercase font-mono text-white/20 hover:text-white/50 transition-colors duration-200 cursor-pointer"
              >
                — Réinitialiser la sélection —
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ExpandOnHover;
