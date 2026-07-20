---
title: "Markdown, 中文, 与数学公式测试"
date: "May 2, 2026"
author: "Z.PC"
description: "展示中文排版（思源宋体）、代码高亮以及由 KaTeX 渲染的复杂数学公式..."
category: "essays"
---

由于设置了 `Noto Serif SC` (思源宋体) 作为主字体，中文的阅读体验非常棒。同时我们原生支持在 MDX/Markdown 中书写**加粗**、*斜体* 和删除线等基本样式。

## 代码高亮支持 (Shiki)

内置了 GitHub Dark 风格的代码高亮，支持所有主流语言。比如下面是一段 React 的钩子实现：

```tsx
import { useState, useEffect } from 'react';

export function useDoorAnimation() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      console.log('🚪 门已推开！进入新世界。');
    }
  }, [isOpen]);

  return { isOpen, setIsOpen };
}
```

## 数学公式支持 (KaTeX)

得益于 `remark-math` 和 `rehype-katex` 插件，我们可以完美地渲染行内公式。质能方程的形式为 $E = mc^2$。

我们同样可以展示复杂的块级公式，比如拉格朗日量，它非常严谨地对齐并排版在居中位置：

$$
\mathcal{L} = \int \left( R - \frac{1}{4} F_{\mu\nu} F^{\mu\nu} \right) \sqrt{-g}  d^4x
$$

> "在粗糙的手绘线条中，隐藏着最精确的数学与代码逻辑。这正是工程师的浪漫。"

