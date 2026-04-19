import getCaretCoordinates from 'textarea-caret';

export function getTextContent(el: HTMLElement): string {
  return el instanceof HTMLTextAreaElement ? el.value : el.innerText;
}

export function detectTrigger(text: string, key: string): string | null {
  const regex = buildTriggerRegex(key);
  // TODO: カーソル位置も考慮して、トリガーがカーソルの前にあるかを判定する必要がある
  const match = text.match(regex);
  return match ? (match[1] ?? '') : null;
}

type EditorType = 'Lexical' | 'ProseMirror' | undefined;
type ProseMirrorType = 'Tiptap' | 'normal';
interface EditorInfo { type: EditorType; proseMirrorType?: ProseMirrorType; }
export function insertPrompt(inputBox: HTMLElement, prompt: string, triggerKey: string): void {
  const regex = buildTriggerRegex(triggerKey);

  if (inputBox instanceof HTMLTextAreaElement) {
    insertViaTextAreaValue(inputBox, regex, prompt);
  } else if (inputBox instanceof HTMLDivElement) {
    const editorInfo = detectEditorType(inputBox);

    switch (editorInfo.type) {
      case 'Lexical':
        console.log('Detected Lexical editor');
        insertViaExecCommand(inputBox, regex, prompt);
        break;
      case 'ProseMirror':
        console.log('Detected ProseMirror editor:', editorInfo.proseMirrorType);
        editorInfo.proseMirrorType === 'Tiptap'
          ? insertViaExecCommand(inputBox, regex, prompt)
          : insertViaInnerText(inputBox, regex, prompt);
        break;
      default:
        console.log('Unknown editor type, using fallback insertion');
        insertViaFallback(inputBox, regex, prompt);
        break;
    }
  }

  // TODO: 変数の検出を行う
  
  inputBox.focus();
}

export type CursorPosition = { top: number; left: number; height: number };
export function getCursorPosition(inputBox: HTMLElement): CursorPosition | null {
  return inputBox instanceof HTMLTextAreaElement
    ? textareaCursorPosition(inputBox)
    : contentEditableCursorPosition();
}

function buildTriggerRegex(key: string): RegExp {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(?:^|\\r?\\n|\\s)${escapedKey}([^\\s\\r\\n]*)`);
}

function detectEditorType(el: HTMLElement): EditorInfo {
  if (el.getAttribute('data-lexical-editor') === 'true' || el.closest('[data-lexical-editor="true"]') || el.id === 'ask-input') return { type: 'Lexical' };
  if (el.closest('.ProseMirror') || el.classList.contains('ProseMirror')) return { type: 'ProseMirror', proseMirrorType: detectProseMirrorType(el) };
  return { type: undefined };
}

function detectProseMirrorType(el: HTMLElement): ProseMirrorType {
  return (el as any).__tiptapEditor || el.closest('.tiptap') || el.closest("[data-editor='tiptap']") ? 'Tiptap' : 'normal';
}

function insertViaTextAreaValue(el: HTMLTextAreaElement, regex: RegExp, prompt: string): void {
  const newText = el.value.replace(regex, (match) => {
    const leadingSpace = match.startsWith(' ') ? ' ' : '';
    return leadingSpace + prompt;
  });

  el.value = newText;
  el.selectionStart = el.selectionEnd = newText.length;

  console.log('Inserted via textarea value');

  el.dispatchEvent(new Event('input', { bubbles: true }));
}

function insertViaExecCommand(el: HTMLDivElement, regex: RegExp, prompt: string, onFallback?: (text: string) => void): void {
  // TODO: regexでテキストを置き換える処理が必要
  const text = prompt + '  ';
  try {
    const selection = window.getSelection();
    if (!selection) throw new Error('No selection available');

    const range = document.createRange();
    range.selectNodeContents(el);
    selection.removeAllRanges();
    selection.addRange(range);

    document.execCommand('delete', false, undefined);
    if (!document.execCommand('insertText', false, text)) throw new Error('execCommand failed');
  } catch (error) {
    console.warn('execCommand insert failed:', error);

    if (onFallback) {
      onFallback(text);
      return;
    }
    insertViaEvent(el, text);
  }

  console.log('Inserted via execCommand');

  moveCursorToEnd(el);
  el.dispatchEvent(new Event('change', { bubbles: true }));
}

function insertViaInnerText(el: HTMLDivElement, regex: RegExp, prompt: string): void {
  try {
    const newText = el.innerText.replace(regex, (match) => {
      const leadingSpace = match.startsWith(' ') ? ' ' : '';
      return leadingSpace + prompt;
    });

    el.innerText = newText;

    console.log('Inserted via innerText');

    moveCursorToEnd(el);
    el.dispatchEvent(new InputEvent('input', { bubbles: true }));
  } catch (error) {
    console.warn('innerText insert failed:', error);
    insertViaExecCommand(el, regex, prompt);
  }
}

function insertViaFallback(el: HTMLDivElement, regex: RegExp, prompt: string): void {
  insertViaExecCommand(el, regex, prompt, (text) => {
    el.textContent = text;
    console.log('Inserted via fallback');
    moveCursorToEnd(el);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  });
}

function insertViaEvent(el: HTMLDivElement, text: string): void {
  try {
    el.dispatchEvent(
      new InputEvent('beforeinput', {
        inputType: 'insertText',
        data: text,
        bubbles: true,
        cancelable: true,
      }),
    );
    el.dispatchEvent(new Event('input', { bubbles: true }));
    console.log('Inserted via event');
  } catch (error) {
    console.warn('Event-based insert failed:', error);
    el.textContent = text;
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }
}

function moveCursorToEnd(el: HTMLDivElement): void {
  const selection = window.getSelection();
  if (!selection) return;

  try {
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  } catch (error) {
    console.warn('Failed to move cursor:', error);
  }
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

  // カーソル位置に一時的な要素を作成して、その位置を取得
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
