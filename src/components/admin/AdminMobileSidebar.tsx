"use client";

import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, LogOut, Landmark } from "lucide-react";
import { sidebarItems } from "./AdminSidebar"; // Import shared items
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function AdminMobileSidebar() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden -ml-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50">
                    <Menu className="w-6 h-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[80vw] sm:w-[300px] bg-slate-900 border-r-slate-800 p-0 text-white flex flex-col">
                {/* Accessible Title & Description for Screen Readers */}
                <div className="sr-only">
                    <SheetTitle>Admin Navigation Menu</SheetTitle>
                    <SheetDescription>Navigation links for the admin dashboard.</SheetDescription>
                </div>

                {/* Header */}
                <div className="h-16 flex items-center px-6 border-b border-slate-800 shrink-0">
                    <Landmark className="w-6 h-6 text-emerald-500 mr-3" />
                    <span className="font-bold text-lg tracking-tight">Al Arqam CMS</span>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setOpen(false)} // Close on click
                                className={cn(
                                    "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/20"
                                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                                )}
                            >
                                <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-500")} />
                                {item.title}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-slate-800 shrink-0">
                    <button
                        onClick={() => {
                            import("@/app/actions/auth").then((mod) => mod.logout());
                            setOpen(false);
                        }}
                        className="flex items-center gap-3 px-3 py-3 w-full rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Keluar
                    </button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
