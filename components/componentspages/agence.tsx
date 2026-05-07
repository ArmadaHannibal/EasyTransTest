"use client";

import React from "react";
import { Avatar } from "@heroui/avatar";
import { FaFacebookF } from "react-icons/fa6";
import { AiFillInstagram } from "react-icons/ai";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaBusSimple } from "react-icons/fa6";
import { IoTicket } from "react-icons/io5";
import { FaPhoneAlt } from "react-icons/fa";
import { Link } from "@heroui/link";
import { Button } from "@heroui/button";
import { GiBus } from "react-icons/gi";
import { MdLocationPin } from "react-icons/md";
import { User } from "@heroui/user";
import { Image } from "@heroui/image";
import { Chip } from "@heroui/chip";
import useSWR from "swr";
import { Empty } from "antd";
import { useRouter } from "next/navigation";

import { fetchAgenciesWithTickets } from "@/services/agencyService";

import "@/styles/styleLoadingAgenceHome.css";

const Agencehome: React.FC = () => {
  const { data: agencies, error } = useSWR(
    "agencies-data",
    fetchAgenciesWithTickets,
  );

  const isLoading = !agencies && !error;

  const router = useRouter();

  // Fonction pour visiter l'agence
  const handleVisitAgency = (agencyId: string) => {
    router.push(`/agencies/${agencyId}`);
  };

  if (isLoading)
    return (
      <div className="contenerloadertrajethome mt-20">
        <div className="text-center mb-8 gap-3.5">
          <div className="mb-4">
            <h2 className="text-7xl font-bold text-center mb-8">
              Réseau d&apos;Agences
            </h2>
          </div>

          <div>
            <p>
              Trouvez et collaborez avec les meilleures agences de transport
              partenaires.
            </p>
          </div>
        </div>
        <div className="relative flex flex-col items-center justify-center h-48">
          <div className="socket">
            <div className="gel center-gel">
              <div className="hex-brick h1"></div>
              <div className="hex-brick h2"></div>
              <div className="hex-brick h3"></div>
            </div>
            <div className="gel c1 r1">
              <div className="hex-brick h1"></div>
              <div className="hex-brick h2"></div>
              <div className="hex-brick h3"></div>
            </div>
            <div className="gel c2 r1">
              <div className="hex-brick h1"></div>
              <div className="hex-brick h2"></div>
              <div className="hex-brick h3"></div>
            </div>
            <div className="gel c3 r1">
              <div className="hex-brick h1"></div>
              <div className="hex-brick h2"></div>
              <div className="hex-brick h3"></div>
            </div>
            <div className="gel c4 r1">
              <div className="hex-brick h1"></div>
              <div className="hex-brick h2"></div>
              <div className="hex-brick h3"></div>
            </div>
            <div className="gel c5 r1">
              <div className="hex-brick h1"></div>
              <div className="hex-brick h2"></div>
              <div className="hex-brick h3"></div>
            </div>
            <div className="gel c6 r1">
              <div className="hex-brick h1"></div>
              <div className="hex-brick h2"></div>
              <div className="hex-brick h3"></div>
            </div>

            <div className="gel c7 r2">
              <div className="hex-brick h1"></div>
              <div className="hex-brick h2"></div>
              <div className="hex-brick h3"></div>
            </div>

            <div className="gel c8 r2">
              <div className="hex-brick h1"></div>
              <div className="hex-brick h2"></div>
              <div className="hex-brick h3"></div>
            </div>
            <div className="gel c9 r2">
              <div className="hex-brick h1"></div>
              <div className="hex-brick h2"></div>
              <div className="hex-brick h3"></div>
            </div>
            <div className="gel c10 r2">
              <div className="hex-brick h1"></div>
              <div className="hex-brick h2"></div>
              <div className="hex-brick h3"></div>
            </div>
            <div className="gel c11 r2">
              <div className="hex-brick h1"></div>
              <div className="hex-brick h2"></div>
              <div className="hex-brick h3"></div>
            </div>
            <div className="gel c12 r2">
              <div className="hex-brick h1"></div>
              <div className="hex-brick h2"></div>
              <div className="hex-brick h3"></div>
            </div>
            <div className="gel c13 r2">
              <div className="hex-brick h1"></div>
              <div className="hex-brick h2"></div>
              <div className="hex-brick h3"></div>
            </div>
            <div className="gel c14 r2">
              <div className="hex-brick h1"></div>
              <div className="hex-brick h2"></div>
              <div className="hex-brick h3"></div>
            </div>
            <div className="gel c15 r2">
              <div className="hex-brick h1"></div>
              <div className="hex-brick h2"></div>
              <div className="hex-brick h3"></div>
            </div>
            <div className="gel c16 r2">
              <div className="hex-brick h1"></div>
              <div className="hex-brick h2"></div>
              <div className="hex-brick h3"></div>
            </div>
            <div className="gel c17 r2">
              <div className="hex-brick h1"></div>
              <div className="hex-brick h2"></div>
              <div className="hex-brick h3"></div>
            </div>
            <div className="gel c18 r2">
              <div className="hex-brick h1"></div>
              <div className="hex-brick h2"></div>
              <div className="hex-brick h3"></div>
            </div>
            <div className="gel c19 r3">
              <div className="hex-brick h1"></div>
              <div className="hex-brick h2"></div>
              <div className="hex-brick h3"></div>
            </div>
            <div className="gel c20 r3">
              <div className="hex-brick h1"></div>
              <div className="hex-brick h2"></div>
              <div className="hex-brick h3"></div>
            </div>
            <div className="gel c21 r3">
              <div className="hex-brick h1"></div>
              <div className="hex-brick h2"></div>
              <div className="hex-brick h3"></div>
            </div>
            <div className="gel c22 r3">
              <div className="hex-brick h1"></div>
              <div className="hex-brick h2"></div>
              <div className="hex-brick h3"></div>
            </div>
            <div className="gel c23 r3">
              <div className="hex-brick h1"></div>
              <div className="hex-brick h2"></div>
              <div className="hex-brick h3"></div>
            </div>
            <div className="gel c24 r3">
              <div className="hex-brick h1"></div>
              <div className="hex-brick h2"></div>
              <div className="hex-brick h3"></div>
            </div>
            <div className="gel c25 r3">
              <div className="hex-brick h1"></div>
              <div className="hex-brick h2"></div>
              <div className="hex-brick h3"></div>
            </div>
            <div className="gel c26 r3">
              <div className="hex-brick h1"></div>
              <div className="hex-brick h2"></div>
              <div className="hex-brick h3"></div>
            </div>
            <div className="gel c28 r3">
              <div className="hex-brick h1"></div>
              <div className="hex-brick h2"></div>
              <div className="hex-brick h3"></div>
            </div>
            <div className="gel c29 r3">
              <div className="hex-brick h1"></div>
              <div className="hex-brick h2"></div>
              <div className="hex-brick h3"></div>
            </div>
            <div className="gel c30 r3">
              <div className="hex-brick h1"></div>
              <div className="hex-brick h2"></div>
              <div className="hex-brick h3"></div>
            </div>
            <div className="gel c31 r3">
              <div className="hex-brick h1"></div>
              <div className="hex-brick h2"></div>
              <div className="hex-brick h3"></div>
            </div>
            <div className="gel c32 r3">
              <div className="hex-brick h1"></div>
              <div className="hex-brick h2"></div>
              <div className="hex-brick h3"></div>
            </div>
            <div className="gel c33 r3">
              <div className="hex-brick h1"></div>
              <div className="hex-brick h2"></div>
              <div className="hex-brick h3"></div>
            </div>
            <div className="gel c34 r3">
              <div className="hex-brick h1"></div>
              <div className="hex-brick h2"></div>
              <div className="hex-brick h3"></div>
            </div>
            <div className="gel c35 r3">
              <div className="hex-brick h1"></div>
              <div className="hex-brick h2"></div>
              <div className="hex-brick h3"></div>
            </div>
            <div className="gel c36 r3">
              <div className="hex-brick h1"></div>
              <div className="hex-brick h2"></div>
              <div className="hex-brick h3"></div>
            </div>
            <div className="gel c37 r3">
              <div className="hex-brick h1"></div>
              <div className="hex-brick h2"></div>
              <div className="hex-brick h3"></div>
            </div>
          </div>

          <div className="mt-64 text-center text-gray-600 font-semibold">
            <span>Recherche d&apos;agence ...</span>
          </div>
        </div>
      </div>
    );
  if (error)
    return (
      <div className="mt-20">
        <div>
          <h2 className="text-7xl font-bold text-center mb-8">
            Réseau d&apos;Agences
          </h2>
        </div>
        <Empty description="Aucun billet disponible pour le moment." />
      </div>
    );

  console.log("Agencies with Tickets:", agencies);

  return (
    <section className="py-8 md:py-10">
      <div className="flex flex-col mx-auto max-w-6xl items-center justify-center gap-4">
        <div className="mt-12 text-center mb-8 gap-3.5 text-white">
          <div className="mb-4">
            <h2 className="text-7xl font-bold text-center">
              Réseau d&apos;Agences
            </h2>
          </div>
          <div>
            <p>
              Trouvez et collaborez avec les meilleures agences de transport
              partenaires.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Example agency cards */}
          {agencies && agencies.length > 0 ? (
            agencies?.map((agencie: any, index: number) => {
              return (
                <div
                  key={agencie.id ?? index}
                  className="relative p-8 rounded-md overflow-hidden text-white"
                  style={{
                    boxShadow:
                      "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
                    backgroundImage:
                      "url(https://res.cloudinary.com/dtrpkegss/image/upload/v1763498349/4009030_kkfcxe.jpg)",
                    backgroundSize: "51rem",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  <div>
                    <Chip color="warning" variant="shadow">
                      Agence
                    </Chip>
                  </div>
                  <div className="absolute -top-10 -right-2">
                    <Image
                      isBlurred
                      alt="logo agence"
                      className="m-5 object-cover"
                      src={
                        agencie.logo_url ??
                        "https://res.cloudinary.com/dtrpkegss/image/upload/v1758121603/young-black-woman-aun-tram-station-uses-smartphone_rpalos.jpg"
                      }
                      width={160}
                      height={160}
                      radius="full"
                    />
                  </div>
                  <div className="mt-28">
                    <div>
                      <h2 className="font-semibold">{agencie?.name}</h2>
                    </div>
                    <div className="mt-4">
                      <User
                        avatarProps={{
                          src:
                            agencie?.owner?.profile_picture ??
                            "https://res.cloudinary.com/dtrpkegss/image/upload/v1758118983/WhatsApp_Image_2024-12-18_%C3%A0_22.27.36_d01591c2-removebg_jgijg7.png",
                        }}
                        description="Propriétaire de l'agence"
                        name={
                          agencie?.owner?.first_name &&
                          agencie?.owner?.last_name
                            ? `${agencie.owner.first_name} ${agencie.owner.last_name}`
                            : "Propriétaire"
                        }
                      />
                    </div>
                    <div className="mt-4 flex flex-col gap-2">
                      <div className="flex flex-row gap-1.5 items-center bg-glacev2 px-2 py-1 rounded-full">
                        <MdLocationPin className="text-lg" />
                        <span className="text-sm">
                          {agencie?.address ?? "Adresse non disponible"}
                        </span>
                      </div>
                      <div className="flex flex-row gap-1.5 items-center bg-glacev2 px-2 py-1 rounded-full">
                        <FaPhoneAlt className="text-base" />
                        <span className="text-sm">
                          {agencie.phone ?? "Aucun numéro disponible"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-center">
                    <Button
                      color="default"
                      variant="solid"
                      className="bg-white"
                      onPress={() => handleVisitAgency(agencie.id)}
                    >
                      Visiter l&apos;agence
                    </Button>
                  </div>
                </div>
              );
            })
          ) : (
            <Empty description="Aucune agence disponible pour le moment." />
          )}
        </div>
      </div>
    </section>
  );
};

export default Agencehome;
