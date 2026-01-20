"use client";

import { useCountdown } from "@/hooks/useCountdown";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Star, Sparkles } from "lucide-react"; // Add Sparkles


import { useState, useEffect } from "react";

interface CountdownSectionProps {
    targetDate: string;
    eventName: string;
    description?: string;
}

export function CountdownSection({
    targetDate = "2026-03-20T00:00:00",
    eventName = "Ramadhan 1447 H",
    description = "Mari bersiap menyambut bulan suci penuh berkah."
}: CountdownSectionProps) {
    const { days, hours, minutes, seconds, isExpired } = useCountdown(targetDate);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true); // eslint-disable-line react-hooks/set-state-in-effect
    }, []);

    if (isExpired) return null;

    return (
        <section className="relative py-20 px-4 overflow-hidden -mt-10 mb-10 z-20">
            <div className="container-custom mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center justify-center mb-10 space-y-3"
                >
                    {/* Decorative Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/50 border border-emerald-200 text-emerald-700 text-xs font-bold tracking-[0.2em] uppercase shadow-sm">
                        <Sparkles className="w-3 h-3" />
                        <span>Special Event</span>
                        <Sparkles className="w-3 h-3" />
                    </div>

                    {/* Main Premium Title */}
                    <h2 className="text-3xl md:text-5xl font-bold font-heading tracking-tight text-center relative z-10">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-emerald-800 to-slate-900 drop-shadow-sm">
                            Countdown Hari Besar
                        </span>
                        <br className="md:hidden" />
                        <span className="md:ml-3 text-emerald-600 font-serif italic font-light relative">
                            Selanjutnya
                            {/* Underline decoration */}
                            <svg className="absolute -bottom-2 left-0 w-full h-2 text-emerald-300 opacity-60" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
                            </svg>
                        </span>
                    </h2>
                </motion.div>

                <div className="relative bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 border border-emerald-500/30 rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-hidden ring-1 ring-emerald-400/20">

                    {/* Islamic Geometric Pattern Overlay (Arabesque) */}
                    <div className="absolute inset-0 opacity-[0.07]"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310b981' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                        }}
                    />

                    {/* Decorative Crescent Moon & Star (Floating) */}
                    <div className="absolute top-0 right-0 p-12 pointer-events-none opacity-20">
                        <Moon className="w-64 h-64 text-emerald-200 -translate-y-1/2 translate-x-1/3 rotate-[-15deg]" strokeWidth={0.5} />
                    </div>
                    <div className="absolute bottom-10 left-10 pointer-events-none opacity-30">
                        <Star className="w-12 h-12 text-yellow-400 animate-pulse" fill="currentColor" />
                    </div>

                    <div className="absolute top-10 left-1/4 pointer-events-none opacity-20">
                        <Star className="w-6 h-6 text-emerald-200 animate-pulse [animation-delay:1s]" />
                    </div>

                    {/* Glowing Orbs */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-500/20 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                        {/* Text Content */}
                        <div className="text-center md:text-left space-y-4 max-w-lg">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-emerald-400 font-bold uppercase tracking-[0.2em] text-sm mb-2 flex items-center justify-center md:justify-start gap-2">
                                    <span className="w-8 h-[1px] bg-emerald-400"></span>
                                    Upcoming Event
                                </h2>
                                <h3 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-100 to-emerald-200 leading-tight drop-shadow-sm font-heading">{eventName}</h3>
                                <p className="text-emerald-100/70 text-lg mt-4 leading-relaxed font-light">{description}</p>
                            </motion.div>
                        </div>

                        {/* Timer Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full md:w-auto">
                            {mounted ? (
                                <>
                                    <TimeUnit value={days} label="Hari" delay={0.1} />
                                    <TimeUnit value={hours} label="Jam" delay={0.2} />
                                    <TimeUnit value={minutes} label="Menit" delay={0.3} />
                                    <TimeUnit value={seconds} label="Detik" delay={0.4} />
                                </>
                            ) : (
                                <>
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/5 shadow-inner h-[110px] w-full animate-pulse"></div>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function TimeUnit({ value, label, delay }: { value: number; label: string; delay: number }) {
    const formattedValue = value < 10 ? `0${value}` : value;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay, type: "spring", stiffness: 100 }}
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-emerald-950/40 backdrop-blur-md border border-emerald-500/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] group hover:bg-emerald-900/40 transition-all hover:scale-105 hover:border-emerald-400/40"
        >
            <AnimatePresence mode="popLayout">
                <motion.span
                    key={formattedValue}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-4xl md:text-5xl font-bold text-white tracking-tight font-heading tabular-nums block drop-shadow-[0_2px_10px_rgba(16,185,129,0.5)]"
                >
                    {formattedValue}
                </motion.span>
            </AnimatePresence>
            <span className="text-xs md:text-sm text-emerald-400 font-medium uppercase tracking-widest mt-2 group-hover:text-emerald-300 transition-colors">{label}</span>
        </motion.div>
    );
}
