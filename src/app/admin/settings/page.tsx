"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const generalSchema = z.object({
  siteTitle: z.string().min(2),
  tagline: z.string().min(5),
});

type GeneralValues = z.infer<typeof generalSchema>;

export default function SettingsAdminPage() {
  const generalForm = useForm({
    resolver: zodResolver(generalSchema),
    defaultValues: {
      siteTitle: "Masjid Jami' Al Arqam",
      tagline: "Pusat Peradaban & Ukhuwah Islamiyah",
    },
  });

  const onGeneralSubmit = (data: any) => {
     console.log("General Settings Updated", data);
     toast.success("Identitas website berhasil disimpan");
  };

  return (
    <div className="space-y-6 w-full max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Pengaturan Website</h1>
        <p className="text-slate-500 mt-1">Kelola identitas utama penampil website.</p>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Identitas Website</CardTitle>
          <CardDescription>Informasi ini akan tampil sebagai judul utama dan tagline di Halaman Depan (Hero Section).</CardDescription>
        </CardHeader>
        <CardContent>
           <form onSubmit={generalForm.handleSubmit(onGeneralSubmit)} className="space-y-6">
              <div className="space-y-2">
                 <Label htmlFor="siteTitle">Nama Masjid / Judul Website</Label>
                 <Input id="siteTitle" placeholder="Contoh: Masjid Jami' Al Arqam" {...generalForm.register("siteTitle")} />
                 {generalForm.formState.errors.siteTitle && <p className="text-xs text-rose-500">{generalForm.formState.errors.siteTitle?.message as string}</p>}
              </div>
              <div className="space-y-2">
                 <Label htmlFor="tagline">Tagline / Slogan</Label>
                 <Input id="tagline" placeholder="Contoh: Pusat Peradaban & Ukhuwah Islamiyah" {...generalForm.register("tagline")} />
                 {generalForm.formState.errors.tagline && <p className="text-xs text-rose-500">{generalForm.formState.errors.tagline?.message as string}</p>}
              </div>
              <div className="flex justify-start pt-2">
                 <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[150px]">Simpan Identitas</Button>
              </div>
           </form>
        </CardContent>
      </Card>
    </div>
  );
}
