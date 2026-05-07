"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { createClient } from "@/utils/supabase/client";

// ── Types ──────────────────────────────────────────────────────────────────────
interface UserProfileContextValue {
  profile: any | null;
  loading: boolean;
  setProfile: React.Dispatch<React.SetStateAction<any | null>>;
  refetch: () => Promise<void>;
}

// ── Context ───────────────────────────────────────────────────────────────────
const UserProfileContext = createContext<UserProfileContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────
export function UserProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = useMemo(() => createClient(), []);

  const fetchProfile = useCallback(
    async (userId: string) => {
      if (!userId) return;
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("user_id", userId)
          .maybeSingle();
        if (error) throw error;
        setProfile(data);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("Erreur fetchProfile:", err);
        }
      } finally {
        setLoading(false);
      }
    },
    [supabase],
  );

  // Expose refetch pour forcer un rechargement depuis n'importe quel composant
  const refetch = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) await fetchProfile(user.id);
  }, [supabase, fetchProfile]);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) await fetchProfile(user.id);
      else setLoading(false);
    };
    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) await fetchProfile(session.user.id);
      else if (event === "SIGNED_OUT") {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, fetchProfile]);

  return (
    <UserProfileContext.Provider
      value={{ profile, loading, setProfile, refetch }}
    >
      {children}
    </UserProfileContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useUserProfile() {
  const ctx = useContext(UserProfileContext);

  // Fallback : si utilisé hors Provider (ex: tests), comportement identique à l'ancien hook
  if (!ctx) {
    throw new Error("useUserProfile must be used within a UserProfileProvider");
  }

  return ctx;
}
