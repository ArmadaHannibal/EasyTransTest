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

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone_number: "",
    address: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // ── Validation ────────────────────────────────────────────────────────────
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const canSubmit =
    form.first_name.trim().length > 0 &&
    form.last_name.trim().length > 0 &&
    isEmailValid &&
    form.password.length >= 6 &&
    !loading;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ── Inscription ───────────────────────────────────────────────────────────
  const handleRegister = async () => {
    if (!canSubmit) return;
    setLoading(true);

    const supabase = createClient();

    // 1. Créer le compte Supabase Auth
    const { data, error: authError } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.password,
    });

    if (authError) {
      setLoading(false);
      addToast({
        title: "Erreur d'inscription",
        description: authError.message.includes("already registered")
          ? "Cet email est déjà utilisé."
          : authError.message.includes("Password")
            ? "Le mot de passe doit comporter au moins 6 caractères."
            : authError.message,
        color: "danger",
      });
      return;
    }

    const user = data.user;

    if (user) {
      // 2. Insérer le profil dans la table users
      const { error: dbError } = await supabase.from("users").insert([
        {
          user_id: user.id,
          first_name: form.first_name.trim(),
          last_name: form.last_name.trim(),
          email: form.email.trim(),
          phone_number: form.phone_number.trim() || null,
          address: form.address.trim() || null,
          role: "buyer",
        },
      ]);

      setLoading(false);

      if (dbError) {
        addToast({
          title: "Erreur",
          description:
            dbError.code === "23505"
              ? "Cet email est déjà enregistré."
              : dbError.message,
          color: "danger",
        });
        return;
      }

      addToast({
        title: "Inscription réussie !",
        description:
          "Vérifiez votre boîte mail pour confirmer votre compte avant de vous connecter.",
        color: "success",
      });
      setTimeout(() => router.push("/login"), 2000);
    }
  };

  // ── Soumettre avec Entrée ─────────────────────────────────────────────────
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleRegister();
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
          timeout: 7000,
        }}
      />

      <section className="flex min-h-screen w-full items-center justify-center p-6 bg-[url(https://res.cloudinary.com/dtrpkegss/image/upload/v1769364661/travel-concept-with-map-background_1_wzhlx0.webp)] bg-cover bg-center bg-no-repeat pt-20">
        <div className="w-full max-w-sm">
          <Card className="bg-glacev2 border-none shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl">Inscription EasyTrans</CardTitle>
              <CardDescription>
                Inscrivez-vous gratuitement pour acheter vos tickets de bus,
                comparer les prix et gérer vos réservations.
              </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-4">
              {/* Prénom + Nom */}
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="first_name">Prénom *</Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    type="text"
                    placeholder="Jean"
                    value={form.first_name}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    disabled={loading}
                    autoFocus
                    autoComplete="given-name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="last_name">Nom *</Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    type="text"
                    placeholder="Dupont"
                    value={form.last_name}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    disabled={loading}
                    autoComplete="family-name"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="grid gap-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="exemple@gmail.com"
                  value={form.email}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  disabled={loading}
                  autoComplete="email"
                />
              </div>

              {/* Mot de passe */}
              <div className="grid gap-2">
                <Label htmlFor="password">
                  Mot de passe *{" "}
                  <span className="text-xs font-normal text-muted-foreground">
                    (min. 6 caractères)
                  </span>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    value={form.password}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    disabled={loading}
                    autoComplete="new-password"
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

              {/* Téléphone */}
              <div className="grid gap-2">
                <Label htmlFor="phone_number">
                  Téléphone{" "}
                  <span className="text-xs font-normal text-muted-foreground">
                    (optionnel)
                  </span>
                </Label>
                <Input
                  id="phone_number"
                  name="phone_number"
                  type="tel"
                  placeholder="+242 06 000 0000"
                  value={form.phone_number}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  disabled={loading}
                  autoComplete="tel"
                />
              </div>
            </CardContent>

            <CardFooter>
              <div className="flex flex-col w-full gap-3">
                <Button
                  onClick={handleRegister}
                  disabled={!canSubmit}
                  className="w-full bg-(--bg-legebluefort)"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Inscription...
                    </span>
                  ) : (
                    "S'inscrire"
                  )}
                </Button>

                <Button
                  variant="link"
                  type="button"
                  onClick={() => router.push("/login")}
                  className="cursor-pointer text-muted-foreground"
                >
                  Déjà un compte ? Se connecter
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </section>
    </>
  );
}
