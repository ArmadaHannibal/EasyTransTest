import "@/styles/globals.css";
import "aos/dist/aos";
import { Metadata, Viewport } from "next";
import { Link } from "@heroui/link";
import clsx from "clsx";

import { Providers } from "./providers";
import ClientLayout from "@/components/componentspages/ClientLayout";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";

import { UserProfileProvider } from "@/hooks/useUserProfile";
import { SupabaseProvider } from "@/providers/SupabaseProvider";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen text-foreground bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
          <div className="relative flex flex-col h-screen">
            <UserProfileProvider>
              <ClientLayout>
                <SupabaseProvider>{children}</SupabaseProvider>
              </ClientLayout>
            </UserProfileProvider>
          </div>
        </Providers>
      </body>
    </html>
  );
}
