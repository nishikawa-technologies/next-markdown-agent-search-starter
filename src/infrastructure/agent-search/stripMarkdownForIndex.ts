/**
 * Markdown から検索用プレーンテキストをざっくり抽出する（完全一致ではない）
 */
export function stripMarkdownForIndex(markdown: string): string {
  let s = markdown;
  // コードフェンス本文を除去（言語宣言行は別扱いで残りがフェンスになる）
  s = s.replace(/```[\s\S]*?```/g, ' ');
  // インラインコード
  s = s.replace(/`[^`]*`/g, ' ');
  // 画像 ![alt](url)
  s = s.replace(/!\[[^\]]*\]\([^)]*\)/g, ' ');
  // リンク [text](url) → text
  s = s.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');
  // ATX見出し
  s = s.replace(/^#{1,6}\s+/gm, ' ');
  // テーブル行のパイプ
  s = s.replace(/\|/g, ' ');
  // HTML ブロック（財務表など）
  s = s.replace(/<[^>]+>/g, ' ');
  // 残記号
  s = s.replace(/[*_>#~=`]/g, ' ');
  s = s.replace(/\s+/g, ' ').trim();

  return s;
}
