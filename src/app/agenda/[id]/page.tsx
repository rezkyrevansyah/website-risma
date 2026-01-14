import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, MapPin, User } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEventById } from "@/app/actions/events";
import { ShareButton } from "@/components/public/ShareButton"; 
// I will need to create ShareButton or inline the client logic in a separate file. 
// For now, I'll create a new component file for the interactive parts or just use a simple button.
// Actually, I can put the share button in a separate file.

interface AgendaDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AgendaDetailPage(props: AgendaDetailPageProps) {
  const params = await props.params;
  const { id } = params;
  const event = await getEventById(id);

  if (!event) {
    notFound();
  }

  const dateObj = new Date(event.date);
  const dayName = dateObj.toLocaleDateString("id-ID", { weekday: "long" });
  const dateStr = dateObj.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

  return (
    <main className="min-h-screen bg-white text-slate-900 pt-24 pb-20">
      <div className="container-custom px-4 md:px-6">
        
        {/* Navigation */}
        <Link href="/#agenda" className="inline-flex items-center text-slate-500 hover:text-emerald-600 transition-colors mb-8 group font-medium">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Kembali ke Agenda
        </Link>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* LEFT COLUMN: Main Content */}
          <div className="lg:col-span-7 space-y-8">
            {/* Header Content */}
            <div className="space-y-4">
               <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-full px-4 py-1 text-xs tracking-wider uppercase font-bold border-none">
                  {event.category}
               </Badge>
               <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                  {event.title}
               </h1>
            </div>

            {/* Content Body */}
            <div className="prose prose-lg prose-slate max-w-none text-slate-600 leading-relaxed">
               <div dangerouslySetInnerHTML={{ __html: event.description }} />
            </div>
          </div>

          {/* RIGHT COLUMN: Sticky Info Card */}
          <div className="lg:col-span-5">
             <div className="sticky top-32">
                <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-8 shadow-xl shadow-slate-200/50">
                   <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                      <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
                      Detail Pelaksanaan
                   </h3>

                   <div className="space-y-6">
                      {/* Date */}
                      <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-emerald-200 transition-colors group">
                         <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Calendar className="w-6 h-6" />
                         </div>
                         <div>
                            <p className="text-sm text-slate-500 font-semibold uppercase tracking-wider">Tanggal</p>
                            <p className="text-lg font-bold text-slate-900">{dayName}</p>
                            <p className="text-slate-600">{dateStr}</p>
                         </div>
                      </div>

                      {/* Time */}
                      <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-emerald-200 transition-colors group">
                         <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Clock className="w-6 h-6" />
                         </div>
                         <div>
                            <p className="text-sm text-slate-500 font-semibold uppercase tracking-wider">Waktu</p>
                            <p className="text-lg font-bold text-slate-900">{event.time}</p>
                            <p className="text-slate-600">Hingga Selesai</p>
                         </div>
                      </div>

                      {/* Location */}
                      <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-emerald-200 transition-colors group">
                         <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <MapPin className="w-6 h-6" />
                         </div>
                         <div>
                            <p className="text-sm text-slate-500 font-semibold uppercase tracking-wider">Lokasi</p>
                            <p className="text-lg font-bold text-slate-900">{event.location}</p>
                            <a href="#" className="text-sm text-emerald-600 hover:underline font-medium">Buka di Google Maps</a>
                         </div>
                      </div>
                   </div>

                   <hr className="border-slate-200 my-8" />

                   <div className="grid grid-cols-1 gap-3">
                      <ShareButton title={event.title} description={event.description} />
                   </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </main>
  );
}
