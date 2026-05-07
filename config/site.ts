export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Next.js + HeroUI",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      label: "Accueil",
      href: "/",
    },
    {
      label: "Transports",
      href: "/transports",
    },
    {
      label: "Hébergements",
      href: "/hebergements",
      sections: [
        {
          title: "Emplacements",
          items: [
            {
              label: "Tous les hébergements",
              desc: "Explorez notre sélection complète de séjours.",
              href: "/hebergements",
            },
          ],
        },
        {
          title: "Services",
          items: [
            {
              label: "Hôtel",
              desc: "Service complet, confort et détente absolue.",
              href: "/hebergements/hotel",
            },
            {
              label: "Appartement",
              desc: "Vivez comme un local avec une totale autonomie.",
              href: "/hebergements/appartement",
            },
          ],
        },
      ],
    },
    {
      label: "Voitures",
      href: "/voitures",
    },
    {
      label: "Entreprises",
      href: "/entreprises",
    },
  ],
  navMenuItems: [
    {
      label: "Accueil",
      href: "/",
    },
    {
      label: "Agences",
      href: "/docs",
    },
    {
      label: "Tickets",
      href: "/pricing",
    },
    {
      label: "Contact",
      href: "/blog",
    },
    {
      label: "Connexion",
      href: "/login",
    },
    {
      label: "Inscription",
      href: "/register",
    },
  ],
  links: {
    github: "https://github.com/heroui-inc/heroui",
    twitter: "https://twitter.com/hero_ui",
    docs: "https://heroui.com",
    inscription: "/register",
    connexion: "/login",
  },
};
