import getCaretCoordinates from 'textarea-caret';

export function getTextContent(el: HTMLElement): string {
  return el instanceof HTMLTextAreaElement ? el.value : el.innerText;
}

export function detectTrigger(text: string, key: string): string | null {
  const regex = buildTriggerRegex(key);
  const match = text.match(regex);
  return match ? (match[1] ?? '') : null;
}

export function insertPrompt(inputBox: HTMLElement, prompt: string, triggerKey: string): void {
  
}

export type CursorPosition = { top: number; left: number; height: number };
export function getCursorPosition(inputBox: HTMLElement): CursorPosition | null {
  return inputBox instanceof HTMLTextAreaElement
    ? textareaCursorPosition(inputBox)
    : contentEditableCursorPosition();
}

function buildTriggerRegex(key: string): RegExp {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(?:^|\\s)${escapedKey}(\\S*)$`);
}

function textareaCursorPosition(textarea: HTMLTextAreaElement): CursorPosition {
  const coords = getCaretCoordinates(textarea, textarea.selectionStart);
  const box = textarea.getBoundingClientRect();
  return {
    top: box.top + coords.top - textarea.scrollTop,
    left: box.left + coords.left,
    height: coords.height,
  };
}

function contentEditableCursorPosition(): CursorPosition | null {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return null;

  const range = sel.getRangeAt(0).cloneRange();
  range.collapse(true);

  const tempSpan = document.createElement('span');
  tempSpan.textContent = '\u200B';
  range.insertNode(tempSpan);

  const rect = tempSpan.getBoundingClientRect();
  tempSpan.remove();

  return {
    top: rect.top,
    left: rect.left,
    height: rect.height,
  };
}
