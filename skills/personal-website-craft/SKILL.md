---
name: deep-space-personal-website
description: 端到端构建并持续迭代一个"深空实验室"主题的 GitHub Pages 个人网站（sushuqiong.github.io）。覆盖设计定论（多轮用户纠偏后确立）、动效体系、黑胶音乐播放器、公鸡 DJ 吉祥物、主题切换、站内搜索、性能优化、隐私边界与版本号部署流程。适用于复现、继续迭代本站，或为同类个人网站提供完整参考。
---

# Deep-Space Personal Website（深空实验室个人网站）

纯原生 HTML/CSS/JS 零框架、GitHub Pages 直接托管的个人网站构建全流程沉淀。从 v1 迭代到 v56+，本 skill 记录最终稳定下来的架构、设计原则与踩坑经验。

## 触发场景

- 复现或继续迭代 https://sushuqiong.github.io/
- 构建同风格（深空 + 明亮内容区 + 音乐 + 吉祥物）个人网站
- 需要参考"如何给 GitHub Pages 网站加动效/播放器/主题切换而不翻车"

## 技术栈与规模

- 零框架零构建：原生 HTML/CSS/JS，GitHub Pages 直接托管
- 17 个 HTML 页，共用 `assets/styles.css`（~9800 行）+ `assets/site.js`（~2700 行）
- 页面：index / skills / wechat / about / archives / projects / posts×3 / road / publications×5 / 404
- 数据：`assets/skills.json`、`assets/wechat-posts.json`（公众号 20 篇）
- 图片：全部 WebP（背景图 8 张 + 论文图 40+ + 歌曲封面 6 张 + 二维码）
- 音乐：`assets/music/` 6 首真实 mp3（网易云）+ 官方歌词 JSON + 专辑封面

## 设计定论（多轮用户纠偏后确立，勿再走回头路）

1. **内容区必须明亮丰富**，忌全站暗色（曾全深空化被否："难看的暗色系还很空洞"）
2. **风景图做背景层融入**（半透明白遮罩透出），忌横幅占位、忌突兀硬切
3. **区块间必须有渐变过渡带**（伪元素渐变桥），忌硬切
4. **色彩层次丰富**：金+红+蓝+紫多色关键词（参照用户参考图），忌全黄/全黑/全宋体
5. **宣言区**：黎明背景（太阳刚出地平线的水面码头）+ 无衬线金发光大字 + 红/蓝/紫关键词
6. **现代无衬线字体栈**：PingFang SC / Microsoft YaHei / Noto Sans SC / HarmonyOS Sans SC
7. 动效要克制但丰富：签名元素 = 公鸡 DJ + 音乐区（全站记忆点）

## 核心模块实现要点

### 版本号缓存机制（最重要！）
- 17 页所有 `styles.css` / `site.js` 链接带 `?vN`（当前 v56）
- 每次改 CSS/JS 必须批量 bump（python 脚本遍历 .html 替换 `?vN`→`?vN+1`）
- 不 bump 用户浏览器缓存看不到新效果（用户曾两次抱怨"没改"）
- GitHub Pages CDN 边缘缓存：push 后 5-15 分钟同步，验证用 `?cb=$RANDOM` 绕过

### 黑胶音乐播放器
- 网易云 API：`music.163.com/api/search/get/web?s=<urlencoded>&type=1` 搜歌 ID
- 音频直链：`music.163.com/song/media/outer/url?id=<id>.mp3`（部分版权受限换翻唱/DJ 版）
- 歌词：`music.163.com/api/song/lyric?id=<id>&lv=1`；封面：`api/song/detail`
- UI：黑胶唱片卡（repeating-radial-gradient 密纹 + 中心标签 + 真实封面 inset）、唱臂 tonearm、频谱（dock 5 柱 + 音乐区 28 柱）、vinyl-wave 环形光点、歌词面板
- Web Audio 合成打碟 scratch 音效（无音频文件）

### 公鸡 DJ 吉祥物
- SVG 动态注入（渐变身体 + 彩虹尾羽 + 大红鸡冠 + 白羽尖翅）
- 交互：单击 hop + 气泡台词、连点 3 次 dance、随机 360° 旋转、DJ 模式（耳机 + 打碟音效 + 触发播放器 + 滚动到音乐区）
- 记忆点升级：常驻耳机 + 迷你打碟机底座（旋转转盘 + 推子 + 闪烁打击垫）

### 宣言区
- 黎明背景（dawn.webp 蓝→橙渐变 + 深蓝遮罩）
- 文字永远可见（HTML 静态 + 关键词 span），JS 只做高亮 + 渐入——**勿用"清空再打字"**（曾导致文字消失 bug）
- 动态：流光扫过、行呼吸发光、关键词彩色发光、萤火虫上浮

### 主题切换（亮/暗）
- `html[data-theme="dark"]` 变量覆盖 + 大批量元素覆盖
- FOUC 防护：<head> 内联脚本首帧前应用 localStorage 主题
- 未手动选择时跟随系统 `prefers-color-scheme`
- giscus 评论区用 postMessage `setConfig` 同步主题

### 动效体系（全部 prefers-reduced-motion 保护）
- Hero：星空 canvas（430 粒子 + 鼠标排斥 + 亮星连线鼠标）、4 层极光、标题渐变流动 + 呼吸发光、3D 微视差
- 全站：自定义光标、星空拖尾、点击星星、区块视差、卡片 tilt、staggered 入场、翻牌、标签云漂浮

### 站内搜索
- Ctrl/⌘+K 唤起面板，索引 = 公众号推文 + 页面/区块
- 文章页支持 `?q=关键词` 正文高亮（mark + 滚动 + 闪光）

### 评论区
- giscus（repoId `R_kgDOTwHTVA`，分类 Announcements）+ CTA 引导横幅 + 主题同步

## 外部工具借鉴（轻量渐进增强）

- **Anime.js**（本地化 assets/vendor/anime.min.js，17.4KB gzip ~6KB）：只用它做"纯增强"动画——宣言星球/飞船漂浮、太阳呼吸；`if (!window.anime) return` 保证未加载时零影响；不动已有 CSS 动画的元素（会冲突）
- **Aceternity UI 风格**：Spotlight 聚光灯卡片（radial-gradient 跟随鼠标 --spot-x/--spot-y，纯 CSS/JS 无需库）
- **Uiverse 风格**：hero 按钮 conic 渐变旋转边框（hover 激活）
- **Anime 深化**：section 标题滚动弹性入场（MutationObserver 监听 .is-visible + easeOutElastic）、SVG 描边动画（宣言星球环 getTotalLength + strokeDashoffset）
- **React Bits 风格**：磁吸按钮（mousemove 计算偏移 translate，hover:none/reduced-motion 关闭）
- **Uiverse 深化**：mini-tag 霓虹发光（hover 渐变填充 + glow）
- **Motion Sites / Showreel Design / React Bits**：作为设计灵感参考源（案例风格借鉴），不直接集成 React 组件（本站零框架）
- 原则：外部库/组件必须本地化 + 渐进增强 + 可回退，禁止 CDN 运行时依赖（避免加载慢/断网失效）

## 性能清单（已验证）

- gzip 自动（GitHub Pages）：CSS 214KB→42.8KB、JS 97KB→29KB
- 图片全 WebP（24.5MB→10.5MB），删除未引用旧图（51.8MB→26.7MB 仓库）

## SEO / 分享层（v56）

- 全站 17 页 OG + Twitter Card（og:title/description/url/image + twitter:card），社交分享显示深空卡片
- `assets/og-image.webp`（1200×630 深空 + 🐔 + 标题，PIL 生成 75KB）
- `sitemap.xml`（17 页 URL + lastmod）+ `robots.txt`（Allow + Sitemap）
- 首页 JSON-LD `Person`（name/url/sameAs）
- 404 页公鸡从 emoji 升级为内联 SVG 场景（弹跳 + 彩虹尾摆动 + 翅膀扇动 + 星空闪烁）
- 背景层图（被遮罩覆盖）再压缩：降分辨率到 1600px + q55，2.7MB→959KB（省 65%，视觉无差）
- img 全带 width/height（零 CLS）、module script 自动 defer、零外部字体

## 隐私红线（重要）

- 网站公开，**不得出现私人邮箱、手机号、住址、后台入口、登录凭据**
- 页脚社交行只放 GitHub / 公众号 / 电台，邮箱仅投稿用不出现在公开页
- 路线叙事抽象化（L-Path），不出现具体人名/单位名

## 验证与部署流程

1. `node --check assets/site.js` + 确认关键函数完整
2. 本地预览：`python -m http.server 8777` + Edge headless 截图（`--user-data-dir` 独立目录 + `taskkill` 清理）
3. 子代理 vision 验证截图效果（渲染 DOM 用 `--dump-dom`，截图工具不滚动时 reveal 区块会透明）
4. bump 版本号（python 批量）→ `git add -A && git commit && git push`
5. sleep 90-150s → curl 线上验证（`?cb=$RANDOM` 绕过 CDN 缓存）+ `gh api .../pages/builds/latest --jq '.status'` 确认 built

## 踩坑记录

- **宣言文字消失**：JS 清空 DOM 再打字，链路卡住文字永空 → 改为文字静态 HTML，JS 只增强
- **tilt 3D 失效**：staggered 入场用 `transform: translateY` 覆盖 tilt 的 perspective transform → 改用 `translate` 独立属性
- **整页截图空白**：reveal 动画 opacity:0 未触发（IO 未触发时区块永久透明）→ ① @media print + prefers-reduced-motion 强制显示 ② **initReveal 加 2s 超时兜底**（2s 内未触发 IO 强制全部 is-visible/is-in）——此修复解决"用户截图/慢滚动看到大片空白"
- **子页 hero 图片异常**：8 个子页差异化风景背景被后加的 `background: transparent` 规则覆盖（CSS 顺序后者赢）→ 统一在文件末尾重新定义各页背景（图 + 顶部深蓝遮罩 + 底部亮色渐变），并在暗色主题加深为星野
- **CDN 旧版**：Edge 截图/用户看到旧版但 curl 新 → CDN 边缘缓存，等 5-15 分钟或带参访问
- **图片误删**：批量删未引用图前先 grep 引用（hongzhaoyuan.jpg 曾被误删，git checkout 恢复）
- **翻牌卡片反引号**：patch 替换 template literal 残留反引号导致语法错误
- **公鸡耳机双边不协调**：正面视角双耳罩像平贴 → SVG 改单边侧戴（头带弧线 + 单耳罩）
- **渐变文字隐形（重要）**：`color: transparent` + `background-clip: text` 在部分渲染环境（GPU 合成层/不支持 clip）下文字完全不可见（hero 标题、section 标题曾中招，用户反馈"文字被你隐藏了"）→ **标题类文字一律纯色 + 光晕**（background-clip 渐变仅用于非关键装饰），其余渐变文字加 `@supports not (background-clip: text)` 兜底
- **内容区丰富度**：区块加便签元素（音乐区粉色"边听边逛"、学术区青色"论文都在这里"）+ 主背景渐变缓慢流动（30s 循环）

## 复现步骤

```bash
git clone https://github.com/sushuqiong/sushuqiong.github.io.git
cd sushuqiong.github.io
python -m http.server 8777   # 本地预览
# 改 CSS/JS 后批量 bump 版本号：
python - <<'PY'
import os
for r, d, fs in os.walk("."):
    if ".git" in r: continue
    for f in fs:
        if f.endswith(".html"):
            p = os.path.join(r, f)
            h = open(p, encoding="utf-8").read()
            h2 = h.replace("?v56", "?v57")
            if h2 != h: open(p, "w", encoding="utf-8").write(h2)
PY
git add -A && git commit -m "update" && git push
```

## 网站文件结构速览

```
site/
├── index.html / skills.html / wechat.html / about/ / archives/ / projects/ / road.html / 404.html
├── posts/（github-pages / privacy / site-architecture，各含 index.html）
├── publications/（5 个论文详情页）
├── skills/personal-website-craft/SKILL.md   ← 本 skill
└── assets/
    ├── styles.css（~9800 行）/ site.js（~2700 行）
    ├── backgrounds/（8 张 webp）/ music/（6 mp3 + covers/）/ pub-imgs/（webp）/ wechat-qr.webp
    ├── skills.json / wechat-posts.json / logo.svg
```
