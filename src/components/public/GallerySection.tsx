"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  ArrowRight, 
  Camera, 
  Instagram, 
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
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
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";

import { GalleryItem } from "@/types";

import { CarouselApi } from "@/components/ui/carousel";

export function GallerySection({ initialData }: { initialData?: GalleryItem[] }) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  // Use initialData if available, otherwise fallback to empty (or static)
  const displayItems = initialData || [];

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
    <section id="galeri" className="section-padding bg-slate-50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-100/50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
      
      <div className="container-custom relative">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 md:mb-12 relative z-10 px-4">
          <div className="max-w-2xl">
             <div className="inline-flex items-center gap-2 mb-3 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-100">
               <Camera className="w-4 h-4 text-emerald-600" />
               <span className="text-xs font-bold tracking-widest uppercase text-emerald-700">Dokumentasi</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
              Galeri Kegiatan
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed">
              Momen-momen berharga kebersamaan dan keceriaan dalam setiap agenda Masjid Jami'.
            </p>
          </div>
          
          {/* Custom Header Buttons */}
          <div className="flex gap-2 relative z-10 self-end md:self-auto">
             <Button 
               onClick={() => api?.scrollPrev()} 
               variant="outline" 
               size="icon" 
               aria-label="Previous slide"
               className="h-12 w-12 rounded-full border-slate-200 bg-white hover:bg-emerald-50 hover:text-emerald-600 transition-all shadow-sm"
             >
               <ChevronLeft className="w-6 h-6" />
             </Button>
             <Button 
               onClick={() => api?.scrollNext()} 
               variant="outline" 
               size="icon" 
               aria-label="Next slide"
               className="h-12 w-12 rounded-full border-slate-200 bg-white hover:bg-emerald-50 hover:text-emerald-600 transition-all shadow-sm"
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
            <CarouselContent className="items-center -ml-8 pb-10">
              {displayItems.map((item, index) => {
                 // Dynamic border radius for aesthetic organic feel
                 const shapes = [
                   "rounded-[40px_10px_40px_10px]",
                   "rounded-[10px_40px_10px_40px]",
                   "rounded-[40px]",
                   "rounded-[20px_50px_20px_50px]"
                 ];
                 const shapeClass = shapes[index % shapes.length];
                 
                 return (
                  <CarouselItem key={item.id} className="pl-8 md:basis-1/2 lg:basis-1/3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <div className={`group relative h-[400px] w-full bg-white shadow-lg cursor-pointer overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${shapeClass} border-4 border-white`}>
                          <Image
                            src={item.src}
                            alt={item.alt}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                            <span className="text-emerald-400 font-bold text-sm mb-2 uppercase tracking-wider">{item.category}</span>
                            <h3 className="text-white text-2xl font-bold">{item.alt}</h3>
                          </div>
                          
                          {/* Play Icon Overlay */}
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-50 group-hover:scale-100 border border-white/30">
                             <ImageIcon className="w-8 h-8 text-white" />
                          </div>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl border-none bg-transparent shadow-none p-0 text-white">
                         <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl">
                           <Image 
                              src={item.src} 
                              alt={item.alt} 
                              fill 
                              className="object-contain" // Use object-contain for lightbox full view
                              priority 
                           />
                           <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-6 backdrop-blur-xl">
                              <DialogTitle className="text-2xl font-bold">{item.alt}</DialogTitle>
                              <p className="text-slate-300 mb-2">{item.caption}</p>
                              <Badge variant="outline" className="text-white border-white/20 capitalize">{item.category}</Badge>
                           </div>
                         </div>
                      </DialogContent>
                    </Dialog>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            
            {/* Native Buttons Removed */}
          </Carousel>
        </div>
      </div>
    </section>
  );
}
