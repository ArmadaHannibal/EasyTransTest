import React from "react";
import { IoStatsChart } from "react-icons/io5";
import { FaShopLock } from "react-icons/fa6";
import { IoMdPricetags } from "react-icons/io";
import { FaMapLocationDot } from "react-icons/fa6";

const features = [
  {
    id: "01",
    tag: "Transport",
    title: "Multitude d'agences",
    desc: "Accédez instantanément aux offres de nombreuses agences partenaires et trouvez le trajet qui vous convient.",
    icon: <IoStatsChart className="w-4 h-4" />,
  },
  {
    id: "02",
    tag: "Sécurité",
    title: "Achat sécurisé",
    desc: "Profitez d'un processus de réservation fiable, avec des paiements sécurisés et une protection optimale de vos données.",
    icon: <FaShopLock className="w-4 h-4" />,
  },
  {
    id: "03",
    tag: "Tarifs",
    title: "Meilleurs prix",
    desc: "Comparez les tarifs en un clin d'œil et réservez toujours au prix le plus avantageux disponible sur le marché.",
    icon: <IoMdPricetags className="w-4 h-4" />,
  },
  {
    id: "04",
    tag: "Destinations",
    title: "Multi-destinations",
    desc: "Découvrez un large choix de trajets vers de nombreuses destinations, pour un voyage rapide ou une longue aventure.",
    icon: <FaMapLocationDot className="w-4 h-4" />,
  },
];

const Banner: React.FC = () => {
  return (
    <header>
      <div className="relative h-[95vh] min-h-[600px] bg-[#080808]">
        {/* Image de fond */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-[url(https://res.cloudinary.com/dtrpkegss/image/upload/v1768423630/touriste-transportant-des-bagages_3__11zon_bbw8gm.webp)]"
          style={{ filter: "brightness(.45) grayscale(.15)" }}
        />

        {/* Overlay directionnel */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(8,8,8,.95) 35%, rgba(8,8,8,.5) 70%, rgba(8,8,8,.15) 100%)",
          }}
        />

        {/* Ligne verticale décorative */}
        <div className="absolute left-8 top-0 bottom-0 w-px bg-white/[0.06] hidden lg:block" />

        {/* Contenu hero */}
        <div className="relative z-10 h-full flex flex-col justify-end px-6 lg:px-16 pb-48 lg:pb-56">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-px bg-white/40" />
            <span className="text-[10px] tracking-[.45em] uppercase text-white/40 font-medium">
              Plateforme de voyage
            </span>
          </div>

          <h1
            className="text-3xl lg:text-5xl font-black text-white leading-[1.05] max-w-xl mb-6"
            style={{ letterSpacing: "-.03em" }}
          >
            EasyTrans — Voyagez simplement,{" "}
            <span className="text-white/35">réservez intelligemment.</span>
          </h1>

          <p className="text-[13px] leading-[1.85] text-white/40 max-w-md mb-10">
            Ne jonglez plus entre plusieurs sites pour organiser vos
            déplacements. EasyTrans regroupe toutes vos réservations en un seul
            espace clair et organisé.
          </p>

          <div className="flex items-center gap-6">
            <button className="group flex items-center gap-3 text-[11px] cursor-pointer tracking-[.25em] uppercase text-white/50 hover:text-white transition-all duration-300">
              Découvrir
              <span className="inline-block w-6 h-px bg-current group-hover:w-10 transition-all duration-300" />
            </button>
            <div className="w-px h-5 bg-white/12" />
            <button className="group flex items-center gap-3 cursor-pointer text-[11px] tracking-[.25em] uppercase text-white/50 hover:text-white transition-all duration-300">
              Nos partenaires
              <span className="inline-block w-6 h-px bg-current group-hover:w-10 transition-all duration-300" />
            </button>
          </div>
        </div>

        {/* SVG wave — conservé, couleur adaptée */}
        {/* <div className="absolute bottom-[-1px] left-0 right-0 z-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            className="w-full block"
          >
            <path
              fill="#0d0d0d"
              fillOpacity="1"
              d="M0,64L48,69.3C96,75,192,85,288,90.7C384,96,480,96,576,90.7C672,85,768,75,864,72C960,69,1056,75,1152,77.3C1248,80,1344,85,1392,88L1440,90L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            />
          </svg>
        </div> */}

        {/* Feature cards */}
        <div
          className="absolute -bottom-80 left-1/2 -translate-x-1/2 translate-y-1/2 w-full max-w-6xl px-4 md:bottom-0 lg:px-0 z-20
          grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.06]"
        >
          {features.map((f) => (
            <div
              key={f.id}
              className="group relative bg-white hover:bg-(--bg-legebluecalme) transition-colors duration-300 p-5 pb-7"
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-white/0 group-hover:bg-white/15 transition-all duration-300" />
              <span className="absolute top-5 right-5 text-[9px] tracking-[.35em] text-white/18">
                {f.id}
              </span>

              <div className="w-9 h-9 flex items-center justify-center border border-black/20 group-hover:border-white/90 mb-5 text-black group-hover:text-white/90 transition-colors duration-300">
                {f.icon}
              </div>

              <h3 className="text-[13px] font-bold text-black group-hover:text-white/90 tracking-tight mb-2">
                {f.title}
              </h3>
              <p className="text-[11px] leading-[1.7] text-black group-hover:text-white/90">
                {f.desc}
              </p>

              <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-black/40 group-hover:text-white/90" />
                <span className="text-[9px] tracking-[.2em] uppercase text-black group-hover:text-white/90">
                  {f.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Banner;
