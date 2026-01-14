import { getSiteSettings } from "@/app/actions/settings";
import { SettingsForm } from "./settings-form";

export const dynamic = "force-dynamic";

export default async function SettingsAdminPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6 w-full max-w-6xl pb-20">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Pengaturan Website</h1>
        <p className="text-slate-500 mt-1">Kelola identitas utama, kontak, dan sosial media website.</p>
      </div>
      
      <SettingsForm initialData={settings} />
    </div>
  );
}
