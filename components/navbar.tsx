"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import NextLink from "next/link";
import clsx from "clsx";
import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { IoLogIn } from "react-icons/io5";
import { GiArchiveRegister } from "react-icons/gi";
import { SearchIcon, Logo } from "@/components/icons";
import { useUserProfile } from "@/hooks/useUserProfile";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from "@heroui/dropdown";
import Notifications from "@/components/Notification";
import ButtonCart from "@/components/ButtonCart";
import ComponentAide from "@/components/ComponentAide";
import UserDropdown from "@/components/user-dropdown";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { FaCaretDown } from "react-icons/fa6";

// ── GridPattern mini (accent décoratif) ───────────────────────────────────────
const NavAccent = () => (
  <span className="absolute left-0 bottom-0 w-full h-[2px] bg-gradient-to-r from-teal-400/0 via-teal-400/60 to-teal-400/0 pointer-events-none" />
);

// ── Navbar ─────────────────────────────────────────────────────────────────────
export const Navbar = () => {
  const { profile } = useUserProfile();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <HeroUINavbar
      maxWidth="xl"
      position="sticky"
      className={`
        fixed top-0 left-0 w-full z-50 text-white transition-all duration-300
        ${
          scrolled
            ? "bg-(--bg-legebluemoyen)/95 backdrop-blur-md border-b border-white/[0.07] shadow-lg shadow-black/20"
            : "bg-(--bg-legebluemoyen) border-b border-white/[0.05]"
        }
      `}
    >
      {/* ── Left: Logo + nav links ── */}
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink
            className="flex justify-start items-center gap-2 group"
            href="/"
          >
            {/* Barre teal à gauche du logo, style SectionHeader */}
            <span className="w-[3px] h-6 bg-teal-400 rounded-full group-hover:h-7 transition-all duration-200" />
            <Logo />
          </NextLink>
        </NavbarBrand>

        <ul className="hidden lg:flex gap-1 justify-start items-center ml-3">
          {siteConfig.navItems
            .filter((item) => !(item.href === "/" && pathname === "/"))
            .map((item) => {
              if (item.sections) {
                return (
                  <NavbarItem key={item.label}>
                    <Dropdown
                      showArrow
                      classNames={{
                        content:
                          "py-1 px-1 border border-white/10 bg-(--bg-legebluemoyen) backdrop-blur-md shadow-xl shadow-black/30",
                      }}
                    >
                      <DropdownTrigger>
                        <Button
                          disableRipple
                          className={`
                            px-3 py-1.5 h-auto min-w-0 rounded-lg text-sm font-medium
                            bg-transparent data-[hover=true]:bg-teal-400/8
                            text-white/70 data-[hover=true]:text-white
                            border border-transparent data-[hover=true]:border-teal-400/20
                            transition-all duration-200
                          `}
                          endContent={
                            <FaCaretDown
                              fill="currentColor"
                              size={12}
                              className="text-teal-400/60 mt-0.5"
                            />
                          }
                          variant="light"
                        >
                          {item.label}
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu
                        aria-label={item.label}
                        variant="faded"
                        classNames={{
                          list: "gap-0.5",
                        }}
                      >
                        {item.sections.map((section) => (
                          <DropdownSection
                            key={section.title}
                            title={section.title}
                            classNames={{
                              heading:
                                "text-[10px] tracking-[0.4em] uppercase text-teal-400/50 px-2 pt-2 pb-1",
                            }}
                          >
                            {section.items.map((subItem) => (
                              <DropdownItem
                                key={subItem.href}
                                description={subItem.desc}
                                href={subItem.href}
                                classNames={{
                                  base: "rounded-lg data-[hover=true]:bg-teal-400/8 data-[hover=true]:border-teal-400/15",
                                  title: "text-white/80 text-sm",
                                  description: "text-white/35 text-xs",
                                }}
                              >
                                {subItem.label}
                              </DropdownItem>
                            ))}
                          </DropdownSection>
                        ))}
                      </DropdownMenu>
                    </Dropdown>
                  </NavbarItem>
                );
              }

              const isActive = pathname === item.href;
              return (
                <NavbarItem key={item.href}>
                  <NextLink
                    href={item.href}
                    className={`
                      relative px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                      ${
                        isActive
                          ? "text-teal-400 bg-teal-400/10 border border-teal-400/20"
                          : "text-white/70 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10"
                      }
                    `}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-teal-400 rounded-full" />
                    )}
                  </NextLink>
                </NavbarItem>
              );
            })}
        </ul>
      </NavbarContent>

      {/* ── Right: actions ── */}
      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        {/* Search */}
        <NavbarItem className="hidden md:flex">
          <NextLink
            href="/recherche"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-teal-400/8 border border-white/10 hover:border-teal-400/20 text-white/60 hover:text-white text-sm font-medium transition-all duration-200"
          >
            <SearchIcon className="w-3.5 h-3.5 text-teal-400/70" />
            <span className="text-xs tracking-wide">Rechercher</span>
          </NextLink>
        </NavbarItem>

        {/* Notifications */}
        <NavbarItem className="hidden md:flex">
          <Notifications />
        </NavbarItem>

        {/* Aide */}
        <NavbarItem className="hidden md:flex">
          <ComponentAide />
        </NavbarItem>

        {/* Cart */}
        <NavbarItem className="hidden md:flex">
          <ButtonCart />
        </NavbarItem>

        {/* Connexion (si non connecté) */}
        <NavbarItem className={profile?.user_id ? "hidden" : "hidden md:flex"}>
          <Button
            as={Link}
            href={siteConfig.links.connexion}
            startContent={<IoLogIn className="w-3.5 h-3.5" />}
            className="text-xs font-medium text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200 h-8 px-3 rounded-lg"
            variant="flat"
          >
            Connexion
          </Button>
        </NavbarItem>

        {/* UserDropdown (si connecté) */}
        <NavbarItem className={profile?.user_id ? "" : "hidden"}>
          <UserDropdown />
        </NavbarItem>

        {/* Inscription (si non connecté) */}
        <NavbarItem className={profile?.user_id ? "hidden" : "hidden md:flex"}>
          <Button
            as={Link}
            href={siteConfig.links.inscription}
            startContent={<GiArchiveRegister className="w-3.5 h-3.5" />}
            className="text-xs font-semibold text-black bg-white hover:bg-white border border-white/0 hover:border-teal-300/30 transition-all duration-200 h-8 px-3 rounded-lg shadow-sm shadow-teal-500/20"
            variant="flat"
          >
            Inscription
          </Button>
        </NavbarItem>
      </NavbarContent>

      {/* ── Mobile toggle ── */}
      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <NavbarMenuToggle className="text-white/70 hover:text-teal-400 transition-colors" />
      </NavbarContent>

      {/* ── Mobile menu ── */}
      <NavbarMenu className="bg-(--bg-legebluemoyen)/98 backdrop-blur-xl pt-6 pb-8 border-t border-white/[0.06]">
        <div className="mx-4 flex flex-col gap-1">
          {/* Search mobile */}
          <NextLink
            href="/recherche"
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 text-sm mb-3"
          >
            <SearchIcon className="w-4 h-4 text-teal-400/70" />
            Rechercher…
          </NextLink>

          {siteConfig.navItems.map((item, index) => (
            <NavbarMenuItem key={`${item.label}-${index}`}>
              {item.sections ? (
                <div className="flex flex-col gap-0.5 mb-2">
                  {/* Section header */}
                  <div className="flex items-center gap-3 px-2 py-2">
                    <span className="w-[2px] h-4 bg-teal-400 rounded-full" />
                    <span className="text-xs tracking-[0.4em] uppercase text-teal-400/60 font-medium">
                      {item.label}
                    </span>
                  </div>
                  <div className="ml-5 flex flex-col gap-0.5 border-l border-teal-400/15 pl-3">
                    {item.sections.map((section) =>
                      section.items.map((subItem) => (
                        <NextLink
                          key={subItem.href}
                          href={subItem.href}
                          className="text-sm text-white/50 hover:text-teal-400 py-1.5 px-2 rounded-lg hover:bg-teal-400/5 transition-all"
                        >
                          {subItem.label}
                        </NextLink>
                      )),
                    )}
                  </div>
                </div>
              ) : (
                <NextLink
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                    ${
                      pathname === item.href
                        ? "text-teal-400 bg-teal-400/10 border border-teal-400/20"
                        : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent"
                    }
                  `}
                >
                  {pathname === item.href && (
                    <span className="w-[2px] h-4 bg-teal-400 rounded-full" />
                  )}
                  {item.label}
                </NextLink>
              )}
            </NavbarMenuItem>
          ))}

          {/* Auth buttons mobile */}
          <div className="mt-4 flex flex-col gap-2 border-t border-white/[0.07] pt-4">
            {!profile?.user_id ? (
              <>
                <Button
                  as={NextLink}
                  href={siteConfig.links.connexion}
                  startContent={<IoLogIn className="w-4 h-4" />}
                  className="w-full text-sm font-medium text-white/70 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-all rounded-xl h-11"
                  variant="flat"
                >
                  Connexion
                </Button>
                <Button
                  as={NextLink}
                  href={siteConfig.links.inscription}
                  startContent={<GiArchiveRegister className="w-4 h-4" />}
                  className="w-full text-sm font-semibold text-black bg-teal-500 hover:bg-teal-400 transition-all rounded-xl h-11 shadow-md shadow-teal-500/20"
                  variant="flat"
                >
                  Inscription
                </Button>
              </>
            ) : (
              <div className="px-1">
                <UserDropdown />
              </div>
            )}
          </div>
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
