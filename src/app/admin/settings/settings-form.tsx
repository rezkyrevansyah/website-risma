"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { SiteSettings, updateSiteSettings } from "@/app/actions/settings";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

const settingsSchema = z.object({
  site_name: z.string().min(2, "Nama website minimal 2 karakter"),
  tagline: z.string().optional(),
  description: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Email tidak valid").optional().or(z.literal("")),
  whatsapp: z.string().optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  youtube: z.string().optional(),
  map_url: z.string().optional(),
});

type SettingsValues = z.infer<typeof settingsSchema>;

interface SettingsFormProps {
  initialData: SiteSettings | null;
}

export function SettingsForm({ initialData }: SettingsFormProps) {
  const router = useRouter();
  
  const form = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      site_name: initialData?.site_name || "Masjid Jami' Al Arqam",
      tagline: initialData?.tagline || "",
      description: initialData?.description || "",
      address: initialData?.address || "",
      phone: initialData?.phone || "",
      email: initialData?.email || "",
      whatsapp: initialData?.whatsapp || "",
      instagram: initialData?.instagram || "",
      facebook: initialData?.facebook || "",
      youtube: initialData?.youtube || "",
      map_url: initialData?.map_url || "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (data: SettingsValues) => {
    try {
      await updateSiteSettings(data);
      toast.success("Pengaturan website berhasil disimpan");
      router.refresh();
    } catch (error) {
      toast.error("Gagal menyimpan pengaturan");
      console.error(error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="general">Umum</TabsTrigger>
          <TabsTrigger value="contact">Kontak & Lokasi</TabsTrigger>
          <TabsTrigger value="social">Sosial Media</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>Identitas Website</CardTitle>
              <CardDescription>Informasi utama yang tampil di halaman depan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site_name">Nama Website / Masjid</Label>
                <Input id="site_name" {...form.register("site_name")} placeholder="Masjid Jami' Al Arqam" />
                {form.formState.errors.site_name && <p className="text-xs text-rose-500">{form.formState.errors.site_name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input id="tagline" {...form.register("tagline")} placeholder="Pusat Peradaban & Ukhuwah Islamiyah" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi Singkat</Label>
                <Textarea id="description" {...form.register("description")} placeholder="Deskripsi singkat tentang masjid..." className="h-24" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>Kontak & Lokasi</CardTitle>
              <CardDescription>Informasi kontak yang dapat dihubungi oleh jamaah.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="phone">Nomor Telepon</Label>
                    <Input id="phone" {...form.register("phone")} placeholder="+62..." />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="whatsapp">Nomor WhatsApp</Label>
                    <Input id="whatsapp" {...form.register("whatsapp")} placeholder="628..." />
                    <p className="text-xs text-slate-500">Gunakan format 628xxx tanpa + atau 0 di depan.</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...form.register("email")} placeholder="contoh@email.com" />
                {form.formState.errors.email && <p className="text-xs text-rose-500">{form.formState.errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Alamat Lengkap</Label>
                <Textarea id="address" {...form.register("address")} placeholder="Jl. ..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="map_url">Link Google Maps (Embed)</Label>
                <Input id="map_url" {...form.register("map_url")} placeholder="https://www.google.com/maps/embed?..." />
                <p className="text-xs text-slate-500">
                    Masukan URL dari fitur &quot;Embed a map&quot; atau &quot;Sematkan peta&quot; di Google Maps.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>Sosial Media</CardTitle>
              <CardDescription>Link ke akun sosial media masjid.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram URL</Label>
                <Input id="instagram" {...form.register("instagram")} placeholder="https://instagram.com/..." />
                <p className="text-xs text-slate-500">Masukkan link lengkap profil Instagram, misal: https://instagram.com/namamasjid</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook URL</Label>
                <Input id="facebook" {...form.register("facebook")} placeholder="https://facebook.com/..." />
                <p className="text-xs text-slate-500">Masukkan link lengkap profil Facebook, misal: https://facebook.com/namamasjid</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="youtube">YouTube URL</Label>
                <Input id="youtube" {...form.register("youtube")} placeholder="https://youtube.com/..." />
                <p className="text-xs text-slate-500">Masukkan link lengkap channel YouTube, misal: https://youtube.com/@namamasjid</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end sticky bottom-4">
        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[150px]" disabled={isSubmitting}>
           {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...</> : "Simpan Perubahan"}
        </Button>
      </div>
    </form>
  );
}
