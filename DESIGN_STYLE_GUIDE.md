# 视觉与交互设计规范（中文主文档）

## 1. 设计方向
当前站点风格基于“动漫语境 + 可读性优先”的策略：

- 白天：浪漫、胶片感、暖色氛围
- 夜晚：赛博感更强、冷色主导
- 组件：分散式玻璃化（每个部件轻玻璃），避免整屏大玻璃
- 核心原则：背景可强烈，正文必须稳定可读

## 2. 技术基座

- 框架：Astro v5
- 交互岛：React 19（`client:load` / `client:only`）
- 样式：Tailwind CSS v4 + `src/styles/global.css`
- 主题切换：`html.dark` + `localStorage`

## 3. 全局层级结构
`src/layouts/Layout.astro` 的总体顺序：

1. `Background.astro`（固定背景层）
2. `Navigation.astro`（固定顶部导航）
3. 页面主内容 `<main>`
4. `Footer.astro`

行为目标：

- 背景固定，内容滚动
- 导航与人物区域不重叠
- 长页面时自动处理底部衔接

## 4. 导航规范
`src/components/Navigation.astro` 当前标准：

- 中间胶囊：主导航链接
- 右侧胶囊：语言 + 主题 + 移动端菜单
- 左侧 logo 区：当前版本隐藏（保留结构位）

移动端由 `MobileMenu.tsx` 提供全屏菜单。

视觉要求：

- 导航胶囊在白天/夜晚保持相同结构
- 同行的非关键背景区域尽量透明，避免突兀块状遮挡

## 5. 背景系统规范
`src/components/Background.astro`。

### 5.1 背景资产

- 白天：`/cowboy_bebop.jpg`
- 夜晚：`/Ghost_in_Shell.jpg`

### 5.2 分层结构

- 基色层（base color）
- 日/夜图层交叉淡入淡出
- 氛围层（film wash / cyber wash / dim）
- 网格和光晕层
- 粒子/雨丝动态层（`BackgroundEffect.tsx`）

### 5.3 高度与位置自适应
背景帧高度由以下共同决定：

- 导航高度
- 视口高度
- 当前背景图宽高比

目标：人物主体始终在导航栏下方，不发生视觉重叠。

### 5.4 底部过渡策略

- 默认不强行加底部白色渐变
- 仅当页面内容超出背景可覆盖范围时，启用 fallback 渐变

## 6. 自动取色与可读性
系统已实现“背景采样 -> 文本变量”的自动适配：

1. Canvas 采样白天/夜晚背景平均色
2. 计算相对亮度
3. 选择对应 palette bucket
4. 写入 `html` 级 CSS 变量

关键变量：

- `--adaptive-text-strong`
- `--adaptive-text-body`
- `--adaptive-text-muted`
- `--adaptive-text-soft`
- `--adaptive-link`
- `--adaptive-inline-code*`
- `--adaptive-blockquote*`
- `--adaptive-hr`

规范：正文、标题、元信息优先使用这些变量，不再逐页硬编码颜色。

## 7. 组件样式 Token
`src/styles/global.css` 统一提供：

- `.glass-card`
- `.glass-chip`
- `.page-shell`
- `.page-hero`
- `.page-hero-card`
- `.page-card`
- `.page-empty`
- `.article-prose`

新增页面或组件时，优先复用以上 token。

## 8. 字体与排版规范

- 页面主标题：`.page-title`（自适应渐变字）
- 副标题/正文：`--adaptive-text-body` 系列
- 分区标题：`--adaptive-text-strong`
- 文章正文：由 `.article-prose` 统一覆盖链接、代码、引用、分隔线

要求：

- 白天模式与夜晚模式均保证可读性，不依赖单一背景假设
- 字号与字重优先稳健，不追求过大视觉冲击

## 9. 动效规范

- 名言栏：轻微悬浮 + 打字机轮播
- 卡片 hover：轻量位移/阴影/颜色变化
- 主题切换：平滑过渡
- 性能优先：避免多层全屏 blur 与高频昂贵动画叠加

## 10. 页面编排规范

### 10.1 首页

- 仅保留个性化封面表达
- 头像、名言、社交入口、下滑引导
- 不承担“最近内容列表”功能

### 10.2 关于页

- 个人介绍 + 最新内容聚合 + 联系方式 + 友情链接
- 友情链接采用可扩展方块卡片布局

### 10.3 博客/学术/作品列表页

- 共享 `.page-shell/.page-card` 体系
- 风格与首页一致，色彩走自适应变量
- 作品页按专题分组（social-observation / anime / other）

### 10.4 详情页

- 返回入口
- 主卡片 + 元信息
- 大正文卡片
- 底部返回按钮

## 11. 背景更换流程（建议）
当未来替换白天/夜晚截图时：

1. 更新 `public/` 下背景文件
2. 修改 `BACKGROUND_ASSETS`
3. 先调 `objectPosition` 再调滤镜/透明度
4. 检查桌面端与移动端人物位置
5. 检查白天/夜晚正文对比度
6. 检查长页面底部过渡是否触发正确

---

## Appendix A (English)

### A.1 Visual direction
Day mode is warm/romantic; night mode is cyberpunk-oriented. UI uses component-level glass surfaces rather than one giant overlay.

### A.2 Core mechanics
- Fixed background with scrolling content
- Capsule navigation (center nav + right controls)
- Adaptive color tokens sampled from background images

### A.3 Background adaptation
Background frame height is computed from nav height, viewport, and image aspect ratio. Bottom gradient is fallback-only when content exceeds background reach.

### A.4 Token-first styling
Use shared tokens in `global.css` (`.glass-card`, `.page-card`, `.article-prose`, etc.) before creating page-specific one-off styles.
