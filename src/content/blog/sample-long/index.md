---
title: "长简介示例"
date: "July 18, 2026"
pdf: "note.pdf"
intro: "long"
description: "长简介不在列表展开，点标题进入说明页。"
---

这篇示例用来演示**长简介**分流：列表页只显示标题，点击后进入独立说明页。

说明页会先渲染这段 Markdown（支持公式与代码），再在下方给出标题与 PDF 下载入口。

质能方程写作 $E = mc^2$。块级公式：

$$
\int_{-\infty}^{\infty} e^{-x^2}\,dx = \sqrt{\pi}
$$

一段示意代码：

```ts
export function openPdf(url: string) {
  window.open(url, '_blank', 'noopener');
}
```

正文再多写几句，确保超过自动阈值时也稳定走长简介路径；此处已用 `intro: long` 强制指定。
