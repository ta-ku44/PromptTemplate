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

export function getCursorPosition(inputBox: HTMLElement): { top: number; left: number; height: number } | null {
  return inputBox instanceof HTMLTextAreaElement
    ? textareaCursorPosition(inputBox)
    : contentEditableCursorPosition();
}

function buildTriggerRegex(key: string): RegExp {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(?:^|\\s)${escapedKey}(\\S*)$`);
}

function textareaCursorPosition(textarea: HTMLTextAreaElement): { top: number; left: number; height: number } {
  const coords = getCaretCoordinates(textarea, textarea.selectionStart);
  const box = textarea.getBoundingClientRect();
  return {
    top: box.top + coords.top - textarea.scrollTop,
    left: box.left + coords.left,
    height: coords.height,
  };
}

function contentEditableCursorPosition(): { top: number; left: number; height: number } | null {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return null;
  const rect = sel.getRangeAt(0).getBoundingClientRect();
  return {
    top: rect.top,
    left: rect.left,
    height: rect.height,
  };
}
