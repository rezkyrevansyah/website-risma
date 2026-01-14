import Link from "next/link";
import { Landmark, MapPin, Phone, Mail, Instagram, Facebook, Youtube, ArrowRight } from "lucide-react";
import { getSiteSettings } from "@/app/actions/settings";

export async function Footer() {
  const settings = await getSiteSettings();
  const currentYear = new Date().getFullYear();

  const ensureAbsoluteUrl = (url: string | undefined) => {
    if (!url) return undefined;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `https://${url}`;
  };

  const navLinks = [
    { label: "Beranda", href: "/" },
    { label: "Agenda", href: "/agenda" },
    { label: "Artikel", href: "/artikel" },
    { label: "Galeri", href: "/galeri" },
    { label: "Tentang Kami", href: "/tentang" },
  ];

  const socialLinks = [
    { href: ensureAbsoluteUrl(settings?.instagram), icon: Instagram, label: "Instagram" },
    { href: ensureAbsoluteUrl(settings?.facebook), icon: Facebook, label: "Facebook" },
    { href: ensureAbsoluteUrl(settings?.youtube), icon: Youtube, label: "YouTube" },
  ].filter(link => link.href);

  return (
    <footer className="bg-slate-900 text-white">
      {/* Main Footer */}
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                <Landmark className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <span className="block font-bold text-xl tracking-tight text-white">
                  {settings?.site_name || "AL ARQAM"}
                </span>
                <span className="text-sm text-slate-400">{settings?.tagline || "Masjid Jami'"}</span>
              </div>
            </Link>
            <p className="text-slate-400 leading-relaxed mb-6">
              {settings?.description || "Membangun generasi muda yang islami, bermanfaat bagi masyarakat, dan menjadi teladan di lingkungan sekitar."}
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-slate-800 hover:bg-gradient-emerald flex items-center justify-center transition-all duration-300"
                  aria-label={link.label}
                >
                  <link.icon className="w-5 h-5" />
                </a>
              ))}
              {settings?.whatsapp && (
                <a
                  href={`https://wa.me/${settings.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-slate-800 hover:bg-green-600 flex items-center justify-center transition-all duration-300"
                  aria-label="WhatsApp"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.863-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Navigation Column */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Navigasi</h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-emerald-light transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">
              Kontak Kami
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-light mt-0.5 flex-shrink-0" />
                <span className="text-slate-400">{settings?.address || "Jl. Contoh No. 123, Kota, Indonesia"}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-emerald-light flex-shrink-0" />
                <a
                  href={`tel:${settings?.phone || "+62 812-xxxx-xxxx"}`}
                  className="text-slate-400 hover:text-emerald-light transition-colors"
                >
                  {settings?.phone || "+62 812-xxxx-xxxx"}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-emerald-light flex-shrink-0" />
                <a
                  href={`mailto:${settings?.email || "contact@example.com"}`}
                  className="text-slate-400 hover:text-emerald-light transition-colors"
                >
                  {settings?.email || "contact@example.com"}
                </a>
              </li>
            </ul>
          </div>

          {/* Map Column */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Lokasi</h4>
            
             {settings?.map_url ? (
                  <a 
                    href={settings.map_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block relative w-full h-40 rounded-xl overflow-hidden border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-300 shadow-sm hover:shadow-md bg-slate-800"
                  >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-slate-800 opacity-100 group-hover:scale-105 transition-transform duration-700">
                       {/* Abstract Map-like Pattern */}
                       <div className="absolute inset-0 opacity-10" style={{ 
                          backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)",
                          backgroundSize: "20px 20px" 
                       }}></div>
                       <div className="absolute inset-0 flex items-center justify-center opacity-20">
                          <MapPin className="w-24 h-24 text-slate-400 transform -rotate-12" />
                       </div>
                    </div>
                    
                    {/* Overlay Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-gradient-to-t from-slate-900/80 to-slate-900/20 group-hover:from-slate-900/60 transition-all">
                      <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform mb-3 border border-emerald-400/20">
                          <MapPin className="w-5 h-5 fill-current" />
                      </div>
                      <span className="text-xs font-medium text-white/90 bg-slate-900/80 px-3 py-1.5 rounded-full backdrop-blur-sm border border-slate-700 group-hover:border-emerald-500/50 transition-colors flex items-center gap-1.5">
                         Buka di Google Maps
                         <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </a>
             ) : (
                <div className="w-full h-40 rounded-xl bg-slate-800/50 border border-slate-800 flex flex-col items-center justify-center text-slate-500 gap-2">
                   <MapPin className="w-8 h-8 opacity-20" />
                   <p className="text-sm">Lokasi belum diatur</p>
                </div>
             )}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800 mt-12 pt-4 pb-4 text-center text-slate-500 text-sm">
          <p>© {currentYear} {settings?.site_name || "Masjid Jami' Al Arqam"}. All rights reserved.</p>
      </div>
    </footer>
  );
}
