import {
  BoltIcon,
  ChevronDownIcon,
  CopyPlusIcon,
  FilesIcon,
  Layers2Icon,
  TrashIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@heroui/link";

export default function ButtonActionDashboard() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="bg-glace cursor-pointer">
          Votre tableau de bord
          <ChevronDownIcon
            className="-me-1 opacity-60"
            size={16}
            aria-hidden="true"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white">
        <DropdownMenuLabel>Profile</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem asChild className="cursor-pointer bg-glacev2">
            <Link
              href="/dashboard/accueil"
              className="text-black text-sm gap-2"
            >
              <CopyPlusIcon
                size={16}
                className="opacity-60"
                aria-hidden="true"
              />
              Votre agence
            </Link>
          </DropdownMenuItem>
          {/* <DropdownMenuItem>
            <BoltIcon size={16} className="opacity-60" aria-hidden="true" />
            Edit
          </DropdownMenuItem> */}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Action</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer bg-glacev2">
            <Layers2Icon size={16} className="opacity-60" aria-hidden="true" />
            Créer un bus
          </DropdownMenuItem>
          {/* <DropdownMenuItem>
            <FilesIcon size={16} className="opacity-60" aria-hidden="true" />
            Clone
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive">
            <TrashIcon size={16} aria-hidden="true" />
            Delete
          </DropdownMenuItem> */}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
