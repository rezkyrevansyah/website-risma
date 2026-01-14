"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Calendar, MessageCircle, Sparkles, Play } from "lucide-react";

interface HeroProps {
  mosqueName?: string;
  tagline?: string;
  backgroundImage?: string;
}

export function Hero({
  mosqueName = "Al Arqam",
  tagline = "Pusat Peradaban & Ukhuwah Islamiyah",
  backgroundImage = "/images/mosque-hero.jpg",
}: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-slate-50 text-slate-900 selection:bg-emerald-200">
      
      {/* 1. Dynamic Background Layer */}
      <div className="absolute inset-0 z-0">
        {/* Light Gradient Base */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-emerald-50" />
        
        {/* Animated Gradient Orbs (Softer) */}
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-emerald-200/40 rounded-full blur-[120px] animate-pulse delay-1000" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-teal-200/40 rounded-full blur-[100px] animate-pulse" />
        
        {/* Noise Texture */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-multiply" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
      </div>

      {/* 2. Content Layer */}
      <div className="relative z-10 w-full container-custom px-4 md:px-6 pt-32 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Supertag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-bold tracking-[0.2em] uppercase animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Est. 1990 • Pusat Dakwah
            </div>

            {/* Typography */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1] sm:leading-[0.9] text-slate-900 mt-4 sm:mt-0">
              MASJID <br/>
              <span className="font-serif italic font-normal text-emerald-600">Jami'</span> {mosqueName}
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-xl leading-relaxed border-l-2 border-emerald-500/30 pl-4 sm:pl-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 fill-mode-forwards">
              Pusat peribadatan dan pengembangan umat. Membangun masyarakat madani yang berlandaskan iman, ilmu, dan amal shaleh.
            </p>

            {/* Action Group */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-forwards">
              <Link href="#agenda">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto rounded-full px-8 py-8 text-lg font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-200 transition-all hover:scale-105"
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Explore Agenda
                </Button>
              </Link>
              
              <Link href="#kontak">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="w-full sm:w-auto rounded-full px-8 py-8 text-lg font-semibold border-slate-200 bg-white hover:bg-slate-50 text-slate-900 hover:text-emerald-700 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-900 flex items-center justify-center mr-3 group-hover:bg-emerald-100">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                  Tentang Kami
                </Button>
              </Link>
            </div>
          </div>

          {/* Visual/Image Area (Right) */}
          <div className="lg:col-span-5 relative hidden lg:block h-[600px]">
             <div className="absolute inset-0 bg-gradient-to-tr from-emerald-100 to-teal-100 rounded-[3rem] rotate-3 blur-3xl opacity-60" />
             
             {/* Main Card Image */}
             <div className="relative h-full w-full rounded-[3rem] overflow-hidden border border-white shadow-2xl bg-white group">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url('/images/mosque-hero.jpg')` }}
                />
                
                {/* Overlay Gradient (Light) */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                
                {/* Floating Stats Content */}
                <div className="absolute bottom-10 left-10 right-10 p-6 bg-white/90 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg">
                   <div className="flex justify-between items-end">
                      <div>
                        <p className="text-emerald-600 text-xs font-bold uppercase tracking-wider mb-1">Next Event</p>
                        <p className="text-slate-900 font-bold text-xl">Kajian Akbar 2026</p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-900">
                        <ArrowRight className="w-5 h-5 -rotate-45" />
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Modern Scroll Indicator */}
      <div className="absolute bottom-10 left-10 md:left-auto md:right-10 flex items-center gap-4 text-slate-400 z-20">
         <span className="text-xs font-mono tracking-widest hidden md:block">SCROLL TO EXPLORE</span>
         <div className="h-px w-20 bg-slate-300"></div>
      </div>
    </section>
  );
}
