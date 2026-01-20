import { renderHook, act } from '@testing-library/react';
import { useAgendaLogic, eventFormSchema } from '@/hooks/useAgendaLogic';
import React from 'react';

// Mock AdminContext
const mockAddEvent = jest.fn();
const mockUpdateEvent = jest.fn();
const mockDeleteEvent = jest.fn();
const mockEvents = [
  { id: '1', title: 'Kajian Rutin', date: '2025-01-20', time: '09:00', location: 'Masjid Al Arqam', category: 'kajian' as const, description: 'Kajian mingguan' },
  { id: '2', title: 'Olahraga Bersama', date: '2025-01-21', time: '06:00', location: 'Lapangan', category: 'olahraga' as const, description: 'Senam pagi' },
  { id: '3', title: 'Bakti Sosial', date: '2025-01-22', time: '08:00', location: 'Balai Desa', category: 'sosial' as const, description: 'Kegiatan sosial' },
];

jest.mock('@/context/AdminContext', () => ({
  useAdmin: () => ({
    events: mockEvents,
    addEvent: mockAddEvent,
    updateEvent: mockUpdateEvent,
    deleteEvent: mockDeleteEvent,
  }),
}));

// Mock sonner toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('useAgendaLogic Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('eventFormSchema', () => {
    it('should validate correct event data', () => {
      const validData = {
        title: 'Valid Event',
        date: '2025-01-25',
        time: '10:00',
        location: 'Masjid',
        category: 'kajian' as const,
        description: 'This is a valid description',
      };

      const result = eventFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject title less than 2 characters', () => {
      const invalidData = {
        title: 'A',
        date: '2025-01-25',
        time: '10:00',
        location: 'Masjid',
        category: 'kajian' as const,
        description: 'Valid description here',
      };

      const result = eventFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject description less than 10 characters', () => {
      const invalidData = {
        title: 'Valid Title',
        date: '2025-01-25',
        time: '10:00',
        location: 'Masjid',
        category: 'kajian' as const,
        description: 'Short',
      };

      const result = eventFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should only accept valid categories', () => {
      const validCategories = ['kajian', 'olahraga', 'sosial', 'lainnya'];

      validCategories.forEach(category => {
        const data = {
          title: 'Valid Title',
          date: '2025-01-25',
          time: '10:00',
          location: 'Masjid',
          category,
          description: 'Valid description here',
        };

        const result = eventFormSchema.safeParse(data);
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid category', () => {
      const invalidData = {
        title: 'Valid Title',
        date: '2025-01-25',
        time: '10:00',
        location: 'Masjid',
        category: 'invalid_category',
        description: 'Valid description here',
      };

      const result = eventFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('filteredEvents', () => {
    it('should return all events when search query is empty', () => {
      const { result } = renderHook(() => useAgendaLogic());

      expect(result.current.filteredEvents).toHaveLength(3);
    });

    it('should filter events by title', () => {
      const { result } = renderHook(() => useAgendaLogic());

      act(() => {
        result.current.setSearchQuery('Kajian');
      });

      expect(result.current.filteredEvents).toHaveLength(1);
      expect(result.current.filteredEvents[0].title).toBe('Kajian Rutin');
    });

    it('should filter events by location', () => {
      const { result } = renderHook(() => useAgendaLogic());

      act(() => {
        result.current.setSearchQuery('Lapangan');
      });

      expect(result.current.filteredEvents).toHaveLength(1);
      expect(result.current.filteredEvents[0].title).toBe('Olahraga Bersama');
    });

    it('should be case-insensitive', () => {
      const { result } = renderHook(() => useAgendaLogic());

      act(() => {
        result.current.setSearchQuery('KAJIAN');
      });

      expect(result.current.filteredEvents).toHaveLength(1);
    });

    it('should return empty array when no match', () => {
      const { result } = renderHook(() => useAgendaLogic());

      act(() => {
        result.current.setSearchQuery('NonExistentEvent');
      });

      expect(result.current.filteredEvents).toHaveLength(0);
    });
  });

  describe('dialog state management', () => {
    it('should open dialog when openNewDialog is called', () => {
      const { result } = renderHook(() => useAgendaLogic());

      expect(result.current.isDialogOpen).toBe(false);

      act(() => {
        result.current.openNewDialog();
      });

      expect(result.current.isDialogOpen).toBe(true);
    });

    it('should close dialog when setIsDialogOpen(false) is called', () => {
      const { result } = renderHook(() => useAgendaLogic());

      act(() => {
        result.current.openNewDialog();
      });

      expect(result.current.isDialogOpen).toBe(true);

      act(() => {
        result.current.setIsDialogOpen(false);
      });

      expect(result.current.isDialogOpen).toBe(false);
    });
  });

  describe('handleEdit', () => {
    it('should set editingId and populate form', () => {
      const { result } = renderHook(() => useAgendaLogic());

      const eventToEdit = mockEvents[0];

      act(() => {
        result.current.handleEdit(eventToEdit);
      });

      expect(result.current.editingId).toBe('1');
      expect(result.current.isDialogOpen).toBe(true);
      expect(result.current.form.getValues('title')).toBe('Kajian Rutin');
      expect(result.current.form.getValues('location')).toBe('Masjid Al Arqam');
    });
  });

  describe('confirmDelete', () => {
    it('should open delete confirmation dialog', () => {
      const { result } = renderHook(() => useAgendaLogic());

      expect(result.current.isDeleteOpen).toBe(false);

      act(() => {
        result.current.confirmDelete('1');
      });

      expect(result.current.isDeleteOpen).toBe(true);
    });
  });

  describe('handleDelete', () => {
    it('should call deleteEvent and close dialog on success', async () => {
      mockDeleteEvent.mockResolvedValue(undefined);

      const { result } = renderHook(() => useAgendaLogic());

      act(() => {
        result.current.confirmDelete('1');
      });

      await act(async () => {
        await result.current.handleDelete();
      });

      expect(mockDeleteEvent).toHaveBeenCalledWith('1');
      expect(result.current.isDeleteOpen).toBe(false);
    });

    it('should show error toast on delete failure', async () => {
      const { toast } = require('sonner');
      mockDeleteEvent.mockRejectedValue(new Error('Delete failed'));

      const { result } = renderHook(() => useAgendaLogic());

      act(() => {
        result.current.confirmDelete('1');
      });

      await act(async () => {
        await result.current.handleDelete();
      });

      expect(toast.error).toHaveBeenCalledWith('Gagal menghapus agenda');
    });
  });

  describe('onSubmit', () => {
    it('should call addEvent for new events', async () => {
      mockAddEvent.mockResolvedValue(undefined);
      const { toast } = require('sonner');

      const { result } = renderHook(() => useAgendaLogic());

      const newEventData = {
        title: 'New Event',
        date: '2025-02-01',
        time: '14:00',
        location: 'New Location',
        category: 'lainnya' as const,
        description: 'New event description',
      };

      await act(async () => {
        await result.current.onSubmit(newEventData);
      });

      expect(mockAddEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'New Event',
          location: 'New Location',
        })
      );
      expect(toast.success).toHaveBeenCalledWith('Agenda baru berhasil ditambahkan');
    });

    it('should call updateEvent for existing events', async () => {
      mockUpdateEvent.mockResolvedValue(undefined);
      const { toast } = require('sonner');

      const { result } = renderHook(() => useAgendaLogic());

      // First, set to edit mode
      act(() => {
        result.current.handleEdit(mockEvents[0]);
      });

      const updatedData = {
        title: 'Updated Kajian',
        date: '2025-01-20',
        time: '10:00',
        location: 'Updated Location',
        category: 'kajian' as const,
        description: 'Updated description text',
      };

      await act(async () => {
        await result.current.onSubmit(updatedData);
      });

      expect(mockUpdateEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          id: '1',
          title: 'Updated Kajian',
        })
      );
      expect(toast.success).toHaveBeenCalledWith('Agenda berhasil diperbarui');
    });

    it('should show error toast on submit failure', async () => {
      const { toast } = require('sonner');
      mockAddEvent.mockRejectedValue(new Error('Submit failed'));

      const { result } = renderHook(() => useAgendaLogic());

      const newEventData = {
        title: 'Fail Event',
        date: '2025-02-01',
        time: '14:00',
        location: 'Location',
        category: 'kajian' as const,
        description: 'Description here',
      };

      await act(async () => {
        await result.current.onSubmit(newEventData);
      });

      expect(toast.error).toHaveBeenCalledWith('Gagal menyimpan agenda');
    });

    it('should close dialog and reset form on success', async () => {
      mockAddEvent.mockResolvedValue(undefined);

      const { result } = renderHook(() => useAgendaLogic());

      act(() => {
        result.current.openNewDialog();
      });

      expect(result.current.isDialogOpen).toBe(true);

      const newEventData = {
        title: 'New Event',
        date: '2025-02-01',
        time: '14:00',
        location: 'Location',
        category: 'lainnya' as const,
        description: 'Description here',
      };

      await act(async () => {
        await result.current.onSubmit(newEventData);
      });

      expect(result.current.isDialogOpen).toBe(false);
      expect(result.current.editingId).toBeNull();
    });
  });
});
