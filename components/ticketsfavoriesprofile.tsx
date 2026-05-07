"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Image } from "@heroui/image";
import { Drawer, Space } from "antd";
import type { DrawerProps } from "antd";

export default function Ticketsfavoriesprofile() {
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState<DrawerProps["size"]>();

  const showLargeDrawer = () => {
    setSize("large");
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div className="flex -space-x-3">
        <Image
          className="ring-background rounded-full ring-2"
          src="https://res.cloudinary.com/dtrpkegss/image/upload/v1758095578/vecteezy_close-up-photo-of-school-bus-on-the-road-generative-ai_30710246_c15xem.jpg"
          width={40}
          height={40}
          radius="full"
          alt="Avatar 01"
        />
        <Image
          className="ring-background rounded-full ring-2"
          src="https://res.cloudinary.com/dtrpkegss/image/upload/v1758095578/vecteezy_close-up-photo-of-school-bus-on-the-road-generative-ai_30710246_c15xem.jpg"
          width={40}
          height={40}
          radius="full"
          alt="Avatar 02"
        />
        <Image
          className="ring-background rounded-full ring-2"
          src="https://res.cloudinary.com/dtrpkegss/image/upload/v1758095578/vecteezy_close-up-photo-of-school-bus-on-the-road-generative-ai_30710246_c15xem.jpg"
          width={40}
          height={40}
          radius="full"
          alt="Avatar 03"
        />
        <Image
          className="ring-background rounded-full ring-2"
          src="https://res.cloudinary.com/dtrpkegss/image/upload/v1758095578/vecteezy_close-up-photo-of-school-bus-on-the-road-generative-ai_30710246_c15xem.jpg"
          width={40}
          height={40}
          radius="full"
          alt="Avatar 04"
        />
        <Button
          variant="secondary"
          className="bg-(--bg-legebluemoyen) text-white z-10 cursor-pointer ring-background hover:text-foreground flex size-10 items-center justify-center rounded-full text-xs ring-2"
          size="icon"
          style={{ width: "4rem" }}
          onClick={showLargeDrawer}
        >
          Voir plus
        </Button>
      </div>
      <Drawer
        title="Liste de vos tickets favoris"
        placement="right"
        size={size}
        onClose={onClose}
        open={open}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={onClose}>OK</Button>
          </Space>
        }
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Drawer>
    </>
  );
}
