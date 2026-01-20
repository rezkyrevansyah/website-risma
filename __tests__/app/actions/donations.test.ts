/**
 * @jest-environment node
 */
import {
  getDonationSettings,
  updateDonationSettings,
} from '@/app/actions/donations';

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

describe('Donation Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getDonationSettings', () => {
    it('should return null when no donation settings exist', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { message: 'No rows found' },
            }),
          }),
        }),
      });

      const result = await getDonationSettings();
      expect(result).toBeNull();
    });

    it('should return donation settings with camelCase mapping', async () => {
      const mockDbSettings = {
        id: 1,
        bank_name: 'Bank Syariah Indonesia',
        account_number: '1234567890',
        holder_name: 'Masjid Al Arqam',
        goal_amount: 100000000,
        current_amount: 50000000,
      };

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: mockDbSettings,
              error: null,
            }),
          }),
        }),
      });

      const result = await getDonationSettings();
      expect(result).not.toBeNull();
      expect(result?.bankName).toBe('Bank Syariah Indonesia');
      expect(result?.accountNumber).toBe('1234567890');
      expect(result?.holderName).toBe('Masjid Al Arqam');
      expect(result?.goalAmount).toBe(100000000);
      expect(result?.currentAmount).toBe(50000000);
    });
  });

  describe('updateDonationSettings', () => {
    const validDonationInfo = {
      bankName: 'Bank Mandiri',
      accountNumber: '9876543210',
      holderName: 'Yayasan Al Arqam',
      goalAmount: 200000000,
      currentAmount: 75000000,
    };

    it('should throw Unauthorized if not authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'Not authenticated' },
      });

      await expect(updateDonationSettings(validDonationInfo)).rejects.toThrow('Unauthorized');
    });

    it('should update existing donation settings', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      });

      // Mock getDonationSettings (existing record)
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { id: 1, bank_name: 'Old Bank' },
              error: null,
            }),
          }),
        }),
      });

      // Mock update
      mockSupabase.from.mockReturnValueOnce({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ error: null }),
        }),
      });

      const result = await updateDonationSettings(validDonationInfo);
      expect(result.success).toBe(true);
    });

    it('should insert new donation settings if none exist', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      });

      // Mock getDonationSettings (no existing record)
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { message: 'No rows' },
            }),
          }),
        }),
      });

      // Mock insert
      mockSupabase.from.mockReturnValueOnce({
        insert: jest.fn().mockResolvedValue({ error: null }),
      });

      const result = await updateDonationSettings(validDonationInfo);
      expect(result.success).toBe(true);
    });

    it('should map camelCase to snake_case for database', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      });

      // Mock getDonationSettings (no existing record)
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: null, error: { message: 'No rows' } }),
          }),
        }),
      });

      const mockInsert = jest.fn().mockResolvedValue({ error: null });
      mockSupabase.from.mockReturnValueOnce({
        insert: mockInsert,
      });

      await updateDonationSettings(validDonationInfo);

      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          bank_name: 'Bank Mandiri',
          account_number: '9876543210',
          holder_name: 'Yayasan Al Arqam',
          goal_amount: 200000000,
          current_amount: 75000000,
        })
      );
    });

    it('should throw error on database failure', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      });

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

      await expect(updateDonationSettings(validDonationInfo)).rejects.toThrow('Failed to update');
    });
  });
});
