"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, Share2, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useParams, notFound } from "next/navigation";
import { articles } from "@/data";
import { toast } from "sonner"; // Assuming sonner is installed/used

export default function ArticleDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const article = articles.find((a) => a.id === id);
  
  if (!article) {
    notFound();
  }

  const relatedArticles = articles
    .filter((a) => a.category === article.category && a.id !== article.id)
    .slice(0, 2);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link berhasil disalin!");
    }
  };

  return (
    <main className="min-h-screen bg-white text-slate-900 pb-20">
      
      {/* 1. Minimal Header */}
      <header className="pt-28 pb-12 bg-white">
        <div className="container-custom px-4 md:px-6 max-w-4xl mx-auto text-center">
            <Link href="/#artikel">
              <Badge variant="outline" className="mb-6 hover:bg-slate-50 cursor-pointer border-slate-200 text-slate-500 font-medium px-4 py-1.5 uppercase tracking-widest text-[10px]">
                Kembali ke Artikel
              </Badge>
            </Link>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-slate-900 mb-6 leading-tight">
              {article.title}
            </h1>

            <p className="text-xl md:text-2xl text-slate-500 leading-relaxed font-light mb-8 max-w-2xl mx-auto">
              {article.excerpt}
            </p>

            {/* Author Meta */}
            <div className="flex items-center justify-center gap-4">
               <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden relative border border-slate-100">
                  {article.author.avatarUrl ? (
                    <Image src={article.author.avatarUrl} alt={article.author.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-lg">
                      {article.author.name.charAt(0)}
                    </div>
                  )}
               </div>
               <div className="text-left">
                  <p className="font-bold text-slate-900 text-sm">{article.author.name}</p>
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-medium uppercase tracking-wider">
                     <span>{article.date}</span>
                     <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                     <span>{article.readingTime}</span>
                  </div>
               </div>
            </div>
        </div>
      </header>

      {/* 2. Featured Image (Cinematic) */}
      <div className="w-full h-[400px] md:h-[600px] relative mb-16 px-4 md:px-8 max-w-[1400px] mx-auto">
         <div className="relative w-full h-full rounded-2xl md:rounded-[3rem] overflow-hidden shadow-2xl">
            <Image 
              src={article.imageUrl} 
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
         </div>
      </div>

      {/* 3. Main Content Room */}
      <div className="container-custom px-4 md:px-6 max-w-3xl mx-auto">
        <article className="prose prose-lg prose-slate md:prose-xl prose-headings:font-serif prose-headings:font-bold prose-img:rounded-3xl prose-a:text-emerald-600 bg-white">
            {article.content ? (
               <div dangerouslySetInnerHTML={{ __html: article.content }} />
            ) : (
               <div dangerouslySetInnerHTML={{ __html: `<p>${article.excerpt}</p>` }} />
            )}
        </article>

        {/* Share Action */}
        <div className="border-t border-slate-100 mt-16 pt-10 text-center">
            <p className="text-slate-500 text-sm font-semibold uppercase tracking-widest mb-4">Bagikan Tulisan Ini</p>
            <div className="flex justify-center gap-2">
               <Button onClick={handleShare} variant="outline" size="lg" className="rounded-full h-12 px-8 border-slate-200 hover:bg-slate-900 hover:text-white transition-all">
                  <Share2 className="w-4 h-4 mr-2" /> Share Article
               </Button>
            </div>
        </div>
      </div>

      {/* 4. More Stories */}
      {relatedArticles.length > 0 && (
        <section className="mt-32 pt-16 border-t border-slate-100">
          <div className="container-custom px-4 md:px-6">
            <div className="flex justify-between items-end mb-12">
               <h2 className="text-3xl font-bold font-serif text-slate-900">Bacaan Lainnya</h2>
               <Link href="/#artikel" className="hidden md:flex items-center text-emerald-600 font-bold hover:underline">
                  Lihat Semua <ArrowRight className="w-4 h-4 ml-1" />
               </Link>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {relatedArticles.map((related) => (
                <Link key={related.id} href={`/artikel/${related.id}`} className="group block">
                  <div className="bg-slate-50 rounded-3xl p-2 transition-colors hover:bg-emerald-50/50">
                     <div className="relative h-64 w-full rounded-2xl overflow-hidden mb-6">
                        <Image src={related.imageUrl} alt={related.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                     </div>
                     <div className="px-4 pb-4">
                        <Badge variant="outline" className="mb-3 border-slate-200 bg-white">{related.category}</Badge>
                        <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors leading-tight">
                           {related.title}
                        </h3>
                        <p className="text-slate-500 line-clamp-2">{related.excerpt}</p>
                     </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
