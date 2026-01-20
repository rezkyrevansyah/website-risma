"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type CountdownSettings = {
    id: number;
    title: string;
    target_date: string;
    description: string;
    is_active: boolean;
    updated_at: string;
};

export async function getCountdownSettings(): Promise<CountdownSettings | null> {
    const supabase = await createClient();

    // Always fetch the first row, as we only support one global countdown
    const { data, error } = await supabase
        .from("countdown_settings")
        .select("*")
        .limit(1)
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            // No rows found
            return null;
        }
        console.error("Error fetching countdown settings:", error);
        return null;
    }

    return data as CountdownSettings;
}

export async function updateCountdownSettings(prevState: unknown, formData: FormData) {
    const supabase = await createClient();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const target_date = formData.get("target_date") as string;
    const is_active = formData.get("is_active") === "on";

    // Check if a row exists
    const existing = await getCountdownSettings();

    let error;

    if (existing) {
        // Update existing
        const { error: updateError } = await supabase
            .from("countdown_settings")
            .update({
                title,
                description,
                target_date,
                is_active,
                updated_at: new Date().toISOString(),
            })
            .eq("id", existing.id);
        error = updateError;
    } else {
        // Create new if not exists
        const { error: insertError } = await supabase
            .from("countdown_settings")
            .insert({
                title,
                description,
                target_date,
                is_active,
            });
        error = insertError;
    }

    if (error) {
        console.error("Error updating countdown:", error);
        return { message: "Gagal menyimpan pengaturan countdown." };
    }

    revalidatePath("/");
    revalidatePath("/admin/countdown");

    return { message: "Pengaturan countdown berhasil disimpan!", success: true };
}
