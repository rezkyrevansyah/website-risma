"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { getCountdownSettings, updateCountdownSettings, type CountdownSettings } from "@/app/actions/countdown";


export function useCountdownAdmin() {
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState<CountdownSettings | null>(null);

    // Initial Data Fetch
    const fetchSettings = useCallback(async () => {
        try {
            const data = await getCountdownSettings();
            setSettings(data);
        } catch {
            toast.error("Gagal mengambil data countdown.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    return {
        settings,
        loading,
        refresh: fetchSettings,
        updateCountdownSettings, // Export server action directly for useFormState
    };
}
