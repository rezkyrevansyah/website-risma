import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEventById } from "@/app/actions/events";
import { ShareButton } from "@/components/public/ShareButton"; 
import { sanitizeHtml } from "@/lib/sanitize"; 

interface AgendaDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AgendaDetailPage(props: AgendaDetailPageProps) {
  const params = await props.params;
  const { id } = params;

  let event;
  try {
    event = await getEventById(id);
  } catch (error) {
    console.error("Error fetching event:", error);
    return (
        <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Terjadi kesalahan server</h1>
                <p>Gagal memuat data agenda. Silakan coba lagi nanti.</p>
                <Link href="/#agenda" className="text-emerald-600 hover:underline mt-4 block">Kembali ke Agenda</Link>
            </div>
        </div>
    );
  }

  if (!event) {
    notFound();
  }

  let dayName = "";
  let dateStr = "";
  let isFinished = false;

  try {
    const dateObj = new Date(event.date);
    if (isNaN(dateObj.getTime())) {
      console.error("Invalid date format for event:", event.id, event.date);
      dayName = "Tanggal Invalid";
      dateStr = event.date;
    } else {
      dayName = dateObj.toLocaleDateString("id-ID", { weekday: "long" });
      dateStr = dateObj.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
      
      const eventDate = new Date(event.date);
      eventDate.setHours(0,0,0,0);
      const today = new Date();
      today.setHours(0,0,0,0);
      isFinished = eventDate < today;
    }
  } catch (error) {
    console.error("Error processing event data:", error);
    return (
        <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Terjadi kesalahan</h1>
                <p>Gagal menampilkan detail agenda.</p>
                <Link href="/#agenda" className="text-emerald-600 hover:underline mt-4 block">Kembali ke Agenda</Link>
            </div>
        </div>
    )
  }

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
               <div className="flex flex-wrap items-center gap-3">
                 <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-full px-4 py-1 text-xs tracking-wider uppercase font-bold border-none">
                    {event.category}
                 </Badge>
                 <Badge 
                    variant={isFinished ? "secondary" : "default"}
                    className={`${
                      isFinished 
                        ? "bg-slate-100 text-slate-500 hover:bg-slate-200" 
                        : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-emerald-100"
                      } border border-transparent shadow-none px-3 py-1 text-xs font-bold uppercase tracking-wider`}
                 >
                    {isFinished ? "Sudah Selesai" : "Akan Datang"}
                 </Badge>
               </div>
               <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                  {event.title}
               </h1>
            </div>

            {/* Content Body */}
            <div className="prose prose-lg prose-slate max-w-none text-slate-600 leading-relaxed">
               <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(event.description) }} />
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
