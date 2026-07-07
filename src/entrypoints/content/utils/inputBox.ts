import { offset } from 'caret-pos';
import { insert as insertIntoEditor } from './textEditor/taxonomy';

export type CaretRect = { top: number; left: number; height: number };

export function getCaretRect(inputBox: HTMLElement): CaretRect | null {
  const o = offset(inputBox);
  if (!o) return null;
  return { top: o.top - window.pageYOffset, left: o.left - window.pageXOffset, height: o.height };
}

export function getTextBeforeCursor(el: HTMLElement): string {
  if (el instanceof HTMLTextAreaElement) return el.value.slice(0, el.selectionStart);

  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return '';

  const range = sel.getRangeAt(0);
  const preRange = range.cloneRange();
  preRange.selectNodeContents(el);
  preRange.setEnd(range.endContainer, range.endOffset);

  return preRange.toString();
}

function buildTriggerRegex(key: string): RegExp {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(?:^|[\\r\\n\\s])${escapedKey}([^\\s\\r\\n]*)$`);
}

export function detectTrigger(text: string, key: string): string | null {
  const regex = buildTriggerRegex(key);
  const match = text.match(regex);
  return match ? (match[1] ?? '') : null;
}

export function injectPrompt(inputBox: HTMLElement, prompt: string, key: string): void {
  const regex = buildTriggerRegex(key);
  insertIntoEditor(inputBox, regex, prompt);
  inputBox.focus();
}
