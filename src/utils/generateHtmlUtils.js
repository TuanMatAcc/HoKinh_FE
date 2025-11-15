import { generateHTML } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

const extensions = [
  StarterKit,
];

// Convert to HTML
export const generateHTMLFromJSON = (content) => generateHTML(JSON.parse(content), extensions);