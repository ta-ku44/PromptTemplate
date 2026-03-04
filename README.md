# Prompt Library

## 概要

日常的な LLM 活用において頻繁に入力するプロンプトを一元管理し、保存 / 管理 / 呼出 の各操作をブラウザ上で完結させる Chrome / Firefox 拡張機能です。

## インストール

### Chrome ウェブストア経由

1. [Chrome ウェブストア](https://chromewebstore.google.com/)のページにアクセス
2. 「Chrome に追加」をクリック
3. 確認ダイアログで「拡張機能を追加」をクリック

### Firefox アドオンストア経由

1. [Firefox アドオンストア](https://addons.mozilla.org/ja/firefox/)のページにアクセス
2. 「Firefox へ追加」をクリック
3. 確認ダイアログで「追加」をクリック

## 利用方法

### プロンプトの呼び出し

入力欄にトリガーキー（デフォルト: `#`）を入力するとサジェストが表示されます。
候補を選択すると、プロンプトが入力欄に挿入されます。

### プロンプトの管理

カテゴリごとにプロンプトを作成・整理できます。
プロンプトの編集時には、プロンプト名と内容を記入します。
カテゴリとプロンプトはそれぞれ Drag & Drop で並び替えが可能です。

### 変数の埋め込み

プロンプト内に {{name: 型}} の形式で変数を埋め込めます。
変数を含むプロンプトを呼び出すと、挿入前にモーダルが表示され、各変数の値を入力できます。
挿入後は変数部分の右側に記号が表示され、クリックするとその箇所へカーソルが移動します。

#### 型定義

| 型  | 記法例 | 入力値 |
| --- | --- | --- |
| string | {{topic: string}} | 任意のテキスト |
| int | {{count: int}} | 整数 |
| float | {{rate: float}} | 小数 |
| url | {{link: url}} | URL |
| date | {{day: date}} | 2026-01-01 |
| datetime | {{deadline: datetime}} | 2026-01-01 12:00:00 |
| time | {{time: time}} | 12:00:00 |
| year | {{year: year}} | 2026 |
| 型 = [...] | {{lang: string = [日本語, English]}} | 選択肢から選択 |

## 動作環境

### 対応サイト

| サイト | URL |
| --- | --- |
| ChatGPT | https://chatgpt.com/ |
| Gemini | https://gemini.google.com/ |
| NotebookLM | https://notebooklm.google.com/ |
| Claude | https://claude.ai/ |
| Grok | https://grok.com/ |
| Copilot | https://copilot.microsoft.com/ |
| GitHub Copilot | https://copilot.github.com/ |
| Genspark | https://genspark.ai/ |
| DeepSeek | https://chat.deepseek.com/ |

### 現在未対応

以下のサイトはリッチテキストエディタの仕様により未対応です（今後のアップデートで対応予定）：
- Perplexity
- Notion AI

## フィードバック・問題報告

不具合や機能要望は [GitHub Issues](https://github.com/ta-ku44/PromptLibrary/issues) までお願いします。
