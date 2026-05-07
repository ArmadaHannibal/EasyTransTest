"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer7 } from "@/components/footer-7";
import { createClient } from "@/utils/supabase/client";
import { useEffect } from "react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideNavbarRoutes = [
    "/dashboard",
    "/dashboard/demandepartenaire",
    "/dashboard/agence",
    "/dashboard/gestiondesbateaux/edit",
    "/dashboard/demandepartenaire",
    "/dashboard/gestiondesbateaux/creer/finalisation",
    "/dashboard/gestiondesutilisateurs",
    "/dashboard/support&messages",
    "/dashboard/reservations",
  ];

  // Vérifie si l'URL commence par l'une des routes définies
  const shouldHideNavbar = hideNavbarRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const supabase = createClient();

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("AUTH EVENT:", event, session);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <div className="relative flex flex-col h-screen">
      {!shouldHideNavbar && <Navbar />}
      <main>{children}</main>
      {!shouldHideNavbar && <Footer7 />}
    </div>
  );
}
