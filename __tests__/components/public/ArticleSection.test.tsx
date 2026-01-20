import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ArticleSection } from '@/components/public/ArticleSection';

// Mock the getArticles action
jest.mock('@/app/actions/articles', () => ({
  getArticles: jest.fn(),
}));

// Mock sonner toast
jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

// Mock next/image
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: { src: string; alt: string }) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />;
  };
});

// Mock next/link
jest.mock('next/link', () => {
  return function MockLink({ children, href, ...props }: React.PropsWithChildren<{ href: string }>) {
    return <a href={href} {...props}>{children}</a>;
  };
});

// Mock the Carousel component
jest.mock('@/components/ui/carousel', () => ({
  Carousel: ({ children, setApi }: React.PropsWithChildren<{ setApi?: (api: unknown) => void }>) => {
    // Call setApi with a mock API
    React.useEffect(() => {
      if (setApi) {
        setApi({
          scrollPrev: jest.fn(),
          scrollNext: jest.fn(),
        });
      }
    }, [setApi]);
    return <div data-testid="carousel">{children}</div>;
  },
  CarouselContent: ({ children }: React.PropsWithChildren<object>) => <div>{children}</div>,
  CarouselItem: ({ children }: React.PropsWithChildren<object>) => <div>{children}</div>,
}));

describe('ArticleSection Component', () => {
  const mockArticles = [
    {
      id: '1',
      title: 'Test Article 1',
      excerpt: 'This is test excerpt 1',
      content: 'Full content 1',
      category: 'Dakwah',
      date: '12 Jan 2026',
      readingTime: '5 menit baca',
      imageUrl: 'http://example.com/image1.jpg',
      author: { name: 'Author 1', role: 'Writer', avatarUrl: '' },
    },
    {
      id: '2',
      title: 'Test Article 2',
      excerpt: 'This is test excerpt 2',
      content: 'Full content 2',
      category: 'Lifestyle',
      date: '10 Jan 2026',
      readingTime: '3 menit baca',
      imageUrl: 'http://example.com/image2.jpg',
      author: { name: 'Author 2', role: 'Editor', avatarUrl: '' },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show loading skeleton initially', async () => {
    const { getArticles } = require('@/app/actions/articles');
    // Delay the resolution to catch loading state
    getArticles.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(mockArticles), 100))
    );

    render(<ArticleSection />);

    // Loading skeletons should be visible initially
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should render section header', async () => {
    const { getArticles } = require('@/app/actions/articles');
    getArticles.mockResolvedValue(mockArticles);

    render(<ArticleSection />);

    await waitFor(() => {
      expect(screen.getByText('Artikel Terbaru')).toBeInTheDocument();
      expect(screen.getByText(/Wawasan & Literasi/i)).toBeInTheDocument();
    });
  });

  it('should render articles after loading', async () => {
    const { getArticles } = require('@/app/actions/articles');
    getArticles.mockResolvedValue(mockArticles);

    render(<ArticleSection />);

    await waitFor(() => {
      expect(screen.getByText('Test Article 1')).toBeInTheDocument();
      expect(screen.getByText('Test Article 2')).toBeInTheDocument();
    });
  });

  it('should display article categories', async () => {
    const { getArticles } = require('@/app/actions/articles');
    getArticles.mockResolvedValue(mockArticles);

    render(<ArticleSection />);

    await waitFor(() => {
      expect(screen.getByText('Dakwah')).toBeInTheDocument();
      expect(screen.getByText('Lifestyle')).toBeInTheDocument();
    });
  });

  it('should display article dates', async () => {
    const { getArticles } = require('@/app/actions/articles');
    getArticles.mockResolvedValue(mockArticles);

    render(<ArticleSection />);

    await waitFor(() => {
      expect(screen.getByText('12 Jan 2026')).toBeInTheDocument();
      expect(screen.getByText('10 Jan 2026')).toBeInTheDocument();
    });
  });

  it('should display reading times', async () => {
    const { getArticles } = require('@/app/actions/articles');
    getArticles.mockResolvedValue(mockArticles);

    render(<ArticleSection />);

    await waitFor(() => {
      expect(screen.getByText('5 menit baca')).toBeInTheDocument();
      expect(screen.getByText('3 menit baca')).toBeInTheDocument();
    });
  });

  it('should display article excerpts', async () => {
    const { getArticles } = require('@/app/actions/articles');
    getArticles.mockResolvedValue(mockArticles);

    render(<ArticleSection />);

    await waitFor(() => {
      expect(screen.getByText('This is test excerpt 1')).toBeInTheDocument();
      expect(screen.getByText('This is test excerpt 2')).toBeInTheDocument();
    });
  });

  it('should display author names', async () => {
    const { getArticles } = require('@/app/actions/articles');
    getArticles.mockResolvedValue(mockArticles);

    render(<ArticleSection />);

    await waitFor(() => {
      expect(screen.getByText('Author 1')).toBeInTheDocument();
      expect(screen.getByText('Author 2')).toBeInTheDocument();
    });
  });

  it('should show empty state when no articles', async () => {
    const { getArticles } = require('@/app/actions/articles');
    getArticles.mockResolvedValue([]);

    render(<ArticleSection />);

    await waitFor(() => {
      expect(screen.getByText('Belum ada artikel yang diterbitkan.')).toBeInTheDocument();
    });
  });

  it('should show error toast on fetch failure', async () => {
    const { getArticles } = require('@/app/actions/articles');
    const { toast } = require('sonner');
    getArticles.mockRejectedValue(new Error('Fetch failed'));

    render(<ArticleSection />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Gagal memuat artikel terbaru');
    });
  });

  it('should have links to individual articles', async () => {
    const { getArticles } = require('@/app/actions/articles');
    getArticles.mockResolvedValue(mockArticles);

    render(<ArticleSection />);

    await waitFor(() => {
      // Find links by href attribute
      const allLinks = screen.getAllByRole('link');
      const article1Link = allLinks.find(link => link.getAttribute('href') === '/artikel/1');
      const article2Link = allLinks.find(link => link.getAttribute('href') === '/artikel/2');
      
      expect(article1Link).toBeDefined();
      expect(article2Link).toBeDefined();
    });
  });

  it('should render navigation buttons', async () => {
    const { getArticles } = require('@/app/actions/articles');
    getArticles.mockResolvedValue(mockArticles);

    render(<ArticleSection />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /previous article/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /next article/i })).toBeInTheDocument();
    });
  });

  it('should disable navigation buttons when no articles', async () => {
    const { getArticles } = require('@/app/actions/articles');
    getArticles.mockResolvedValue([]);

    render(<ArticleSection />);

    await waitFor(() => {
      const prevButton = screen.getByRole('button', { name: /previous article/i });
      const nextButton = screen.getByRole('button', { name: /next article/i });
      expect(prevButton).toBeDisabled();
      expect(nextButton).toBeDisabled();
    });
  });

  it('should show "No Image" placeholder when imageUrl is missing', async () => {
    const { getArticles } = require('@/app/actions/articles');
    const articlesWithNoImage = [{
      ...mockArticles[0],
      imageUrl: '',
    }];
    getArticles.mockResolvedValue(articlesWithNoImage);

    render(<ArticleSection />);

    await waitFor(() => {
      expect(screen.getByText('No Image')).toBeInTheDocument();
    });
  });

  it('should call getArticles with limit 6', async () => {
    const { getArticles } = require('@/app/actions/articles');
    getArticles.mockResolvedValue(mockArticles);

    render(<ArticleSection />);

    await waitFor(() => {
      expect(getArticles).toHaveBeenCalledWith(6);
    });
  });
});
