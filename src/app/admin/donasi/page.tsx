"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { getDonationSettings, updateDonationSettings } from "@/app/actions/donations";
import { defaultDonation } from "@/data";
import { Loader2 } from "lucide-react";

const donationSchema = z.object({
  bankName: z.string().min(2, "Nama bank minimal 2 karakter"),
  accountNumber: z.string().min(5, "Nomor rekening minimal 5 karakter"),
  holderName: z.string().min(2, "Atas nama minimal 2 karakter"),
  goalAmount: z.coerce.number().min(0),
  currentAmount: z.coerce.number().min(0),
});

type DonationValues = z.infer<typeof donationSchema>;

export default function DonationAdminPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const donationForm = useForm({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      bankName: "",
      accountNumber: "",
      holderName: "",
      goalAmount: 0,
      currentAmount: 0,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDonationSettings();
        if (data) {
          donationForm.reset(data);
        } else {
          // Fallback to default if no data in DB yet
          donationForm.reset(defaultDonation);
          // Optional: toast.info("Menggunakan data default application");
        }
      } catch (error) {
        console.error(error);
        toast.error("Gagal memuat data donasi");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [donationForm]);

  const onDonationSubmit = async (data: any) => {
    try {
      setSaving(true);
      await updateDonationSettings(data);
      toast.success("Informasi donasi berhasil diperbarui");
    } catch (error) {
      console.error(error);
      toast.error("Gagal menyimpan perubahan");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Manajemen Donasi</h1>
        <p className="text-slate-500 mt-1">Atur informasi rekening dan target donasi masjid.</p>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Rekening & Target</CardTitle>
          <CardDescription>Informasi ini akan ditampilkan pada widget donasi di halaman utama.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={donationForm.handleSubmit(onDonationSubmit)} className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <Label htmlFor="bankName">Nama Bank</Label>
                   <Input id="bankName" placeholder="Contoh: Bank Syariah Indonesia" {...donationForm.register("bankName")} />
                   {donationForm.formState.errors.bankName && <p className="text-xs text-rose-500">{donationForm.formState.errors.bankName.message}</p>}
                </div>
                <div className="space-y-2">
                   <Label htmlFor="accountNumber">Nomor Rekening</Label>
                   <Input id="accountNumber" placeholder="Contoh: 1234567890" {...donationForm.register("accountNumber")} />
                   {donationForm.formState.errors.accountNumber && <p className="text-xs text-rose-500">{donationForm.formState.errors.accountNumber.message}</p>}
                </div>
             </div>
             
             <div className="space-y-2">
                <Label htmlFor="holderName">Atas Nama</Label>
                <Input id="holderName" placeholder="Contoh: DKM Masjid Al Arqam" {...donationForm.register("holderName")} />
                {donationForm.formState.errors.holderName && <p className="text-xs text-rose-500">{donationForm.formState.errors.holderName.message}</p>}
             </div>

             <Separator />

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <Label htmlFor="goalAmount">Target Donasi (Rp)</Label>
                   <Input id="goalAmount" type="number" {...donationForm.register("goalAmount")} />
                   <p className="text-[0.8rem] text-slate-500">Target total dana yang ingin dicapai.</p>
                </div>
                <div className="space-y-2">
                   <Label htmlFor="currentAmount">Terkumpul Saat Ini (Rp)</Label>
                   <Input id="currentAmount" type="number" {...donationForm.register("currentAmount")} />
                   <p className="text-[0.8rem] text-slate-500">Jumlah dana yang sudah masuk, update secara berkala.</p>
                </div>
             </div>

             <div className="flex justify-start pt-4">
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[150px]" disabled={saving}>
                   {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Menyimpan...
                      </>
                   ) : (
                      "Simpan Perubahan"
                   )}
                </Button>
             </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
