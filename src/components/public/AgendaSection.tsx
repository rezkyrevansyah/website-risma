"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  ArrowRight, 
  Mic, 
  Trophy, 
  Heart, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { EventItem, EventCategory } from "@/types";
import { dummyEvents } from "@/data";
import { CarouselApi } from "@/components/ui/carousel";

const categoryIcons: Record<EventCategory, React.ReactNode> = {
  kajian: <Mic className="w-6 h-6 text-white" />,
  olahraga: <Trophy className="w-6 h-6 text-white" />,
  sosial: <Heart className="w-6 h-6 text-white" />,
  lainnya: <Calendar className="w-6 h-6 text-white" />,
};

const categoryGradients: Record<EventCategory, string> = {
  kajian: "bg-gradient-to-br from-emerald-400 to-emerald-600",
  olahraga: "bg-gradient-to-br from-blue-400 to-blue-600",
  sosial: "bg-gradient-to-br from-rose-400 to-rose-600",
  lainnya: "bg-gradient-to-br from-amber-400 to-amber-600",
};

function AgendaCard({ event }: { event: EventItem }) {
  const dateObj = new Date(event.date);
  const dayName = dateObj.toLocaleDateString("id-ID", { weekday: "long" });
  const dateStr = dateObj.toLocaleDateString("id-ID", { day: "numeric", month: "long" });

  return (
    <div className="group relative bg-white dark:bg-slate-800 rounded-[2rem] p-8 shadow-sm hover:shadow-xl transition-all duration-300 h-full border border-slate-100 dark:border-slate-700 flex flex-col justify-between">
      
      {/* Top Section: Icon & Category */}
      <div>
        <div className="flex justify-between items-start mb-6">
          <div className={`w-14 h-14 rounded-2xl ${categoryGradients[event.category]} flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
            {categoryIcons[event.category]}
          </div>
          {/* Faint Background Icon Decoration */}
          <div className="opacity-5 scale-150 grayscale">
             {categoryIcons[event.category]}
          </div>
        </div>

        <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
          {event.title}
        </h3>
        
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-4 font-medium">
          <Calendar className="w-4 h-4" />
          <span>{dayName}, {dateStr}</span>
          <span className="w-1 h-1 rounded-full bg-slate-300 mx-1" />
          <Clock className="w-4 h-4" />
          <span>{event.time}</span>
        </div>

        <div 
          className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6 line-clamp-3 prose prose-sm prose-emerald"
          dangerouslySetInnerHTML={{ __html: event.description }}
        />
      </div>

      {/* Button Action */}
      <div className="flex items-center justify-between mt-auto">
         <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-400">
            <MapPin className="w-3 h-3" />
            {event.location}
         </div>
         
         <Link href={`/agenda/${event.id}`}>
           <button aria-label={`Detail event ${event.title}`} className="w-10 h-10 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
             <ArrowRight className="w-5 h-5" />
           </button>
         </Link>
      </div>
    </div>
  );
}

export function AgendaSection({ events = [] }: { events?: EventItem[] }) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!api) {
      return
    }
 
    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)
 
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  return (
    <section id="agenda" className="section-padding bg-slate-50/50 dark:bg-slate-900/50 relative">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 md:mb-12 gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 mb-3">
               <span className="w-8 h-1 bg-primary rounded-full"></span>
               <span className="text-xs font-bold tracking-widest uppercase text-primary">AGENDA MASJID</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
              Kegiatan Terdekat
            </h2>
          </div>
          
          {/* Custom Header Buttons */}
          <div className="flex gap-2 relative z-10 self-end md:self-auto">
             <Button 
               onClick={() => api?.scrollPrev()} 
               variant="outline" 
               size="icon" 
               aria-label="Previous agenda"
               className="h-12 w-12 rounded-full border-slate-200 bg-white hover:bg-slate-50 hover:text-primary transition-all shadow-sm"
             >
               <ChevronLeft className="w-6 h-6" />
             </Button>
             <Button 
               onClick={() => api?.scrollNext()} 
               variant="outline" 
               size="icon" 
               aria-label="Next agenda"
               className="h-12 w-12 rounded-full border-slate-200 bg-white hover:bg-slate-50 hover:text-primary transition-all shadow-sm"
             >
               <ChevronRight className="w-6 h-6" />
             </Button>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative">
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4 pb-4">
              {events.map((event) => (
                <CarouselItem key={event.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="h-full">
                    <AgendaCard event={event} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {/* Native Buttons Removed */}
          </Carousel>
        </div>
        
        {/* Mobile Warning/Action (Optional, maybe remove if Header buttons work well) */}
      </div>
    </section>
  );
}
