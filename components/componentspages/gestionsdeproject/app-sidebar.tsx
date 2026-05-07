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
  useProjectSidebar,
} from "@/components/ui/sidebarproject";
import { Button, ButtonGroup } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Image } from "@heroui/image";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaPlus } from "react-icons/fa";
import { RiCircleFill } from "react-icons/ri";
import { Tooltip } from "@heroui/tooltip";
import { useDisclosure } from "@heroui/modal";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from "@heroui/drawer";
import useSWR from "swr";
import { Textarea } from "@/components/ui/textarea";
import BusImageUploader from "@/components/componentspages/BusImageUploader";
import { addToast, ToastProvider } from "@heroui/toast";
import { uploadBusImage, createBus, fetchBuses } from "@/hooks/busService";
import { useUserProfile } from "@/hooks/useUserProfile";

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
      title: "Accueil",
      url: "#",
      icon: Inbox,
      isActive: true,
    },
    {
      title: "Projects",
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
    },
    {
      name: "Alice Smith",
      email: "alicesmith@example.com",
      subject: "Re: Project Update",
      date: "Yesterday",
      teaser:
        "Thanks for the update. The progress looks great so far.\nLet's schedule a call to discuss the next steps.",
    },
    {
      name: "Bob Johnson",
      email: "bobjohnson@example.com",
      subject: "Weekend Plans",
      date: "2 days ago",
      teaser:
        "Hey everyone! I'm thinking of organizing a team outing this weekend.\nWould you be interested in a hiking trip or a beach day?",
    },
    {
      name: "Emily Davis",
      email: "emilydavis@example.com",
      subject: "Re: Question about Budget",
      date: "2 days ago",
      teaser:
        "I've reviewed the budget numbers you sent over.\nCan we set up a quick call to discuss some potential adjustments?",
    },
    {
      name: "Michael Wilson",
      email: "michaelwilson@example.com",
      subject: "Important Announcement",
      date: "1 week ago",
      teaser:
        "Please join us for an all-hands meeting this Friday at 3 PM.\nWe have some exciting news to share about the company's future.",
    },
    {
      name: "Sarah Brown",
      email: "sarahbrown@example.com",
      subject: "Re: Feedback on Proposal",
      date: "1 week ago",
      teaser:
        "Thank you for sending over the proposal. I've reviewed it and have some thoughts.\nCould we schedule a meeting to discuss my feedback in detail?",
    },
    {
      name: "David Lee",
      email: "davidlee@example.com",
      subject: "New Project Idea",
      date: "1 week ago",
      teaser:
        "I've been brainstorming and came up with an interesting project concept.\nDo you have time this week to discuss its potential impact and feasibility?",
    },
    {
      name: "Olivia Wilson",
      email: "oliviawilson@example.com",
      subject: "Vacation Plans",
      date: "1 week ago",
      teaser:
        "Just a heads up that I'll be taking a two-week vacation next month.\nI'll make sure all my projects are up to date before I leave.",
    },
    {
      name: "James Martin",
      email: "jamesmartin@example.com",
      subject: "Re: Conference Registration",
      date: "1 week ago",
      teaser:
        "I've completed the registration for the upcoming tech conference.\nLet me know if you need any additional information from my end.",
    },
    {
      name: "Sophia White",
      email: "sophiawhite@example.com",
      subject: "Team Dinner",
      date: "1 week ago",
      teaser:
        "To celebrate our recent project success, I'd like to organize a team dinner.\nAre you available next Friday evening? Please let me know your preferences.",
    },
  ],
};

type ToastPlacement =
  | "top-center"
  | "top-right"
  | "top-left"
  | "bottom-center"
  | "bottom-right"
  | "bottom-left";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Note: I'm using state to show active item.
  // IRL you should use the url/router.
  const [activeItem, setActiveItem] = React.useState(data.navMain[0]);
  const [mails, setMails] = React.useState(data.mails);
  const { setOpen } = useProjectSidebar();
  const [placement, setPlacement] = React.useState<ToastPlacement>("top-right");
  const { profile, setProfile } = useUserProfile();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [size, setSize] = React.useState("4xl");

  const handleOpen = (size: string) => {
    setSize(size);
    onOpen();
  };

  const { data: buses, mutate } = useSWR(
    profile?.user_id ? ["buses", profile?.user_id] : null,
    () => fetchBuses(profile?.user_id),
  );

  const [form, setForm] = React.useState({
    bus_name: "",
    bus_capacity: 0,
    bus_type: "",
    bus_license_plate: "",
    bus_description: "",
  });
  const [file, setFile] = React.useState<File | null>(null);

  const [loading, setLoading] = React.useState(false);

  async function handleSubmit() {
    if (loading) return;

    try {
      setLoading(true);

      let busImageUrl: string | undefined;

      if (file) {
        busImageUrl = await uploadBusImage(file, profile?.user_id);
      }

      await createBus({
        ...form,
        bus_capacity: Number(form.bus_capacity),
        bus_image_url: busImageUrl,
      });

      setForm({
        bus_name: "",
        bus_capacity: 0,
        bus_type: "",
        bus_license_plate: "",
        bus_description: "",
      });
      setFile(null);
      mutate();
      onClose();
    } catch (err: any) {
      addToast({
        title: "Erreur",
        description: err.message,
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="relative">
        <ToastProvider
          placement={placement}
          toastOffset={placement.includes("top") ? 60 : 0}
        />
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
                  <SidebarMenuButton
                    size="lg"
                    asChild
                    className="md:h-8 md:p-0"
                  >
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
                              () => Math.random() - 0.5,
                            );
                            setMails(
                              mail.slice(
                                0,
                                Math.max(5, Math.floor(Math.random() * 10) + 1),
                              ),
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
                <SidebarGroupContent className="grid grid-cols-2 gap-2 p-2">
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
                          onClick={() => handleOpen("4xl")}
                        >
                          <FaPlus className="w-6 h-6" />
                        </Button>
                      </div>
                    </div>
                  </Tooltip>

                  {mails.map((mail) => (
                    // <div
                    //   key={mail.email}
                    //   className="relative overflow-hidden hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex flex-col items-start gap-2 border-b py-2 p-4 text-sm leading-tight whitespace-nowrap last:border-b-0"
                    // >
                    //   <div className="relative z-10 flex w-full items-center gap-2">
                    //     <span>{mail.name}</span>{" "}
                    //     <span className="ml-auto text-xs">{mail.date}</span>
                    //   </div>
                    //   <span className="font-medium">{mail.subject}</span>
                    //   <span className="line-clamp-2 w-[260px] text-xs whitespace-break-spaces">
                    //     {mail.teaser}
                    //   </span>
                    // </div>
                    <div
                      key={mail.email}
                      className="flex flex-col gap-2 bg-glace p-2 rounded-md cursor-pointer"
                    >
                      <div className="flex flex-row justify-between items-center">
                        <div>
                          <span className="font-bold">XP-9578521235</span>
                        </div>
                        <div>
                          <Chip color="warning" variant="shadow">
                            En fonction
                          </Chip>
                        </div>
                      </div>
                      <div className="flex flex-row justify-between bg-glacev2 p-2">
                        <div className="flex flex-col justify-between">
                          <div>
                            <span className="font-bold">GP-45478</span>
                          </div>
                          <div>
                            <span>Lorem ipsum</span>
                          </div>
                        </div>
                        <div>
                          <ul>
                            <li className="flex flex-row gap-1 items-center">
                              <RiCircleFill className="w-2 h-2 text-blue-800" />
                              <span>jhgfdnnnn</span>
                            </li>
                            <li className="flex flex-row gap-1 items-center">
                              <RiCircleFill className="w-2 h-2 text-blue-800" />
                              <span>jhgfdnnnn</span>
                            </li>
                            <li className="flex flex-row gap-1 items-center">
                              <RiCircleFill className="w-2 h-2 text-blue-800" />
                              <span>jhgfdnnnn</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div>
                        <Image
                          alt="HeroUI hero Image"
                          src="https://res.cloudinary.com/dtrpkegss/image/upload/v1765385943/t%C3%A9l%C3%A9chargement__8_-removebg-preview_zqkd9q.png"
                          width={300}
                        />
                      </div>
                    </div>
                  ))}
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
        </Sidebar>
        <Drawer
          isOpen={isOpen}
          size="4xl"
          onClose={onClose}
          className="bg-cover bg-no-repeat bg-[url(https://res.cloudinary.com/dtrpkegss/image/upload/v1767734704/5655510_c5zaxz.webp)]"
        >
          <DrawerContent>
            {(onClose) => (
              <>
                <DrawerHeader className="flex flex-col gap-1">
                  Ajouter un bus
                </DrawerHeader>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                >
                  <DrawerBody>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <div>
                          <Label htmlFor="nomdubus">Nom du bus</Label>
                        </div>
                        <div>
                          <Input
                            type="text"
                            id="nomdubus"
                            placeholder="Veuillez entrer le nom du bus"
                            value={form.bus_name}
                            onChange={(e) =>
                              setForm({ ...form, bus_name: e.target.value })
                            }
                          />
                        </div>
                      </div>
                      <div>
                        <div>
                          <Label htmlFor="Capacite">Capacité</Label>
                        </div>
                        <div>
                          <Input
                            type="number"
                            id="Capacite"
                            placeholder="Veuillez entrer la capacité du bus"
                            value={
                              Number.isNaN(form.bus_capacity)
                                ? ""
                                : form.bus_capacity
                            }
                            onChange={(e) => {
                              const val = e.target.valueAsNumber;
                              setForm({
                                ...form,
                                bus_capacity: Number.isNaN(val) ? 0 : val,
                              });
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <div>
                          <Label htmlFor="Type">Type</Label>
                        </div>
                        <div>
                          <Input
                            type="text"
                            id="Type"
                            placeholder="Veuillez entrer le type de bus"
                            value={form.bus_type}
                            onChange={(e) =>
                              setForm({ ...form, bus_type: e.target.value })
                            }
                          />
                        </div>
                      </div>
                      <div>
                        <div>
                          <Label htmlFor="Immatriculation">
                            Immatriculation
                          </Label>
                        </div>
                        <div>
                          <Input
                            type="text"
                            id="Immatriculation"
                            placeholder="Veuillez entrer l'immatriculation du bus"
                            value={form.bus_license_plate}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                bus_license_plate: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-1 mt-2">
                      <div className="grid grid-cols-1 gap-1">
                        <div>
                          <Label htmlFor="Description">
                            Description du bus
                          </Label>
                        </div>
                        <div>
                          <Textarea
                            placeholder="Veuillez entrer la description du bus"
                            id="Description"
                            value={form.bus_description}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                bus_description: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-1 mt-2">
                      <div className="w-full">
                        <div className="space-y-2 mb-6">
                          <h1 className="text-2xl font-bold tracking-tight">
                            Téléverser des images du bus
                          </h1>
                          <p className="text-muted-foreground">
                            Ajoutez une imagee pour mieux représenter le bus.
                          </p>
                        </div>

                        <BusImageUploader onFileChange={setFile} />
                      </div>
                    </div>
                  </DrawerBody>
                  <DrawerFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-primary text-white px-4 py-2 rounded-md"
                    >
                      {loading ? "Envoi..." : "Action"}
                    </button>
                  </DrawerFooter>
                </form>
              </>
            )}
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
}
