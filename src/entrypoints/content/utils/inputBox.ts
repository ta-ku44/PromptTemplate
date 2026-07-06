import getCaretCoordinates from 'textarea-caret';

export type CaretRect = { top: number; left: number; height: number };

export function getCaretRect(inputBox: HTMLElement): CaretRect | null {
  if (inputBox instanceof HTMLTextAreaElement || inputBox instanceof HTMLInputElement) {
    const c = getCaretCoordinates(inputBox, inputBox.selectionStart ?? 0);
    const box = inputBox.getBoundingClientRect();
    return { top: box.top + c.top - inputBox.scrollTop, left: box.left + c.left, height: c.height };
  }

  const sel = window.getSelection();
  if (!sel?.rangeCount) return null;

  const range = sel.getRangeAt(0).cloneRange();
  range.collapse(true);

  // カーソル位置に一時的な要素を作成して、その位置を取得
  const span = document.createElement('span');
  span.textContent = '\u200b';
  range.insertNode(span);

  const rect = span.getBoundingClientRect();
  span.remove();

  return { top: rect.top, left: rect.left, height: rect.height };
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

  // TODO: テキストエディタに合わせて抽象化してそれを実行する
  inputBox.focus();
}
