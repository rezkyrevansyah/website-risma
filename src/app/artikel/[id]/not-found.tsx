import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

export default function ArticleNotFound() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center px-4">
        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">📄</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          Artikel Tidak Ditemukan
        </h1>
        <p className="text-slate-500 mb-8 max-w-md mx-auto">
          Maaf, artikel yang Anda cari tidak ditemukan atau sudah dihapus.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/#artikel">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Lihat Semua Artikel
            </Button>
          </Link>
          <Link href="/">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
              <Home className="w-4 h-4" />
              Kembali ke Beranda
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
