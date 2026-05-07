"use client";

import React, { useEffect, useState } from "react";
import { Avatar, AvatarGroup, AvatarIcon } from "@heroui/avatar";
import { Button, ButtonGroup } from "@heroui/button";
import { FaStar } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaComment } from "react-icons/fa6";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function CardsComments({ agencyId }: any) {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // État de chargement
  const [error, setError] = useState(null); // Optionnel: pour les erreurs

  useEffect(() => {
    setIsLoading(true); // Début du chargement
    setError(null); // Réinitialiser les erreurs

    fetch(`/api/reviews/${agencyId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Erreur lors du chargement des commentaires");
        }
        return res.json();
      })
      .then((data) => {
        setComments(data);
      })
      .catch((err) => {
        setError(err.message);
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false); // Fin du chargement
      });
  }, [agencyId]);

  // État de chargement
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600">
          Chargement des commentaires...
        </span>
      </div>
    );
  }

  // Gestion des erreurs (optionnel)
  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Erreur : {error}</p>
        <Button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Réessayer
        </Button>
      </div>
    );
  }

  // Aucun commentaire
  if (comments.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon" className="bg-glace">
            <FaComment />
          </EmptyMedia>
          {/* <EmptyTitle>Info</EmptyTitle> */}
          <EmptyDescription>Aucun commentaire pour ce bus.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <>
      <ul className="space-y-2">
        {comments.map((c: any) => (
          <li key={c.review_id}>
            <div className="flex flex-row gap-4 bg-glacev2 p-4 rounded-md">
              <div>
                {c.users?.profile_picture ? (
                  <Avatar
                    isBordered
                    color="primary"
                    src={c.users?.profile_picture}
                  />
                ) : (
                  <div className="p-2 border-2 border-blue-700 rounded-full">
                    <FaUser className="w-5 h-5" />
                  </div>
                )}
              </div>
              <div>
                <div>
                  <p className="text-sm text-gray-600">
                    <strong className="text-black">
                      {c.users?.first_name} {c.users?.last_name}
                    </strong>{" "}
                    : {c.comment}
                  </p>
                </div>
                <div className="flex flex-row items-center gap-2 text-sm mt-2">
                  <div>
                    <strong>{new Date(c.created_at).toLocaleString()}</strong>
                  </div>
                  <div>
                    <span>|</span>
                  </div>
                  <div className="flex gap-1 items-center">
                    {Array.from({ length: c.rating }).map((_, i) => (
                      <FaStar key={i} className="text-orange-400" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
