import React from "react";
import { Image } from "@heroui/image";
import DecorativeNumber from "@/components/DecorativeNumber";

const About: React.FC = () => {
  return (
    <section
      className="relative flex flex-col items-center justify-center pb-[6rem] pt-[42rem] md:py-0 min-h-screen overflow-hidden mt-44 z-10"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Ligne verticale gauche décorative */}
      <div className="absolute left-8 top-0 bottom-0 w-px bg-white/8 hidden lg:block" />

      {/* Numéro de section décoratif */}
      {/* <span
        className="absolute top-10 right-10 text-[11rem] font-black leading-none select-none pointer-events-none hidden lg:block"
        style={{
          color: "transparent",
          WebkitTextStroke: "1px rgba(255,255,255,0.04)",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        01
      </span> */}
      <DecorativeNumber number="01" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-16">
        {/* ── HEADER ── */}
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
                À PROPOS
              </p>
            </div>
          </div>

          {/* Ligne horizontale */}
          <div className="mt-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-white/20 text-xs tracking-widest">
              EsayTrans
            </span>
            <div className="w-8 h-px bg-white/10" />
          </div>
        </div>

        {/* ── CONTENU PRINCIPAL ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* Image — col 5 */}
          <div className="lg:col-span-5 relative group">
            {/* Cadre décoratif décalé */}
            <div
              className="absolute -top-4 -left-4 w-full h-full border border-white/10 z-0 transition-transform duration-500 group-hover:translate-x-1 group-hover:translate-y-1"
              style={{ borderRadius: "2px" }}
            />
            {/* Image */}
            <div
              className="relative z-10 overflow-hidden"
              style={{ borderRadius: "2px" }}
            >
              <Image
                alt="EasyTrans"
                src="https://res.cloudinary.com/dtrpkegss/image/upload/v1768423919/african-cafe-beautiful-american-black_11zon_yvqlgm.webp"
                width={500}
                className="w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                style={{ display: "block" }}
              />
              {/* Overlay dégradé bas */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>

            {/* Badge flottant */}
            <div
              className="absolute -bottom-5 -right-5 z-20 px-5 py-3 border border-white/15"
              style={{
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(12px)",
                borderRadius: "2px",
              }}
            >
              <p className="text-white text-xs tracking-[0.3em] uppercase font-medium">
                Plateforme de voyage
              </p>
            </div>
          </div>

          {/* Texte — col 7 */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            {/* Tag */}
            <div className="flex items-center gap-3">
              <div className="w-6 h-px bg-white/40" />
              <span className="text-white/40 text-xs tracking-[0.4em] uppercase font-medium">
                Notre mission
              </span>
            </div>

            {/* Accroche */}
            <h3
              className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight"
              style={{ letterSpacing: "-0.02em" }}
            >
              Centralisez tous vos
              <br />
              <span className="text-white/40">voyages en un seul endroit.</span>
            </h3>

            {/* Paragraphe */}
            <p className="text-white/50 text-base leading-[1.85] max-w-xl">
              EasyTrans est votre solution idéale pour centraliser toutes vos
              réservations de voyage. Comparez les meilleures offres, réservez
              vos transports, hébergements et services en quelques clics — bus,
              trains, hôtels, locations de voiture et plus encore.
            </p>

            {/* Séparateur */}
            <div className="w-full h-px bg-white/8" />

            {/* Stats inline */}
            <div className="grid grid-cols-3 gap-6">
              {[
                { value: "100+", label: "Partenaires" },
                { value: "24/7", label: "Disponible" },
                { value: "0€", label: "Frais cachés" },
              ].map(({ value, label }) => (
                <div key={label} className="flex flex-col gap-1">
                  <span
                    className="text-2xl md:text-3xl font-black text-white"
                    style={{ letterSpacing: "-0.03em" }}
                  >
                    {value}
                  </span>
                  <span className="text-white/30 text-xs tracking-[0.25em] uppercase">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA discret */}
            <div className="flex items-center gap-4 mt-2">
              <button className="group flex items-center cursor-pointer gap-3 text-white text-sm font-medium tracking-wide transition-all duration-300 hover:gap-5">
                <span>Découvrir EasyTrans</span>
                <span className="w-8 h-px bg-white transition-all duration-300 group-hover:w-12" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
