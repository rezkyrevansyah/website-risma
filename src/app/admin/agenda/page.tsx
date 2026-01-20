"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, Search, Calendar, MapPin, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Controller } from "react-hook-form";
import { useAgendaLogic } from "@/hooks/useAgendaLogic";
import { motion, AnimatePresence } from "framer-motion";

// Helper component for expandable description
function ExpandableDescription({ content }: { content: string }) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  // Format HTML to clean text with lines
  const plainText = React.useMemo(() => content
    ? content
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(p|div|li|ul|ol|h[1-6])>/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .trim()
    : "", [content]);

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

import React from "react";


export default function AgendaAdminPage() {
  const {
    filteredEvents,
    searchQuery,
    setSearchQuery,
    isDialogOpen,
    setIsDialogOpen,
    isDeleteOpen,
    setIsDeleteOpen,
    editingId,
    form,
    onSubmit,
    handleEdit,
    confirmDelete,
    handleDelete,
    openNewDialog
  } = useAgendaLogic();

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Manajemen Agenda</h1>
          <p className="text-slate-500 mt-1">Kelola jadwal kegiatan masjid dan event penting.</p>
        </div>
        <Button onClick={openNewDialog} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200 transition-all hover:scale-105">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Agenda
        </Button>
      </div>

      {/* Toolbar & Filter */}
      <div className="flex items-center gap-4 max-w-md bg-white/50 p-2 rounded-xl backdrop-blur-sm border border-slate-100 shadow-sm">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Cari agenda, lokasi..."
            className="pl-9 bg-transparent border-none focus-visible:ring-0 placeholder:text-slate-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Glassmorphism Table Container */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl overflow-hidden ring-1 ring-slate-900/5">
        <Table className="table-fixed w-full">
          <TableHeader className="bg-slate-50/50 border-b border-slate-200/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[35%] font-bold text-slate-800 tracking-wide uppercase text-xs p-4">Judul & Deskripsi</TableHead>
              <TableHead className="w-[20%] font-bold text-slate-800 tracking-wide uppercase text-xs p-4">Kategori</TableHead>
              <TableHead className="w-[30%] font-bold text-slate-800 tracking-wide uppercase text-xs p-4">Waktu & Tempat</TableHead>
              <TableHead className="w-[15%] text-right font-bold text-slate-800 tracking-wide uppercase text-xs p-4">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="popLayout">
              {filteredEvents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-40 text-center text-slate-500 bg-white/30">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-slate-300" />
                      </div>
                      <p>Tidak ada agenda ditemukan.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredEvents.map((event) => (
                  <motion.tr
                    key={event.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="group hover:bg-emerald-50/30 transition-colors border-b border-slate-100/50 last:border-none"
                  >
                    <TableCell className="align-top p-4">
                      <div className="flex flex-col gap-1.5 w-full">
                        <span className="text-slate-900 font-bold text-base truncate block group-hover:text-emerald-700 transition-colors">{event.title}</span>
                        <ExpandableDescription content={event.description} />
                      </div>
                    </TableCell>
                    <TableCell className="align-top p-4">
                      <Badge variant="secondary" className="capitalize bg-white border border-slate-200 shadow-sm text-slate-700 font-medium px-3 py-1">{event.category}</Badge>
                    </TableCell>
                    <TableCell className="align-top p-4">
                      <div className="flex flex-col gap-2 text-sm text-slate-600">
                        <div className="flex items-center gap-2.5">
                          <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                          </div>
                          <span className="font-medium">{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                            <Clock className="w-3.5 h-3.5 text-blue-600" />
                          </div>
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                            <MapPin className="w-3.5 h-3.5 text-rose-600" />
                          </div>
                          <span className="truncate max-w-[180px]" title={event.location}>{event.location}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right align-top p-4">
                      <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(event)} className="h-9 w-9 p-0 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full border border-transparent hover:border-blue-100 hover:shadow-sm">
                          <Pencil className="w-4 h-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => confirmDelete(event.id)} className="h-9 w-9 p-0 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-full border border-transparent hover:border-rose-100 hover:shadow-sm">
                          <Trash2 className="w-4 h-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>

      {/* Dialog Form */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-xl border-white/20 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-br from-slate-900 to-slate-700 bg-clip-text text-transparent">{editingId ? "Edit Agenda" : "Tambah Agenda Baru"}</DialogTitle>
            <DialogDescription>
              Isi formulir di bawah ini untuk {editingId ? "memperbarui" : "membuat"} agenda kegiatan.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">

            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-semibold text-slate-700">Judul Kegiatan <span className="text-rose-500">*</span></Label>
              <Input id="title" {...form.register("title")} placeholder="Contoh: Kajian Rutin..." className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all" />
              {form.formState.errors.title && <p className="text-xs text-rose-500 font-medium">{form.formState.errors.title.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm font-semibold text-slate-700">Tanggal <span className="text-rose-500">*</span></Label>
                <Input id="date" type="date" {...form.register("date")} className="h-11 bg-slate-50 border-slate-200 focus:bg-white" />
                {form.formState.errors.date && <p className="text-xs text-rose-500 font-medium">{form.formState.errors.date.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="time" className="text-sm font-semibold text-slate-700">Waktu (WIB) <span className="text-rose-500">*</span></Label>
                <Input id="time" type="time" {...form.register("time")} className="h-11 bg-slate-50 border-slate-200 focus:bg-white" />
                {form.formState.errors.time && <p className="text-xs text-rose-500 font-medium">{form.formState.errors.time.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-semibold text-slate-700">Kategori <span className="text-rose-500">*</span></Label>
                <Controller
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="h-11 bg-slate-50 border-slate-200 focus:bg-white">
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kajian">Kajian</SelectItem>
                        <SelectItem value="olahraga">Olahraga</SelectItem>
                        <SelectItem value="sosial">Sosial</SelectItem>
                        <SelectItem value="lainnya">Lainnya</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-semibold text-slate-700">Lokasi <span className="text-rose-500">*</span></Label>
                <Input id="location" {...form.register("location")} placeholder="Contoh: Masjid Utama" className="h-11 bg-slate-50 border-slate-200 focus:bg-white" />
                {form.formState.errors.location && <p className="text-xs text-rose-500 font-medium">{form.formState.errors.location.message}</p>}
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
              {form.formState.errors.description && <p className="text-xs text-rose-500 font-medium">{form.formState.errors.description.message}</p>}
            </div>

            <DialogFooter className="pt-6 border-t border-slate-100">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="h-11 px-6 text-slate-500 hover:text-slate-900">Batal</Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white h-11 px-8 rounded-full shadow-lg shadow-emerald-200/50 hover:shadow-emerald-200 transaction-all font-semibold">Simpan Agenda</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent className="bg-white/95 backdrop-blur-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-rose-600 flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Hapus Agenda?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus agenda ini? Tindakan ini tidak dapat dibatalkan dan data akan hilang permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-slate-200">Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-rose-600 hover:bg-rose-700 text-white border-none shadow-md shadow-rose-200">
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
