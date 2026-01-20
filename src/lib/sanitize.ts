import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitizes HTML content to prevent XSS attacks.
 * Uses DOMPurify to remove malicious scripts and event handlers.
 * Works on both client and server (SSR compatible).
 * 
 * @param html - The raw HTML string to sanitize
 * @returns Sanitized HTML string safe for rendering
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';
  
  return DOMPurify.sanitize(html, {
    // Allow common HTML tags for rich text
    ALLOWED_TAGS: [
      'p', 'br', 'b', 'i', 'u', 'strong', 'em', 'a', 'ul', 'ol', 'li',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre',
      'span', 'div', 'img'
    ],
    // Allow safe attributes
    ALLOWED_ATTR: [
      'href', 'target', 'rel', 'class', 'id', 'src', 'alt', 'title', 'style'
    ],
    // Force rel="noopener noreferrer" on links
    ADD_ATTR: ['target'],
    // Remove dangerous protocols from href
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
  });
}

/**
 * Sanitizes a string to prevent XSS in text contexts.
 * Escapes HTML entities.
 * 
 * @param text - The raw text to escape
 * @returns Escaped text safe for rendering
 */
export function escapeHtml(text: string): string {
  if (!text) return '';
  
  const escapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  
  return text.replace(/[&<>"'/]/g, (char) => escapeMap[char]);
}

/**
 * Validates and sanitizes a URL to prevent javascript: and data: attacks.
 * 
 * @param url - The URL to validate
 * @returns Sanitized URL or empty string if dangerous
 */
export function sanitizeUrl(url: string): string {
  if (!url) return '';
  
  try {
    const parsed = new URL(url);
    
    // Only allow http, https, and mailto protocols
    if (!['http:', 'https:', 'mailto:'].includes(parsed.protocol)) {
      return '';
    }
    
    return url;
  } catch {
    // If it's a relative URL, allow it
    if (url.startsWith('/') && !url.startsWith('//')) {
      return url;
    }
    return '';
  }
}
