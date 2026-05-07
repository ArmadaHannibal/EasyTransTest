"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Button } from "@heroui/button";
import { addToast, ToastProvider } from "@heroui/toast";

type PartnerRequest = {
  request_id: number;
  company_name: string;
  company_address: string | null;
  contact_full_name: string;
  contact_phone: string | null;
  contact_email: string;
  status: string;
  submitted_at: string;
  user_id: string | null;
};

type ToastPlacement =
  | "top-center"
  | "top-right"
  | "top-left"
  | "bottom-center"
  | "bottom-right"
  | "bottom-left";

const PageDemandePartenaireDashboard: React.FC = () => {
  const supabase = createClient();
  const [requests, setRequests] = useState<PartnerRequest[]>([]);
  const [placement, setPlacement] = React.useState<ToastPlacement>("top-right");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from("partner_requests")
      .select("*")
      .order("submitted_at", { ascending: false });

    if (error) {
      console.error("Erreur récupération :", error);
    } else {
      setRequests(data as PartnerRequest[]);
    }
  };

  const handleApprove = async (request: PartnerRequest) => {
    try {
      // Créer l’agence
      const { error: agencyError } = await supabase.from("agencies").insert({
        owner_id: request.user_id,
        name: request.company_name,
        address: request.company_address,
        phone: request.contact_phone,
      });
      if (agencyError) throw agencyError;

      // Mettre à jour la demande
      await supabase
        .from("partner_requests")
        .update({
          status: "approved",
          reviewed_at: new Date().toISOString(),
        })
        .eq("request_id", request.request_id);

      // Créer une notification
      await supabase.from("notifications").insert({
        user_id: request.user_id,
        message: `Votre demande pour l'agence "${request.company_name}" a été approuvée`,
        notification_type: "info",
        status: "unread",
      });

      addToast({
        title: "Demande approuvée",
        // description: "Toast Description",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
        color: "success",
      });

      fetchRequests();
    } catch (err) {
      console.error("Erreur approbation :", err);
    }
  };

  const handleReject = async (request: PartnerRequest) => {
    try {
      const { error } = await supabase
        .from("partner_requests")
        .update({
          status: "rejected",
          reviewed_at: new Date().toISOString(),
        })
        .eq("request_id", request.request_id);

      await supabase.from("notifications").insert({
        user_id: request.user_id,
        message: `Votre demande pour l'agence "${request.company_name}" a été rejetée`,
        notification_type: "info",
        status: "unread",
      });

      addToast({
        title: "Demande rejetée",
        // description: "Toast Description",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
        color: "danger",
      });

      if (error) throw error;
      fetchRequests();
    } catch (err) {
      console.error("Erreur rejet :", err);
    }
  };

  return (
    <>
      <div className="mx-7">
        <Table
          aria-label="Table des demandes partenaires"
          selectionMode="none"
          className="border rounded-lg shadow-md"
        >
          <TableHeader>
            <TableColumn>Société</TableColumn>
            <TableColumn>Contact</TableColumn>
            <TableColumn>Email</TableColumn>
            <TableColumn>Téléphone</TableColumn>
            <TableColumn>Statut</TableColumn>
            <TableColumn>Action</TableColumn>
          </TableHeader>
          <TableBody emptyContent={"Aucune demande trouvée."} items={requests}>
            {(request) => (
              <TableRow key={request.request_id}>
                <TableCell>{request.company_name}</TableCell>
                <TableCell>{request.contact_full_name}</TableCell>
                <TableCell>{request.contact_email}</TableCell>
                <TableCell>{request.contact_phone || "-"}</TableCell>
                <TableCell className="capitalize font-medium">
                  {request.status}
                </TableCell>
                <TableCell className="flex gap-2">
                  {request.status === "pending" ? (
                    <>
                      <Button
                        size="sm"
                        color="success"
                        onClick={() => handleApprove(request)}
                      >
                        Approuver
                      </Button>
                      <Button
                        size="sm"
                        color="danger"
                        variant="flat"
                        onClick={() => handleReject(request)}
                      >
                        Rejeter
                      </Button>
                    </>
                  ) : (
                    <span className="text-gray-500">✔ Déjà traité</span>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default PageDemandePartenaireDashboard;
