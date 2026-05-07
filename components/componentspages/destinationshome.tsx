"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { FaArrowRight } from "react-icons/fa6";
import DecorativeNumber from "@/components/DecorativeNumber";

const listedestinations = [
  {
    id: "1",
    city: "Brazzaville",
    badge: "Capitale",
    url: "https://res.cloudinary.com/dtrpkegss/image/upload/v1765132100/A-Brazzaville-Mpila-est-en-plein-renouvellement-urbain_izfrwp.webp",
    description:
      "Capitale du pays, située sur les rives du fleuve Congo, juste en face de Kinshasa.",
  },
  {
    id: "2",
    city: "Pointe-Noire",
    url: "https://res.cloudinary.com/dtrpkegss/image/upload/v1765132101/vue-aerienne-de-drone-du-centre-ville-de-chisinau-vue-panoramique-sur-plusieurs-routes-de-batiments_oefmzk.webp",
    description:
      "Principal port maritime et centre économique, notamment pour l'industrie pétrolière.",
  },
  {
    id: "3",
    city: "Dolisie",
    url: "https://res.cloudinary.com/dtrpkegss/image/upload/v1765132100/Sans-titre-3_tukobh.webp",
    description:
      "Ville industrielle et commerciale importante située dans le sud-ouest du pays.",
  },
  {
    id: "4",
    city: "Oyo",
    url: "https://res.cloudinary.com/dtrpkegss/image/upload/v1765132100/OYO_1_odb0wf.webp",
    description:
      "Petite ville au nord du pays, connue pour sa proximité avec les zones agricoles.",
  },
];

const DestinationHome: React.FC = () => {
  const router = useRouter();

  const goToDestination = (city: string) => {
    router.push(`/destinations/${encodeURIComponent(city)}`);
  };

  return (
    <section className="relative py-8 md:py-10">
      <div className="absolute left-8 top-0 bottom-0 w-px bg-white/8 hidden lg:block" />
      <DecorativeNumber number="02" />
      {/* ── HEADER ── */}
      <div className="relative mx-auto max-w-6xl">
        <div className="mb-16 md:mb-20">
          <div className="flex items-center gap-5">
            {/* Barre verticale */}
            <div className="w-[3px] h-20 bg-white shrink-0" />
            <div className="relative">
              {/* <PathAnimation
                title="EASYTRANS"
                className="-top-[3rem] -left-[15.5rem]"
                fontSize="text-6xl"
              /> */}
              <p
                className="text-xs tracking-[0.5em] uppercase text-white/40 mt-1"
                style={{ letterSpacing: "0.45em" }}
              >
                DESTINATIONS
              </p>
            </div>
          </div>

          {/* Ligne horizontale */}
          <div className="mt-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-white/20 text-xs font-mono tracking-widest">
              EsayTrans
            </span>
            <div className="w-8 h-px bg-white/10" />
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.06]">
          {listedestinations.map((dest, i) => (
            <div
              key={dest.id}
              className="group relative bg-[#0d0d0d] hover:bg-[#111] cursor-pointer transition-colors duration-300 overflow-hidden"
              onClick={() => goToDestination(dest.city)}
            >
              {/* Accent line top */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/0 group-hover:bg-white/12 transition-all duration-300" />

              {/* Image */}
              <div className="overflow-hidden relative">
                <img
                  src={dest.url}
                  alt={dest.city}
                  className="w-full h-48 object-cover brightness-[.7] grayscale-[.2] group-hover:brightness-[.85] group-hover:grayscale-0 group-hover:scale-[1.04] transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0d0d0d]" />
              </div>

              {/* Body */}
              <div className="px-5 pt-4 pb-6">
                <p className="text-[10px] font-mono tracking-[.35em] text-white/20 font-bold mb-2">
                  {dest.id}
                </p>
                <h3 className="text-lg font-black text-white tracking-tight mb-2">
                  {dest.city}
                </h3>
                <p className="text-xs leading-[1.7] text-white/40 mb-5">
                  {dest.description}
                </p>

                <div className="flex items-center justify-between border-t border-white/[0.06] pt-4">
                  <span className="flex items-center gap-2 text-[11px] tracking-[.25em] uppercase text-white/50 group-hover:text-white group-hover:gap-3 transition-all duration-300">
                    Explorer
                    <span className="inline-block w-5 h-px bg-current group-hover:w-8 transition-all duration-300" />
                  </span>
                  <span className="text-[9px] tracking-[.2em] uppercase text-white/25 border border-white/[0.08] px-2 py-0.5">
                    {dest.badge}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DestinationHome;
