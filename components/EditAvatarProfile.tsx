"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { FaUser } from "react-icons/fa";
import { useAvatarUpload } from "@/hooks/use-avatar-upload";

interface EditAvatarProfileProps {
  userId: string;
  onChange: (url: string) => void;
  initialUrl?: string;
}

export default function EditAvatarProfile({
  userId,
  onChange,
  initialUrl,
}: EditAvatarProfileProps) {
  const { uploadAvatar, removePreview } = useAvatarUpload();
  const [preview, setPreview] = useState<string | null>(initialUrl ?? null);
  const [fileName, setFileName] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = handleFileChange;
    input.click();
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removePreview();
    setPreview(null);
    setFileName("");
    onChange("");
  };

  const handleFileChange = async (e: Event) => {
    const input = e.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    setFileName(file.name);
    setUploading(true);

    try {
      // On attend l’upload avant de montrer l’image
      const url = await uploadAvatar(file, userId);

      setPreview(url); // affiche seulement l’image finale
      onChange(url);
    } catch (error) {
      console.error("Upload failed:", error);
      setPreview(null);
      setFileName("");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative inline-flex">
        <Button
          variant="outline"
          type="button"
          className="relative w-32 h-32 overflow-hidden p-0 shadow-none cursor-pointer"
          onClick={handleButtonClick}
          aria-label={preview ? "Change image" : "Upload image"}
          disabled={uploading}
        >
          {uploading ? (
            <div className="flex items-center justify-center w-full h-full">
              <span className="text-sm text-muted-foreground animate-pulse">
                Uploading...
              </span>
            </div>
          ) : preview ? (
            <img
              src={preview}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <FaUser className="text-4xl opacity-60" />
            </div>
          )}
        </Button>

        {!uploading && preview && (
          <Button
            type="button"
            onClick={handleRemoveFile}
            size="icon"
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full border-2 border-background shadow-none"
            aria-label="Remove image"
          >
            <XIcon className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>

      {fileName && <p className="text-muted-foreground text-xs">{fileName}</p>}
    </div>
  );
}
