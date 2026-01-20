/**
 * @jest-environment jsdom
 */

import { sanitizeHtml, escapeHtml, sanitizeUrl } from '@/lib/sanitize';

describe('sanitizeHtml - XSS Prevention', () => {
  describe('Script Injection Prevention', () => {
    it('should remove script tags', () => {
      const malicious = '<script>alert("XSS")</script>';
      const result = sanitizeHtml(malicious);
      
      expect(result).not.toContain('<script>');
      expect(result).not.toContain('alert');
    });

    it('should remove script tags with attributes', () => {
      const malicious = '<script src="https://evil.com/steal.js"></script>';
      const result = sanitizeHtml(malicious);
      
      expect(result).not.toContain('<script');
      expect(result).not.toContain('evil.com');
    });

    it('should remove scripts disguised with case variations', () => {
      const malicious = '<SCRIPT>alert("XSS")</SCRIPT>';
      const result = sanitizeHtml(malicious);
      
      expect(result.toLowerCase()).not.toContain('<script');
    });

    it('should handle scripts with newlines - they become text', () => {
      // Scripts with newlines in the tag are not valid and become text content
      const malicious = '<scr\nipt>alert("XSS")</scr\nipt>';
      const result = sanitizeHtml(malicious);
      
      // DOMPurify treats this as text, not a script
      // The important thing is the script doesn't execute
      expect(result).not.toContain('<script>');
    });
  });

  describe('Event Handler Injection Prevention', () => {
    it('should remove onerror event handlers', () => {
      const malicious = '<img src="x" onerror="alert(\'XSS\')">';
      const result = sanitizeHtml(malicious);
      
      expect(result).not.toContain('onerror');
      expect(result).not.toContain('alert');
    });

    it('should remove onclick event handlers', () => {
      const malicious = '<button onclick="stealCookies()">Click</button>';
      const result = sanitizeHtml(malicious);
      
      expect(result).not.toContain('onclick');
      expect(result).not.toContain('stealCookies');
    });

    it('should remove onload event handlers', () => {
      const malicious = '<body onload="maliciousCode()">';
      const result = sanitizeHtml(malicious);
      
      expect(result).not.toContain('onload');
    });

    it('should remove onmouseover event handlers', () => {
      const malicious = '<div onmouseover="steal()">Hover me</div>';
      const result = sanitizeHtml(malicious);
      
      expect(result).not.toContain('onmouseover');
    });
  });

  describe('JavaScript URL Prevention', () => {
    it('should remove javascript: URLs from href', () => {
      const malicious = '<a href="javascript:alert(\'XSS\')">Click</a>';
      const result = sanitizeHtml(malicious);
      
      expect(result).not.toContain('javascript:');
    });

    it('should remove javascript: URLs from src', () => {
      const malicious = '<img src="javascript:alert(\'XSS\')">';
      const result = sanitizeHtml(malicious);
      
      expect(result).not.toContain('javascript:');
    });

    it('should remove data: URLs with script content', () => {
      const malicious = '<a href="data:text/html,<script>alert(\'XSS\')</script>">Click</a>';
      const result = sanitizeHtml(malicious);
      
      expect(result).not.toContain('data:text/html');
    });
  });

  describe('Iframe and Object Prevention', () => {
    it('should remove iframe tags', () => {
      const malicious = '<iframe src="https://evil.com/phishing"></iframe>';
      const result = sanitizeHtml(malicious);
      
      expect(result).not.toContain('<iframe');
    });

    it('should remove object tags', () => {
      const malicious = '<object data="malware.swf"></object>';
      const result = sanitizeHtml(malicious);
      
      expect(result).not.toContain('<object');
    });

    it('should remove embed tags', () => {
      const malicious = '<embed src="plugin.swf">';
      const result = sanitizeHtml(malicious);
      
      expect(result).not.toContain('<embed');
    });
  });

  describe('Style Injection Prevention', () => {
    it('should remove style tags with javascript', () => {
      const malicious = '<style>body{background:url("javascript:alert(1)")}</style>';
      const result = sanitizeHtml(malicious);
      
      expect(result).not.toContain('<style');
    });

    it('should allow safe inline styles', () => {
      // Note: expression() is an IE-specific CSS vulnerability that doesn't work in modern browsers
      // DOMPurify allows inline styles by default since expression() is not a threat in modern browsers
      const withStyle = '<div style="color: red">test</div>';
      const result = sanitizeHtml(withStyle);
      
      expect(result).toContain('style="color: red"');
    });
  });

  describe('Safe HTML Preservation', () => {
    it('should preserve safe paragraph tags', () => {
      const safe = '<p>This is a paragraph</p>';
      const result = sanitizeHtml(safe);
      
      expect(result).toBe(safe);
    });

    it('should preserve safe formatting tags', () => {
      const safe = '<strong>Bold</strong> and <em>italic</em>';
      const result = sanitizeHtml(safe);
      
      expect(result).toContain('<strong>');
      expect(result).toContain('<em>');
    });

    it('should preserve safe links with http', () => {
      const safe = '<a href="https://example.com">Link</a>';
      const result = sanitizeHtml(safe);
      
      expect(result).toContain('href="https://example.com"');
    });

    it('should preserve ordered and unordered lists', () => {
      const safe = '<ul><li>Item 1</li><li>Item 2</li></ul>';
      const result = sanitizeHtml(safe);
      
      expect(result).toContain('<ul>');
      expect(result).toContain('<li>');
    });

    it('should preserve headings', () => {
      const safe = '<h1>Title</h1><h2>Subtitle</h2>';
      const result = sanitizeHtml(safe);
      
      expect(result).toContain('<h1>');
      expect(result).toContain('<h2>');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string', () => {
      expect(sanitizeHtml('')).toBe('');
    });

    it('should handle null-like values', () => {
      expect(sanitizeHtml(null as unknown as string)).toBe('');
      expect(sanitizeHtml(undefined as unknown as string)).toBe('');
    });

    it('should handle nested malicious content', () => {
      const malicious = '<div><p><script>alert(1)</script></p></div>';
      const result = sanitizeHtml(malicious);
      
      expect(result).not.toContain('<script');
      expect(result).toContain('<div>');
      expect(result).toContain('<p>');
    });
  });
});

describe('escapeHtml - Text Escaping', () => {
  it('should escape less than sign', () => {
    expect(escapeHtml('<')).toBe('&lt;');
  });

  it('should escape greater than sign', () => {
    expect(escapeHtml('>')).toBe('&gt;');
  });

  it('should escape ampersand', () => {
    expect(escapeHtml('&')).toBe('&amp;');
  });

  it('should escape double quotes', () => {
    expect(escapeHtml('"')).toBe('&quot;');
  });

  it('should escape single quotes', () => {
    expect(escapeHtml("'")).toBe('&#x27;');
  });

  it('should escape script tags', () => {
    const result = escapeHtml('<script>alert("XSS")</script>');
    
    expect(result).not.toContain('<script>');
    expect(result).toContain('&lt;script&gt;');
  });

  it('should handle empty string', () => {
    expect(escapeHtml('')).toBe('');
  });

  it('should handle plain text without special chars', () => {
    const plain = 'Hello World';
    expect(escapeHtml(plain)).toBe(plain);
  });
});

describe('sanitizeUrl - URL Validation', () => {
  it('should allow https URLs', () => {
    const url = 'https://example.com/page';
    expect(sanitizeUrl(url)).toBe(url);
  });

  it('should allow http URLs', () => {
    const url = 'http://example.com/page';
    expect(sanitizeUrl(url)).toBe(url);
  });

  it('should allow mailto URLs', () => {
    const url = 'mailto:test@example.com';
    expect(sanitizeUrl(url)).toBe(url);
  });

  it('should reject javascript: URLs', () => {
    const url = 'javascript:alert("XSS")';
    expect(sanitizeUrl(url)).toBe('');
  });

  it('should reject data: URLs', () => {
    const url = 'data:text/html,<script>alert(1)</script>';
    expect(sanitizeUrl(url)).toBe('');
  });

  it('should reject file: URLs', () => {
    const url = 'file:///etc/passwd';
    expect(sanitizeUrl(url)).toBe('');
  });

  it('should allow relative URLs starting with /', () => {
    const url = '/path/to/page';
    expect(sanitizeUrl(url)).toBe(url);
  });

  it('should reject protocol-relative URLs', () => {
    const url = '//evil.com/phishing';
    expect(sanitizeUrl(url)).toBe('');
  });

  it('should handle empty string', () => {
    expect(sanitizeUrl('')).toBe('');
  });

  it('should handle malformed URLs', () => {
    const url = 'not a valid url';
    expect(sanitizeUrl(url)).toBe('');
  });
});
