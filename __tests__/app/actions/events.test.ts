/**
 * @jest-environment node
 */
import {
  getEvents,
  getLatestEvent,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from '@/app/actions/events';

// Mock the Supabase server client
const mockSupabase = {
  from: jest.fn(),
  auth: {
    getUser: jest.fn(),
  },
};

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(() => Promise.resolve(mockSupabase)),
}));

// Mock next/cache
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

describe('Event Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getEvents', () => {
    it('should return empty array when no events exist', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({ data: [], error: null }),
        }),
      });

      const result = await getEvents();
      expect(result).toEqual([]);
    });

    it('should return events ordered by date ascending', async () => {
      const mockEvents = [
        { id: '1', title: 'Event 1', date: '2025-01-01', time: '10:00', location: 'Place 1', category: 'kajian', description: 'Desc 1', image_url: null },
        { id: '2', title: 'Event 2', date: '2025-01-02', time: '11:00', location: 'Place 2', category: 'sosial', description: 'Desc 2', image_url: 'http://example.com/img.jpg' },
      ];

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({ data: mockEvents, error: null }),
        }),
      });

      const result = await getEvents();
      expect(result).toHaveLength(2);
      expect(result[0].title).toBe('Event 1');
      expect(result[1].imageUrl).toBe('http://example.com/img.jpg');
    });

    it('should limit results when limit param is provided', async () => {
      const mockOrderFn = jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue({ data: [{ id: '1', title: 'Event 1', date: '2025-01-01', time: '10:00', location: 'Place', category: 'kajian', description: 'Desc', image_url: null }], error: null }),
      });

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: mockOrderFn,
        }),
      });

      const result = await getEvents(1);
      expect(result).toHaveLength(1);
    });

    it('should return empty array on error', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({ data: null, error: { message: 'DB error' } }),
        }),
      });

      const result = await getEvents();
      expect(result).toEqual([]);
    });

    it('should map snake_case to camelCase correctly', async () => {
      const mockEvent = {
        id: '1',
        title: 'Test',
        date: '2025-01-01',
        time: '10:00',
        location: 'Test Location',
        category: 'kajian',
        description: 'Test Description',
        image_url: 'http://example.com/image.jpg',
      };

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({ data: [mockEvent], error: null }),
        }),
      });

      const result = await getEvents();
      expect(result[0]).toHaveProperty('imageUrl', 'http://example.com/image.jpg');
      expect(result[0]).not.toHaveProperty('image_url');
    });
  });

  describe('getLatestEvent', () => {
    it('should return null when no events exist', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
            }),
          }),
        }),
      });

      const result = await getLatestEvent();
      expect(result).toBeNull();
    });

    it('should return the latest event', async () => {
      const mockEvent = {
        id: '1',
        title: 'Latest Event',
        date: '2025-01-15',
        time: '14:00',
        location: 'Main Hall',
        category: 'kajian',
        description: 'Latest description',
        image_url: null,
      };

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: mockEvent, error: null }),
            }),
          }),
        }),
      });

      const result = await getLatestEvent();
      expect(result).not.toBeNull();
      expect(result?.title).toBe('Latest Event');
    });
  });

  describe('getEventById', () => {
    it('should return null for non-existent event', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
          }),
        }),
      });

      const result = await getEventById('non-existent-id');
      expect(result).toBeNull();
    });

    it('should return null for invalid UUID', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: null, error: { code: '22P02' } }),
          }),
        }),
      });

      const result = await getEventById('invalid-uuid');
      expect(result).toBeNull();
    });

    it('should return event when found', async () => {
      const mockEvent = {
        id: 'valid-uuid',
        title: 'Found Event',
        date: '2025-02-01',
        time: '09:00',
        location: 'Room A',
        category: 'olahraga',
        description: 'Sports event',
        image_url: 'http://example.com/sport.jpg',
      };

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: mockEvent, error: null }),
          }),
        }),
      });

      const result = await getEventById('valid-uuid');
      expect(result).not.toBeNull();
      expect(result?.title).toBe('Found Event');
      expect(result?.imageUrl).toBe('http://example.com/sport.jpg');
    });
  });

  describe('createEvent', () => {
    it('should throw Unauthorized if not authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'Not authenticated' },
      });

      await expect(
        createEvent({
          title: 'New Event',
          date: '2025-03-01',
          time: '10:00',
          location: 'New Location',
          category: 'kajian',
          description: 'New description',
        })
      ).rejects.toThrow('Unauthorized');
    });

    it('should throw validation error for missing required fields', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      });

      await expect(
        createEvent({
          title: '', // Empty title
          date: '2025-03-01',
          time: '10:00',
          location: 'Location',
          category: 'kajian',
          description: 'Description',
        })
      ).rejects.toThrow('Validation failed');
    });

    it('should throw validation error for invalid category', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      });

      await expect(
        createEvent({
          title: 'Valid Title',
          date: '2025-03-01',
          time: '10:00',
          location: 'Location',
          category: 'invalid_category' as 'kajian',
          description: 'Description',
        })
      ).rejects.toThrow('Validation failed');
    });

    it('should create event successfully', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      });

      const mockInsertResult = {
        data: [{ id: 'new-event-id', title: 'New Event' }],
        error: null,
      };

      mockSupabase.from.mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockResolvedValue(mockInsertResult),
        }),
      });

      const result = await createEvent({
        title: 'New Event',
        date: '2025-03-01',
        time: '10:00',
        location: 'New Location',
        category: 'kajian',
        description: 'New description',
      });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('updateEvent', () => {
    it('should throw Unauthorized if not authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'Not authenticated' },
      });

      await expect(
        updateEvent({
          id: 'event-id',
          title: 'Updated Event',
          date: '2025-03-01',
          time: '10:00',
          location: 'Location',
          category: 'kajian',
          description: 'Description',
        })
      ).rejects.toThrow('Unauthorized');
    });

    it('should update event successfully', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      });

      const mockUpdateResult = {
        data: [{ id: 'event-id', title: 'Updated Event' }],
        error: null,
      };

      mockSupabase.from.mockReturnValue({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            select: jest.fn().mockResolvedValue(mockUpdateResult),
          }),
        }),
      });

      const result = await updateEvent({
        id: 'event-id',
        title: 'Updated Event',
        date: '2025-03-01',
        time: '10:00',
        location: 'Updated Location',
        category: 'sosial',
        description: 'Updated description',
      });

      expect(result.success).toBe(true);
    });
  });

  describe('deleteEvent', () => {
    it('should throw Unauthorized if not authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'Not authenticated' },
      });

      await expect(deleteEvent('event-id')).rejects.toThrow('Unauthorized');
    });

    it('should delete event successfully', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        delete: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ error: null }),
        }),
      });

      await expect(deleteEvent('event-id')).resolves.not.toThrow();
    });

    it('should throw error on delete failure', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        delete: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ error: { message: 'Delete failed' } }),
        }),
      });

      await expect(deleteEvent('event-id')).rejects.toThrow('Failed to delete event');
    });
  });
});
