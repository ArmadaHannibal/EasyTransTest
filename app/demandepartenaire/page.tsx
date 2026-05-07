"use client";
import * as React from "react";
import { useState } from "react";
import { FaBuilding } from "react-icons/fa";
import { FaUserAlt } from "react-icons/fa";
import { FaBus } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { addToast, ToastProvider } from "@heroui/toast";
import { createPartnerRequest } from "@/services/partner.service";

type ToastPlacement =
  | "top-center"
  | "top-right"
  | "top-left"
  | "bottom-center"
  | "bottom-right"
  | "bottom-left";

const STEPS = [
  { id: 1, label: "Entreprise", icon: FaBuilding },
  { id: 2, label: "Contact", icon: FaUserAlt },
  { id: 3, label: "Services", icon: FaBus },
  { id: 4, label: "Confirmation", icon: FaCheck },
];

export default function DemandepartenairePageForm() {
  const [placement] = React.useState<ToastPlacement>("top-center");
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const CONGO_CITIES = ["Brazzaville", "Pointe-Noire", "Dolisie", "Oyo"];

  const [formpartenaire, setFormpartenaire] = useState({
    company_name: "",
    company_registration_number: "",
    company_address: "",
    company_city: [] as string[],
    company_country: "",
    contact_full_name: "",
    contact_position: "",
    contact_email: "",
    contact_phone: "",
    service_type: "",
    service_zones: "",
    accept_terms: false,
    accept_marketing: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormpartenaire((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const isSubmittingRef = React.useRef(false);

  const handleSubmit = async () => {
    if (isSubmittingRef.current) return;

    isSubmittingRef.current = true;
    setError("");
    setIsSubmitting(true);
    try {
      await createPartnerRequest(formpartenaire);

      setError("");
      setIsSubmitting(false);

      addToast({
        title: "Demande envoyée",
        description: "Votre demande de partenariat a été envoyée avec succès.",
        color: "success",
      });

      router.push("/");
    } catch (err: any) {
      // Traduction des erreurs Supabase en français
      const msg: string = err?.message || "";
      let msgFr = "Une erreur est survenue. Veuillez réessayer.";

      if (msg.includes("invalid input value for enum"))
        msgFr = "Le type de service sélectionné n'est pas valide.";
      else if (msg.includes("duplicate key") || msg.includes("unique"))
        msgFr =
          "Cette adresse email est déjà associée à une demande existante.";
      else if (msg.includes("violates not-null"))
        msgFr = "Veuillez remplir tous les champs obligatoires.";
      else if (msg.includes("JWT") || msg.includes("auth"))
        msgFr = "Session expirée. Veuillez rafraîchir la page.";
      else if (msg.includes("network") || msg.includes("fetch"))
        msgFr = "Erreur réseau. Vérifiez votre connexion internet.";
      else if (msg.includes("Vous devez accepter")) msgFr = msg; // déjà en français

      setIsSubmitting(false);
      setError(msgFr);
    }
  };

  const canProceed = () => {
    if (currentStep === 1)
      return (
        formpartenaire.company_name.trim() !== "" &&
        formpartenaire.company_registration_number.trim() !== "" &&
        formpartenaire.company_country.trim() != "" &&
        formpartenaire.company_address.trim() != "" &&
        formpartenaire.company_city.length > 0
      );
    if (currentStep === 2)
      return (
        formpartenaire.contact_full_name.trim() !== "" &&
        formpartenaire.contact_email.trim() !== ""
      );
    if (currentStep === 3) return formpartenaire.service_type !== "";
    return formpartenaire.accept_terms;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .partner-form-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: #04000f;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          position: relative;
          overflow: hidden;
        }

        .partner-form-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background:
            radial-gradient(ellipse 60% 50% at 20% 20%, rgba(1, 99, 139, 0.18) 0%, transparent 70%),
            radial-gradient(ellipse 50% 60% at 80% 80%, rgba(1, 179, 217, 0.10) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .grid-bg {
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(1, 99, 139, 0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(1, 99, 139, 0.07) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
          z-index: 0;
        }

        .form-wrapper {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 680px;
        }

        .form-header {
          margin-bottom: 2.5rem;
          text-align: center;
        }

        .form-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(1, 179, 217, 0.1);
          border: 1px solid rgba(1, 179, 217, 0.25);
          border-radius: 999px;
          padding: 0.3rem 0.9rem;
          font-size: 0.75rem;
          color: #01b3d9;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-weight: 500;
          margin-bottom: 1rem;
        }

        .form-title {
          // font-family: 'Syne', sans-serif;
          font-size: 2rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1.2;
          margin-bottom: 0.5rem;
        }

        .form-title span {
          color: #01b3d9;
        }

        .form-subtitle {
          color: rgba(255,255,255,0.45);
          font-size: 0.875rem;
          font-weight: 300;
          line-height: 1.6;
        }

        /* Stepper */
        .stepper {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          margin-bottom: 2.5rem;
        }

        .step-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.4rem;
          position: relative;
          flex: 1;
        }

        .step-item:not(:last-child)::after {
          content: '';
          position: absolute;
          top: 18px;
          left: 60%;
          width: 80%;
          height: 1px;
          background: rgba(1, 99, 139, 0.3);
          z-index: 0;
          transition: background 0.4s ease;
        }

        .step-item.completed:not(:last-child)::after {
          background: rgba(1, 179, 217, 0.6);
        }

        .step-dot {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1.5px solid rgba(1, 99, 139, 0.4);
          background: rgba(4, 0, 15, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          position: relative;
          z-index: 1;
          transition: all 0.3s ease;
          color: rgba(255,255,255,0.3);
        }

        .step-item.active .step-dot {
          border-color: #01b3d9;
          background: rgba(1, 179, 217, 0.12);
          box-shadow: 0 0 16px rgba(1, 179, 217, 0.4), 0 0 32px rgba(1, 179, 217, 0.15);
          color: #01b3d9;
        }

        .step-item.completed .step-dot {
          border-color: rgba(1, 179, 217, 0.5);
          background: rgba(1, 179, 217, 0.08);
          color: rgba(1, 179, 217, 0.7);
        }

        .step-label {
          font-size: 0.7rem;
          color: rgba(255,255,255,0.25);
          font-weight: 500;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          transition: color 0.3s ease;
        }

        .step-item.active .step-label {
          color: #01b3d9;
        }

        .step-item.completed .step-label {
          color: rgba(1, 179, 217, 0.5);
        }

        /* Card */
        .form-card {
          background: rgba(255, 255, 255, 0.025);
          border: 1px solid rgba(1, 99, 139, 0.2);
          border-radius: 20px;
          padding: 2.5rem;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          position: relative;
          overflow: hidden;
        }

        .form-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(1, 179, 217, 0.03) 0%, transparent 60%);
          pointer-events: none;
        }

        .step-content {
          animation: fadeSlide 0.3s ease forwards;
        }

        @keyframes fadeSlide {
          from { opacity: 0; transform: translateX(12px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .step-heading {
          font-family: 'Syne', sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 0.3rem;
        }

        .step-desc {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.35);
          margin-bottom: 1.8rem;
          font-weight: 300;
        }

        .fields-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.2rem;
        }

        .fields-grid.single {
          grid-template-columns: 1fr;
        }

        .field-group {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }

        .field-group.span-2 {
          grid-column: span 2;
        }

        .field-label {
          font-size: 0.75rem;
          font-weight: 500;
          color: rgba(255,255,255,0.5);
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .field-input {
          background: rgba(255,255,255,0.04) !important;
          border: 1px solid rgba(1, 99, 139, 0.25) !important;
          border-radius: 10px !important;
          color: #fff !important;
          font-family: 'DM Sans', sans-serif !important;
          font-size: 0.875rem !important;
          padding: 0.65rem 0.85rem !important;
          transition: border-color 0.2s, box-shadow 0.2s !important;
          height: auto !important;
        }

        .field-input::placeholder {
          color: rgba(255,255,255,0.2) !important;
        }

        .field-input:focus {
          border-color: rgba(1, 179, 217, 0.5) !important;
          box-shadow: 0 0 0 3px rgba(1, 179, 217, 0.08) !important;
          outline: none !important;
          background: rgba(1, 179, 217, 0.04) !important;
        }

        /* Select override */
        .custom-select-trigger {
          background: rgba(255,255,255,0.04) !important;
          border: 1px solid rgba(1, 99, 139, 0.25) !important;
          border-radius: 10px !important;
          color: #fff !important;
          font-family: 'DM Sans', sans-serif !important;
          font-size: 0.875rem !important;
          padding: 0.65rem 0.85rem !important;
          height: auto !important;
          width: 100% !important;
          transition: border-color 0.2s !important;
        }

        .custom-select-trigger:hover,
        .custom-select-trigger[data-state="open"] {
          border-color: rgba(1, 179, 217, 0.5) !important;
        }

        /* Checkboxes */
        .checkbox-group {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .checkbox-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          cursor: pointer;
        }

        .checkbox-input {
          appearance: none;
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          min-width: 18px;
          border: 1.5px solid rgba(1, 99, 139, 0.4);
          border-radius: 5px;
          background: rgba(255,255,255,0.03);
          cursor: pointer;
          position: relative;
          transition: all 0.2s;
          margin-top: 2px;
        }

        .checkbox-input:checked {
          background: rgba(1, 179, 217, 0.15);
          border-color: #01b3d9;
        }

        .checkbox-input:checked::after {
          content: '';
          position: absolute;
          left: 4px;
          top: 1px;
          width: 6px;
          height: 10px;
          border: 2px solid #01b3d9;
          border-top: none;
          border-left: none;
          transform: rotate(45deg);
        }

        .checkbox-text {
          font-size: 0.82rem;
          color: rgba(255,255,255,0.5);
          line-height: 1.5;
        }

        .checkbox-text a {
          color: #01b3d9;
          text-decoration: none;
        }

        /* Summary card */
        .summary-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.8rem;
        }

        .summary-item {
          background: rgba(1, 99, 139, 0.07);
          border: 1px solid rgba(1, 99, 139, 0.15);
          border-radius: 10px;
          padding: 0.75rem 1rem;
        }

        .summary-item-label {
          font-size: 0.68rem;
          color: rgba(255,255,255,0.3);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.2rem;
        }

        .summary-item-value {
          font-size: 0.82rem;
          color: rgba(255,255,255,0.75);
          font-weight: 500;
          word-break: break-word;
        }

        .summary-item.span-2 {
          grid-column: span 2;
        }

        /* Navigation */
        .form-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 2rem;
          gap: 1rem;
        }

        .btn-back {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.4);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
          padding: 0.7rem 1.4rem;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-back:hover {
          border-color: rgba(255,255,255,0.2);
          color: rgba(255,255,255,0.7);
        }

        .btn-next {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, #01638b, #01b3d9);
          border: none;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          font-weight: 600;
          padding: 0.75rem 2rem;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
          flex: 1;
          max-width: 280px;
          box-shadow: 0 4px 20px rgba(1, 179, 217, 0.2);
          letter-spacing: 0.02em;
        }

        .btn-next:hover:not(:disabled) {
          box-shadow: 0 4px 28px rgba(1, 179, 217, 0.4);
          transform: translateY(-1px);
        }

        .btn-next:disabled {
          opacity: 0.35;
          cursor: not-allowed;
          transform: none;
        }

        .btn-next.submit {
          background: linear-gradient(135deg, #0a7c4e, #00c47a);
          box-shadow: 0 4px 20px rgba(0, 196, 122, 0.2);
        }

        .btn-next.submit:hover:not(:disabled) {
          box-shadow: 0 4px 28px rgba(0, 196, 122, 0.4);
        }

        .error-msg {
          background: rgba(255, 80, 80, 0.08);
          border: 1px solid rgba(255, 80, 80, 0.2);
          border-radius: 8px;
          padding: 0.65rem 1rem;
          font-size: 0.8rem;
          color: rgba(255, 120, 120, 0.9);
          margin-top: 1rem;
        }

        .progress-bar {
          height: 2px;
          background: rgba(1, 99, 139, 0.2);
          border-radius: 1px;
          margin-bottom: 2rem;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #01638b, #01b3d9);
          border-radius: 1px;
          transition: width 0.4s ease;
          box-shadow: 0 0 8px rgba(1, 179, 217, 0.6);
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <ToastProvider
        placement={placement}
        toastOffset={placement.includes("top") ? 60 : 0}
        toastProps={{
          radius: "lg",
          color: "primary",
          variant: "flat",
          timeout: 9000,
        }}
      />

      <div className="partner-form-root">
        <div className="grid-bg" />

        <div className="form-wrapper mt-20">
          {/* Header */}
          <div className="form-header">
            <div className="form-badge">
              <span>
                <FaBus />
              </span>
              <span>EasyTrans Partenaire</span>
            </div>
            <h1 className="form-title">
              Rejoignez notre <span>réseau</span>
            </h1>
            <p className="form-subtitle">
              Complétez votre demande en 4 étapes simples.
              <br />
              Votre dossier sera examiné sous 48h ouvrées.
            </p>
          </div>

          {/* Stepper */}
          <div className="stepper">
            {STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.id}
                  className={`step-item ${
                    currentStep === step.id
                      ? "active"
                      : currentStep > step.id
                        ? "completed"
                        : ""
                  }`}
                >
                  <div className="step-dot">
                    <Icon />
                  </div>
                  <span className="step-label">{step.label}</span>
                </div>
              );
            })}
          </div>

          {/* Progress */}
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%`,
              }}
            />
          </div>

          {/* Card */}
          <div className="form-card">
            {/* STEP 1 — Entreprise */}
            {currentStep === 1 && (
              <div className="step-content" key="step1">
                <h2 className="step-heading">Informations entreprise</h2>
                <p className="step-desc">
                  Renseignez les données officielles de votre société.
                </p>
                <div className="fields-grid">
                  <div className="field-group span-2">
                    <label className="field-label">
                      Nom de l'entreprise{" "}
                      <span className="text-red-700">*</span>
                    </label>
                    <input
                      className="field-input"
                      name="company_name"
                      placeholder="Transport Dupont & Associés"
                      value={formpartenaire.company_name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="field-group">
                    <label className="field-label">
                      SIRET / Enregistrement{" "}
                      <span className="text-red-700">*</span>
                    </label>
                    <input
                      className="field-input"
                      name="company_registration_number"
                      placeholder="123 456 789 00012"
                      value={formpartenaire.company_registration_number}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="field-group">
                    <label className="field-label">
                      Pays <span className="text-red-700">*</span>
                    </label>
                    <input
                      className="field-input"
                      name="company_country"
                      placeholder="France"
                      value={formpartenaire.company_country}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="field-group span-2">
                    <label className="field-label">
                      Adresse complète <span className="text-red-700">*</span>
                    </label>
                    <input
                      className="field-input"
                      name="company_address"
                      placeholder="12 rue de la Paix"
                      value={formpartenaire.company_address}
                      onChange={handleChange}
                    />
                  </div>
                  {/* Villes — choix multiple */}
                  <div className="field-group span-2">
                    <label className="field-label">
                      Ville(s) d'activité{" "}
                      <span className="text-red-700">*</span>
                    </label>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.5rem",
                        padding: "0.65rem 0.85rem",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(1, 99, 139, 0.25)",
                        borderRadius: "10px",
                        minHeight: "48px",
                        cursor: "pointer",
                      }}
                    >
                      {CONGO_CITIES.map((city) => {
                        const selected =
                          formpartenaire.company_city.includes(city);
                        return (
                          <button
                            key={city}
                            type="button"
                            onClick={() =>
                              setFormpartenaire((prev) => ({
                                ...prev,
                                company_city: selected
                                  ? prev.company_city.filter((c) => c !== city)
                                  : [...prev.company_city, city],
                              }))
                            }
                            style={{
                              padding: "0.25rem 0.75rem",
                              borderRadius: "999px",
                              fontSize: "0.78rem",
                              fontWeight: 500,
                              border: selected
                                ? "1px solid #01b3d9"
                                : "1px solid rgba(255,255,255,0.12)",
                              background: selected
                                ? "rgba(1, 179, 217, 0.15)"
                                : "rgba(255,255,255,0.04)",
                              color: selected
                                ? "#01b3d9"
                                : "rgba(255,255,255,0.4)",
                              cursor: "pointer",
                              transition: "all 0.15s ease",
                            }}
                          >
                            {selected ? "✓ " : ""}
                            {city}
                          </button>
                        );
                      })}
                    </div>
                    {formpartenaire.company_city.length === 0 && (
                      <span
                        style={{
                          fontSize: "0.72rem",
                          color: "rgba(255,255,255,0.2)",
                        }}
                      >
                        Sélectionnez au moins une ville
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2 — Contact */}
            {currentStep === 2 && (
              <div className="step-content" key="step2">
                <h2 className="step-heading">Responsable du dossier</h2>
                <p className="step-desc">
                  La personne que nous contacterons pour valider le partenariat.
                </p>
                <div className="fields-grid">
                  <div className="field-group">
                    <label className="field-label">
                      Nom complet <span className="text-red-700">*</span>
                    </label>
                    <input
                      className="field-input"
                      name="contact_full_name"
                      placeholder="Jean Dupont"
                      value={formpartenaire.contact_full_name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="field-group">
                    <label className="field-label">Fonction</label>
                    <input
                      className="field-input"
                      name="contact_position"
                      placeholder="Responsable commercial"
                      value={formpartenaire.contact_position}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="field-group">
                    <label className="field-label">
                      Email <span className="text-red-700">*</span>
                    </label>
                    <input
                      className="field-input"
                      type="email"
                      name="contact_email"
                      placeholder="jean@entreprise.com"
                      value={formpartenaire.contact_email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="field-group">
                    <label className="field-label">Téléphone</label>
                    <input
                      className="field-input"
                      type="tel"
                      name="contact_phone"
                      placeholder="+33 6 12 34 56 78"
                      value={formpartenaire.contact_phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3 — Services */}
            {currentStep === 3 && (
              <div className="step-content" key="step3">
                <h2 className="step-heading">Votre offre de transport</h2>
                <p className="step-desc">
                  Décrivez les services que vous souhaitez proposer sur
                  EasyTrans.
                </p>
                <div className="fields-grid">
                  <div className="field-group">
                    <label className="field-label">
                      Type de service <span className="text-red-700">*</span>
                    </label>
                    <Select
                      value={formpartenaire.service_type}
                      onValueChange={(value) =>
                        setFormpartenaire((prev) => ({
                          ...prev,
                          service_type: value,
                        }))
                      }
                    >
                      <SelectTrigger className="custom-select-trigger">
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectGroup>
                          <SelectItem
                            value="transport"
                            className="flex gap-2 cursor-pointer"
                          >
                            Transport de bus
                          </SelectItem>
                          <SelectItem
                            value="hotel"
                            className="flex gap-2 cursor-pointer"
                          >
                            hôtellerie
                          </SelectItem>
                          <SelectItem
                            value="apartment"
                            className="flex gap-2 cursor-pointer"
                          >
                            Appartement
                          </SelectItem>
                          <SelectItem
                            value="car_rental"
                            className="flex gap-2 cursor-pointer"
                          >
                            Location de voiture
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="field-group">
                    <label className="field-label">Zones desservies</label>
                    <input
                      className="field-input"
                      name="service_zones"
                      placeholder="Brazzaville - Pointe-Noire, Dolisie - Nkayi"
                      value={formpartenaire.service_zones}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4 — Confirmation */}
            {currentStep === 4 && (
              <div className="step-content" key="step4">
                <h2 className="step-heading">Récapitulatif & confirmation</h2>
                <p className="step-desc">
                  Vérifiez vos informations avant d'envoyer votre demande.
                </p>

                <div
                  className="summary-grid"
                  style={{ marginBottom: "1.5rem" }}
                >
                  <div className="summary-item">
                    <div className="summary-item-label">Entreprise</div>
                    <div className="summary-item-value">
                      {formpartenaire.company_name || "—"}
                    </div>
                  </div>
                  <div className="summary-item">
                    <div className="summary-item-label">SIRET</div>
                    <div className="summary-item-value">
                      {formpartenaire.company_registration_number || "—"}
                    </div>
                  </div>
                  <div className="summary-item span-2">
                    <div className="summary-item-label">Adresse</div>
                    <div className="summary-item-value">
                      {[
                        formpartenaire.company_address,
                        formpartenaire.company_country,
                      ]
                        .filter(Boolean)
                        .join(", ") || "—"}
                    </div>
                  </div>
                  <div className="summary-item span-2">
                    <div className="summary-item-label">Villes</div>
                    <div className="summary-item-value">
                      {formpartenaire.company_city.length > 0
                        ? formpartenaire.company_city.join(", ")
                        : "—"}
                    </div>
                  </div>
                  <div className="summary-item">
                    <div className="summary-item-label">Contact</div>
                    <div className="summary-item-value">
                      {formpartenaire.contact_full_name || "—"}
                    </div>
                  </div>
                  <div className="summary-item">
                    <div className="summary-item-label">Email</div>
                    <div className="summary-item-value">
                      {formpartenaire.contact_email || "—"}
                    </div>
                  </div>
                  <div className="summary-item">
                    <div className="summary-item-label">Service</div>
                    <div className="summary-item-value">
                      {formpartenaire.service_type.replace("_", " ") || "—"}
                    </div>
                  </div>
                  <div className="summary-item">
                    <div className="summary-item-label">Zones</div>
                    <div className="summary-item-value">
                      {formpartenaire.service_zones || "—"}
                    </div>
                  </div>
                </div>

                <div className="checkbox-group">
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      className="checkbox-input"
                      name="accept_terms"
                      checked={formpartenaire.accept_terms}
                      onChange={(e) =>
                        setFormpartenaire((prev) => ({
                          ...prev,
                          accept_terms: e.target.checked,
                        }))
                      }
                    />
                    <span className="checkbox-text">
                      J'accepte les <a href="#">conditions générales</a> et la{" "}
                      <a href="#">politique de confidentialité</a> d'EasyTrans{" "}
                      <span className="text-red-700">*</span>
                    </span>
                  </label>
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      className="checkbox-input"
                      checked={formpartenaire.accept_marketing}
                      onChange={(e) =>
                        setFormpartenaire((prev) => ({
                          ...prev,
                          accept_marketing: e.target.checked,
                        }))
                      }
                    />
                    <span className="checkbox-text">
                      J'accepte de recevoir des communications commerciales et
                      des actualités EasyTrans
                    </span>
                  </label>
                </div>

                {error && !isSubmitting && (
                  <div className="error-msg">{error}</div>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="form-nav">
              {currentStep > 1 ? (
                <button
                  className="btn-back"
                  onClick={() => setCurrentStep((s) => s - 1)}
                >
                  ← Retour
                </button>
              ) : (
                <div />
              )}

              {currentStep < 4 ? (
                <button
                  className="btn-next"
                  disabled={!canProceed()}
                  onClick={() => setCurrentStep((s) => s + 1)}
                >
                  Continuer →
                </button>
              ) : (
                <button
                  className="btn-next submit"
                  disabled={!formpartenaire.accept_terms || isSubmitting}
                  onClick={() => {
                    if (!isSubmitting) handleSubmit();
                  }}
                >
                  {isSubmitting ? (
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        style={{ animation: "spin 1s linear infinite" }}
                      >
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                      Envoi en cours…
                    </span>
                  ) : (
                    "Envoyer ma demande ✓"
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
