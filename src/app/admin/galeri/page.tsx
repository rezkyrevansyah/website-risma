"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Search, Image as ImageIcon, Heart, Pencil, Loader2 } from "lucide-react";
import { GalleryItem, GalleryCategory } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { createGallery, deleteGallery, getGalleries } from "@/app/actions/gallery";
import { updateGallery } from "@/app/actions/gallery-update";

// Schema Validation
const formSchema = z.object({
  src: z.string().optional(), // Make optional because we might just have a file
  alt: z.string().min(1, "Alt text wajib diisi"),
  caption: z.string().min(1, "Caption wajib diisi"),
  category: z.enum(["kajian", "santunan", "outdoor", "festive"]),
});

type FormValues = z.infer<typeof formSchema>;

export default function GalleryAdminPage() {
  const [dataList, setDataList] = useState<GalleryItem[]>([]);
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

  // Fetch Data
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const data = await getGalleries();
      setDataList(data);
    } catch (error) {
      toast.error("Gagal memuat data galeri");
    } finally {
      setIsLoading(false);
    }
  }

  // Filter
  const filteredData = dataList.filter((item) => 
    item.alt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.caption.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Form handling
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      src: "",
      alt: "",
      caption: "",
      category: "kajian",
    },
  });

  // Handle File Selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      form.setValue("src", url); // Just for validation/preview
    }
  };

  const uploadImage = async (file: File) => {
    const supabase = createClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('images')
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
      let finalImageUrl = data.src || "";

      // 1. Upload Image (if new file selected)
      if (selectedFile) {
        finalImageUrl = await uploadImage(selectedFile);
      }

      // 2. Save to DB
      if (editingId) {
         // Update
         await updateGallery({
            id: editingId,
            src: finalImageUrl,
            alt: data.alt,
            caption: data.caption,
            category: data.category as GalleryCategory,
            likes: dataList.find(g => g.id === editingId)?.likes || 0
         });
         toast.success("Foto berhasil diperbarui");
      } else {
         // Create
         if (!finalImageUrl) throw new Error("Gambar wajib diupload");
         
         await createGallery({
           src: finalImageUrl,
           alt: data.alt,
           caption: data.caption,
           category: data.category as GalleryCategory,
         });
         toast.success("Foto baru berhasil ditambahkan");
      }
      
      // 3. Reset & Refresh
      setIsDialogOpen(false);
      resetForm();
      await loadData();
      
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan saat menyimpan");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setSelectedFile(null);
    setPreviewUrl("");
    form.reset({
      src: "",
      alt: "",
      caption: "",
      category: "kajian",
    });
  };

  const handleEdit = (item: GalleryItem) => {
      setEditingId(item.id);
      setPreviewUrl(item.src); // Show existing image
      setSelectedFile(null); // No new file yet
      form.reset({
         src: item.src,
         alt: item.alt,
         caption: item.caption,
         category: item.category as any,
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
        await deleteGallery(deleteId);
        toast.success("Foto berhasil dihapus");
        await loadData();
      } catch (error) {
        toast.error("Gagal menghapus foto");
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
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Manajemen Galeri</h1>
          <p className="text-slate-500 mt-1">Upload dan kelola dokumentasi kegiatan.</p>
        </div>
        <Button onClick={() => { resetForm(); setIsDialogOpen(true); }} className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Upload Foto
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4 max-w-sm">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Cari foto..." 
            className="pl-9 bg-white border-slate-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredData.map((item) => (
            <div key={item.id} className="group relative bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative aspect-square bg-slate-100">
                 <img src={item.src} alt={item.alt} className="w-full h-full object-cover" />
                 
                 {/* Overlay Actions */}
                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                     <Button variant="secondary" size="sm" onClick={() => handleEdit(item)} className="shadow-lg hover:bg-emerald-50 hover:text-emerald-600">
                       <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => confirmDelete(item.id)} className="shadow-lg">
                       <Trash2 className="w-4 h-4" />
                    </Button>
                 </div>
              </div>
              <div className="p-4">
                 <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="text-[10px] uppercase">{item.category}</Badge>
                    <div className="flex items-center text-slate-400 text-xs">
                       <Heart className="w-3 h-3 mr-1 fill-current" />
                       {item.likes}
                    </div>
                 </div>
                 <h3 className="font-semibold text-slate-900 line-clamp-1 text-sm mb-1">{item.alt}</h3>
                 <p className="text-xs text-slate-500 line-clamp-2">{item.caption}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {!isLoading && filteredData.length === 0 && (
         <div className="text-center py-12 text-slate-500 border border-dashed border-slate-200 rounded-xl bg-slate-50">
            <ImageIcon className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p>Tidak ada foto ditemukan.</p>
         </div>
      )}

      {/* Dialog Form */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Foto" : "Upload Foto Baru"}</DialogTitle>
            <DialogDescription>
              {editingId ? "Perbarui detail foto dokumentasi." : "Tambahkan foto dokumentasi kegiatan terbaru."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">Foto Dokumentasi <span className="text-rose-500">*</span></Label>
              <div className="flex items-start gap-4">
                  <div className="w-24 h-24 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden relative group">
                      {previewUrl ? (
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
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
                      <p className="text-xs text-slate-500">Format: JPG, PNG. Maks 5MB.</p>
                  </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="alt">Judul Foto (Alt Text)</Label>
              <Input id="alt" {...form.register("alt")} placeholder="Judul singkat..." />
              {form.formState.errors.alt && <p className="text-xs text-rose-500">{form.formState.errors.alt.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Kategori</Label>
              <Select 
                onValueChange={(val) => form.setValue("category", val as GalleryCategory)} 
                defaultValue={form.getValues("category")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kajian">Kajian</SelectItem>
                  <SelectItem value="santunan">Santunan</SelectItem>
                  <SelectItem value="outdoor">Outdoor</SelectItem>
                  <SelectItem value="festive">Festive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="caption">Caption</Label>
              <Input id="caption" {...form.register("caption")} placeholder="Keterangan foto..." />
              {form.formState.errors.caption && <p className="text-xs text-rose-500">{form.formState.errors.caption.message}</p>}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>Batal</Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white" disabled={isSubmitting}>
                {isSubmitting ? (
                   <>
                     <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                     {editingId ? "Menyimpan..." : "Mengupload..."}
                   </>
                ) : (
                   editingId ? "Simpan Perubahan" : "Upload"
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
            <AlertDialogTitle className="text-rose-600">Hapus Foto?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus foto ini? Tindakan ini tidak dapat dibatalkan.
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
