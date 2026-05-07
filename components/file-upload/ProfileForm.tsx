"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSupabase } from "@/providers/SupabaseProvider";
import AvatarUpload from "@/components/file-upload/avatar-upload";
import { Button } from "@heroui/button";
import { useAvatarUpload } from "@/hooks/use-avatar-upload";

type FormValues = {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  address: string;
  profile_picture?: File | null;
};

export default function ProfileForm({ profile, setProfile, onClose }: any) {
  const { supabase, session } = useSupabase();
  const { uploadAvatar } = useAvatarUpload();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      first_name: profile?.first_name || "",
      last_name: profile?.last_name || "",
      email: profile?.email || "",
      phone_number: profile?.phone_number || "",
      address: profile?.address || "",
    },
  });

  const selectedFile = watch("profile_picture"); // On peut stocker le fichier dans le form

  const onSubmit = async (data: FormValues) => {
    if (!session?.user?.id) {
      alert("Session expirée, reconnectez-vous.");
      return;
    }

    let profile_picture = profile?.profile_picture;

    // Si un avatar est sélectionné
    if (selectedFile instanceof File) {
      // Appel à ton hook pour uploader l'avatar
      profile_picture = await uploadAvatar(
        selectedFile,
        session.user.id,
        profile?.profile_picture,
      );
    }

    const { data: updatedProfile, error } = await supabase
      .from("users")
      .update({
        ...data,
        profile_picture,
      })
      .eq("user_id", session.user.id)
      .select()
      .single();

    if (error) {
      console.error(error);
      alert("Erreur lors de la mise à jour du profil.");
      return;
    }

    setProfile(updatedProfile);
    onClose?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <AvatarUpload
        onFileChange={(file) => setValue("profile_picture", file)}
        defaultValue={profile?.profile_picture}
        urlprofile={profile?.profile_picture}
      />

      <input {...register("last_name")} placeholder="Nom" className="input" />
      <input
        {...register("first_name")}
        placeholder="Prénom"
        className="input"
      />
      <input {...register("email")} placeholder="Email" className="input" />
      <input
        {...register("phone_number")}
        placeholder="Téléphone"
        className="input"
      />
      <input {...register("address")} placeholder="Adresse" className="input" />

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Enregistrement..." : "Enregistrer"}
      </Button>
    </form>
  );
}
