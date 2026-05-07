import React, { useState, useEffect } from "react";
import { Gallery, ImageModal } from "@/components/react-tailwind-image-gallery";

const galleryData = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=1470&auto=format&fit=crop",
    alt: "Cityscape at dusk",
    title: "Cityscape at dusk",
    span: "col-span-1",
  },
  {
    id: 2,
    src: "https://ix-marketing.imgix.net/focalpoint.png?q=80&w=1470&auto=format&fit=crop",
    alt: "Portrait",
    title: "Portrait",
    span: "sm:col-span-2",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=1470&auto=format&fit=crop",
    alt: "Sunlight through a forest",
    title: "Forest Path",
    span: "col-span-1",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1364&auto=format&fit=crop",
    alt: "Portrait of a person",
    title: "Portrait",
    span: "col-span-1",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?q=80&w=1470&auto=format&fit=crop",
    alt: "Wildlife photography",
    title: "Wildlife",
    span: "sm:col-span-2",
  },
  {
    id: 6,
    src: "https://ix-marketing.imgix.net/bg-remove_after.png?q=80&w=1470&auto=format&fit=crop",
    alt: "Modern architecture",
    title: "Architecture",
    span: "col-span-1",
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1488866022504-f2584929ca5f?q=80&w=1470&auto=format&fit=crop",
    alt: "Starry night sky",
    title: "Night Sky",
    span: "col-span-1",
  },
  {
    id: 8,
    src: "https://ix-marketing.imgix.net/autocompress.png?q=80&w=1287&auto=format&fit=crop",
    alt: "Street art",
    title: "Street Art",
    span: "col-span-1",
  },
  {
    id: 9,
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1470&auto=format&fit=crop",
    alt: "Mountain Range",
    title: "Mountain Range",
    span: "sm:col-span-2",
  },
];

export default function GalerieHotels() {
  const [modalImage, setModalImage] = useState<string | null>(null);

  const openModal = (src: string) => setModalImage(src);
  const closeModal = () => setModalImage(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <Gallery data={galleryData} onImageClick={openModal} />
      <ImageModal src={modalImage} onClose={closeModal} />
    </>
  );
}
