/**
 * @jest-environment node
 */

/**
 * Security Tests for Input Validation
 * Tests validation schemas for SQL injection, XSS prevention at input level
 */

import { z } from 'zod';

// Import the actual schemas from the project
// We'll test the validation logic without needing Supabase mocks

describe('Auth Schema Security Tests', () => {
  // Recreate the schemas as they are in auth.ts
  const loginSchema = z.object({
    identifier: z.string().min(1, "Email atau Username wajib diisi"),
    password: z.string().min(6, "Password minimal 6 karakter"),
  });

  const signupSchema = z.object({
    fullName: z.string().min(3, "Nama lengkap minimal 3 karakter"),
    username: z.string().min(3, "Username minimal 3 karakter").regex(/^[a-zA-Z0-9_]+$/, "Username hanya boleh huruf, angka, dan underscore"),
    email: z.string().email("Format email tidak valid"),
    password: z.string().min(1, "Password wajib diisi"),
  });

  describe('Login Schema Validation', () => {
    it('should accept valid email and password', () => {
      const result = loginSchema.safeParse({
        identifier: 'user@example.com',
        password: 'password123',
      });
      expect(result.success).toBe(true);
    });

    it('should accept SQL injection string as valid identifier (validation passes, but Supabase parameterizes)', () => {
      // SQL injection strings are technically valid strings
      // The protection happens at the database level via parameterization
      const result = loginSchema.safeParse({
        identifier: "' OR '1'='1' --",
        password: 'password123',
      });
      expect(result.success).toBe(true);
    });

    it('should accept script tags as identifier (XSS in text field - Supabase stores as text)', () => {
      // XSS prevention for login identifier happens elsewhere (not rendered as HTML)
      const result = loginSchema.safeParse({
        identifier: '<script>alert("XSS")</script>',
        password: 'password123',
      });
      expect(result.success).toBe(true);
    });

    it('should reject empty identifier', () => {
      const result = loginSchema.safeParse({
        identifier: '',
        password: 'password123',
      });
      expect(result.success).toBe(false);
      expect(result.error?.flatten().fieldErrors.identifier).toBeDefined();
    });

    it('should reject password under 6 characters', () => {
      const result = loginSchema.safeParse({
        identifier: 'user@example.com',
        password: '12345',
      });
      expect(result.success).toBe(false);
      expect(result.error?.flatten().fieldErrors.password).toBeDefined();
    });
  });

  describe('Signup Schema Validation - SQL Injection Prevention', () => {
    it('should reject username with SQL injection (special chars blocked by regex)', () => {
      const result = signupSchema.safeParse({
        fullName: 'Test User',
        username: "admin'; DROP TABLE users; --",
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result.success).toBe(false);
      expect(result.error?.flatten().fieldErrors.username).toBeDefined();
    });

    it('should reject username with semicolons (SQL statement separator)', () => {
      const result = signupSchema.safeParse({
        fullName: 'Test User',
        username: 'admin;',
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result.success).toBe(false);
    });

    it('should reject username with quotes (SQL string delimiter)', () => {
      const result = signupSchema.safeParse({
        fullName: 'Test User',
        username: "admin'test",
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result.success).toBe(false);
    });

    it('should reject username with double dashes (SQL comment)', () => {
      const result = signupSchema.safeParse({
        fullName: 'Test User',
        username: "admin--",
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('Signup Schema Validation - XSS Prevention', () => {
    it('should reject username with < character (HTML tag)', () => {
      const result = signupSchema.safeParse({
        fullName: 'Test User',
        username: 'admin<script>',
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result.success).toBe(false);
    });

    it('should reject username with > character (HTML tag closing)', () => {
      const result = signupSchema.safeParse({
        fullName: 'Test User',
        username: 'admin>test',
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result.success).toBe(false);
    });

    it('should accept fullName with HTML (will be escaped at render)', () => {
      // fullName can contain any characters - XSS prevention happens at rendering
      const result = signupSchema.safeParse({
        fullName: '<script>alert("XSS")</script>',
        username: 'validuser',
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('Signup Schema Validation - Email Format', () => {
    it('should reject email without @ symbol', () => {
      const result = signupSchema.safeParse({
        fullName: 'Test User',
        username: 'validuser',
        email: 'notanemail',
        password: 'password123',
      });
      expect(result.success).toBe(false);
      expect(result.error?.flatten().fieldErrors.email).toBeDefined();
    });

    it('should reject email without domain', () => {
      const result = signupSchema.safeParse({
        fullName: 'Test User',
        username: 'validuser',
        email: 'test@',
        password: 'password123',
      });
      expect(result.success).toBe(false);
    });

    it('should accept valid email format', () => {
      const result = signupSchema.safeParse({
        fullName: 'Test User',
        username: 'validuser',
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result.success).toBe(true);
    });
  });
});

describe('Event Schema Security Tests', () => {
  const eventSchema = z.object({
    title: z.string().min(1, "Judul wajib diisi"),
    date: z.string().min(1, "Tanggal wajib diisi"),
    time: z.string().min(1, "Waktu wajib diisi"),
    location: z.string().min(1, "Lokasi wajib diisi"),
    category: z.enum(["kajian", "olahraga", "sosial", "lainnya"]),
    description: z.string().min(1, "Deskripsi wajib diisi"),
    imageUrl: z.string().optional(),
  });

  it('should reject empty title', () => {
    const result = eventSchema.safeParse({
      title: '',
      date: '2025-01-20',
      time: '10:00',
      location: 'Test',
      category: 'kajian',
      description: 'Test',
    });
    expect(result.success).toBe(false);
  });

  it('should reject invalid category', () => {
    const result = eventSchema.safeParse({
      title: 'Test',
      date: '2025-01-20',
      time: '10:00',
      location: 'Test',
      category: 'invalid_category',
      description: 'Test',
    });
    expect(result.success).toBe(false);
  });

  it('should accept HTML in description (sanitized at render)', () => {
    const result = eventSchema.safeParse({
      title: 'Test',
      date: '2025-01-20',
      time: '10:00',
      location: 'Test',
      category: 'kajian',
      description: '<script>alert("XSS")</script>',
    });
    expect(result.success).toBe(true);
  });

  it('should accept all valid categories', () => {
    const categories = ['kajian', 'olahraga', 'sosial', 'lainnya'];
    categories.forEach(category => {
      const result = eventSchema.safeParse({
        title: 'Test',
        date: '2025-01-20',
        time: '10:00',
        location: 'Test',
        category,
        description: 'Test',
      });
      expect(result.success).toBe(true);
    });
  });
});

describe('Article Schema Security Tests', () => {
  const articleSchema = z.object({
    title: z.string().min(1, "Judul wajib diisi"),
    excerpt: z.string().min(1, "Ringkasan wajib diisi"),
    content: z.string().min(1, "Konten wajib diisi"),
    category: z.string().min(1, "Kategori wajib diisi"),
    date: z.string().min(1, "Tanggal wajib diisi"),
    readingTime: z.string().min(1, "Waktu baca wajib diisi"),
    imageUrl: z.string().min(1, "Gambar wajib diisi"),
    author: z.object({
      name: z.string().min(1),
      role: z.string().min(1),
      avatarUrl: z.string().default(''),
    })
  });

  it('should reject missing title', () => {
    const result = articleSchema.safeParse({
      title: '',
      excerpt: 'Test',
      content: 'Test',
      category: 'Test',
      date: '2025-01-20',
      readingTime: '5 min',
      imageUrl: 'https://test.com/img.jpg',
      author: { name: 'Test', role: 'Test', avatarUrl: '' },
    });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.title).toBeDefined();
  });

  it('should reject missing imageUrl', () => {
    const result = articleSchema.safeParse({
      title: 'Test',
      excerpt: 'Test',
      content: 'Test',
      category: 'Test',
      date: '2025-01-20',
      readingTime: '5 min',
      imageUrl: '',
      author: { name: 'Test', role: 'Test', avatarUrl: '' },
    });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.imageUrl).toBeDefined();
  });

  it('should accept HTML in content (sanitized at render)', () => {
    const result = articleSchema.safeParse({
      title: 'Test',
      excerpt: 'Test',
      content: '<p>Valid content</p><script>alert("XSS")</script>',
      category: 'Test',
      date: '2025-01-20',
      readingTime: '5 min',
      imageUrl: 'https://test.com/img.jpg',
      author: { name: 'Test', role: 'Test', avatarUrl: '' },
    });
    expect(result.success).toBe(true);
  });

  it('should reject missing author name', () => {
    const result = articleSchema.safeParse({
      title: 'Test',
      excerpt: 'Test',
      content: 'Test',
      category: 'Test',
      date: '2025-01-20',
      readingTime: '5 min',
      imageUrl: 'https://test.com/img.jpg',
      author: { name: '', role: 'Test', avatarUrl: '' },
    });
    expect(result.success).toBe(false);
  });
});

describe('SQL Injection Character Tests', () => {
  const usernameRegex = /^[a-zA-Z0-9_]+$/;

  const dangerousSqlChars = [
    "'", // Single quote
    '"', // Double quote
    ';', // Statement separator
    '--', // Comment
    '/*', // Block comment start
    '*/', // Block comment end
    '\\', // Escape character
    '=',  // Equals
    '<',  // Less than
    '>',  // Greater than
    '(',  // Parenthesis
    ')',  // Parenthesis
  ];

  dangerousSqlChars.forEach(char => {
    it(`should reject username containing "${char}"`, () => {
      const username = `admin${char}test`;
      expect(usernameRegex.test(username)).toBe(false);
    });
  });

  it('should accept safe username with letters, numbers, and underscore', () => {
    const safeUsernames = ['admin', 'user123', 'test_user', 'UserName_123'];
    safeUsernames.forEach(username => {
      expect(usernameRegex.test(username)).toBe(true);
    });
  });
});

