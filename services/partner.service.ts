import { createClient } from "@/utils/supabase/client";

type PartnerForm = {
    company_name: string;
    company_registration_number: string;
    company_address: string;
    company_city: string[];
    company_country: string;
    contact_full_name: string;
    contact_position: string;
    contact_email: string;
    contact_phone: string;
    service_type: string;
    service_zones: string;
    accept_terms: boolean;
    accept_marketing: boolean;
    login_password?: string;
};

export async function createPartnerRequest(form: PartnerForm) {
    const supabase = createClient();

    if (!form.accept_terms) {
        throw new Error("Vous devez accepter les conditions générales.");
    }

    const { data: request, error: requestError } = await supabase
        .from("partner_requests")
        .insert([
            {
                company_name: form.company_name,
                company_registration_number: form.company_registration_number,
                company_address: form.company_address,
                company_city: form.company_city.join(", "),
                company_country: form.company_country,
                contact_full_name: form.contact_full_name,
                contact_position: form.contact_position,
                contact_email: form.contact_email,
                contact_phone: form.contact_phone,
                service_type: form.service_type,
                service_zones: form.service_zones,
                accept_terms: form.accept_terms,
                accept_marketing: form.accept_marketing,
                status: "pending",
            },
        ])
        .select()
        .single();

    if (requestError || !request) {
        throw new Error(requestError?.message ?? "Erreur inconnue lors de la soumission.");
    }

    return request;
}