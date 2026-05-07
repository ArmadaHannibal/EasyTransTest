import * as React from "react";
import Image from "next/image";
import { IconSvgProps } from "@/types";

export const LogoWhite: React.FC<IconSvgProps> = ({
  size = 100,
  width,
  alt = "LogoWhite",
  className,
  id,
  height,
  ...props
}) => (
  <Image
    src="https://res.cloudinary.com/dtrpkegss/image/upload/v1769291720/Group_rgeabt.png" // ton fichier placé dans /public/logo.svg
    alt={alt}
    width={width || size}
    height={height || size}
    className={className}
    id={id}
    {...props}
  />
);
