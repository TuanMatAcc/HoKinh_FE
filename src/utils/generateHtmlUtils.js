import { generateHTML } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import DOMPurify from 'dompurify' // Install: npm install dompurify
const extensions = [
  StarterKit,
];

export const generateHTMLFromJSON = (content) => {
  if (!content) return '';
  
  try {
    // Parse JSON string to object
    const jsonContent = typeof content === 'string' ? JSON.parse(content) : content;
    // TipTap's generateHTML is safe - it only generates HTML from structured JSON
    return generateHTML(jsonContent, extensions);
  } catch (e) {
    // If parsing fails, assume it might be HTML and sanitize it
    console.warn('Failed to parse as JSON, treating as HTML:', e);
    
    if (typeof content === 'string') {
      // Sanitize HTML to remove malicious scripts
      return DOMPurify.sanitize(content, {
        ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'a'],
        ALLOWED_ATTR: ['href', 'target', 'rel']
      });
    }
    
    return '';
  }
};