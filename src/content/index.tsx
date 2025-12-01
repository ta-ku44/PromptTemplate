import { loadStoredData } from '../utils/storage';

let currentTextArea: HTMLElement | null = null;

const init = () => {
  console.log('PromptTemplateを初期化:',window.location.href);

  if (currentTextArea) {
    currentTextArea.removeEventListener('input', handleInput);
    currentTextArea = null;
  }

  const checkInterval = setInterval(() => {
    const textAreas = findTextAreas();{
      if (textAreas) {
        console.log('入力欄を取得:', textAreas);

        textAreas.addEventListener('input', handleInput);
        currentTextArea = textAreas;

        clearInterval(checkInterval);
      } else {
        console.warn('入力欄はまだ未取得');
      }
    }
  }, 1000);

  setTimeout(() => clearInterval(checkInterval), 10000);
}

//* 入力欄が有効かチェック */
const isValidInput = (element: HTMLElement): boolean => {
  const style = window.getComputedStyle(element);
  return style.display !== 'none' && 
         style.visibility !== 'hidden' && 
         element.offsetParent !== null &&
         element.getBoundingClientRect().width > 0 &&
         element.getBoundingClientRect().height > 0
};

const findTextAreas = (): HTMLElement | null => {
  const selectors = [
    '[role="textbox"]', // textboxを探索
    'textarea:not([disabled]):not([readonly])', // textareaを探索
    '[contenteditable="true"]' // contenteditableを探索
  ];

  for (const s of selectors) {
    const elements = document.querySelectorAll(s);
    for (const el of elements) {
      const htmlEl = el as HTMLElement;
      if (isValidInput(htmlEl)) return htmlEl;
      }
  }
  return null;
};

//** 入力イベントのハンドラ */
const handleInput = async (event: Event) => {
  const target = event.target as HTMLTextAreaElement | HTMLDivElement;
  const text = target.textContent || (target as HTMLTextAreaElement).value || '';
  
  const match = text.match(/;;(\w*)$/);
  if (match) {
    const query = match[1];
    await showDropdown(query, target as HTMLElement);
  } else {
    hideDropdown();
  }
}

/** ドロップダウンを表示 */
const showDropdown = async (query: string, textarea: HTMLElement) => {
  const data = await loadStoredData();
  const templates = data.templates.filter(t => 
    t.name.toLowerCase().includes(query.toLowerCase())
  );

  if (templates.length > 0) return;
  console.log('テンプレート候補:', templates);
  console.log('ドロップダウンを表示:', textarea);
}

/** ドロップダウンを非表示 */
const hideDropdown = () => {
  // TODO: ドロップダウンを非表示にする処理
}

/** テンプレート選択時の処理 */
// const handleTemplateSelect = (template: Template) => {
//   // TODO: テンプレート内容を入力欄に挿入
//   console.log('テンプレート選択:', template);

//   hideDropdown()
// }

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}