"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/client";
import { addToast, ToastProvider } from "@heroui/toast";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // ── Validation ────────────────────────────────────────────────────────────
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canSubmit = isEmailValid && password.length >= 6 && !loading;

  // ── Connexion ─────────────────────────────────────────────────────────────
  const handleLogin = async () => {
    if (!canSubmit) return;
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (error) {
      addToast({
        title: "Erreur de connexion",
        description:
          error.message === "Invalid login credentials"
            ? "Email ou mot de passe incorrect."
            : error.message,
        color: "danger",
      });
      return;
    }

    if (data.user) {
      addToast({
        title: "Connexion réussie",
        description: "Vous allez être redirigé...",
        color: "success",
      });
      setTimeout(() => router.push("/profil"), 1500);
    }
  };

  // ── Soumettre avec la touche Entrée ───────────────────────────────────────
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <>
      <ToastProvider
        placement="top-center"
        toastOffset={60}
        toastProps={{
          radius: "lg",
          color: "primary",
          variant: "flat",
          timeout: 5000,
        }}
      />

      <section className="flex min-h-screen w-full items-center justify-center p-6 bg-[url(https://res.cloudinary.com/dtrpkegss/image/upload/v1769364661/top-view-magnifying-glass-compass_alvdtf.webp)] bg-cover bg-center bg-no-repeat">
        <div className="w-full max-w-sm">
          <Card className="bg-glacev2 border-none shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl">Connexion à EasyTrans</CardTitle>
              <CardDescription>
                Connectez-vous pour acheter vos tickets, gérer vos réservations
                et profiter d&apos;un service rapide et sécurisé.
              </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-5">
              {/* Email */}
              <div className="grid gap-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="exemple@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={loading}
                  autoComplete="email"
                  autoFocus
                />
              </div>

              {/* Mot de passe */}
              <div className="grid gap-2">
                <Label htmlFor="login-password">Mot de passe</Label>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={loading}
                    autoComplete="current-password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                    aria-label={
                      showPassword ? "Masquer" : "Afficher le mot de passe"
                    }
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Mot de passe oublié */}
              <div className="flex justify-end -mt-2">
                <button
                  type="button"
                  onClick={() => router.push("/reset-password")}
                  className="text-xs text-muted-foreground hover:underline"
                >
                  Mot de passe oublié ?
                </button>
              </div>
            </CardContent>

            <CardFooter>
              <div className="flex flex-col w-full gap-3">
                <Button
                  onClick={handleLogin}
                  disabled={!canSubmit}
                  className="w-full bg-(--bg-legebluefort)"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Connexion...
                    </span>
                  ) : (
                    "Se connecter"
                  )}
                </Button>

                <Button
                  variant="link"
                  type="button"
                  onClick={() => router.push("/register")}
                  className="cursor-pointer text-muted-foreground"
                >
                  Pas encore de compte ? S&apos;inscrire
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </section>
    </>
  );
}
