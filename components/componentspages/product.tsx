"use client";

import React, { useEffect, useState } from "react";
import { Avatar } from "@heroui/avatar";
import { FaCalendarAlt } from "react-icons/fa";
import { FaBusSimple } from "react-icons/fa6";
import { IoTicket } from "react-icons/io5";
import { IoTime } from "react-icons/io5";
import { Image } from "@heroui/image";
import { Chip } from "@heroui/chip";
import { FaStar } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";
import { IoMdLocate } from "react-icons/io";
import dayjs, { Dayjs } from "dayjs";
import { Link } from "@heroui/link";
import { Button } from "@heroui/button";
import { Empty } from "antd";
import useSWR from "swr";
import { fetchTickets } from "@/services/ticketService";
import { Alert } from "@heroui/alert";
import { User } from "@heroui/user";

import "@/styles/styleLoadingtrajetHome.css";

const Tickethome: React.FC = () => {
  const { data: tickets, error } = useSWR("tickets", fetchTickets);
  const isLoading = !tickets && !error;

  if (isLoading)
    return (
      <div className="contenerloadertrajethome mt-32">
        <div>
          <h2 className="font-bold text-7xl text-center mb-8">Trajet</h2>
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="loader"></div>
          <div className="mt-8 text-center text-gray-600 font-semibold">
            <span>Recherche de trajet ...</span>
          </div>
        </div>
      </div>
    );
  if (error)
    return (
      <div className="mt-32">
        <div>
          <h2 className="font-bold text-7xl text-center mb-8">Trajet</h2>
        </div>
        <Empty description="Aucun billet disponible pour le moment." />
      </div>
    );

  const calculateDuration = (depart: string, arrivee: string): string => {
    if (!depart || !arrivee) return "0h";

    try {
      const parseTime = (timeStr: string): number => {
        const parts = timeStr.split(":");
        const hours = parseInt(parts[0]) || 0;
        const minutes = parseInt(parts[1]) || 0;
        return hours * 60 + minutes;
      };

      const departMinutes = parseTime(depart);
      const arriveeMinutes = parseTime(arrivee);

      let diffMinutes = arriveeMinutes - departMinutes;
      if (diffMinutes < 0) {
        diffMinutes += 1440; // Ajouter 24 heures
      }

      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;

      return `${hours}h${minutes > 0 ? `${minutes}m` : ""}`;
    } catch (error) {
      console.warn("Error calculating duration:", error);
      return "0h";
    }
  };

  // console.log("Tickets fetched:", tickets);

  return (
    <section className="py-8 md:py-10">
      <div className="flex flex-col mx-auto max-w-6xl items-center justify-center gap-4">
        <div className="text-center mt-12 mb-8 gap-3.5 text-white">
          <div>
            <h2 className="font-bold text-7xl">Trajet</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 mx-4 lg:mx-0">
          {tickets && tickets.length > 0 ? (
            tickets?.map((ticket: any, index: number) => {
              // Utilisation
              const depart = ticket.heure_depart;
              const arrivee = ticket.heure_arrive;
              const duree = calculateDuration(depart, arrivee);

              return (
                <div
                  key={ticket.id ?? index}
                  className="bg-size-[60rem] bg-no-repeat bg-[url(https://res.cloudinary.com/dtrpkegss/image/upload/v1763498362/2147_x5z7fl.jpg)] rounded-2xl shadow-xl overflow-hidden"
                >
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      isZoomed
                      src="https://res.cloudinary.com/dtrpkegss/image/upload/v1758095578/vecteezy_close-up-photo-of-school-bus-on-the-road-generative-ai_30710246_c15xem.jpg"
                      alt="Voyage en bus vers la montagne"
                      className="w-full h-full object-cover"
                      width={400}
                      height={224}
                      radius="none"
                    />
                    <div className="absolute inset-0 bg-black opacity-50 z-20"></div>
                    <div className="absolute top-4 right-4 z-30">
                      <Chip
                        color="warning"
                        variant="dot"
                        className="text-white"
                      >
                        À partir de {ticket.ticket_price} XAF
                      </Chip>
                    </div>

                    <div className="absolute bottom-4 left-4 text-white z-30">
                      <h2 className="flex items-center gap-2.5 text-2xl font-bold">
                        {" "}
                        <FaBusSimple className="w-4 h-4" />
                        {ticket.buses.bus_name}
                      </h2>
                      <p className="text-sm flex items-center gap-2.5">
                        <FaLocationDot className="w-4 h-4" /> Départ{" "}
                        {ticket.departure_location}
                      </p>
                      <p className="text-sm flex items-center gap-2.5">
                        <IoMdLocate className="w-4 h-4" /> Arrivée{" "}
                        {ticket.destination}
                      </p>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="bg-glacev2 p-2 rounded-md grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-lg mr-3">
                          <IoTime />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Durée</p>
                          <p className="text-sm font-semibold">{duree}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-lg mr-3">
                          <FaCalendarAlt />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Départs</p>
                          <p className="text-sm font-semibold">
                            {new Date(
                              ticket.departure_date ?? new Date(),
                            ).toLocaleDateString("fr-FR", {
                              timeZone: "UTC",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-glacev2 p-2 rounded-md flex items-center justify-between mb-5">
                      <div>
                        <div className="flex flex-row gap-1 mb-1">
                          <FaStar className="w-4 h-4 text-yellow-500" />
                          <FaStar className="w-4 h-4 text-yellow-500" />
                          <FaStar className="w-4 h-4 text-yellow-500" />
                          <FaStar className="w-4 h-4 text-yellow-500" />
                          <FaStar className="w-4 h-4 text-yellow-500" />
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">
                          Places disponibles
                        </p>
                        <p className="font-semibold text-accent">
                          {ticket.quantity} restantes
                        </p>
                      </div>
                    </div>

                    <div className="bg-glacev2 p-2 rounded-md mb-6">
                      <div>
                        <User
                          avatarProps={{
                            src: ticket.agency.logo_url || "",
                            alt: "Propriétaire du bus",
                          }}
                          description={
                            <>
                              <p className="flex flex-col">
                                <span>
                                  {`Numéro de l'agence : ` +
                                    ticket.agency.phone || "aucun numéro"}
                                </span>
                                <span>
                                  {`Adresse de l'agence : ` +
                                    ticket.agency.address || "aucune adresse"}
                                </span>
                              </p>
                            </>
                          }
                          name={`Agence ` + ticket.agency.name}
                        />
                      </div>
                      <div></div>
                    </div>

                    {ticket.quantity > 0 ? (
                      <button className="booking-btn gap-2 w-full bg-primary hover:bg-darkBlue text-white font-semibold py-3 px-4 rounded-xl transition duration-300 flex items-center justify-center">
                        <IoTicket />
                        Réserver maintenant
                      </button>
                    ) : (
                      <div className="w-full flex items-center my-3">
                        <Alert
                          radius="full"
                          color="danger"
                          title={`Ce billet est complet.`}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <Empty description="Aucun billet disponible pour le moment." />
          )}
        </div>
      </div>
    </section>
  );
};

export default Tickethome;
