"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { XIcon } from "lucide-react";
import { Image } from "@heroui/image";
// Assuming you have Avatar components
import { Badge } from "@/components/badge-2"; // Assuming you have a Badge component
import { Button } from "@/components/button-1";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardHeading,
  CardTitle,
  CardToolbar,
} from "@/components/card";
import { Settings } from "lucide-react";

// User data
const users = [
  {
    id: "1",
    name: "Kathryn Campbell",
    availability: "online",
    avatar: "men/66.jpg",
    status: "active",
    email: "kathryn@apple.com",
  },
  {
    id: "2",
    name: "Robert Smith",
    availability: "away",
    avatar: "women/60.jpg",
    status: "inactive",
    email: "robert@openai.com",
  },
  {
    id: "3",
    name: "Sophia Johnson",
    availability: "busy",
    avatar: "women/71.jpg",
    status: "active",
    email: "sophia@meta.com",
  },
  {
    id: "4",
    name: "Lucas Walker",
    availability: "offline",
    avatar: "men/42.jpg",
    status: "inactive",
    flag: "🇦🇺",
    email: "lucas@tesla.com",
  },
  {
    id: "5",
    name: "Emily Davis",
    availability: "online",
    avatar: "men/21.jpg",
    status: "active",
    email: "emily@sap.com",
  },
];

function Dot({ className }: { className?: string }) {
  return (
    <svg
      width="6"
      height="6"
      fill="currentColor"
      viewBox="0 0 6 6"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="3" cy="3" r="3" />
    </svg>
  );
}

export default function VosCommentComponentsAgence() {
  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardHeading>
          <CardTitle>Vos commentaire</CardTitle>
        </CardHeading>
        <CardToolbar>
          <Button mode="icon" variant="outline" size="sm">
            <Settings />
          </Button>
        </CardToolbar>
      </CardHeader>
      <CardContent className="py-1">
        {users.map((user) => {
          return (
            <div
              key={user.id}
              className="z-50 max-w-[400px] rounded-md border bg-background p-4 shadow-lg mb-2"
            >
              <div className="flex gap-3">
                <Image
                  className="size-9 rounded-full w-[9rem] h-[2rem]"
                  src="https://res.cloudinary.com/dtrpkegss/image/upload/v1763327715/composition-abstraite-de-lumiere-ultraviolette-uv_ehjjaf.jpg"
                  alt="Mary Palmer"
                />
                <div className="flex grow flex-col gap-3">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Dolore odio officia, quo aperiam voluptatem temporibus
                      asperiores sit quasi beatae dolor, ab deserunt ex corporis
                      quia quibusdam et numquam qui natus.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm">Accept</Button>
                    <Button size="sm" variant="outline">
                      Decline
                    </Button>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
                  aria-label="Close notification"
                >
                  <XIcon
                    size={16}
                    className="opacity-60 transition-opacity group-hover:opacity-100"
                    aria-hidden="true"
                  />
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
      <CardFooter className="justify-center">
        <Button mode="link" underlined="dashed">
          <Link href="#">Learn more</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
