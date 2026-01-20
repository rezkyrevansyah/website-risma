/**
 * @jest-environment node
 */
import {
  getCountdownSettings,
  updateCountdownSettings,
} from '@/app/actions/countdown';

// Mock the Supabase server client
const mockSupabase = {
  from: jest.fn(),
};

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(() => Promise.resolve(mockSupabase)),
}));

// Mock next/cache
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

describe('Countdown Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCountdownSettings', () => {
    it('should return null when no countdown settings exist (PGRST116)', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { code: 'PGRST116', message: 'No rows found' },
            }),
          }),
        }),
      });

      const result = await getCountdownSettings();
      expect(result).toBeNull();
    });

    it('should return null on other database errors', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { code: 'OTHER', message: 'Database error' },
            }),
          }),
        }),
      });

      const result = await getCountdownSettings();
      expect(result).toBeNull();
    });

    it('should return countdown settings when they exist', async () => {
      const mockSettings = {
        id: 1,
        title: 'Ramadhan Countdown',
        target_date: '2025-03-01T00:00:00Z',
        description: 'Menuju bulan suci Ramadhan',
        is_active: true,
        updated_at: '2025-01-15T10:00:00Z',
      };

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: mockSettings,
              error: null,
            }),
          }),
        }),
      });

      const result = await getCountdownSettings();
      expect(result).not.toBeNull();
      expect(result?.title).toBe('Ramadhan Countdown');
      expect(result?.is_active).toBe(true);
    });
  });

  describe('updateCountdownSettings', () => {
    it('should update existing countdown settings', async () => {
      // First call: getCountdownSettings (existing record)
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { id: 1, title: 'Old Title' },
              error: null,
            }),
          }),
        }),
      });

      // Second call: update
      mockSupabase.from.mockReturnValueOnce({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ error: null }),
        }),
      });

      const formData = new FormData();
      formData.append('title', 'New Countdown');
      formData.append('description', 'Updated description');
      formData.append('target_date', '2025-04-01T00:00:00Z');
      formData.append('is_active', 'on');

      const result = await updateCountdownSettings(null, formData);
      expect(result.success).toBe(true);
      expect(result.message).toContain('berhasil');
    });

    it('should insert new countdown if none exists', async () => {
      // First call: getCountdownSettings (no existing record)
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { code: 'PGRST116' },
            }),
          }),
        }),
      });

      // Second call: insert
      mockSupabase.from.mockReturnValueOnce({
        insert: jest.fn().mockResolvedValue({ error: null }),
      });

      const formData = new FormData();
      formData.append('title', 'First Countdown');
      formData.append('description', 'First description');
      formData.append('target_date', '2025-05-01T00:00:00Z');
      // No is_active = false

      const result = await updateCountdownSettings(null, formData);
      expect(result.success).toBe(true);
    });

    it('should parse is_active checkbox correctly (on = true)', async () => {
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
          }),
        }),
      });

      const mockInsert = jest.fn().mockResolvedValue({ error: null });
      mockSupabase.from.mockReturnValueOnce({
        insert: mockInsert,
      });

      const formData = new FormData();
      formData.append('title', 'Active Countdown');
      formData.append('description', 'Desc');
      formData.append('target_date', '2025-06-01');
      formData.append('is_active', 'on');

      await updateCountdownSettings(null, formData);

      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          is_active: true,
        })
      );
    });

    it('should parse is_active checkbox correctly (missing = false)', async () => {
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
          }),
        }),
      });

      const mockInsert = jest.fn().mockResolvedValue({ error: null });
      mockSupabase.from.mockReturnValueOnce({
        insert: mockInsert,
      });

      const formData = new FormData();
      formData.append('title', 'Inactive Countdown');
      formData.append('description', 'Desc');
      formData.append('target_date', '2025-07-01');
      // is_active not appended

      await updateCountdownSettings(null, formData);

      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          is_active: false,
        })
      );
    });

    it('should return error message on database failure', async () => {
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: { id: 1 }, error: null }),
          }),
        }),
      });

      mockSupabase.from.mockReturnValueOnce({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ error: { message: 'Update failed' } }),
        }),
      });

      const formData = new FormData();
      formData.append('title', 'Will Fail');
      formData.append('description', 'Desc');
      formData.append('target_date', '2025-08-01');

      const result = await updateCountdownSettings(null, formData);
      expect(result.message).toContain('Gagal');
      expect(result.success).toBeUndefined();
    });
  });
});
