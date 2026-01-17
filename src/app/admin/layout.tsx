import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminMobileSidebar } from "@/components/admin/AdminMobileSidebar";
import { AdminProvider } from "@/context/AdminContext";
import { getEvents } from "@/app/actions/events";
import { getArticles } from "@/app/actions/articles";
import { getGalleries } from "@/app/actions/gallery";
import { getProfile } from "@/app/actions/profile";
import { ExternalLink } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [events, articles, galleries, profile] = await Promise.all([
    getEvents(),
    getArticles(),
    getGalleries(),
    getProfile(),
  ]);

  return (
    <AdminProvider
      initialEvents={events}
      initialArticles={articles}
      initialGalleries={galleries}
    >
      <div className="min-h-screen bg-slate-50 relative">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <AdminSidebar />
        </div>

        <div className="pl-0 md:pl-64 transition-[padding] duration-300 ease-in-out">
          {/* Top Header Mobile/Desktop */}
          <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <AdminMobileSidebar />
              <h2 className="font-semibold text-slate-700 truncate">Selamat Datang, {profile?.full_name || "Admin"}</h2>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors border border-emerald-200"
              >
                <ExternalLink className="w-4 h-4" />
                Lihat Website
              </a>
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs uppercase cursor-default ring-2 ring-white shadow-sm">
                {profile?.full_name?.substring(0, 2) || "AD"}
              </div>
            </div>
          </header>

          <main className="p-4 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </AdminProvider>
  );
}
