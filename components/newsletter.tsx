"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  return (
    <section className="relative overflow-hidden py-20 px-6">
      {/* Ligne verticale décorative */}
      <div className="absolute left-8 top-0 bottom-0 w-px bg-white/[0.06] hidden lg:block" />

      <div className="max-w-3xl mx-auto flex flex-col items-center gap-12">
        {/* Header */}
        <div className="flex items-center gap-5 w-full">
          <div className="w-[3px] h-14 bg-white shrink-0" />
          <div className="flex flex-col gap-1">
            <p className="text-[10px] tracking-[.45em] uppercase text-white/35 font-medium">
              Restez informé
            </p>
            <h2 className="text-2xl font-black tracking-tight text-white">
              Newsletter
            </h2>
          </div>
        </div>

        {/* Séparateur */}
        <div className="flex items-center gap-4 w-full">
          <div className="h-px flex-1 bg-white/[0.06]" />
          <span className="text-[10px] text-white/15 tracking-[.3em] font-mono">
            EasyTrans
          </span>
          <div className="w-8 h-px bg-white/[0.06]" />
        </div>

        {/* Corps */}
        <div className="flex flex-col items-center gap-6 text-center max-w-lg">
          <p className="text-[13px] leading-[1.8] text-white/35">
            Recevez en avant-première nos meilleures offres de voyage, nos
            nouveaux partenaires et nos actualités directement dans votre boîte
            mail.
          </p>

          {/* Champ e-mail */}
          <div className="flex items-center w-full max-w-md border border-white/10 bg-white/[0.02] focus-within:border-white/25 transition-colors duration-300">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre adresse e-mail"
              className="bg-transparent outline-none border-none text-white text-[13px] placeholder:text-white/25 px-5 h-[52px] flex-1"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            />
            <button className="group flex items-center gap-2 cursor-pointer h-10 mx-1.5 px-5 bg-white/[0.06] border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20 text-[10px] tracking-[.25em] uppercase font-medium transition-all duration-300">
              S'inscrire
              <span className="inline-block w-3.5 h-px bg-current group-hover:w-5 transition-all duration-300" />
            </button>
          </div>

          <span className="text-[10px] text-white/18 tracking-wide">
            Aucun spam · Désinscription libre à tout moment
          </span>
        </div>
      </div>
    </section>
  );
}
