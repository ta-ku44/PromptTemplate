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

function buildTriggerRegex(key: string): RegExp {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(?:^|\\s)${escapedKey}(\\S*)$`);
}
