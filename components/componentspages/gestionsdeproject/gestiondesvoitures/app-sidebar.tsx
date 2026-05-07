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
import { FaMoneyBillWave } from "react-icons/fa";
import { Switch } from "@heroui/switch";
import { FaCar } from "react-icons/fa";
import { CgUnavailable } from "react-icons/cg";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/image-uploader";

import { createCar } from "@/services/voitures.services";
import { uploadCarImage } from "@/lib/uploadCarImage";

import { useAgency } from "@/hooks/useAgency";

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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Note: I'm using state to show active item.
  // IRL you should use the url/router.
  const [activeItem, setActiveItem] = React.useState(data.navMain[0]);
  const [mails, setMails] = React.useState(data.mails);
  const { setOpen } = useProjectSidebar();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [size, setSize] = React.useState("4xl");

  const handleOpen = (size: string) => {
    setSize(size);
    onOpen();
  };

  const { agencyId } = useAgency();

  const [isSelected, setIsSelected] = React.useState(true);

  const [files, setFiles] = React.useState<File[]>([]);

  const [loading, setLoading] = React.useState(false);

  const [form, setForm] = React.useState({
    brand: "",
    model: "",
    year: "",
    seats: "",
    transmission: "",
    fuel_type: "",
    price_per_day: "",
    description: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!agencyId) {
      console.error("Agency ID manquant");
      return;
    }

    if (loading) return;

    try {
      setLoading(true);

      // Upload images
      let uploadedUrls: string[] = [];

      if (files.length > 0) {
        for (const file of files) {
          const url = await uploadCarImage(file);
          uploadedUrls.push(url);
        }
      }

      await createCar(
        {
          ...form,
          is_available: isSelected,
        },
        uploadedUrls,
        agencyId,
      );

      // Reset form
      setForm({
        brand: "",
        model: "",
        year: "",
        seats: "",
        transmission: "",
        fuel_type: "",
        price_per_day: "",
        description: "",
      });

      setFiles([]);
      setIsSelected(true);

      onClose(); // fermer drawer proprement
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

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
                  <div className="flex flex-col justify-center items-center h-full gap-2 bg-glace p-2 rounded-md">
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
                    <div className="flex justify-center items-center">
                      <Image
                        alt="HeroUI hero Image"
                        src="https://res.cloudinary.com/dtrpkegss/image/upload/v1767551235/t%C3%A9l%C3%A9chargement__9_-removebg-preview_vuo4zg.webp"
                        width={120}
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
                Ajouter un véhicule
              </DrawerHeader>
              <form onSubmit={handleSubmit}>
                <DrawerBody>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div>
                        <Label htmlFor="marqueduvehicule">
                          Marque du véhicule
                        </Label>
                      </div>
                      <div>
                        <Input
                          type="text"
                          id="marqueduvehicule"
                          placeholder="Veuillez entrer la marque du véhicule"
                          value={form.brand}
                          onChange={(e) =>
                            setForm({ ...form, brand: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <div>
                        <Label htmlFor="modeleduvehicule">
                          Modèle du véhicule
                        </Label>
                      </div>
                      <div>
                        <Input
                          type="text"
                          id="modeleduvehicule"
                          placeholder="Veuillez entrer le modèle du véhicule"
                          value={form.model}
                          onChange={(e) =>
                            setForm({ ...form, model: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <div>
                        <Label htmlFor="annee">Année de fabrication</Label>
                      </div>
                      <div>
                        <Input
                          type="text"
                          id="annee"
                          placeholder="Veuillez entrer l'année de fabrication Ex(2020)"
                          value={form.year}
                          onChange={(e) =>
                            setForm({ ...form, year: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <div>
                        <Label htmlFor="nombredeplaces">Nombre de places</Label>
                      </div>
                      <div>
                        <Input
                          type="text"
                          id="nombredeplaces"
                          placeholder="Veuillez entrer le nombre de places"
                          value={form.seats}
                          onChange={(e) =>
                            setForm({ ...form, seats: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <div>
                        <Label htmlFor="typedetransmission">
                          Type de transmission
                        </Label>
                      </div>
                      <div>
                        <Select
                          value={form.transmission}
                          onValueChange={(value) =>
                            setForm({ ...form, transmission: value })
                          }
                        >
                          <SelectTrigger
                            id="typedetransmission"
                            className="w-full"
                          >
                            <SelectValue placeholder="Type de transmission" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectGroup>
                              <SelectLabel>Type de transmission</SelectLabel>
                              <SelectItem
                                className="cursor-pointer"
                                value="manuelle"
                              >
                                manuelle
                              </SelectItem>
                              <SelectItem
                                className="cursor-pointer"
                                value="automatique"
                              >
                                automatique
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <div>
                        <Label htmlFor="typecarburant">Type de carburant</Label>
                      </div>
                      <div>
                        <Select
                          value={form.fuel_type}
                          onValueChange={(value) =>
                            setForm({ ...form, fuel_type: value })
                          }
                        >
                          <SelectTrigger id="typecarburant" className="w-full">
                            <SelectValue placeholder="Type de carburant" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectGroup>
                              <SelectLabel>Type de carburant</SelectLabel>
                              <SelectItem
                                className="cursor-pointer"
                                value="essence"
                              >
                                essence
                              </SelectItem>
                              <SelectItem
                                className="cursor-pointer"
                                value="diesel"
                              >
                                diesel
                              </SelectItem>
                              <SelectItem
                                className="cursor-pointer"
                                value="électrique"
                              >
                                électrique
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <div>
                        <Label htmlFor="prixparjour">Prix par jour</Label>
                      </div>
                      <div className="flex flex-row items-center w-full h-8">
                        <div className="bg-(--bg-legebluefort) text-white h-9 p-2.5 rounded-tl-md rounded-bl-md flex justify-center items-center">
                          <FaMoneyBillWave className="w-4 h-4" />
                        </div>
                        <div className="w-full">
                          <Input
                            type="number"
                            id="prixparjour"
                            placeholder=""
                            className="rounded-tl-none rounded-bl-none w-full"
                            value={form.price_per_day}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                price_per_day: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <div>
                        <Label htmlFor="disponibilite">
                          Disponibilité du véhicule
                        </Label>
                      </div>
                      {/* <div>
                        <Switch
                          isSelected={isSelected}
                          onValueChange={setIsSelected}
                          color="primary"
                          size="lg"
                          thumbIcon={({ isSelected, className }) =>
                            isSelected ? (
                              <FaCar className={className} />
                            ) : (
                              <CgUnavailable className={className} />
                            )
                          }
                        >
                          <span className="text-sm">
                            {isSelected ? "Disponible" : "Indisponible"}
                          </span>
                        </Switch>
                      </div> */}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-1 mt-2">
                    <div className="grid grid-cols-1 gap-1">
                      <div>
                        <Label htmlFor="descriptionduvehicule">
                          Description du véhicule
                        </Label>
                      </div>
                      <div>
                        <Textarea
                          placeholder="Veuillez entrer la description du véhicule"
                          id="descriptionduvehicule"
                          value={form.description}
                          onChange={(e) =>
                            setForm({ ...form, description: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-1 mt-2">
                    <div className="w-full">
                      <div className="space-y-2 mb-6">
                        <h1 className="text-2xl font-bold tracking-tight">
                          Téléverser des images du véhicule
                        </h1>
                        <p className="text-muted-foreground">
                          Ajoutez des images pour mieux représenter le véhicule.
                        </p>
                      </div>

                      <ImageUploader
                        files={files}
                        onChange={setFiles}
                        maxFiles={5}
                        maxSize={4} // in MB
                        accept="image/jpeg, image/png, image/webp"
                      />

                      {/* Optional: Display file names to show state is managed correctly */}
                      {files.length > 0 && (
                        <div className="mt-6">
                          <h2 className="text-lg font-semibold">
                            Fichiers téléchargés:
                          </h2>
                          <ul className="list-disc list-inside mt-2 text-sm text-muted-foreground">
                            {files.map((file, index) => (
                              <li key={index}>{file.name}</li>
                            ))}
                          </ul>
                        </div>
                      )}
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
    </>
  );
}
