import { getProfile } from "@/app/actions/profile";
import { UserCircle, Mail, Hash } from "lucide-react";

export default async function AdminProfilePage() {
  const profile = await getProfile();

  if (!profile) return <div>Profil tidak ditemukan</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-heading text-slate-900">Profil Admin</h1>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="h-32 bg-emerald-600 relative">
             <div className="absolute -bottom-12 left-8">
                <div className="w-24 h-24 rounded-full bg-white p-1">
                    <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <UserCircle className="w-12 h-12" />
                    </div>
                </div>
             </div>
        </div>
        
        <div className="pt-16 pb-8 px-8">
            <h2 className="text-2xl font-bold text-slate-900">{profile.full_name}</h2>
            <p className="text-slate-500 font-medium">@{profile.username}</p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-3 mb-2 text-slate-500 text-sm font-medium">
                        <Mail className="w-4 h-4" />
                        Email Address
                    </div>
                    <p className="text-slate-900 font-medium">{profile.email}</p>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-3 mb-2 text-slate-500 text-sm font-medium">
                        <Hash className="w-4 h-4" />
                        Admin ID
                    </div>
                    <p className="text-slate-900 font-mono text-sm">{profile.id}</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
