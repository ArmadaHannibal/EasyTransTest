"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Image } from "@heroui/image";
import { Drawer, Space } from "antd";
import type { DrawerProps } from "antd";

export default function Agencesfavoriesprofile() {
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
      <div className="bg-background flex items-center rounded-full border p-1 shadow-sm">
        <div className="flex -space-x-3">
          <Image
            className="ring-background ring-2"
            src="https://res.cloudinary.com/dtrpkegss/image/upload/v1758462816/freepik__the-style-is-candid-image-photography-with-natural__37038_eijiuc.jpg"
            width={40}
            height={40}
            radius="full"
            alt="Avatar 01"
          />
          <Image
            className="ring-background ring-2"
            src="https://res.cloudinary.com/dtrpkegss/image/upload/v1758462816/freepik__the-style-is-candid-image-photography-with-natural__37041_gf1erk.jpg"
            width={40}
            height={40}
            radius="full"
            alt="Avatar 02"
          />
          <Image
            className="ring-background ring-2"
            src="https://res.cloudinary.com/dtrpkegss/image/upload/v1758462816/freepik__the-style-is-candid-image-photography-with-natural__37040_gopiha.jpg"
            width={40}
            height={40}
            radius="full"
            alt="Avatar 03"
          />
          <Image
            className="ring-background ring-2"
            src="https://res.cloudinary.com/dtrpkegss/image/upload/v1758462816/freepik__the-style-is-candid-image-photography-with-natural__37042_jammel.jpg"
            width={40}
            height={40}
            radius="full"
            alt="Avatar 04"
          />
        </div>
        <Button
          variant="secondary"
          onClick={showLargeDrawer}
          className="text-muted-foreground flex items-center cursor-pointer z-10 bg-(--bg-legebluemoyen) text-white justify-center rounded-full px-3 text-xs"
        >
          Voir plus
        </Button>
      </div>
      <Drawer
        title="Liste de vos agences favoris"
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
