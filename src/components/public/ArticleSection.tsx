"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar, User, BookOpen, Share2, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { ArticleItem } from "@/types";
import { articles } from "@/data";
import { CarouselApi } from "@/components/ui/carousel";

export function ArticleSection() {
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
    <section id="artikel" className="section-padding bg-white relative">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 md:mb-12 gap-6">
          <div className="max-w-xl">
             <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 w-fit">
               <BookOpen className="w-3.5 h-3.5" />
               <span className="text-xs font-bold tracking-widest uppercase">Wawasan & Literasi</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
              Artikel Terbaru
            </h2>
            <p className="text-slate-500 text-lg">
              Baca artikel-artikel islami, ringkasan kajian, dan berita terbaru dari kegiatan Masjid Jami'.
            </p>
          </div>
          
          {/* Custom Header Buttons */}
          <div className="flex gap-2 relative z-10 self-end md:self-auto">
             <Button 
               onClick={() => api?.scrollPrev()} 
               variant="outline" 
               size="icon" 
               aria-label="Previous article"
               className="h-12 w-12 rounded-full border-slate-200 bg-white hover:bg-slate-50 hover:text-emerald-600 transition-all shadow-sm"
             >
               <ChevronLeft className="w-6 h-6" />
             </Button>
             <Button 
               onClick={() => api?.scrollNext()} 
               variant="outline" 
               size="icon" 
               aria-label="Next article"
               className="h-12 w-12 rounded-full border-slate-200 bg-white hover:bg-slate-50 hover:text-emerald-600 transition-all shadow-sm"
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
            <CarouselContent className="-ml-6 pb-8">
              {articles.map((article) => (
                <CarouselItem key={article.id} className="pl-6 md:basis-1/2 lg:basis-1/3">
                  <div className="group relative bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 h-full flex flex-col">
                    
                    {/* Image Top */}
                    <div className="relative h-60 w-full overflow-hidden bg-slate-100">
                      {/* Fallback pattern if image missing */}
                       <div className="absolute inset-0 bg-slate-200 flex items-center justify-center text-slate-400">
                          <Image 
                            src={article.imageUrl} 
                            alt={article.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                       </div>
                       
                       {/* Floating Tag */}
                       <div className="absolute top-4 left-4">
                          <Badge className="bg-white/90 backdrop-blur text-slate-900 border-none shadow-sm hover:bg-white text-xs font-bold px-3 py-1">
                             {article.category}
                          </Badge>
                       </div>
                    </div>
                    
                     {/* Content Body */}
                    <div className="p-8 flex-1 flex flex-col">
                       <div className="flex items-center gap-3 text-xs text-slate-500 font-medium mb-4">
                          <span className="flex items-center gap-1">
                             <Calendar className="w-3.5 h-3.5" />
                             {article.date}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                          <span>{article.readingTime}</span>
                       </div>
                       
                       <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors line-clamp-2">
                          {article.title}
                       </h3>
                       
                       <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">
                          {article.excerpt}
                       </p>
                       
                       {/* Footer Action (Like Agenda: Arrow Btn) */}
                       <div className="mt-auto flex items-center justify-between border-t border-slate-50 pt-6">
                          <div className="flex items-center gap-2">
                             <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 overflow-hidden">
                                {article.author.avatarUrl && (
                                  <Image src={article.author.avatarUrl} alt={article.author.name} width={32} height={32} />
                                )}
                                {!article.author.avatarUrl && <User className="w-4 h-4" />}
                             </div>
                             <span className="text-sm font-semibold text-slate-700">{article.author.name}</span>
                          </div>
                          
                          <Link href={`/artikel/${article.id}`}>
                             <button aria-label={`Baca artikel ${article.title}`} className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-emerald-600 hover:scale-110 transition-all shadow-lg">
                                <ArrowRight className="w-5 h-5" />
                             </button>
                          </Link>
                       </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Navigation Buttons Removed (Native) */}
          </Carousel>
        </div>
      </div>
    </section>
  );
}
