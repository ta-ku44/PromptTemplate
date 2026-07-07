import { insertFallback, insertViaExecCommand, insertViaInnerText, insertViaTextAreaValue } from './adapters';

type EditorType = 'textarea' | 'lexical' | 'tiptap' | 'proseMirror' | 'fallback';

function isLexicalEditor(el: HTMLElement): boolean {
  return el.getAttribute('data-lexical-editor') === 'true' || !!el.closest('[data-lexical-editor="true"]') || el.id === 'ask-input';
}

function isTiptapEditor(el: HTMLElement): boolean {
  return !!(el as any).__tiptapEditor || !!el.closest('.tiptap') || !!el.closest("[data-editor='tiptap']");
}

function isProseMirrorEditor(el: HTMLElement): boolean {
  return !!el.closest('.ProseMirror') || el.classList.contains('ProseMirror');
}

function detectEditorType(el: HTMLElement): EditorType {
  if (el instanceof HTMLTextAreaElement) return 'textarea';
  if (isLexicalEditor(el)) return 'lexical';
  if (isTiptapEditor(el)) return 'tiptap';
  if (isProseMirrorEditor(el)) return 'proseMirror';
  return 'fallback';
}

export function insert(el: HTMLElement, regex: RegExp, prompt: string): void {
  switch (detectEditorType(el)) {
    case 'textarea':
      return insertViaTextAreaValue(el as HTMLTextAreaElement, regex, prompt);
    case 'lexical':
    case 'tiptap':
      return insertViaExecCommand(el, regex, prompt);
    case 'proseMirror':
      return insertViaInnerText(el, regex, prompt);
    default:
      return insertFallback(el, regex, prompt);
  }
}
