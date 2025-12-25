import { generateHTML } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
const extensions = [
  StarterKit,
];

export const generateHTMLFromJSON = (content) => {
  if (!content) return '';
  
  // Already HTML string
  if (typeof content === 'string' && content.trim().startsWith('<')) {
    return content;
  }
  
  try {
    // Parse JSON string to object
    const jsonContent = typeof content === 'string' ? JSON.parse(content) : content;
    return generateHTML(jsonContent, extensions);
  } catch (e) {
    console.warn('Failed to generate HTML from content:', e);
    // Return original content as fallback
    return typeof content === 'string' ? content : '';
  }
};