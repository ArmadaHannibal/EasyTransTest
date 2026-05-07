"use client";

import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Button,
  Col,
  DatePicker,
  //   Drawer,
  Form,
  Input,
  Row,
  Select,
  Space,
} from "antd";
import { Link } from "@heroui/link";
import type { TimePickerProps } from "antd";
import { TimePicker } from "antd";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { updateBus, deleteBus } from "@/hooks/busService";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from "@heroui/drawer";
import { useDisclosure } from "@heroui/modal";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { createTicket } from "@/services/ticketService";
import dayjs, { Dayjs } from "dayjs";
import { Button as Buttonheroui } from "@heroui/button";
import { Tooltip as Tooltipheroui } from "@heroui/tooltip";
import { fetchTicketCountByBus, fetchTicketsByBus } from "@/hooks/busService";
import { IoTicketSharp } from "react-icons/io5";
import { FaBus } from "react-icons/fa";
import { Steps, Tooltip, InputNumber, InputNumberProps } from "antd";
import { Chip } from "@heroui/chip";
import { BsFillCalendar2DateFill } from "react-icons/bs";
import { IoPricetags } from "react-icons/io5";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import utc from "dayjs/plugin/utc";
import { MdAccessTime } from "react-icons/md";
import { GiTimeTrap } from "react-icons/gi";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import BusImageUploader from "@/components/componentspages/BusImageUploader";
import { Image as Imageheroui } from "@heroui/image";

type Bus = {
  bus_id: number;
  bus_name: string;
  bus_capacity: number;
  bus_type: string;
  bus_license_plate: string;
  bus_description?: string;
  bus_image_url?: string;
  created_at: string;
};

const { Option } = Select;

interface FormState {
  ticket_price: number;
  departure_date: Dayjs | null;
  departure_location: string;
  destination: string;
  quantity: number;
  date_arrived: Dayjs | null;
  heure_depart?: string;
  heure_arrivee?: string;
  bus_id: number;
}

export default function BusTable({
  buses,
  mutate,
  userId,
}: {
  buses: Bus[];
  mutate: () => void;
  userId: string;
}) {
  const supabase = createClient();
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);

  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const [form, setForm] = useState<FormState>({
    ticket_price: 0,
    departure_date: null, // valeur par défaut
    departure_location: "",
    destination: "",
    quantity: 1,
    date_arrived: null,
    heure_depart: undefined,
    heure_arrivee: undefined,
    bus_id: 0,
  });

  const [editForm, setEditForm] = useState({
    bus_name: "",
    bus_capacity: 0,
    bus_type: "",
    bus_license_plate: "",
    bus_description: "",
  });
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [openAddTicketBusId, setOpenAddTicketBusId] = useState<number | null>(
    null,
  );
  const [openEditTicketBusId, setOpenEditTicketBusId] = useState<number | null>(
    null,
  );
  const [openShowDetailBusId, setOpenShowDetailBusId] = useState<number | null>(
    null,
  );
  const [openTicketsBusId, setOpenTicketsBusId] = useState<number | null>(null);
  const [ticketCounts, setTicketCounts] = useState<Record<number, number>>({});

  dayjs.extend(utc);

  async function handleSubmit(e: React.FormEvent) {
    // e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    // console.log("Submitting form with data:", form);
    // return;
    try {
      await createTicket({
        bus_id: selectedBus?.bus_id ?? 0,
        ticket_price: form.ticket_price,
        departure_date: form.departure_date?.toISOString() || "",
        departure_location: form.departure_location,
        destination: form.destination,
        buyer_id: userId,
        // valeurs par défaut pour RLS
        ticket_status: "sold",
        payment_status: "pending",
        quantity: form.quantity,
        date_arrive: form.date_arrived?.toISOString() || "",
        heure_depart: form.heure_depart || undefined,
        heure_arrive: form.heure_arrivee || undefined,
      });
      setSuccess(true);
      setForm({
        ticket_price: 0,
        departure_date: null,
        departure_location: "",
        destination: "",
        quantity: 1,
        date_arrived: null,
        heure_depart: undefined,
        heure_arrivee: undefined,
        bus_id: 0,
      });
    } catch (err: any) {
      setError(err.message || "Erreur lors de la création du ticket");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateBus(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedBus) return;

    setLoading(true);
    setError(null);
    try {
      let newImageUrl = selectedBus?.bus_image_url;

      if (file) {
        const safeFileName = file.name
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-zA-Z0-9.\-_]/g, "_");
        const uniqueFileName = `${Date.now()}_${safeFileName}`;
        // upload le nouveau fichier vers Supabase Storage
        const { data, error } = await supabase.storage
          .from("buses")
          .upload(uniqueFileName, file, { upsert: true });
        if (error) throw error;

        newImageUrl = data.path
          ? `https://cenndlcqorzxgafcpevn.supabase.co/storage/v1/object/public/buses/${data.path}`
          : newImageUrl;
      }

      await updateBus(selectedBus!.bus_id, {
        ...editForm,
        bus_image_url: newImageUrl,
      });
      setSuccess(true);
      if (typeof mutate === "function") {
        await mutate(); // attends la mutation avant de fermer
      }
      // Ferme le Drawer et rafraîchit les données si besoin
      setTimeout(() => {
        setOpenEditTicketBusId(null);
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Erreur lors de la mise à jour du bus");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteBus(bus_id: number) {
    if (!confirm("Voulez-vous vraiment supprimer ce bus ?")) return;

    try {
      await deleteBus(bus_id);
      if (typeof mutate === "function") {
        await mutate(); // attends la mutation avant de fermer
      }
    } catch (err) {
      console.error("Erreur suppression :", err);
    }
  }

  useEffect(() => {
    async function loadTicketCounts() {
      const counts: Record<number, number> = {};
      for (const bus of buses) {
        const count = await fetchTicketCountByBus(bus.bus_id);
        counts[bus.bus_id] = count;
      }
      setTicketCounts(counts);
    }
    if (buses.length > 0) loadTicketCounts();
  }, [buses]);

  const [tickets, setTickets] = useState<any[]>([]);
  useEffect(() => {
    async function loadTickets() {
      if (openTicketsBusId) {
        const data = await fetchTicketsByBus(openTicketsBusId);
        setTickets(data);
      }
    }
    loadTickets();
  }, [openTicketsBusId]);

  if (!buses || buses.length === 0) {
    return (
      <Card className="p-6 text-center text-gray-500">Aucun bus trouvé 🚍</Card>
    );
  }

  return (
    <Card className="overflow-hidden shadow-lg rounded-xl">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Capacité</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Immatriculation</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Ticket</TableHead>
            <TableHead>Créé le</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {buses.map((bus) => (
            <TableRow key={bus.bus_id}>
              <TableCell>
                {bus.bus_image_url ? (
                  <Image
                    src={bus.bus_image_url}
                    alt={bus.bus_name}
                    width={60}
                    height={40}
                    className="rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-14 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-xs">
                    Pas d&apos;image
                  </div>
                )}
              </TableCell>
              <TableCell className="font-medium">{bus.bus_name}</TableCell>
              <TableCell>
                <Badge variant="outline">{bus.bus_capacity} places</Badge>
              </TableCell>
              <TableCell>{bus.bus_type}</TableCell>
              <TableCell>{bus.bus_license_plate}</TableCell>
              <TableCell className="max-w-[200px] truncate">
                {bus.bus_description || "-"}
              </TableCell>
              <TableCell>
                🎟️ {ticketCounts[bus.bus_id] ?? "Chargement..."} tickets
              </TableCell>
              <TableCell>
                {new Date(bus.created_at).toLocaleDateString("fr-FR")}
              </TableCell>
              <TableCell className="text-right">
                {/* <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedBus(bus)}
                >
                  <MoreHorizontal className="w-5 h-5" />
                </Button> */}
                <DropdownMenu>
                  <DropdownMenuTrigger className="cursor-pointer">
                    <MoreHorizontal className="w-5 h-5" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-glace text-white">
                    <DropdownMenuLabel>Option</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer pointer-glace"
                      onClick={() => {
                        setSelectedBus(bus);
                        setOpenShowDetailBusId(bus.bus_id);
                      }}
                    >
                      Détails du bus
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer pointer-glace"
                      onClick={() => setOpenTicketsBusId(bus.bus_id)}
                    >
                      Voir les tickets
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer pointer-glace"
                      onClick={() => {
                        setSelectedBus(bus);
                        setOpenAddTicketBusId(bus.bus_id);
                      }}
                    >
                      Ajouter un ticket
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer pointer-glace"
                      onClick={() => {
                        setSelectedBus(bus);
                        setEditForm({
                          bus_name: bus.bus_name,
                          bus_capacity: bus.bus_capacity,
                          bus_type: bus.bus_type,
                          bus_license_plate: bus.bus_license_plate,
                          bus_description: bus.bus_description || "",
                        });
                        setOpenEditTicketBusId(bus.bus_id);
                      }}
                    >
                      Modifier le bus
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer bg-red-600 font-semibold pointer-glace"
                      onClick={() => handleDeleteBus(bus.bus_id)}
                    >
                      Supprimer le bus
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Drawer
        hideCloseButton
        backdrop="blur"
        classNames={{
          base: "sm:data-[placement=right]:m-2 sm:data-[placement=left]:m-2  rounded-medium",
        }}
        isOpen={openAddTicketBusId !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) setOpenAddTicketBusId(null);
        }}
      >
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="absolute top-0 inset-x-0 z-50 flex flex-row gap-2 px-2 py-2 border-b border-default-200/50 justify-between bg-content1/50 backdrop-saturate-150 backdrop-blur-lg">
                <Tooltipheroui content="Close">
                  <Buttonheroui
                    isIconOnly
                    className="text-default-400"
                    size="sm"
                    variant="light"
                    onPress={onClose}
                  >
                    <svg
                      fill="none"
                      height={20}
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width={20}
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="m13 17 5-5-5-5M6 17l5-5-5-5" />
                    </svg>
                  </Buttonheroui>
                </Tooltipheroui>
                <div className="w-full flex justify-start gap-2">
                  {/* <Buttonheroui
                    className="font-medium text-small text-default-500"
                    size="sm"
                    startContent={
                      <svg
                        height="16"
                        viewBox="0 0 16 16"
                        width="16"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3.85.75c-.908 0-1.702.328-2.265.933-.558.599-.835 1.41-.835 2.29V7.88c0 .801.23 1.548.697 2.129.472.587 1.15.96 1.951 1.06a.75.75 0 1 0 .185-1.489c-.435-.054-.752-.243-.967-.51-.219-.273-.366-.673-.366-1.19V3.973c0-.568.176-.993.433-1.268.25-.27.632-.455 1.167-.455h4.146c.479 0 .828.146 1.071.359.246.215.43.54.497.979a.75.75 0 0 0 1.483-.23c-.115-.739-.447-1.4-.99-1.877C9.51 1 8.796.75 7.996.75zM7.9 4.828c-.908 0-1.702.326-2.265.93-.558.6-.835 1.41-.835 2.29v3.905c0 .879.275 1.69.833 2.289.563.605 1.357.931 2.267.931h4.144c.91 0 1.705-.326 2.268-.931.558-.599.833-1.41.833-2.289V8.048c0-.879-.275-1.69-.833-2.289-.563-.605-1.357-.931-2.267-.931zm-1.6 3.22c0-.568.176-.992.432-1.266.25-.27.632-.454 1.168-.454h4.145c.54 0 .92.185 1.17.453.255.274.43.698.43 1.267v3.905c0 .569-.175.993-.43 1.267-.25.268-.631.453-1.17.453H7.898c-.54 0-.92-.185-1.17-.453-.255-.274-.43-.698-.43-1.267z"
                          fill="currentColor"
                          fillRule="evenodd"
                        />
                      </svg>
                    }
                    variant="flat"
                  >
                    Copy Link
                  </Buttonheroui>
                  <Buttonheroui
                    className="font-medium text-small text-default-500"
                    endContent={
                      <svg
                        fill="none"
                        height="16"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width="16"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M7 17 17 7M7 7h10v10" />
                      </svg>
                    }
                    size="sm"
                    variant="flat"
                  >
                    Event Page
                  </Buttonheroui> */}
                  <h2>
                    {selectedBus
                      ? `Ajouter un ticket pour ${selectedBus.bus_name}`
                      : "Ajouter un ticket"}
                  </h2>
                </div>
              </DrawerHeader>
              <DrawerBody className="pt-16">
                <Form
                  layout="vertical"
                  hideRequiredMark
                  onFinish={handleSubmit}
                  initialValues={{ quantity: 1 }}
                >
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="prix"
                        label="Prix"
                        rules={[
                          {
                            required: true,
                            message: "Veuillez saisir le prix du billet",
                          },
                        ]}
                      >
                        <Input
                          placeholder="Veuillez saisir le prix du billet"
                          value={form.ticket_price || ""}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              ticket_price: Number(e.target.value),
                            })
                          }
                          suffix="XAF"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="departure_date"
                        label="Date de départ"
                        rules={[{ required: true, message: "Date de départ" }]}
                      >
                        <DatePicker
                          getPopupContainer={(triggerNode) =>
                            triggerNode.parentNode as HTMLElement
                          }
                          value={form.departure_date || undefined}
                          onChange={(date) =>
                            setForm({ ...form, departure_date: date })
                          }
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="date_arrived"
                        label="Date d'arrivée"
                        rules={[{ required: true, message: "Date d'arrivée" }]}
                      >
                        <DatePicker
                          getPopupContainer={(triggerNode) =>
                            triggerNode.parentNode as HTMLElement
                          }
                          value={form.date_arrived || undefined}
                          onChange={(date) =>
                            setForm({ ...form, date_arrived: date })
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="quantity"
                        label="Quantité"
                        rules={[
                          {
                            required: true,
                            message: "Veuillez saisir la quantité de billets",
                          },
                        ]}
                      >
                        <InputNumber
                          min={1}
                          max={10}
                          value={form.quantity}
                          onChange={(value) =>
                            setForm({ ...form, quantity: value || 1 })
                          }
                          style={{ width: "93%" }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="heure_depart"
                        label="Heure de départ"
                        rules={[
                          {
                            required: true,
                            message: "Veuillez saisir la quantité de billets",
                          },
                        ]}
                      >
                        <TimePicker
                          format="HH:mm"
                          value={
                            form.heure_depart
                              ? dayjs(form.heure_depart, "HH:mm")
                              : null
                          }
                          onChange={(time, timeString) => {
                            const heure = Array.isArray(timeString)
                              ? timeString[0]
                              : (timeString as string);
                            setForm({ ...form, heure_depart: heure });
                          }}
                          getPopupContainer={(triggerNode) =>
                            triggerNode.parentNode as HTMLElement
                          }
                          defaultOpenValue={dayjs("00:00", "HH:mm")}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="heure_arrivee"
                        label="Heure d'arrivée"
                        rules={[
                          {
                            required: true,
                            message: "Heure d'arrivée requise",
                          },
                        ]}
                      >
                        <TimePicker
                          getPopupContainer={(triggerNode) =>
                            triggerNode.parentNode as HTMLElement
                          }
                          format="HH:mm"
                          value={
                            form.heure_arrivee
                              ? dayjs(form.heure_arrivee, "HH:mm")
                              : null
                          }
                          onChange={(time, timeString) => {
                            const heure = Array.isArray(timeString)
                              ? timeString[0]
                              : (timeString as string);
                            setForm({ ...form, heure_arrivee: heure });
                          }}
                          defaultOpenValue={dayjs("00:00", "HH:mm")}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="departure_location"
                        label="Lieu de départ"
                        rules={[
                          {
                            required: true,
                            message: "Veuillez saisir le Lieu de départ",
                          },
                        ]}
                      >
                        <Input
                          placeholder="Veuillez saisir le Lieu de départ"
                          value={form.departure_location}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              departure_location: e.target.value,
                            })
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="destination"
                        label="Destination"
                        rules={[
                          {
                            required: true,
                            message: "Veuillez saisir la Destination",
                          },
                        ]}
                      >
                        <Input
                          placeholder="Veuilaz saisir la Destination"
                          value={form.destination}
                          onChange={(e) =>
                            setForm({ ...form, destination: e.target.value })
                          }
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  {success && (
                    <p className="text-green-600 text-sm">
                      ✅ Ticket créé avec succès
                    </p>
                  )}
                  <Buttonheroui
                    type="submit"
                    disabled={loading}
                    className="font-semibold"
                    style={{
                      backgroundColor: "var(--bg-legebluefort)",
                      color: "white",
                    }}
                  >
                    {loading ? "Création..." : "Créer un ticket"}
                  </Buttonheroui>
                </Form>
              </DrawerBody>
              <DrawerFooter className="flex flex-col gap-1">
                {/* <Link
                  className="text-default-400"
                  href="mailto:hello@heroui.com"
                  size="sm"
                >
                  Contact the host
                </Link>
                <Link
                  className="text-default-400"
                  href="mailto:hello@heroui.com"
                  size="sm"
                >
                  Report event
                </Link> */}
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>

      <Drawer
        hideCloseButton
        backdrop="blur"
        classNames={{
          base: "sm:data-[placement=right]:m-2 sm:data-[placement=left]:m-2  rounded-medium",
        }}
        isOpen={openEditTicketBusId !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) setOpenEditTicketBusId(null);
        }}
      >
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="absolute top-0 inset-x-0 z-50 flex flex-row gap-2 px-2 py-2 border-b border-default-200/50 justify-between bg-content1/50 backdrop-saturate-150 backdrop-blur-lg">
                <Tooltipheroui content="Close">
                  <Buttonheroui
                    isIconOnly
                    className="text-default-400"
                    size="sm"
                    variant="light"
                    onPress={onClose}
                  >
                    <svg
                      fill="none"
                      height={20}
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width={20}
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="m13 17 5-5-5-5M6 17l5-5-5-5" />
                    </svg>
                  </Buttonheroui>
                </Tooltipheroui>
                <div className="w-full flex justify-start gap-2">
                  <h2>
                    {selectedBus
                      ? `Modifier ${selectedBus.bus_name}`
                      : "Modifier le bus"}
                  </h2>
                </div>
              </DrawerHeader>
              <DrawerBody className="pt-16">
                <form
                  onSubmit={handleUpdateBus}
                  className="space-y-4 p-4 border rounded-md"
                >
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="nomdubus">Nom du bus</Label>
                      <Input
                        id="nomdubus"
                        value={editForm.bus_name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, bus_name: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="Capacite">Capacité</Label>
                      <Input
                        id="Capacite"
                        type="number"
                        value={editForm.bus_capacity}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            bus_capacity: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>Type</Label>
                      <Input
                        value={editForm.bus_type}
                        onChange={(e) =>
                          setEditForm({ ...editForm, bus_type: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>Immatriculation</Label>
                      <Input
                        value={editForm.bus_license_plate}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            bus_license_plate: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={editForm.bus_description}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          bus_description: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <BusImageUploader
                      onFileChange={setFile}
                      initialImageUrl={selectedBus?.bus_image_url || undefined}
                    />
                  </div>

                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  {success && (
                    <p className="text-green-600 text-sm">
                      ✅ Bus mis à jour avec succès
                    </p>
                  )}

                  <Buttonheroui
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                  >
                    {loading ? "Mise à jour..." : "Mettre à jour le bus"}
                  </Buttonheroui>
                </form>
              </DrawerBody>
              <DrawerFooter className="flex flex-col gap-1">
                {/* <Link
                  className="text-default-400"
                  href="mailto:hello@heroui.com"
                  size="sm"
                >
                  Contact the host
                </Link>
                <Link
                  className="text-default-400"
                  href="mailto:hello@heroui.com"
                  size="sm"
                >
                  Report event
                </Link> */}
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>

      <Drawer
        hideCloseButton
        backdrop="blur"
        classNames={{
          base: "sm:data-[placement=right]:m-2 sm:data-[placement=left]:m-2  rounded-medium",
        }}
        isOpen={openShowDetailBusId !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) setOpenShowDetailBusId(null);
        }}
      >
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="absolute top-0 inset-x-0 z-50 flex flex-row gap-2 px-2 py-2 border-b border-default-200/50 justify-between bg-content1/50 backdrop-saturate-150 backdrop-blur-lg">
                <Tooltipheroui content="Close">
                  <Buttonheroui
                    isIconOnly
                    className="text-default-400"
                    size="sm"
                    variant="light"
                    onPress={onClose}
                  >
                    <svg
                      fill="none"
                      height={20}
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width={20}
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="m13 17 5-5-5-5M6 17l5-5-5-5" />
                    </svg>
                  </Buttonheroui>
                </Tooltipheroui>
                <div className="w-full flex justify-start gap-2">
                  <h2>
                    {selectedBus
                      ? `Modifier ${selectedBus.bus_name}`
                      : "Modifier le bus"}
                  </h2>
                </div>
              </DrawerHeader>
              <DrawerBody className="pt-16">
                <div className="space-y-4 p-4 border rounded-md">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="grid grid-cols-1 gap-2">
                      <Label htmlFor="nomdubus">Nom du bus</Label>
                      <Chip color="default" variant="faded">
                        {selectedBus?.bus_name}
                      </Chip>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      <Label htmlFor="Capacite">Capacité</Label>
                      <Chip color="default" variant="faded">
                        {selectedBus?.bus_capacity} places
                      </Chip>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="grid grid-cols-1 gap-2">
                      <Label>Type</Label>
                      <Chip color="default" variant="faded">
                        {selectedBus?.bus_type}
                      </Chip>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      <Label>Immatriculation</Label>
                      <Chip color="default" variant="faded">
                        {selectedBus?.bus_license_plate}
                      </Chip>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    <Label>Description</Label>
                    <Chip color="default" variant="faded">
                      {selectedBus?.bus_description || "-"}
                    </Chip>
                  </div>

                  <div>
                    <Imageheroui
                      isBlurred
                      alt="HeroUI Album Cover"
                      className="m-5 object-cover"
                      src={selectedBus?.bus_image_url || ""}
                      width={320}
                      height={260}
                    />
                  </div>
                </div>
              </DrawerBody>
              <DrawerFooter className="flex flex-col gap-1"></DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>

      <Drawer
        hideCloseButton
        backdrop="blur"
        isOpen={openTicketsBusId !== null}
        onOpenChange={() => setOpenTicketsBusId(null)}
      >
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader>
                <Tooltipheroui content="Close">
                  <Buttonheroui
                    isIconOnly
                    className="text-default-400"
                    size="sm"
                    variant="light"
                    onPress={onClose}
                  >
                    <svg
                      fill="none"
                      height={20}
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width={20}
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="m13 17 5-5-5-5M6 17l5-5-5-5" />
                    </svg>
                  </Buttonheroui>
                </Tooltipheroui>
                <div className="w-full flex justify-start gap-2">
                  <h2>
                    Tickets de{" "}
                    {buses.find((b) => b.bus_id === openTicketsBusId)?.bus_name}
                  </h2>
                </div>
              </DrawerHeader>
              <DrawerBody>
                {tickets.length === 0 ? (
                  <p className="text-gray-500 text-sm">
                    Aucun ticket trouvé 🎟️
                  </p>
                ) : (
                  <ScrollShadow className="w-[auto] h-[100%]">
                    <div className="space-y-3">
                      {tickets.map((ticket) => {
                        const depart = dayjs(ticket.heure_depart, "HH:mm");
                        let arrivee = dayjs(ticket.heure_arrive, "HH:mm");

                        console.log(depart, arrivee);

                        if (arrivee.isBefore(depart)) {
                          arrivee = arrivee.add(1, "day");
                        }

                        const diffMinutes = arrivee.diff(depart);
                        let duree = "0h 0min";

                        if (!isNaN(diffMinutes)) {
                          const diffMinutes = arrivee.diff(depart, "minute");
                          const hours = Math.floor(diffMinutes / 60);
                          const minutes = diffMinutes % 60;

                          duree = `${hours}h ${minutes}min`;
                        }

                        return (
                          <div
                            key={ticket.ticket_id}
                            className="relative overflow-hidden p-3 border border-gray-200 text-white rounded-lg shadow-sm"
                            style={{
                              backgroundColor: "var(--bg-legebluecalme)",
                            }}
                          >
                            <div className="flex flex-row gap-14">
                              <div>
                                <div
                                  className="absolute top-0 left-0 rounded-br-full w-12 h-12 border-2 border-r-white border-b-white flex items-center justify-start p-[0.6rem]"
                                  style={{
                                    backgroundColor: "var(--bg-legebluefort)",
                                  }}
                                >
                                  <IoTicketSharp className="text-white w-5 h-5" />
                                </div>
                              </div>
                              <div className="flex flex-col gap-4 w-full">
                                <div className="flex flex-row justify-between items-center">
                                  <span className="font-semibold">
                                    {ticket.departure_location}
                                  </span>
                                  <div>
                                    <Chip
                                      color="warning"
                                      variant="shadow"
                                      className="text-white"
                                    >
                                      <FaBus />
                                    </Chip>
                                  </div>
                                  <span className="font-semibold">
                                    {ticket.destination}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="mt-4">
                              <Steps
                                size="small"
                                direction="horizontal"
                                items={[
                                  {
                                    title: (
                                      <span
                                        style={{
                                          color: "#fff",
                                          fontWeight: 600,
                                        }}
                                      >
                                        {new Date(
                                          ticket.departure_date ?? new Date(),
                                        ).toLocaleDateString("fr-FR", {
                                          timeZone: "UTC",
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                        })}
                                      </span>
                                    ),
                                    status: "finish",
                                    icon: (
                                      <BsFillCalendar2DateFill
                                        className="text-white"
                                        style={{ fontSize: "1rem" }}
                                      />
                                    ),
                                  },
                                  {
                                    title: (
                                      <span
                                        style={{
                                          color: "#fff",
                                          fontWeight: 600,
                                        }}
                                      >
                                        {new Date(
                                          ticket.date_arrive &&
                                          ticket.date_arrive != null
                                            ? ticket.date_arrive
                                            : ticket.departure_date ||
                                              new Date(),
                                        ).toLocaleDateString("fr-FR", {
                                          timeZone: "UTC",
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                        })}
                                      </span>
                                    ),
                                    status: "finish",
                                    icon: (
                                      <BsFillCalendar2DateFill
                                        className="text-white"
                                        style={{ fontSize: "1rem" }}
                                      />
                                    ),
                                  },
                                ]}
                              />
                              <Steps
                                size="small"
                                direction="horizontal"
                                items={[
                                  {
                                    title: (
                                      <span
                                        style={{
                                          color: "#fff",
                                          fontWeight: 600,
                                        }}
                                      >
                                        {ticket.quantity + " Billets"}
                                      </span>
                                    ),
                                    status: "finish",
                                    icon: (
                                      <MdOutlineProductionQuantityLimits
                                        className="text-white"
                                        style={{ fontSize: "1rem" }}
                                      />
                                    ),
                                  },
                                  {
                                    title: (
                                      <span
                                        style={{
                                          color: "#fff",
                                          fontWeight: 600,
                                        }}
                                      >
                                        {ticket.ticket_price + " XAF"}
                                      </span>
                                    ),
                                    status: "finish",
                                    icon: (
                                      <IoPricetags
                                        className="text-white"
                                        style={{ fontSize: "1rem" }}
                                      />
                                    ),
                                  },
                                ]}
                              />
                              <Steps
                                size="small"
                                direction="horizontal"
                                items={[
                                  {
                                    title: (
                                      <span
                                        style={{
                                          color: "#fff",
                                          fontWeight: 600,
                                        }}
                                      >
                                        {depart && depart.isValid()
                                          ? depart.format("HH:mm")
                                          : "00:00"}
                                      </span>
                                    ),
                                    status: "finish",
                                    icon: (
                                      <MdAccessTime
                                        className="text-white"
                                        style={{ fontSize: "1rem" }}
                                      />
                                    ),
                                  },
                                  {
                                    title: (
                                      <span
                                        style={{
                                          color: "#fff",
                                          fontWeight: 600,
                                        }}
                                      >
                                        {duree}
                                      </span>
                                    ),
                                    status: "finish",
                                    icon: (
                                      <GiTimeTrap
                                        className="text-white"
                                        style={{ fontSize: "1rem" }}
                                      />
                                    ),
                                  },
                                  {
                                    title: (
                                      <span
                                        style={{
                                          color: "#fff",
                                          fontWeight: 600,
                                        }}
                                      >
                                        {arrivee && arrivee.isValid()
                                          ? arrivee.format("HH:mm")
                                          : "00:00"}
                                      </span>
                                    ),

                                    status: "finish",
                                    icon: (
                                      <MdAccessTime
                                        className="text-white"
                                        style={{ fontSize: "1rem" }}
                                      />
                                    ),
                                  },
                                ]}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollShadow>
                )}
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </Card>
  );
}
