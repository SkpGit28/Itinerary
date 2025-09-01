import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';

export function renderMarkdown(md: string) {
  const html = marked.parse(md || '') as string;
  const safe = DOMPurify.sanitize(html);
  return safe as string;
}
