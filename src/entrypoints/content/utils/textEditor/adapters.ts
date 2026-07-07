export function insertViaTextAreaValue(el: HTMLTextAreaElement, regex: RegExp, prompt: string): void {
  const newText = el.value.replace(regex, (match) => {
    const leadingSpace = match.startsWith(' ') ? ' ' : '';
    return leadingSpace + prompt;
  });

  el.value = newText;
  el.selectionStart = el.selectionEnd = newText.length;

  el.dispatchEvent(new Event('input', { bubbles: true }));
}

export function moveCursorToEnd(el: HTMLElement): void {
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

export function insertViaEvent(el: HTMLElement, text: string): void {
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
  } catch (error) {
    el.textContent = text;
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }
}

export function insertViaExecCommand(el: HTMLElement, regex: RegExp, prompt: string, onFallback?: (text: string) => void): void {
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

  moveCursorToEnd(el);
  el.dispatchEvent(new Event('change', { bubbles: true }));
}

export function insertViaInnerText(el: HTMLElement, regex: RegExp, prompt: string): void {
  try {
    const newText = el.innerText.replace(regex, (match) => {
      const leadingSpace = match.startsWith(' ') ? ' ' : '';
      return leadingSpace + prompt;
    });

    el.innerText = newText;

    moveCursorToEnd(el);
    el.dispatchEvent(new InputEvent('input', { bubbles: true }));
  } catch (error) {
    console.warn('innerText insert failed:', error);
    insertViaExecCommand(el, regex, prompt);
  }
}

export function insertFallback(el: HTMLElement, regex: RegExp, prompt: string): void {
  insertViaExecCommand(el, regex, prompt, (text) => {
    el.textContent = text;
    moveCursorToEnd(el);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  });
}
