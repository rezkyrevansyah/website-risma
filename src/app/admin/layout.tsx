import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminProvider } from "@/context/AdminContext";
import { getEvents } from "@/app/actions/events";
import { getArticles } from "@/app/actions/articles";
import { getGalleries } from "@/app/actions/gallery";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [events, articles, galleries] = await Promise.all([
    getEvents(),
    getArticles(),
    getGalleries(),
  ]);

  return (
    <AdminProvider
      initialEvents={events}
      initialArticles={articles}
      initialGalleries={galleries}
    >
      <div className="min-h-screen bg-slate-50">
        <AdminSidebar />
        <div className="pl-64">
          {/* Top Header Mobile/Desktop */}
          <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">
             <h2 className="font-semibold text-slate-700">Selamat Datang, Admin</h2>
             <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
                   AD
                </div>
             </div>
          </header>
          
          <main className="p-8">
            {children}
          </main>
        </div>
      </div>
    </AdminProvider>
  );
}
