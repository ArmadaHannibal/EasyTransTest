"use client";

import * as React from "react";
import { ArchiveX, Command, File, Inbox, Send, Trash2 } from "lucide-react";

import { NavUser } from "@/components/nav-user";
import { Label } from "@/components/ui/label";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Tooltip } from "@heroui/tooltip";
import { Button, ButtonGroup } from "@heroui/button";
import { FaPlus } from "react-icons/fa";
import { image } from "@heroui/theme";
import { Chip } from "@heroui/chip";
import { FaStar } from "react-icons/fa6";

// import { Switch } from "@/components/ui/switch"

// This is sample data
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Acceuil",
      url: "#",
      icon: Inbox,
      isActive: true,
    },
    {
      title: "Drafts",
      url: "#",
      icon: File,
      isActive: false,
    },
    {
      title: "Sent",
      url: "#",
      icon: Send,
      isActive: false,
    },
    {
      title: "Junk",
      url: "#",
      icon: ArchiveX,
      isActive: false,
    },
    {
      title: "Trash",
      url: "#",
      icon: Trash2,
      isActive: false,
    },
  ],
  mails: [
    {
      name: "William Smith",
      email: "williamsmith@example.com",
      subject: "Meeting Tomorrow",
      date: "09:34 AM",
      teaser:
        "Hi team, just a reminder about our meeting tomorrow at 10 AM.\nPlease come prepared with your project updates.",
      image:
        "https://res.cloudinary.com/dtrpkegss/image/upload/v1766792644/piscine-et-plage-de-l-hotel-de-luxe-complexe-de-divertissement-de-type-amara-dolce-vita-hotel-de-luxe-recours-tekirova-kemer-dinde_dlsveq.jpg",
    },
    {
      name: "Alice Smith",
      email: "alicesmith@example.com",
      subject: "Re: Project Update",
      date: "Yesterday",
      teaser:
        "Thanks for the update. The progress looks great so far.\nLet's schedule a call to discuss the next steps.",
      image:
        "https://res.cloudinary.com/dtrpkegss/image/upload/v1766792644/vue-complete-d-un-batiment-blanc-moderne-avec-des-colonnes-et-des-gravures-sur-eux-avec-des-fenetres-et-des-lumieres_tvxjck.jpg",
    },
    {
      name: "Bob Johnson",
      email: "bobjohnson@example.com",
      subject: "Weekend Plans",
      date: "2 days ago",
      teaser:
        "Hey everyone! I'm thinking of organizing a team outing this weekend.\nWould you be interested in a hiking trip or a beach day?",
      image:
        "https://res.cloudinary.com/dtrpkegss/image/upload/v1766792645/la-station-balneaire-populaire-amara-dolce-vita-luxury-hotel-avec-piscines-et-parcs-aquatiques-et-zone-de-loisirs-le-long-de-la-cote-de-la-mer-en-turquie-au-coucher-du-soleil-tekirova-kemer_tdhnec.jpg",
    },
    {
      name: "Emily Davis",
      email: "emilydavis@example.com",
      subject: "Re: Question about Budget",
      date: "2 days ago",
      teaser:
        "I've reviewed the budget numbers you sent over.\nCan we set up a quick call to discuss some potential adjustments?",

      image:
        "https://res.cloudinary.com/dtrpkegss/image/upload/v1766792642/piscine-et-plage-de-l-hotel-de-luxe-et-piscines-exterieures-et-un-spa-amara-dolce-vita-hotel-de-luxe-recours-tekirova-kemer-dinde_gu8mz7.jpg",
    },
    {
      name: "Michael Wilson",
      email: "michaelwilson@example.com",
      subject: "Important Announcement",
      date: "1 week ago",
      teaser:
        "Please join us for an all-hands meeting this Friday at 3 PM.\nWe have some exciting news to share about the company's future.",
      image:
        "https://res.cloudinary.com/dtrpkegss/image/upload/v1766793666/le-paysage-de-la-baie-de-miami_wq35ph.jpg",
    },
    {
      name: "Sarah Brown",
      email: "sarahbrown@example.com",
      subject: "Re: Feedback on Proposal",
      date: "1 week ago",
      teaser:
        "Thank you for sending over the proposal. I've reviewed it and have some thoughts.\nCould we schedule a meeting to discuss my feedback in detail?",
      image:
        "https://res.cloudinary.com/dtrpkegss/image/upload/v1766793734/vue-de-l-espace-interieur-de-l-hotel-de-luxe_c42mzg.jpg",
    },
    {
      name: "David Lee",
      email: "davidlee@example.com",
      subject: "New Project Idea",
      date: "1 week ago",
      teaser:
        "I've been brainstorming and came up with an interesting project concept.\nDo you have time this week to discuss its potential impact and feasibility?",
      image:
        "https://res.cloudinary.com/dtrpkegss/image/upload/v1766792644/piscine-et-plage-de-l-hotel-de-luxe-complexe-de-divertissement-de-type-amara-dolce-vita-hotel-de-luxe-recours-tekirova-kemer-dinde_dlsveq.jpg",
    },
    {
      name: "Olivia Wilson",
      email: "oliviawilson@example.com",
      subject: "Vacation Plans",
      date: "1 week ago",
      teaser:
        "Just a heads up that I'll be taking a two-week vacation next month.\nI'll make sure all my projects are up to date before I leave.",
      image:
        "https://res.cloudinary.com/dtrpkegss/image/upload/v1766792644/piscine-et-plage-de-l-hotel-de-luxe-complexe-de-divertissement-de-type-amara-dolce-vita-hotel-de-luxe-recours-tekirova-kemer-dinde_dlsveq.jpg",
    },
    {
      name: "James Martin",
      email: "jamesmartin@example.com",
      subject: "Re: Conference Registration",
      date: "1 week ago",
      teaser:
        "I've completed the registration for the upcoming tech conference.\nLet me know if you need any additional information from my end.",
      image:
        "https://res.cloudinary.com/dtrpkegss/image/upload/v1766792644/piscine-et-plage-de-l-hotel-de-luxe-complexe-de-divertissement-de-type-amara-dolce-vita-hotel-de-luxe-recours-tekirova-kemer-dinde_dlsveq.jpg",
    },
    {
      name: "Sophia White",
      email: "sophiawhite@example.com",
      subject: "Team Dinner",
      date: "1 week ago",
      teaser:
        "To celebrate our recent project success, I'd like to organize a team dinner.\nAre you available next Friday evening? Please let me know your preferences.",
      image:
        "https://res.cloudinary.com/dtrpkegss/image/upload/v1766792644/piscine-et-plage-de-l-hotel-de-luxe-complexe-de-divertissement-de-type-amara-dolce-vita-hotel-de-luxe-recours-tekirova-kemer-dinde_dlsveq.jpg",
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Note: I'm using state to show active item.
  // IRL you should use the url/router.
  const [activeItem, setActiveItem] = React.useState(data.navMain[0]);
  const [mails, setMails] = React.useState(data.mails);
  const { setOpen } = useSidebar();

  return (
    <>
      <Sidebar
        collapsible="icon"
        className="overflow-hidden *:data-[sidebar=sidebar]:flex-row"
        {...props}
      >
        {/* This is the first sidebar */}
        {/* We disable collapsible and adjust width to icon. */}
        {/* This will make the sidebar appear as icons. */}
        <Sidebar
          collapsible="none"
          className="bg-(--bg-legebluemoyen) w-[calc(var(--sidebar-width-icon)+1px)]! border-r"
        >
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                  <a href="#">
                    <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                      <Command className="size-4" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">Acme Inc</span>
                      <span className="truncate text-xs">Enterprise</span>
                    </div>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent className="px-1.5 md:px-0">
                <SidebarMenu>
                  {data.navMain.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        tooltip={{
                          children: item.title,
                          hidden: false,
                        }}
                        onClick={() => {
                          setActiveItem(item);
                          const mail = data.mails.sort(
                            () => Math.random() - 0.5
                          );
                          setMails(
                            mail.slice(
                              0,
                              Math.max(5, Math.floor(Math.random() * 10) + 1)
                            )
                          );
                          setOpen(true);
                        }}
                        isActive={activeItem?.title === item.title}
                        className="px-2.5 md:px-2"
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <NavUser user={data.user} />
          </SidebarFooter>
        </Sidebar>

        {/* This is the second sidebar */}
        {/* We disable collapsible and let it fill remaining space */}
        <Sidebar
          collapsible="none"
          className="bg-(--bg-legebluecalme) hidden flex-1 md:flex"
        >
          <SidebarHeader className="gap-3.5 border-b p-4">
            <div className="flex w-full items-center justify-between">
              <div className="text-foreground text-base font-medium">
                {activeItem?.title}
              </div>
              {/* <Label className="flex items-center gap-2 text-sm">
              <span>Unreads</span>
              <Switch className="shadow-none" />
            </Label> */}
            </div>
            <SidebarInput placeholder="Type to search..." />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup className="px-0">
              <SidebarGroupContent className="grid grid-cols-1 gap-2 p-2">
                <Tooltip
                  showArrow
                  classNames={{
                    base: [
                      // arrow color
                      "before:bg-white dark:before:bg-white",
                    ],
                    content: ["py-2 px-4 shadow-xl", "text-black bg-white"],
                  }}
                  content="Ajouter un nouveau bus"
                  placement="bottom"
                >
                  <div className="flex flex-col justify-center items-center h-full gap-2 bg-glace p-2 rounded-md cursor-pointer">
                    <div>
                      <Button
                        isIconOnly
                        aria-label="Take a photo"
                        radius="full"
                        className="bg-glacev2 w-14 h-14"
                        // color="warning"
                        // variant="faded"
                      >
                        <FaPlus className="w-6 h-6" />
                      </Button>
                    </div>
                  </div>
                </Tooltip>
                <div className="flex flex-col gap-4 bg-white rounded-md p-4">
                  {mails.map((mail) => (
                    <div
                      key={mail.email}
                      className="relative rounded-md bg-cover h-64 bg-no-repeat"
                      style={{
                        backgroundImage: `url(${mail.image})`,
                      }}
                    >
                      <div className="absolute top-2 left-2">
                        <div>
                          <Chip color="warning" variant="shadow" size="sm">
                            Brazzaville
                          </Chip>
                        </div>
                      </div>
                      <div
                        className="absolute flex justify-between rounded-b-md h-16 bottom-0 left-0 right-0 p-2"
                        style={{
                          background:
                            "linear-gradient(0deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.9) 50%, rgba(0, 0, 0, 0.48) 100%)",
                        }}
                      >
                        <div className="text-white">
                          <div>
                            <h3 className="text-sm font-medium">
                              Hôtel Brazzaville
                            </h3>
                          </div>
                          <div>
                            <span>2458 chambres</span>
                          </div>
                        </div>
                        <div className="flex gap-2 items-center">
                          <div>
                            <span className="text-white">3</span>
                          </div>
                          <FaStar className="text-orange-500" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </Sidebar>
    </>
  );
}
