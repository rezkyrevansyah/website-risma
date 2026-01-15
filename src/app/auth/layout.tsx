import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Left Side - Visual & Branding */}
      <div className="relative hidden lg:flex flex-col justify-between p-10 bg-primary/5 dark:bg-primary/10 border-r border-border overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute inset-0 pattern-islamic opacity-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 font-bold text-2xl font-heading text-primary">
            Website Risma
          </Link>
        </div>

        <div className="relative z-10 max-w-lg">
          <h1 className="text-4xl font-bold font-heading mb-4 text-gradient-emerald">
            Selamat Datang di Dashboard Admin
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Kelola konten website, artikel, agenda, dan galeri masjid dengan mudah dan efisien.
            Desain modern untuk pengalaman pengelola yang lebih baik.
          </p>
        </div>
        
        <div className="relative z-10 text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Website Risma. All rights reserved.
        </div>
      </div>

      {/* Right Side - Form Container */}
      <div className="flex items-center justify-center p-6 sm:p-10 relative">
        <div className="absolute top-10 right-10 block lg:hidden">
             <Link href="/" className="flex items-center gap-2 font-bold text-xl font-heading text-primary">
            Website Risma
          </Link>
        </div>
        <div className="w-full max-w-md space-y-8">
            {children}
        </div>
      </div>
    </div>
  );
}
