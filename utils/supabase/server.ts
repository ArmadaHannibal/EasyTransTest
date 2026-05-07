import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = "https://cenndlcqorzxgafcpevn.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlbm5kbGNxb3J6eGdhZmNwZXZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwMzQ1NTIsImV4cCI6MjA3MzYxMDU1Mn0.5_xoA1xjwtcP4EP0akJcb3xXK8nlwWiv1Lws76ndZ_g";

export async function createClient() {
  const cookieStore = await cookies(); // ✔ maintenant autorisé

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Ignore en mode Server Action
        }
      },
    },
  });
}
