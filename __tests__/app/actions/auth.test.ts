/**
 * @jest-environment node
 */
import { login, signup, logout } from '@/app/actions/auth';

// Mock the Supabase server client
const mockSupabase = {
  from: jest.fn(),
  auth: {
    signInWithPassword: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
  },
};

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(() => Promise.resolve(mockSupabase)),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

// Mock next/cache
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

describe('Auth Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return error if email/identifier is missing', async () => {
      const formData = new FormData();
      formData.append('password', 'password123');

      const result = await login(null, formData);
      expect(result).toHaveProperty('error');
      expect(result.error?.email).toBeDefined();
    });

    it('should return error if password is missing', async () => {
      const formData = new FormData();
      formData.append('email', 'test@example.com');

      const result = await login(null, formData);
      expect(result).toHaveProperty('error');
      expect(result.error?.password).toBeDefined();
    });

    it('should return error if password is less than 6 characters', async () => {
      const formData = new FormData();
      formData.append('email', 'test@example.com');
      formData.append('password', '123');

      const result = await login(null, formData);
      expect(result).toHaveProperty('error');
      expect(result.error?.password).toBeDefined();
    });

    it('should lookup user by username when identifier has no @ symbol', async () => {
      const formData = new FormData();
      formData.append('email', 'myusername');
      formData.append('password', 'password123');

      // Mock profile lookup - username not found
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: null, error: null }),
          }),
        }),
      });

      const result = await login(null, formData);
      expect(result).toHaveProperty('message');
      expect(result.message).toContain('Username tidak ditemukan');
    });

    it('should attempt login with resolved email from username', async () => {
      const formData = new FormData();
      formData.append('email', 'myusername');
      formData.append('password', 'password123');

      // Mock profile lookup - username found
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { email: 'user@example.com' },
              error: null,
            }),
          }),
        }),
      });

      // Mock successful login
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: { id: '123' } },
        error: null,
      });

      // Note: This will throw because redirect is called
      // We just verify signInWithPassword was called with correct email
      try {
        await login(null, formData);
      } catch {
        // Expected: redirect throws
      }

      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'password123',
      });
    });

    it('should return error message on invalid credentials', async () => {
      const formData = new FormData();
      formData.append('email', 'test@example.com');
      formData.append('password', 'wrongpassword');

      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: null,
        error: { message: 'Invalid credentials' },
      });

      const result = await login(null, formData);
      expect(result).toHaveProperty('message');
      expect(result.message).toContain('salah');
    });
  });

  describe('signup', () => {
    it('should return error if fullName is less than 3 characters', async () => {
      const formData = new FormData();
      formData.append('fullName', 'Ab');
      formData.append('username', 'validuser');
      formData.append('email', 'test@example.com');
      formData.append('password', 'password123');
      formData.append('confirmPassword', 'password123');

      const result = await signup(null, formData);
      expect(result).toHaveProperty('error');
      expect(result.error?.fullName).toBeDefined();
    });

    it('should return error if username contains invalid characters', async () => {
      const formData = new FormData();
      formData.append('fullName', 'Valid Name');
      formData.append('username', 'invalid user!');
      formData.append('email', 'test@example.com');
      formData.append('password', 'password123');
      formData.append('confirmPassword', 'password123');

      const result = await signup(null, formData);
      expect(result).toHaveProperty('error');
      expect(result.error?.username).toBeDefined();
    });

    it('should return error if passwords do not match', async () => {
      const formData = new FormData();
      formData.append('fullName', 'Valid Name');
      formData.append('username', 'validuser');
      formData.append('email', 'test@example.com');
      formData.append('password', 'password123');
      formData.append('confirmPassword', 'differentpassword');

      const result = await signup(null, formData);
      expect(result).toHaveProperty('message');
      expect(result.message).toContain('tidak cocok');
    });

    it('should return error if username already exists', async () => {
      const formData = new FormData();
      formData.append('fullName', 'Valid Name');
      formData.append('username', 'existinguser');
      formData.append('email', 'test@example.com');
      formData.append('password', 'password123');
      formData.append('confirmPassword', 'password123');

      // Mock existing username check
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { username: 'existinguser' },
              error: null,
            }),
          }),
        }),
      });

      const result = await signup(null, formData);
      expect(result).toHaveProperty('message');
      expect(result.message).toContain('sudah digunakan');
    });

    it('should create profile after successful signup', async () => {
      const formData = new FormData();
      formData.append('fullName', 'New User');
      formData.append('username', 'newuser');
      formData.append('email', 'new@example.com');
      formData.append('password', 'password123');
      formData.append('confirmPassword', 'password123');

      // Mock username check - not exists
      const mockInsert = jest.fn().mockResolvedValue({ error: null });
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: null, error: null }),
          }),
        }),
        insert: mockInsert,
      });

      // Mock successful signup (no session = needs email verification)
      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: { id: 'new-user-id' }, session: null },
        error: null,
      });

      const result = await signup(null, formData);
      expect(result).toHaveProperty('success', true);
      expect(result.message).toContain('berhasil');
    });
  });

  describe('logout', () => {
    it('should call signOut', async () => {
      mockSupabase.auth.signOut.mockResolvedValue({ error: null });

      try {
        await logout();
      } catch {
        // Expected: redirect throws
      }

      expect(mockSupabase.auth.signOut).toHaveBeenCalled();
    });
  });
});
