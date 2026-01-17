import { useState, useMemo } from "react";
import { useAdmin } from "@/context/AdminContext";
import { EventItem } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

// Schema Validation
export const eventFormSchema = z.object({
    title: z.string().min(2, "Judul minimal 2 karakter"),
    date: z.string().min(1, "Tanggal wajib diisi"),
    time: z.string().min(1, "Waktu wajib diisi"),
    location: z.string().min(1, "Lokasi wajib diisi"),
    category: z.enum(["kajian", "olahraga", "sosial", "lainnya"]),
    description: z.string().min(10, "Deskripsi minimal 10 karakter"),
});

export type EventFormValues = z.infer<typeof eventFormSchema>;

export function useAgendaLogic() {
    const { events, addEvent, updateEvent, deleteEvent } = useAdmin();
    const [searchQuery, setSearchQuery] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    // Filter events - Memoized for performance
    const filteredEvents = useMemo(() => {
        const lowerQuery = searchQuery.toLowerCase();
        return events.filter((e) =>
            e.title.toLowerCase().includes(lowerQuery) ||
            e.location.toLowerCase().includes(lowerQuery)
        );
    }, [events, searchQuery]);

    // Form handling
    const form = useForm<EventFormValues>({
        resolver: zodResolver(eventFormSchema),
        defaultValues: {
            title: "",
            date: "",
            time: "",
            location: "",
            category: "kajian",
            description: "",
        },
    });

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

    const onSubmit = async (data: EventFormValues) => {
        try {
            if (editingId) {
                // Edit Mode
                await updateEvent({ ...data, id: editingId } as EventItem);
                toast.success("Agenda berhasil diperbarui");
            } else {
                // Create Mode - Generate a simpler ID for client-side opt update if backend requires it, 
                // normally backend handles ID but here we are optimistic
                const newEvent: EventItem = {
                    id: Math.random().toString(36).substr(2, 9),
                    ...data,
                };
                await addEvent(newEvent);
                toast.success("Agenda baru berhasil ditambahkan");
            }
            setIsDialogOpen(false);
            resetForm();
        } catch (error) {
            toast.error("Gagal menyimpan agenda");
            console.error(error);
        }
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

    const handleDelete = async () => {
        if (deleteId) {
            try {
                await deleteEvent(deleteId);
                toast.success("Agenda berhasil dihapus");
            } catch (error) {
                toast.error("Gagal menghapus agenda");
                console.error(error);
            } finally {
                setIsDeleteOpen(false);
                setDeleteId(null);
            }
        }
    };

    const openNewDialog = () => {
        resetForm();
        setIsDialogOpen(true);
    };

    return {
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
    };
}
