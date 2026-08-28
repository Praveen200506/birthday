/**
 * Calculate approximate reading time for article content
 */
export const calculateReadingTime = (content: string): string => {
  if (!content) return "1 min read";
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${Math.max(1, minutes)} min read`;
};

/**
 * Generate clean URL-safe slug from title
 */
export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

/**
 * Basic sanitization to prevent XSS in rendered content while supporting safe markdown
 */
export const sanitizeHtml = (str: string): string => {
  if (!str) return "";
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/on\w+="[^"]*"/gi, "")
    .replace(/on\w+='[^']*'/gi, "")
    .replace(/javascript:/gi, "");
};
