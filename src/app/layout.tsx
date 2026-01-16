import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Masjid Jami' Al Arqam",
  description: "Pusat Peradaban & Ukhuwah Islamiyah",
  authors: [{ name: "Masjid Jami' Al Arqam" }],
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Masjid Jami' Al Arqam",
    title: "Masjid Jami' Al Arqam",
    description: "Pusat Peradaban & Ukhuwah Islamiyah",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${plusJakarta.variable} ${inter.variable} antialiased`}
      >
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
