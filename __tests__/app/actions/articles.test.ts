/**
 * @jest-environment node
 */
import {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} from '@/app/actions/articles';

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

describe('Article Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getArticles', () => {
    it('should return empty array when no articles exist', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({ data: [], error: null }),
        }),
      });

      const result = await getArticles();
      expect(result).toEqual([]);
    });

    it('should return articles with correct field mapping', async () => {
      const mockArticles = [
        {
          id: '1',
          title: 'Article 1',
          excerpt: 'Excerpt 1',
          content: 'Content 1',
          category: 'news',
          date: '2025-01-01',
          reading_time: '5 min',
          image_url: 'http://example.com/img1.jpg',
          author_name: 'John Doe',
          author_role: 'Admin',
          author_avatar_url: 'http://example.com/avatar.jpg',
        },
      ];

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({ data: mockArticles, error: null }),
        }),
      });

      const result = await getArticles();
      expect(result).toHaveLength(1);
      expect(result[0].readingTime).toBe('5 min');
      expect(result[0].imageUrl).toBe('http://example.com/img1.jpg');
      expect(result[0].author.name).toBe('John Doe');
      expect(result[0].author.avatarUrl).toBe('http://example.com/avatar.jpg');
    });

    it('should limit results when limit param is provided', async () => {
      const mockOrderFn = jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue({
          data: [{
            id: '1', title: 'Article 1', excerpt: 'Ex', content: 'Con',
            category: 'news', date: '2025-01-01', reading_time: '5 min',
            image_url: '', author_name: 'Author', author_role: 'Role', author_avatar_url: ''
          }],
          error: null
        }),
      });

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: mockOrderFn,
        }),
      });

      const result = await getArticles(1);
      expect(result).toHaveLength(1);
    });

    it('should return empty array on error', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({ data: null, error: { message: 'DB error' } }),
        }),
      });

      const result = await getArticles();
      expect(result).toEqual([]);
    });
  });

  describe('getArticleById', () => {
    it('should return null for non-existent article', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } }),
          }),
        }),
      });

      const result = await getArticleById('non-existent-id');
      expect(result).toBeNull();
    });

    it('should return article when found', async () => {
      const mockArticle = {
        id: 'valid-id',
        title: 'Found Article',
        excerpt: 'Excerpt',
        content: 'Full content',
        category: 'tips',
        date: '2025-02-01',
        reading_time: '10 min',
        image_url: 'http://example.com/article.jpg',
        author_name: 'Jane Smith',
        author_role: 'Editor',
        author_avatar_url: '',
      };

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: mockArticle, error: null }),
          }),
        }),
      });

      const result = await getArticleById('valid-id');
      expect(result).not.toBeNull();
      expect(result?.title).toBe('Found Article');
      expect(result?.author.name).toBe('Jane Smith');
    });
  });

  describe('createArticle', () => {
    const validArticle = {
      title: 'New Article',
      excerpt: 'New excerpt',
      content: 'New content',
      category: 'news',
      date: '2025-03-01',
      readingTime: '7 min',
      imageUrl: 'http://example.com/new.jpg',
      author: {
        name: 'New Author',
        role: 'Writer',
        avatarUrl: '',
      },
    };

    it('should throw Unauthorized if not authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'Not authenticated' },
      });

      await expect(createArticle(validArticle)).rejects.toThrow('Unauthorized');
    });

    it('should throw validation error for missing title', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      });

      await expect(
        createArticle({ ...validArticle, title: '' })
      ).rejects.toThrow('Validation failed');
    });

    it('should throw validation error for missing image', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      });

      await expect(
        createArticle({ ...validArticle, imageUrl: '' })
      ).rejects.toThrow('Validation failed');
    });

    it('should create article successfully', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockResolvedValue({
            data: [{ id: 'new-article-id', ...validArticle }],
            error: null,
          }),
        }),
      });

      const result = await createArticle(validArticle);
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('updateArticle', () => {
    const validArticle = {
      id: 'article-id',
      title: 'Updated Article',
      excerpt: 'Updated excerpt',
      content: 'Updated content',
      category: 'tips',
      date: '2025-03-15',
      readingTime: '8 min',
      imageUrl: 'http://example.com/updated.jpg',
      author: {
        name: 'Updated Author',
        role: 'Senior Writer',
        avatarUrl: '',
      },
    };

    it('should throw Unauthorized if not authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'Not authenticated' },
      });

      await expect(updateArticle(validArticle)).rejects.toThrow('Unauthorized');
    });

    it('should update article successfully', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            select: jest.fn().mockResolvedValue({
              data: [validArticle],
              error: null,
            }),
          }),
        }),
      });

      const result = await updateArticle(validArticle);
      expect(result.success).toBe(true);
    });
  });

  describe('deleteArticle', () => {
    it('should throw Unauthorized if not authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'Not authenticated' },
      });

      await expect(deleteArticle('article-id')).rejects.toThrow('Unauthorized');
    });

    it('should delete article and its image successfully', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      });

      // Mock getting the article first (to get image URL)
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { image_url: 'http://example.com/storage/v1/object/public/images/test.jpg' },
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

      await expect(deleteArticle('article-id')).resolves.not.toThrow();
    });

    it('should throw error on delete failure', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      });

      // Mock getting the article
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: { image_url: null }, error: null }),
          }),
        }),
      });

      // Mock delete failure
      mockSupabase.from.mockReturnValueOnce({
        delete: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ error: { message: 'Delete failed' } }),
        }),
      });

      await expect(deleteArticle('article-id')).rejects.toThrow('Failed to delete article');
    });
  });
});
