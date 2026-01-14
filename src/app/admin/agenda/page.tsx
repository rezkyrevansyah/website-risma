"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, Search, Calendar, MapPin, Clock } from "lucide-react";
import { dummyEvents } from "@/data";
import { EventItem, EventCategory } from "@/types";
import { useAdmin } from "@/context/AdminContext";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

// Schema Validation
const formSchema = z.object({
  title: z.string().min(2, "Judul minimal 2 karakter"),
  date: z.string().min(1, "Tanggal wajib diisi"),
  time: z.string().min(1, "Waktu wajib diisi"),
  location: z.string().min(1, "Lokasi wajib diisi"),
  category: z.enum(["kajian", "olahraga", "sosial", "lainnya"]),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
});

type FormValues = z.infer<typeof formSchema>;

// Helper component for expandable description
function ExpandableDescription({ content }: { content: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Format HTML to clean text with lines
  const plainText = content
    ? content
        .replace(/<br\s*\/?>/gi, "\n") // Replace <br> with newline
        .replace(/<\/(p|div|li|ul|ol|h[1-6])>/gi, "\n") // Replace block end tags with newline
        .replace(/<[^>]+>/g, "") // Strip remaining tags
        .trim() // Trim start/end
    : "";

  if (!plainText) return null;

  return (
    <div className="flex flex-col items-start gap-1 w-full max-w-full text-left">
      <div 
        className={`text-xs text-slate-500 leading-relaxed transition-all duration-300 w-full break-words whitespace-pre-line ${isExpanded ? "" : "line-clamp-2 mix-blend-multiply"}`}
        title={plainText}
      >
        {plainText}
      </div>
      {plainText.length > 80 && (
        <button
          onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
          className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5 mt-0.5 select-none uppercase tracking-wider shrink-0"
        >
          {isExpanded ? "Sembunyikan" : "Selengkapnya"}
        </button>
      )}
    </div>
  );
}

export default function AgendaAdminPage() {
  const { events, addEvent, updateEvent, deleteEvent } = useAdmin();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Delete State
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Filter events
  const filteredEvents = events.filter((e) => 
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Form handling
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      date: "",
      time: "",
      location: "",
      category: "kajian",
      description: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    if (editingId) {
      // Edit Mode
      updateEvent({ ...data, id: editingId } as EventItem);
      toast.success("Agenda berhasil diperbarui");
    } else {
      // Create Mode
      const newEvent: EventItem = {
        id: Math.random().toString(36).substr(2, 9),
        ...data,
      };
      addEvent(newEvent);
      toast.success("Agenda baru berhasil ditambahkan");
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setEditingId(null);
    form.reset({
      title: "",
      date: "",
      time: "",
      location: "",
      category: "kajian",
      description: "",
    });
  };

  const handleEdit = (event: EventItem) => {
    setEditingId(event.id);
    form.reset({
      title: event.title,
      date: event.date,
      time: event.time,
      location: event.location,
      category: event.category,
      description: event.description,
    });
    setIsDialogOpen(true);
  };

  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setIsDeleteOpen(true);
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteEvent(deleteId);
      toast.success("Agenda berhasil dihapus");
      setIsDeleteOpen(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Manajemen Agenda</h1>
          <p className="text-slate-500 mt-1">Kelola jadwal kegiatan masjid.</p>
        </div>
        <Button onClick={() => { resetForm(); setIsDialogOpen(true); }} className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Agenda
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4 max-w-sm">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Cari berdasarkan judul atau lokasi..." 
            className="pl-9 bg-white border-slate-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <Table className="table-fixed w-full">
          <TableHeader className="bg-slate-50 border-b border-slate-200">
            <TableRow>
              <TableHead className="w-[35%] font-semibold text-slate-900">Judul & Deskripsi</TableHead>
              <TableHead className="w-[20%] font-semibold text-slate-900">Kategori</TableHead>
              <TableHead className="w-[30%] font-semibold text-slate-900">Waktu & Tempat</TableHead>
              <TableHead className="w-[15%] text-right font-semibold text-slate-900">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEvents.length === 0 ? (
               <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-slate-500">
                     <div className="flex flex-col items-center justify-center">
                        <Calendar className="w-8 h-8 mb-2 text-slate-300" />
                        <p>Tidak ada agenda ditemukan.</p>
                     </div>
                  </TableCell>
               </TableRow>
            ) : (
                filteredEvents.map((event) => (
                  <TableRow key={event.id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-none">
                    <TableCell className="font-medium align-top py-4">
                      <div className="flex flex-col gap-1.5 w-full">
                        <span className="text-slate-900 font-semibold text-base truncate block">{event.title}</span>
                         <ExpandableDescription content={event.description} />
                      </div>
                    </TableCell>
                    <TableCell className="align-top py-4">
                      <Badge variant="secondary" className="capitalize bg-slate-100 text-slate-700 hover:bg-slate-200 border-none font-medium">{event.category}</Badge>
                    </TableCell>
                    <TableCell className="align-top py-4">
                      <div className="flex flex-col gap-1.5 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-emerald-600" />
                          <span className="font-medium">{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-600" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <MapPin className="w-4 h-4 text-rose-600" />
                           <span>{event.location}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right align-top py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(event)} className="h-8 w-8 p-0 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full">
                          <Pencil className="w-4 h-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => confirmDelete(event.id)} className="h-8 w-8 p-0 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-full">
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
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Agenda" : "Tambah Agenda Baru"}</DialogTitle>
            <DialogDescription>
              Isi formulir di bawah ini untuk {editingId ? "memperbarui" : "membuat"} agenda kegiatan.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 py-4">
            
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-semibold text-slate-700">Judul Kegiatan <span className="text-rose-500">*</span></Label>
              <Input id="title" {...form.register("title")} placeholder="Contoh: Kajian Rutin..." className="h-10" />
              {form.formState.errors.title && <p className="text-xs text-rose-500">{form.formState.errors.title.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <Label htmlFor="date" className="text-sm font-semibold text-slate-700">Tanggal <span className="text-rose-500">*</span></Label>
                  <Input id="date" type="date" {...form.register("date")} className="h-10" />
                  {form.formState.errors.date && <p className="text-xs text-rose-500">{form.formState.errors.date.message}</p>}
               </div>
               <div className="space-y-2">
                  <Label htmlFor="time" className="text-sm font-semibold text-slate-700">Waktu (WIB) <span className="text-rose-500">*</span></Label>
                  <Input id="time" type="time" {...form.register("time")} className="h-10" />
                  {form.formState.errors.time && <p className="text-xs text-rose-500">{form.formState.errors.time.message}</p>}
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-semibold text-slate-700">Kategori <span className="text-rose-500">*</span></Label>
                  <Select 
                    onValueChange={(val) => form.setValue("category", val as EventCategory)} 
                    defaultValue={form.getValues("category")}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kajian">Kajian</SelectItem>
                      <SelectItem value="olahraga">Olahraga</SelectItem>
                      <SelectItem value="sosial">Sosial</SelectItem>
                      <SelectItem value="lainnya">Lainnya</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="text-sm font-semibold text-slate-700">Lokasi <span className="text-rose-500">*</span></Label>
                  <Input id="location" {...form.register("location")} placeholder="Contoh: Masjid Utama" className="h-10" />
                  {form.formState.errors.location && <p className="text-xs text-rose-500">{form.formState.errors.location.message}</p>}
                </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">Deskripsi Lengkap <span className="text-rose-500">*</span></Label>
              <Controller
                control={form.control}
                name="description"
                render={({ field }) => (
                  <RichTextEditor 
                    value={field.value} 
                    onChange={field.onChange} 
                    placeholder="Tulis deskripsi kegiatan di sini..."
                  />
                )}
              />
              {form.formState.errors.description && <p className="text-xs text-rose-500">{form.formState.errors.description.message}</p>}
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="h-10 px-6">Batal</Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white h-10 px-6 shadow-md shadow-emerald-100">Simpan Agenda</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-rose-600">Hapus Agenda?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus agenda ini? Tindakan ini tidak dapat dibatalkan dan data akan hilang permanen.
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
