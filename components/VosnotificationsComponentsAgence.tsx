"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

export default function VosnotificationsComponentsAgence() {
  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardHeading>
          <CardTitle>Vos notifications</CardTitle>
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
            <button
              key={user.id}
              type="button"
              className="text-left rounded-md bg-glacev2 mb-2 cursor-pointer px-3 py-2 text-sm transition-colors hover:bg-accent"
              // onClick={() => handleNotificationClick(notification.id)}
            >
              <div className="relative flex items-start pe-3">
                <div className="flex-1 space-y-1">
                  <div className="text-left text-foreground/80 after:absolute after:inset-0">
                    <span className="font-medium text-foreground hover:underline">
                      {user.name}
                    </span>{" "}
                    :{" "}
                    <span className="font-medium text-foreground hover:underline">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Fuga expedita consequuntur dolor suscipit quam tempore
                      ratione, dicta ipsa harum! Aliquid, consectetur qui.
                      Molestias impedit fugiat tempora nihil ipsa, dignissimos
                      in.
                    </span>
                    .
                  </div>
                  <div className="text-xs text-muted-foreground">
                    20 Novembre 2025
                  </div>
                </div>
                <div className="absolute end-0 self-center">
                  <span className="sr-only">Unread</span>
                  <Dot />
                </div>
              </div>
            </button>
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
