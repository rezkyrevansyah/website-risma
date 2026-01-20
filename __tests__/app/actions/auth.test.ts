/**
 * @jest-environment node
 */
import { login } from '@/app/actions/auth';
import { createClient } from '@/lib/supabase/client';

// Mock the Supabase client
jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

describe('Auth Actions - Login', () => {
    
  it('should return error if fields are missing', async () => {
      const formData = new FormData();
      // formData.append('email', 'test@example.com'); // Missing password
      
      const result = await login(null, formData);
      expect(result).toHaveProperty('error');
  });

});
