"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export function useAgency() {
    const supabase = createClient();

    const [agencyId, setAgencyId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAgency = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                setAgencyId(null);
                setLoading(false);
                return;
            }

            const { data } = await supabase
                .from("agencies")
                .select("id")
                .eq("owner_id", user.id)
                .maybeSingle();

            setAgencyId(data?.id ?? null);
            setLoading(false);
        };

        fetchAgency();
    }, []);

    return { agencyId, loading };
}