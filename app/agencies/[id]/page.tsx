import { Metadata } from "next";
import { notFound } from "next/navigation";
import AgencyDetails from "@/components/componentspages/agency/AgencyDetails";
import { fetchAgencyById } from "@/services/agencyService";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params; // Await ici

  // Validation basique de l'ID
  if (!id || typeof id !== "string" || id.trim().length === 0) {
    return {
      title: "Agence non trouvée",
    };
  }

  try {
    const agency = await fetchAgencyById(id);

    if (!agency) {
      return {
        title: "Agence non trouvée",
        description: "Cette agence n'existe pas ou a été supprimée",
      };
    }

    return {
      title: `${agency.name} - Détails de l'agence`,
      description: `Découvrez les services et tickets disponibles chez ${agency.name}`,
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Erreur de chargement",
      description: "Impossible de charger les informations de l'agence",
    };
  }
}

export default async function AgencyPage({ params }: PageProps) {
  const { id } = await params; // Await ici aussi avant d'utiliser params

  // Validation de base du paramètre
  if (!id || typeof id !== "string" || id.trim().length === 0) {
    console.error("Invalid agency ID:", id);
    notFound();
  }

  try {
    const agency = await fetchAgencyById(id);

    if (!agency) {
      console.log("Agency not found for ID:", id);
      notFound();
    }

    return <AgencyDetails agency={agency} />;
  } catch (error) {
    console.error("Error loading agency page:", error);
    notFound();
  }
}
