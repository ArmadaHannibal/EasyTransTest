import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Link } from "@heroui/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useMemo } from "react";

const MENU_ITEMS = {
  status: [
    {
      value: "focus",
      icon: "solar:emoji-funny-circle-line-duotone",
      label: "Focus",
    },
    {
      value: "offline",
      icon: "solar:moon-sleep-line-duotone",
      label: "Appear Offline",
    },
  ],
  profile: [
    {
      icon: "solar:user-circle-line-duotone",
      link: "/profil",
      label: "Votre profil",
      action: "profile",
    },
  ],
  account: [
    {
      icon: "solar:logout-2-bold-duotone",
      label: "Se déconnecter",
      action: "logout",
    },
  ],
};

interface MenuItem {
  value?: string;
  icon: string;
  label: string;
  link?: string;
  action?: string;
  iconClass?: string;
  badge?: { text: string; className: string };
  rightIcon?: string;
}

interface UserDropdownProps {
  user?: {
    name: string;
    username: string;
    avatar: string;
    initials: string;
    status: string;
  };
  onAction?: (action: string) => void;
  onStatusChange?: (status: string) => void;
  selectedStatus?: string;
  promoDiscount?: string;
}

type Status = "online" | "offline" | "busy";

export const UserDropdown = ({
  user = {
    name: "Utilisateur",
    username: "@utilisateur",
    avatar: "https://avatars.githubusercontent.com/u/126724835?v=4",
    initials: "U",
    status: "online",
  },
  onAction = () => {},
  onStatusChange = () => {},
  selectedStatus = "online",
  promoDiscount = "20% off",
}: UserDropdownProps) => {
  const { profile, setProfile } = useUserProfile();
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  // ── Déconnexion ──────────────────────────────────────────────────────────────
  // Stratégie : on ne bloque PAS l'UI sur le réseau.
  // 1. setProfile(null) immédiatement → la navbar bascule tout de suite
  // 2. router.push("/")              → on redirige sans attendre signOut
  // 3. signOut()                     → fire-and-forget pour invalider le cookie côté serveur
  const handleLogout = () => {
    // Réinitialisation immédiate du profil local — pas d'await, pas de spinner
    setProfile(null);

    // Redirection immédiate
    router.push("/");

    // signOut en arrière-plan — on s'en fiche du résultat pour l'UX
    supabase.auth.signOut().catch((err) => {
      console.warn("[logout] signOut background error (ignoré):", err);
    });
  };

  const handleAction = (action: string) => {
    if (action === "logout") {
      handleLogout();
      return;
    }
    onAction(action);
  };

  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const getStatusColor = (status: string) => {
    const normalized = status.toLowerCase() as Status;
    const colors: Record<Status, string> = {
      online:
        "text-green-600 bg-green-100 border-green-300 dark:text-green-400 dark:bg-green-900/30 dark:border-green-500/50",
      offline:
        "text-gray-600 bg-gray-100 border-gray-300 dark:text-gray-400 dark:bg-gray-800 dark:border-gray-600",
      busy: "text-red-600 bg-red-100 border-red-300 dark:text-red-400 dark:bg-red-900/30 dark:border-red-500/50",
    };
    return colors[normalized] ?? colors.online;
  };

  const displayName =
    profile?.last_name && profile?.first_name
      ? `${profile.first_name} ${profile.last_name}`
      : user.name;

  const displayInitials =
    profile?.last_name && profile?.first_name
      ? getInitials(`${profile.first_name} ${profile.last_name}`)
      : user.initials;

  const renderMenuItem = (item: MenuItem, index: number) => {
    const isLogout = item.action === "logout";
    return (
      <DropdownMenuItem
        key={index}
        className={cn(
          "p-2 rounded-lg cursor-pointer",
          item.badge || item.rightIcon ? "justify-between" : "",
          isLogout
            ? "text-red-500 hover:!text-red-600 hover:!bg-red-50 dark:hover:!bg-red-900/20 focus:!text-red-600 focus:!bg-red-50"
            : "",
        )}
        onClick={() => handleAction(item.action || "")}
      >
        {item.link && !isLogout ? (
          <Link color="foreground" className="text-sm w-full" href={item.link}>
            <span className="flex items-center gap-1.5 font-medium">
              <Icon
                icon={item.icon}
                className={`size-5 ${item.iconClass || "text-gray-500 dark:text-gray-400"}`}
              />
              {item.label}
            </span>
          </Link>
        ) : (
          <span className="flex items-center gap-1.5 font-medium text-sm w-full">
            <Icon
              icon={item.icon}
              className={`size-5 ${isLogout ? "text-red-500" : item.iconClass || "text-gray-500 dark:text-gray-400"}`}
            />
            {item.label}
          </span>
        )}
        {item.badge && (
          <Badge className={item.badge.className}>
            {promoDiscount || item.badge.text}
          </Badge>
        )}
        {item.rightIcon && (
          <Icon
            icon={item.rightIcon}
            className="size-4 text-gray-500 dark:text-gray-400"
          />
        )}
      </DropdownMenuItem>
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer size-10 border border-white dark:border-gray-700">
          <AvatarImage
            src={profile?.profile_picture || user.avatar}
            alt={displayName}
            className="object-cover"
          />
          <AvatarFallback>{displayInitials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="no-scrollbar w-[310px] rounded-2xl bg-gray-50 dark:bg-black/90 p-0"
        align="end"
      >
        <section className="bg-white dark:bg-gray-100/10 backdrop-blur-lg rounded-2xl p-1 shadow border border-gray-200 dark:border-gray-700/20">
          <div className="flex items-center p-2">
            <div className="flex-1 flex items-center gap-2">
              <Avatar className="cursor-pointer size-10 border border-white dark:border-gray-700">
                <AvatarImage
                  src={profile?.profile_picture || user.avatar}
                  alt={displayName}
                  className="object-cover"
                />
                <AvatarFallback>{displayInitials}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                  {displayName}
                </h3>
                <p className="text-muted-foreground text-xs">
                  {profile?.email ?? user.username}
                </p>
              </div>
            </div>
            <Badge
              className={`${getStatusColor(profile?.status ?? user.status)} border-[0.5px] text-[11px] rounded-sm capitalize`}
            >
              {profile?.status ?? user.status}
            </Badge>
          </div>

          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="bg-white dark:bg-white/10 backdrop-blur-lg">
                  <DropdownMenuRadioGroup
                    value={selectedStatus}
                    onValueChange={onStatusChange}
                  >
                    {MENU_ITEMS.status.map((s, i) => (
                      <DropdownMenuRadioItem
                        className="gap-2"
                        key={i}
                        value={s.value}
                      >
                        <Icon
                          icon={s.icon}
                          className="size-5 text-gray-500 dark:text-gray-400"
                        />
                        {s.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            {MENU_ITEMS.profile.map(renderMenuItem)}
          </DropdownMenuGroup>
        </section>

        <section className="mt-1 p-1 rounded-2xl">
          <DropdownMenuGroup>
            {MENU_ITEMS.account.map(renderMenuItem)}
          </DropdownMenuGroup>
        </section>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
