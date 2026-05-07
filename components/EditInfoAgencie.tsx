"use client";

import React, { useState } from "react";
import { MinusIcon, PlusIcon, TypeIcon } from "lucide-react";
import { Button as ButtonHeroui } from "@heroui/button";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/client";

type BackdropType = "opaque" | "blur" | "transparent";

export default function EditInfoAgencie({
  agencyData,
  onUpdate,
}: {
  agencyData: any;
  onUpdate: (updated: any) => void;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const supabase = createClient();

  const [backdrop, setBackdrop] = useState<BackdropType>("opaque");
  const [form, setForm] = useState(agencyData);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  if (!agencyData) return <p>Aucune agence trouvée</p>;

  const handleOpen = (backdrop: BackdropType) => {
    setBackdrop(backdrop);
    onOpen();
  };

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      const fileExt = file.name.split(".").pop();
      const filePath = `logos/${form.id}-${Date.now()}.${fileExt}`;

      // Upload vers Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("agencies") // Assure-toi que ce bucket existe
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Récupérer lNom de l&#39;URL publique
      const { data } = supabase.storage.from("agencies").getPublicUrl(filePath);

      // Mettre à jour le form local
      setForm({ ...form, logo_url: data.publicUrl });
    } catch (err: any) {
      alert("Erreur upload logo : " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("agencies")
      .update({
        name: form.name,
        address: form.address,
        phone: form.phone,
        logo_url: form.logo_url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", form.id);

    setSaving(false);

    if (error) {
      alert("Erreur lors de la mise à jour : " + error.message);
    } else {
      onUpdate(form); // renvoie les nouvelles données au parent
      alert("Agence mise à jour ✅");
      onClose();
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <ButtonHeroui
            variant="shadow"
            color="primary"
            className="rounded-full w-56 h-12 cursor-pointer"
            aria-label="Open edit menu"
          >
            {/* <PlusIcon size={16} aria-hidden="true" /> */}
            Modifier votre profile
          </ButtonHeroui>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="pb-2 bg-glace">
          <DropdownMenuLabel>Option</DropdownMenuLabel>
          <DropdownMenuItem
            className="cursor-pointer bg-glacev2 mb-2"
            onClick={() => handleOpen("blur")}
          >
            <div
              className="bg-background flex size-8 items-center justify-center rounded-md border"
              aria-hidden="true"
            >
              <TypeIcon size={16} className="opacity-60" />
            </div>
            <div>
              <div className="text-sm font-medium">
                Modifier lNom de l&#39;agence
              </div>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer bg-glacev2">
            <div
              className="bg-background flex size-8 items-center justify-center rounded-md border"
              aria-hidden="true"
            >
              <MinusIcon size={16} className="opacity-60" />
            </div>
            <div>
              <div className="text-sm font-medium">
                Désactiver lNom de l&#39;agence
              </div>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* MODAL */}
      <Modal backdrop={backdrop} isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Modifier votre agence
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-1 gap-2">
                  <div className="mb-4">
                    <Label htmlFor="logo">Logo</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      disabled={uploading}
                    />
                    {form.logo_url && (
                      <img
                        src={form.logo_url}
                        alt="logo agence"
                        className="h-16 mt-2 rounded"
                      />
                    )}
                  </div>
                  <div>
                    <Label htmlFor="nomagence">
                      Nom de lNom de l&#39;agence
                    </Label>
                    <Input
                      id="nomagence"
                      type="text"
                      value={form.name || ""}
                      onChange={(e) => handleChange("name", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="adresse">Adresse</Label>
                    <Input
                      id="adresse"
                      type="text"
                      value={form.address || ""}
                      onChange={(e) => handleChange("address", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      type="text"
                      value={form.phone || ""}
                      onChange={(e) => handleChange("phone", e.target.value)}
                    />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <ButtonHeroui color="danger" variant="light" onPress={onClose}>
                  Annuler
                </ButtonHeroui>
                <ButtonHeroui
                  color="primary"
                  isLoading={saving}
                  onPress={handleSave}
                >
                  Enregistrer
                </ButtonHeroui>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
