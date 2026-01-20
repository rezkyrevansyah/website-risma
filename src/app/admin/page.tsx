"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { 
  Calendar, 
  FileText, 
  Image as ImageIcon, 
  ArrowUpRight,
  TrendingUp,
  Activity
} from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

export default function AdminDashboardPage() {
  const { events, articles, galleries } = useAdmin();

  // Calculate specific stats
  const totalEvents = events.length;
  const upcomingEvents = events.filter(e => new Date(e.date) > new Date()).length;
  const totalArticles = articles.length;
  const totalGallery = galleries.length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
        <p className="text-slate-500 mt-2">Ringkasan aktivitas website Masjid Jami&apos; Al Arqam.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Agenda Stat */}
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Agenda</CardTitle>
            <Calendar className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{totalEvents}</div>
            <p className="text-xs text-slate-500 mt-1 flex items-center">
               <span className="text-emerald-600 font-bold mr-1">{upcomingEvents}</span> akan datang
            </p>
          </CardContent>
        </Card>

        {/* Article Stat */}
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Artikel Terbit</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{totalArticles}</div>
            <p className="text-xs text-emerald-600 mt-1 flex items-center font-medium">
               <TrendingUp className="w-3 h-3 mr-1" /> +2 minggu ini
            </p>
          </CardContent>
        </Card>

        {/* Gallery Stat */}
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Foto</CardTitle>
            <ImageIcon className="h-4 w-4 text-rose-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{totalGallery}</div>
            <p className="text-xs text-slate-500 mt-1">Dokumentasi kegiatan</p>
          </CardContent>
        </Card>

        {/* Visitors (Mock) */}
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Pengunjung</CardTitle>
            <Activity className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">1,248</div>
            <p className="text-xs text-emerald-600 mt-1 flex items-center font-medium">
               <ArrowUpRight className="w-3 h-3 mr-1" /> +12% bulan ini
            </p>
          </CardContent>
        </Card>

      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <Card className="col-span-1 border-slate-200 shadow-sm">
            <CardHeader>
               <CardTitle>Agenda Terdekat</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                  {events.slice(0, 3).map((event) => (
                     <div key={event.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div>
                           <h4 className="font-semibold text-slate-900">{event.title}</h4>
                           <p className="text-sm text-slate-500">{event.date} • {event.location}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                           event.category === 'kajian' ? 'bg-emerald-100 text-emerald-700' : 
                           event.category === 'olahraga' ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-700'
                        }`}>
                           {event.category}
                        </div>
                     </div>
                  ))}
               </div>
            </CardContent>
         </Card>

         <Card className="col-span-1 border-slate-200 shadow-sm">
            <CardHeader>
               <CardTitle>Artikel Terbaru</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                  {articles.slice(0, 3).map((article) => (
                     <div key={article.id} className="flex gap-4 items-center group cursor-pointer hover:bg-slate-50 p-2 -mx-2 rounded-xl transition-colors">
                        <div className="w-16 h-16 bg-slate-200 rounded-lg overflow-hidden relative shrink-0">
                           {/* Placeholder for image */}
                           {article.imageUrl ? (
                              <Image src={article.imageUrl} alt={article.title} fill className="object-cover" />
                           ) : (
                              <div className="absolute inset-0 bg-slate-300" />
                           )}
                        </div>
                        <div>
                           <h4 className="font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1">{article.title}</h4>
                           <p className="text-sm text-slate-500">{article.date} • {article.author.name}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
