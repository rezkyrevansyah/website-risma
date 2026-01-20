"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Image as ImageIcon,
  Settings,
  LogOut,
  Landmark,
  PiggyBank,
  UserCircle,
  Timer
} from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer } from "@/lib/motion";

export const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Countdown",
    href: "/admin/countdown",
    icon: Timer,
  },
  {
    title: "Agenda",
    href: "/admin/agenda",
    icon: Calendar,
  },
  {
    title: "Artikel",
    href: "/admin/artikel",
    icon: FileText,
  },
  {
    title: "Galeri",
    href: "/admin/galeri",
    icon: ImageIcon,
  },
  {
    title: "Donasi",
    href: "/admin/donasi",
    icon: PiggyBank,
  },
  {
    title: "Pengaturan",
    href: "/admin/settings",
    icon: Settings,
  },
  {
    title: "Profil Admin",
    href: "/admin/profile",
    icon: UserCircle,
  },
];

const sidebarItemVariant = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 }
};

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-slate-900 min-h-screen text-white flex flex-col fixed left-0 top-0 bottom-0 z-50">
      {/* Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <Landmark className="w-6 h-6 text-emerald-500 mr-3" />
        <span className="font-bold text-lg tracking-tight">Al Arqam CMS</span>
      </div>

      {/* Navigation */}
      <motion.nav
        variants={staggerContainer(0.05)}
        initial="hidden"
        animate="show"
        className="flex-1 py-6 px-3 space-y-1 overflow-y-auto"
      >
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
            >
              <motion.div
                variants={sidebarItemVariant}
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-500")} />
                {item.title}
              </motion.div>
            </Link>
          );
        })}
      </motion.nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-800">
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={() => import("@/app/actions/auth").then((mod) => mod.logout())}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Keluar
        </motion.button>
      </div>
    </div>
  );
}
