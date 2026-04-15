export class DomObserver {
  private curInputBox: HTMLElement | null = null;
  private observer: MutationObserver | null = null;
  private onFound: (inputBox: HTMLElement) => void;
  private onLost?: () => void;

  constructor(opts: { onFound: (inputBox: HTMLElement) => void; onLost?: () => void }) {
    this.onFound = opts.onFound;
    this.onLost = opts.onLost;
  }

  public start() {
    if (this.observer) this.observer.disconnect();

    this.observer = new MutationObserver(() => {
      if (this.curInputBox && document.body.contains(this.curInputBox) && this.isVisibleInput(this.curInputBox)) return;
      if (this.curInputBox && !document.body.contains(this.curInputBox)) {
        this.curInputBox = null;
        this.onLost?.();
      }
      this.assignInputBox();
    });

    this.observer.observe(document.body, { childList: true, subtree: true });
  }

  public stop() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.curInputBox = null;
  }

  private assignInputBox() {
    const foundInputBox = this.findInputBox();

    if (foundInputBox && foundInputBox !== this.curInputBox) {
      this.curInputBox = foundInputBox;
      this.onFound(foundInputBox);
    }
  }

  private findInputBox(): HTMLElement | null {
    const selectors = [
      '[contenteditable="true"]',
      'textarea:not([disabled]):not([readonly])'
    ];

    for (const s of selectors) {
      const elements = document.querySelectorAll(s);
      for (const el of elements) {
        const htmlEl = el as HTMLElement;
        if (this.isVisibleInput(htmlEl)) return htmlEl;
      }
    }
    return null;
  }

  private isVisibleInput(el: HTMLElement): boolean {
    if (!el || !el.isConnected) return false;

    const style = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();

    return (
      style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      el.offsetParent !== null &&
      rect.width > 0 &&
      rect.height > 0
    );
  }
}
