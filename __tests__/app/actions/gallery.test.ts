/**
 * @jest-environment node
 */
import {
  getGalleries,
  getLatestGalleryItem,
  createGallery,
  deleteGallery,
} from '@/app/actions/gallery';

// Mock the Supabase server client
const mockSupabase = {
  from: jest.fn(),
  auth: {
    getUser: jest.fn(),
  },
  storage: {
    from: jest.fn().mockReturnValue({
      remove: jest.fn().mockResolvedValue({ error: null }),
    }),
  },
};

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(() => Promise.resolve(mockSupabase)),
}));

// Mock next/cache
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

describe('Gallery Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getGalleries', () => {
    it('should return empty array when no galleries exist', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({ data: [], error: null }),
        }),
      });

      const result = await getGalleries();
      expect(result).toEqual([]);
    });

    it('should return galleries ordered by created_at descending', async () => {
      const mockGalleries = [
        { id: '1', src: 'http://example.com/img1.jpg', alt: 'Image 1', caption: 'Caption 1', category: 'event', likes: 10 },
        { id: '2', src: 'http://example.com/img2.jpg', alt: 'Image 2', caption: 'Caption 2', category: 'activity', likes: 5 },
      ];

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({ data: mockGalleries, error: null }),
        }),
      });

      const result = await getGalleries();
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('1');
    });

    it('should return empty array on error', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({ data: null, error: { message: 'DB error' } }),
        }),
      });

      const result = await getGalleries();
      expect(result).toEqual([]);
    });
  });

  describe('getLatestGalleryItem', () => {
    it('should return null when no gallery items exist (PGRST116)', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: null,
                error: { code: 'PGRST116' },
              }),
            }),
          }),
        }),
      });

      const result = await getLatestGalleryItem();
      expect(result).toBeNull();
    });

    it('should return latest gallery item', async () => {
      const mockItem = {
        id: 'latest-id',
        src: 'http://example.com/latest.jpg',
        alt: 'Latest',
        caption: 'Latest caption',
        category: 'event',
        likes: 15,
      };

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: mockItem, error: null }),
            }),
          }),
        }),
      });

      const result = await getLatestGalleryItem();
      expect(result).not.toBeNull();
      expect(result?.id).toBe('latest-id');
    });
  });

  describe('createGallery', () => {
    const validGalleryItem = {
      src: 'http://example.com/new.jpg',
      alt: 'New Image',
      caption: 'New caption',
      category: 'activity',
    };

    it('should throw Unauthorized if not authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'Not authenticated' },
      });

      await expect(createGallery(validGalleryItem)).rejects.toThrow('Unauthorized');
    });

    it('should create gallery item successfully', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockResolvedValue({
            data: [{ id: 'new-gallery-id', ...validGalleryItem }],
            error: null,
          }),
        }),
      });

      const result = await createGallery(validGalleryItem);
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });

    it('should throw error on insert failure', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockResolvedValue({
            data: null,
            error: { message: 'Insert failed', code: 'ERROR' },
          }),
        }),
      });

      await expect(createGallery(validGalleryItem)).rejects.toThrow('Failed to create gallery item');
    });
  });

  describe('deleteGallery', () => {
    it('should throw Unauthorized if not authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'Not authenticated' },
      });

      await expect(deleteGallery('gallery-id')).rejects.toThrow('Unauthorized');
    });

    it('should throw error if item not found', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { message: 'Not found' },
            }),
          }),
        }),
      });

      await expect(deleteGallery('non-existent-id')).rejects.toThrow('Item not found');
    });

    it('should delete gallery item and its image from storage', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      });

      // Mock fetch item
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { src: 'http://example.com/storage/v1/object/public/images/test.jpg' },
              error: null,
            }),
          }),
        }),
      });

      // Mock delete
      mockSupabase.from.mockReturnValueOnce({
        delete: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ error: null }),
        }),
      });

      await expect(deleteGallery('gallery-id')).resolves.not.toThrow();
      expect(mockSupabase.storage.from).toHaveBeenCalledWith('images');
    });

    it('should throw error on delete failure', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      });

      // Mock fetch item
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { src: null },
              error: null,
            }),
          }),
        }),
      });

      // Mock delete failure
      mockSupabase.from.mockReturnValueOnce({
        delete: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ error: { message: 'Delete failed' } }),
        }),
      });

      await expect(deleteGallery('gallery-id')).rejects.toThrow('Failed to delete gallery item');
    });
  });
});
