"use client";

import { Auth0Provider } from "@auth0/auth0-react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN!}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!}
      authorizationParams={{
        redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
      }}
    >
      {children}
    </Auth0Provider>
  );
}
