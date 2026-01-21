# 博客发布指南 | Blog Post Guide

本指南将教你如何在这个 Astro 博客系统中发布新文章。

---

## 快速开始

### 1. 创建新文章

在 `src/content/posts/` 目录下创建一个新的 `.md` 文件:

```bash
src/content/posts/my-new-post.md
```

### 2. 添加 Frontmatter

在文件开头添加 YAML frontmatter (必须用 `---` 包围):

```markdown
---
title: "文章标题"
pubDate: 2024-03-22
description: "文章简短描述"
author: "Zhong Pengchen"
tags: ["标签1", "标签2"]
heroImage: "图片URL(可选)"
lang: "zh"
draft: false
---

## 这里开始写正文

你的文章内容...
```

### 3. 开始写作

在 frontmatter 之后,使用标准 Markdown 语法编写内容。

---

## Frontmatter 字段说明

| 字段 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|
| `title` | string | ✅ | 文章标题 | `"现代 Web 设计趋势"` |
| `pubDate` | date | ✅ | 发布日期 | `2024-03-22` |
| `description` | string | ✅ | 文章描述(显示在列表页) | `"探索最新的设计趋势"` |
| `author` | string | ❌ | 作者名(默认: Alex Dev) | `"Alex Dev"` |
| `tags` | array | ❌ | 文章标签 | `["Design", "Web"]` |
| `heroImage` | string | ❌ | 头图URL | `"https://..."` |
| `lang` | string | ❌ | 文章语言(默认: zh) | `"zh"` / `"en"` / `"ja"` |
| `draft` | boolean | ❌ | 是否为草稿(默认: false) | `true` / `false` |

---

## Markdown 功能

### 基础语法

```markdown
# 一级标题
## 二级标题
### 三级标题

**粗体文字**
*斜体文字*
~~删除线~~
`行内代码`

- 无序列表项
- 另一项

1. 有序列表项
2. 另一项

> 引用文字

[链接文本](https://example.com)
```

### 代码块

支持语法高亮:

````markdown
```javascript
function hello() {
  console.log("Hello, World!");
}
```

```python
def greet(name):
    print(f"Hello, {name}!")
```

```css
.button {
  background: blue;
  color: white;
}
```
````

### 数学公式

使用 KaTeX 渲染数学公式:

```markdown
行内公式: $E = mc^2$

块级公式:
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
```

### 插入图片

```markdown
![图片描述](https://images.unsplash.com/photo-xxx?w=1000&q=80)
```

**推荐图片尺寸:**
- 头图 (heroImage): 1200×600px
- 正文图片: 1000×600px

**免费图片资源:**
- [Unsplash](https://unsplash.com)
- [Pexels](https://pexels.com)
- [Pixabay](https://pixabay.com)

### 表格

```markdown
| 列1 | 列2 | 列3 |
|-----|-----|-----|
| 数据 | 数据 | 数据 |
| 数据 | 数据 | 数据 |
```

---

## 完整示例

这是一个包含所有功能的完整示例:

```markdown
---
title: "我的第一篇博客"
pubDate: 2024-03-22
description: "这是我的第一篇博客文章,分享我的学习经验。"
author: "Zhong Pengchen"
tags: ["学习", "经验分享", "编程"]
heroImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&q=80"
lang: "zh"
draft: false
---

## 引言

今天我想分享一下我学习 Web 开发的经历。

![学习编程](https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1000&q=80)

## 我的学习路径

学习 Web 开发需要掌握三个核心技术:

1. **HTML** - 网页结构
2. **CSS** - 样式设计
3. **JavaScript** - 交互逻辑

### HTML 基础

HTML 是构建网页的基础:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>我的网页</title>
  </head>
  <body>
    <h1>Hello World</h1>
  </body>
</html>
```

### CSS 美化

使用 CSS 让页面更美观:

```css
body {
  font-family: Arial, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### JavaScript 交互

JavaScript 让网页"活"起来:

```javascript
document.querySelector('button').addEventListener('click', () => {
  alert('你点击了按钮!');
});
```

## 学习资源

| 资源 | 类型 | 推荐度 |
|------|------|--------|
| MDN | 文档 | ⭐⭐⭐⭐⭐ |
| freeCodeCamp | 教程 | ⭐⭐⭐⭐⭐ |
| YouTube | 视频 | ⭐⭐⭐⭐ |

## 数学公式示例

计算圆的面积: $A = \pi r^2$

复杂公式:
$$
f(x) = \int_{-\infty}^{\infty} \hat{f}(\xi) e^{2\pi i \xi x} d\xi
$$

## 总结

> "学习永无止境,保持好奇心!"

坚持学习,你一定能成为优秀的开发者!

---

**延伸阅读:**
- [如何成为全栈开发者](#)
- [前端框架对比](#)
```

---

## 文章发布流程

### 开发环境预览

1. 启动开发服务器:
```bash
npm run dev
```

2. 在浏览器访问:
```
http://localhost:4321/zh/posts
```

3. 查看你的新文章

### 发布到生产环境

1. 构建项目:
```bash
npm run build
```

2. 预览构建结果:
```bash
npm run preview
```

3. 部署到 GitHub Pages 或其他托管平台

---

## 文件命名建议

使用小写字母和连字符,避免空格:

✅ **推荐:**
- `my-first-post.md`
- `web-design-trends-2024.md`
- `javascript-tips.md`

❌ **不推荐:**
- `My First Post.md` (有空格)
- `我的文章.md` (中文名可能导致URL问题)
- `POST_1.md` (全大写)

---

## 草稿功能

如果文章还没写完,可以设置为草稿:

```yaml
---
title: "未完成的文章"
draft: true
---
```

草稿文章不会显示在博客列表中,但你仍然可以通过直接访问 URL 来预览。

---

## 多语言支持

系统支持三种语言: 中文(zh)、英文(en)、日文(ja)

设置文章语言:

```yaml
---
title: "My Article"
lang: "en"
---
```

访问路径会自动匹配:
- 中文: `/zh/posts/my-article`
- 英文: `/en/posts/my-article`
- 日文: `/ja/posts/my-article`

---

## 常见问题

### Q: 图片无法显示?
A: 确保图片 URL 是完整的 https:// 链接,或使用相对路径引用 `public/` 目录中的图片。

### Q: 数学公式不显示?
A: 检查是否已安装 `remark-math` 和 `rehype-katex` 插件,并且 KaTeX CSS 已正确引入。

### Q: 代码高亮不工作?
A: Astro 默认使用 Shiki 进行代码高亮,确保代码块指定了正确的语言。

### Q: 如何修改作者名?
A: 在 `src/content/config.ts` 中修改默认作者,或在每篇文章的 frontmatter 中指定。

---

## 技术支持

遇到问题? 查看:
- [Astro 官方文档](https://docs.astro.build)
- [Markdown 语法指南](https://www.markdownguide.org)
- [KaTeX 支持的函数](https://katex.org/docs/supported.html)

---

**祝你写作愉快!** ✍️
