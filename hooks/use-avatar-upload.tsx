import { useState } from "react";
import { useSupabase } from "@/providers/SupabaseProvider";

export function useAvatarUpload() {
  const [preview, setPreview] = useState<string | null>(null);
  const [currentFilePath, setCurrentFilePath] = useState<string | null>(null);
  const { supabase } = useSupabase();

  const uploadAvatar = async (file: File, userId: string, oldUrl?: string) => {
    try {
      // Générer un nom unique
      const fileExt = file.name.split(".").pop();
      const uniqueSuffix = Date.now();
      const fileName = `${userId}-${uniqueSuffix}.${fileExt}`;
      const filePath = `${fileName}`;

      // 1. TENTATIVE DE SUPPRESSION (Non bloquante)
      if (oldUrl && oldUrl.includes("supabase.co")) {
        const oldFileName = oldUrl?.split("/").pop()?.split("?")[0]?.trim();

        if (oldFileName && !oldFileName.includes("default")) {
          // On n'attend pas forcément la fin de la suppression avec await
          // pour éviter de bloquer si le serveur met du temps à répondre
          supabase.storage
            .from("avatars")
            .remove([oldFileName])
            .then(({ error }) => {
              if (error)
                console.warn(
                  "Note: L'ancien fichier n'a pas pu être supprimé, ce n'est pas grave.",
                );
            });
        }
      }

      // 2. UPLOAD DU NOUVEAU FICHIER
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // 3. RÉCUPÉRATION URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      const freshUrl = `${publicUrl}?t=${Date.now()}`; // éviter le cache

      setPreview(freshUrl);
      setCurrentFilePath(filePath);

      return freshUrl;
    } catch (error) {
      console.error("Avatar upload error:", error);
      throw error;
    }
  };

  const removePreview = async () => {
    if (currentFilePath) {
      await supabase.storage.from("avatars").remove([currentFilePath]);
    }
    setPreview(null);
    setCurrentFilePath(null);
  };

  return { preview, uploadAvatar, removePreview };
}
