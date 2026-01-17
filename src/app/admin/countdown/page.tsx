"use client";

import { useCountdownAdmin } from "@/hooks/useCountdownAdmin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, Timer, Save } from "lucide-react";
import { toast } from "sonner";
import { useActionState, useEffect } from "react";

const initialState = {
    message: "",
    success: false,
};

export default function CountdownAdminPage() {
    const { settings, loading, updateCountdownSettings, refresh } = useCountdownAdmin();
    const [state, formAction, isPending] = useActionState(updateCountdownSettings, initialState);

    // Show toast on server action result
    useEffect(() => {
        if (state?.message) {
            if (state.success) {
                toast.success(state.message);
                refresh();
            } else {
                toast.error(state.message);
            }
        }
    }, [state, refresh]);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
        );
    }

    // Format date for datetime-local input (YYYY-MM-DDTHH:mm)
    const defaultDate = settings?.target_date
        ? new Date(settings.target_date).toISOString().slice(0, 16)
        : "";

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <Timer className="w-8 h-8 text-emerald-600" />
                    Pengaturan Countdown
                </h1>
                <p className="text-slate-500 mt-1">Kelola hitung mundur untuk event besar berikutnya.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 md:p-8">
                {/* Key ensures form re-mounts when data changes, updating defaultValues */}
                <form key={settings?.updated_at} action={formAction} className="space-y-6">
                    {/* Status Toggle */}
                    <div className="flex items-center justify-between bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <div className="space-y-0.5">
                            <Label htmlFor="is_active" className="text-base font-semibold text-slate-900">Status Aktif</Label>
                            <p className="text-sm text-slate-500">Jika dimatikan, section countdown tidak akan muncul di halaman depan.</p>
                        </div>
                        <Switch
                            id="is_active"
                            name="is_active"
                            defaultChecked={settings?.is_active}
                        />
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Event Title */}
                        <div className="space-y-2">
                            <Label htmlFor="title">Judul Event</Label>
                            <Input
                                id="title"
                                name="title"
                                placeholder="Contoh: Menuju Idul Fitri 1447 H"
                                defaultValue={settings?.title}
                                required
                            />
                        </div>

                        {/* Target Date */}
                        <div className="space-y-2">
                            <Label htmlFor="target_date">Tanggal & Waktu Target</Label>
                            <Input
                                type="datetime-local"
                                id="target_date"
                                name="target_date"
                                defaultValue={defaultDate}
                                required
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Deskripsi Singkat</Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Contoh: Mari bersiap menyambut hari kemenangan..."
                            className="min-h-[100px]"
                            defaultValue={settings?.description}
                        />
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex justify-end">
                        <Button type="submit" disabled={isPending} className="bg-emerald-600 hover:bg-emerald-700 w-full md:w-auto">
                            {isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Simpan Perubahan
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
