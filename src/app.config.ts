import { defineAppConfig } from '#imports';
import { Catalog } from './types/catalog';

declare module 'wxt/utils/define-app-config' {
  export interface WxtAppConfig {
    catalog: Catalog;
    shortcutKey: string;
    theme?: 'light' | 'dark' | 'auto';
  }
}

export default defineAppConfig({
  catalog: {
    // * IDs are replaced with nanoid on initial storage seeding.
    items: [
      { id: '1', name: 'summarize', content: '', categoryId: '1', fractionalIndex: 'a0' },
      { id: '2', name: 'explain', content: '', categoryId: '1', fractionalIndex: 'a1' },
      { id: '3', name: 'fact-check', content: '', categoryId: '1', fractionalIndex: 'a2' },
      { id: '4', name: 'grammar', content: '以下の文章を添削し、改善点について詳細なフィードバックを提供してください。\n\n【入力】\n"{{content: string}}"\n\n※ 入力された文章が空の場合は、「改善したい文章を入力してください。」のみを出力し、その他の内容は出力しないでください。\n\n# 文法・表記\n- 誤字・脱字・表記揺れを修正\n- 助詞（が／は／を／に／で／へ 等）の誤用を修正\n- 主語と述語の不一致や係り受けの不自然さを修正\n- 時制（過去・現在・未来）の不自然な混在を整理\n- 常体（だ・である調）／敬体（です・ます調）の不統一を解消\n- 句読点や基本的な記号の使い方を適切に整える\n\n# スタイル・明瞭さ\n- 文構造や文章全体の流れを確認し、不自然な箇所を示す\n- 冗長・曖昧な表現を簡潔で自然な表現に言い換える\n- 主語の省略や指示語の多用により意味が曖昧な箇所を明確にする\n- 同じ語尾や言い回し、接続表現の繰り返しを改善する\n- 文同士のつながりが不自然な箇所を整える\n\n# 文体・可読性\n- 全体の語調・文体（硬い／柔らかい／口語的 など）を評価\n- 長すぎる文や構造が複雑な文を特定\n- 文脈に応じて、より適切で自然な語彙への改善案を提示\n- 全体を通して一貫した語り口・文体になるよう調整\n\n# 回答形式\n1. 修正済みの文章：修正後の本文のみをコードブロック形式で出力\n2. 主な変更点：重要な修正内容を箇条書きで列挙\n3. スタイルに関する提案：改善の余地がある点を強調\n4. 全体評価：文章の強みと今後の改善ポイントを簡潔にまとめる\n\n意味や意図は変更せず、著者の文体を尊重したまま、自然さ・明瞭さ・正確性を高めてください。', categoryId: '2', fractionalIndex: 'a0' },
      { id: '5', name: 'composition', content: '', categoryId: '2', fractionalIndex: 'a1' },
      { id: '6', name: 'best-words', content: '', categoryId: '2', fractionalIndex: 'a2' },
      { id: '7', name: 'review', content: '', categoryId: '3', fractionalIndex: 'a0' },
      { id: '8', name: 'refactor', content: '', categoryId: '3', fractionalIndex: 'a1' },
      { id: '9', name: 'best-practices', content: '', categoryId: '3', fractionalIndex: 'a2' },
    ],
    categories: [
      { id: '1', name: 'General', fractionalIndex: 'a0' },
      { id: '2', name: 'Writing', fractionalIndex: 'a1' },
      { id: '3', name: 'Code', fractionalIndex: 'a2' },
    ],
  },
  shortcutKey: '#',
  theme: 'auto',
});
