"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, Search, Image as ImageIcon, CalendarIcon, Loader2 } from "lucide-react";
import { ArticleItem } from "@/types";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { getArticles, createArticle, updateArticle, deleteArticle } from "@/app/actions/articles";

// Schema Validation
const formSchema = z.object({
  title: z.string().min(5, "Judul minimal 5 karakter"),
  excerpt: z.string().min(10, "Ringkasan minimal 10 karakter"),
  category: z.string().min(1, "Kategori wajib diisi"),
  date: z.string().min(1, "Tanggal wajib diisi"),
  readingTime: z.string().min(1, "Waktu baca wajib diisi"),
  imageUrl: z.string().optional(), // Made optional for edit case where we keep existing
  authorName: z.string().min(1, "Nama penulis wajib diisi"),
  authorRole: z.string().min(1, "Peran penulis wajib diisi"),
  content: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function ArticleAdminPage() {
  const [dataList, setDataList] = useState<ArticleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  // Delete State
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Load Data
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const data = await getArticles();
      setDataList(data);
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat data artikel");
    } finally {
      setIsLoading(false);
    }
  }

  // Filter
  const filteredData = dataList.filter((item) => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.author.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Form handling
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      excerpt: "",
      category: "",
      date: "",
      readingTime: "5 menit baca",
      imageUrl: "",
      authorName: "",
      authorRole: "Kontributor",
      content: "",
    },
  });

  // Handle File Selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      form.setValue("imageUrl", url); // Trigger validation pass
    }
  };

  const uploadImage = async (file: File) => {
    const supabase = createClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `article-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('images') // Reusing images bucket
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage.from('images').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      let finalImageUrl = data.imageUrl || "";

      // 1. Upload Image (if new file selected)
      if (selectedFile) {
        finalImageUrl = await uploadImage(selectedFile);
      }

      const dateObj = new Date(data.date);
      const formattedDate = dateObj.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

      const payload = {
        title: data.title,
        excerpt: data.excerpt,
        content: data.content || "",
        category: data.category,
        date: formattedDate,
        readingTime: data.readingTime,
        imageUrl: finalImageUrl,
        author: {
          name: data.authorName,
          role: data.authorRole,
          avatarUrl: "" 
        }
      };

      if (editingId) {
        await updateArticle({ ...payload, id: editingId } as ArticleItem);
        toast.success("Artikel berhasil diperbarui");
      } else {
        if (!finalImageUrl) throw new Error("Gambar wajib diupload untuk artikel baru");
        await createArticle(payload);
        toast.success("Artikel baru berhasil ditambahkan");
      }
      
      setIsDialogOpen(false);
      resetForm();
      await loadData();

    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      console.error(error);
      toast.error(error.message || "Terjadi kesalahan saat menyimpan");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setSelectedFile(null);
    setPreviewUrl("");
    form.reset({
      title: "",
      excerpt: "",
      category: "",
      date: "",
      readingTime: "5 menit baca",
      imageUrl: "",
      authorName: "",
      authorRole: "Kontributor",
      content: "",
    });
  };

  const handleEdit = (item: ArticleItem) => {
    setEditingId(item.id);
    
    setPreviewUrl(item.imageUrl);
    setSelectedFile(null);

    // Date handling: current item.date is formatted string "12 Okt 2023"
    // HTML date input needs "YYYY-MM-DD".
    // We'd ideally parse it or store raw date DB side. 
    // For now, let's leave date empty as "re-enter required" if we can't parse easily without library
    // Or try basic parsing if format is consistent 'D MMM YYYY' in ID locale... 
    // Let's just reset date field to empty for now to be safe.
    
    form.reset({
      title: item.title,
      excerpt: item.excerpt,
      category: item.category,
      date: "", 
      readingTime: item.readingTime,
      imageUrl: item.imageUrl,
      authorName: item.author.name,
      authorRole: item.author.role,
      content: item.content || "",
    });
    setIsDialogOpen(true);
  };

  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setIsDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await deleteArticle(deleteId);
        toast.success("Artikel berhasil dihapus");
        await loadData();
      } catch {
        toast.error("Gagal menghapus artikel");
      } finally {
        setIsDeleteOpen(false);
        setDeleteId(null);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Manajemen Artikel</h1>
          <p className="text-slate-500 mt-1">Publikasi dan kelola konten artikel.</p>
        </div>
        <Button onClick={() => { resetForm(); setIsDialogOpen(true); }} className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Tulis Artikel
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4 max-w-sm">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Cari judul atau penulis..." 
            className="pl-9 bg-white border-slate-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50 border-b border-slate-200">
            <TableRow>
              <TableHead className="w-[80px] font-semibold text-slate-900">Cover</TableHead>
              <TableHead className="w-[300px] font-semibold text-slate-900">Judul & Ringkasan</TableHead>
              <TableHead className="font-semibold text-slate-900">Penulis</TableHead>
              <TableHead className="font-semibold text-slate-900">Kategori</TableHead>
              <TableHead className="text-right font-semibold text-slate-900">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
               <TableRow>
                 <TableCell colSpan={5} className="h-32 text-center">
                    <div className="flex justify-center items-center h-full">
                      <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                    </div>
                 </TableCell>
               </TableRow>
            ) : filteredData.length === 0 ? (
               <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                     <p>Tidak ada artikel ditemukan.</p>
                  </TableCell>
               </TableRow>
            ) : (
                filteredData.map((item) => (
                  <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-none">
                    <TableCell className="align-top py-4">
                      <div className="w-14 h-14 bg-slate-100 rounded-lg overflow-hidden relative border border-slate-200">
                        {item.imageUrl ? (
                           <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                        ) : (
                           <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                              <ImageIcon className="w-6 h-6" />
                           </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium align-top py-4">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-slate-900 font-semibold line-clamp-1 text-base">{item.title}</span>
                        <span className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{item.excerpt}</span>
                      </div>
                    </TableCell>
                    <TableCell className="align-top py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                           {item.author.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                           <span className="text-sm font-medium text-slate-900">{item.author.name}</span>
                           <span className="text-xs text-slate-500 flex items-center mt-0.5">
                              <CalendarIcon className="w-3 h-3 mr-1" />
                              {item.date}
                           </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="align-top py-4">
                      <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-none font-medium">{item.category}</Badge>
                    </TableCell>
                    <TableCell className="text-right align-top py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(item)} className="h-8 w-8 p-0 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full">
                          <Pencil className="w-4 h-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => confirmDelete(item.id)} className="h-8 w-8 p-0 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-full">
                          <Trash2 className="w-4 h-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog Form */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Artikel" : "Tulis Artikel Baru"}</DialogTitle>
            <DialogDescription>
              Lengkapi formulir di bawah ini untuk mempublikasikan artikel.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            
            {/* Image Upload Area */}
            <div className="flex flex-col gap-2">
               <Label className="text-sm font-semibold text-slate-700">Cover Artikel <span className="text-rose-500">*</span></Label>
               <div className="flex items-start gap-4">
                  <div className="w-32 h-20 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden relative group">
                     {previewUrl ? (
                        <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                     ) : (
                        <ImageIcon className="w-8 h-8 text-slate-400" />
                     )}
                  </div>
                  <div className="flex-1">
                     <Input 
                        id="imageUpload" 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileSelect}
                        className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 mb-2" 
                     />
                     <p className="text-xs text-slate-500">Format: JPG, PNG, GIF. Maks 2MB.</p>
                     {form.formState.errors.imageUrl && <p className="text-xs text-rose-500 mt-1">{form.formState.errors.imageUrl.message}</p>}
                  </div>
               </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-semibold text-slate-700">Judul Artikel <span className="text-rose-500">*</span></Label>
              <Input id="title" {...form.register("title")} placeholder="Judul yang menarik..." className="h-10 text-lg font-medium" />
              {form.formState.errors.title && <p className="text-xs text-rose-500">{form.formState.errors.title.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-semibold text-slate-700">Kategori <span className="text-rose-500">*</span></Label>
                  <Select 
                    onValueChange={(val) => form.setValue("category", val)} 
                    defaultValue={form.getValues("category")}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dakwah">Dakwah</SelectItem>
                      <SelectItem value="Berita">Berita</SelectItem>
                      <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                      <SelectItem value="Opini">Opini</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.category && <p className="text-xs text-rose-500">{form.formState.errors.category.message}</p>}
               </div>
               <div className="space-y-2">
                  <Label htmlFor="date" className="text-sm font-semibold text-slate-700">Tanggal Publikasi <span className="text-rose-500">*</span></Label>
                  <Input id="date" type="date" {...form.register("date")} className="h-10" />
                  {form.formState.errors.date && <p className="text-xs text-rose-500">{form.formState.errors.date.message}</p>}
               </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt" className="text-sm font-semibold text-slate-700">Ringkasan (Excerpt) <span className="text-rose-500">*</span></Label>
              <Textarea id="excerpt" {...form.register("excerpt")} rows={2} placeholder="Ringkasan singkat untuk kartu artikel..." />
              {form.formState.errors.excerpt && <p className="text-xs text-rose-500">{form.formState.errors.excerpt.message}</p>}
            </div>

             <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">Konten Lengkap</Label>
               <Controller
                control={form.control}
                name="content" 
                render={({ field }) => (
                  <RichTextEditor 
                    value={field.value || ""} 
                    onChange={field.onChange} 
                    placeholder="Tulis artikel lengkap di sini..."
                  />
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
               <div className="space-y-2">
                  <Label htmlFor="authorName" className="text-sm font-semibold text-slate-700">Nama Penulis <span className="text-rose-500">*</span></Label>
                  <Input id="authorName" {...form.register("authorName")} className="bg-white" />
                  {form.formState.errors.authorName && <p className="text-xs text-rose-500">{form.formState.errors.authorName.message}</p>}
               </div>
               <div className="space-y-2">
                  <Label htmlFor="authorRole" className="text-sm font-semibold text-slate-700">Peran Penulis <span className="text-rose-500">*</span></Label>
                  <Input id="authorRole" {...form.register("authorRole")} className="bg-white" />
               </div>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting} className="h-10 px-6">Batal</Button>
              <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 text-white h-10 px-6 shadow-md shadow-emerald-100">
                {isSubmitting ? (
                   <>
                     <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                     Menyimpan...
                   </>
                ) : (
                   "Simpan Publikasi"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-rose-600">Hapus Artikel?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus artikel ini? Data yang dihapus tidak dapat dikembalikan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-rose-600 hover:bg-rose-700 text-white border-none">
               Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
