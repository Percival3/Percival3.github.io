// 计算文章阅读时间和字数统计的工具函数

interface ReadingStats {
  wordCount: number;
  readingTime: number; // 分钟
}

/**
 * 计算文章的阅读时间和字数
 * @param content - Markdown 文章内容
 * @returns 字数和预估阅读时间(分钟)
 */
export function calculateReadingStats(content: string): ReadingStats {
  // 移除 frontmatter (YAML 头部)
  const cleanContent = content.replace(/^---[\s\S]*?---/, '');

  // 移除代码块
  const withoutCodeBlocks = cleanContent.replace(/```[\s\S]*?```/g, '');

  // 移除行内代码
  const withoutInlineCode = withoutCodeBlocks.replace(/`[^`]+`/g, '');

  // 移除链接但保留文字
  const withoutLinks = withoutInlineCode.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');

  // 移除图片
  const withoutImages = withoutLinks.replace(/!\[([^\]]*)\]\([^\)]+\)/g, '');

  // 移除 Markdown 标记符号
  const withoutMarkdown = withoutImages
    .replace(/#{1,6}\s/g, '') // 移除标题符号
    .replace(/[*_~`]/g, '')   // 移除加粗、斜体等
    .replace(/>\s/g, '');     // 移除引用符号

  // 统计中文字符(包括中文标点)
  const chineseChars = withoutMarkdown.match(/[\u4e00-\u9fa5]/g) || [];
  const chineseCount = chineseChars.length;

  // 统计英文单词(通过空格分隔)
  const englishWords = withoutMarkdown
    .replace(/[\u4e00-\u9fa5]/g, '') // 移除中文字符
    .match(/\b\w+\b/g) || [];
  const englishCount = englishWords.length;

  // 总字数 = 中文字符数 + 英文单词数
  const wordCount = chineseCount + englishCount;

  // 阅读速度:
  // - 中文: 300-500 字/分钟，这里取 400
  // - 英文: 200-250 词/分钟，这里取 225
  const chineseReadingTime = chineseCount / 400;
  const englishReadingTime = englishCount / 225;

  // 总阅读时间(分钟)，至少 1 分钟
  const readingTime = Math.max(1, Math.ceil(chineseReadingTime + englishReadingTime));

  return {
    wordCount,
    readingTime,
  };
}

/**
 * 格式化阅读时间文本(多语言)
 */
export function formatReadingTime(minutes: number, lang: string = 'zh'): string {
  const texts = {
    zh: `${minutes} 分钟阅读`,
    en: `${minutes} min read`,
    ja: `${minutes} 分で読めます`,
  };

  return texts[lang as keyof typeof texts] || texts.zh;
}

/**
 * 格式化字数统计文本(多语言)
 */
export function formatWordCount(count: number, lang: string = 'zh'): string {
  const texts = {
    zh: `${count.toLocaleString()} 字`,
    en: `${count.toLocaleString()} words`,
    ja: `${count.toLocaleString()} 文字`,
  };

  return texts[lang as keyof typeof texts] || texts.zh;
}
