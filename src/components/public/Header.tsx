"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, Landmark, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { transitions } from "@/lib/motion";

import { navItems } from "@/data";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ ...transitions.layout, damping: 20 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            {/* Logo Icon */}
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
              <Landmark className="w-4 h-4" />
            </div>
            <div className="hidden sm:block">
              <span
                className={cn(
                  "block font-bold text-lg transition-colors leading-none",
                  isScrolled ? "text-emerald-deep" : "text-slate-900"
                )}
              >
                AL ARQAM
              </span>
              <span
                className={cn(
                  "block text-xs transition-colors tracking-widest uppercase",
                  isScrolled ? "text-muted-foreground" : "text-slate-600"
                )}
              >
                Masjid Jami&apos;
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Premium Floating Pill */}
          <nav className="hidden md:flex items-center gap-1" onMouseLeave={() => setHoveredIndex(null)}>
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                onMouseEnter={() => setHoveredIndex(index)}
                className={cn(
                  "relative px-4 py-2 rounded-lg font-medium transition-colors duration-200",
                  isScrolled ? "text-slate-700" : "text-slate-800"
                )}
              >
                {/* Floating Background Pill */}
                <AnimatePresence>
                  {hoveredIndex === index && (
                    <motion.span
                      layoutId="nav-pill"
                      className={cn(
                        "absolute inset-0 rounded-lg -z-10",
                        isScrolled ? "bg-emerald-50 text-emerald-600" : "bg-white/40 backdrop-blur-sm"
                      )}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </AnimatePresence>

                <span className="relative z-10">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* CTA Button + Mobile Menu */}
          <div className="flex items-center gap-3">
            <Button
              asChild
              className="hidden sm:flex bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-lg hover:scale-105 transition-all"
            >
              <Link href="#donasi">
                Donasi
              </Link>
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open mobile menu"
                  suppressHydrationWarning
                  className={cn(
                    isScrolled
                      ? "text-foreground"
                      : "text-slate-900 hover:bg-slate-100"
                  )}
                >
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] border-l border-white/20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-0 flex flex-col h-full">
                {/* Sidebar Header */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                  <SheetTitle className="text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <Landmark className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <span className="font-bold text-xl text-slate-900 dark:text-white tracking-tight">
                          AL ARQAM
                        </span>
                        <span className="block text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                          Masjid Jami&apos;
                        </span>
                      </div>
                    </div>
                  </SheetTitle>
                </div>

                {/* Sidebar Links */}
                <nav className="flex-1 overflow-y-auto py-8 px-6 flex flex-col gap-2">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="group relative flex items-center justify-between px-4 py-4 rounded-xl text-lg font-medium text-slate-600 dark:text-slate-300 transition-all duration-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700 dark:hover:text-emerald-400"
                      >
                        <span className="relative z-10">{item.label}</span>
                        <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 text-emerald-500" />
                      </Link>
                    </motion.div>
                  ))}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * navItems.length }}
                  >
                    <Link
                      href="/auth/login"
                      onClick={() => setIsOpen(false)}
                      className="group relative flex items-center justify-between px-4 py-4 rounded-xl text-lg font-medium text-slate-600 dark:text-slate-300 transition-all duration-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700 dark:hover:text-emerald-400 lg:hidden"
                    >
                      <span className="relative z-10">Admin Login</span>
                      <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 text-emerald-500" />
                    </Link>
                  </motion.div>
                </nav>

                {/* Sidebar Footer */}
                <div className="p-6 bg-slate-50/50 dark:bg-black/20 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    asChild
                    className="w-full h-12 rounded-xl text-md font-bold bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-900/10 transition-all hover:scale-[1.02]"
                  >
                    <Link href="#donasi" onClick={() => setIsOpen(false)}>
                      Donasi Sekarang
                    </Link>
                  </Button>
                  <div className="mt-6 text-center">
                    <p className="text-xs text-slate-400 font-medium">
                      © 2026 Masjid Jami&apos; Al Arqam
                    </p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
