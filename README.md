# sushuqiong.github.io

个人主页 + skills 展示 + 公众号精选的 GitHub Pages 站点。

设计主题：**「深空实验室」** —— 暗色星空 Hero（史诗感）+ 明亮内容区（学术耐看）。
纯原生 HTML / CSS / JavaScript，零框架、零构建，GitHub Pages 直接托管。

## 功能特性

- 🌌 **深空星空 Hero**：Canvas 星空粒子动画（慢速漂移 + 闪烁 + 鼠标视差），星云光晕 + 网格线背景
- ⌨️ **Hero 打字机**：5 句轮播短语，荧光光标；`prefers-reduced-motion` 时静态展示
- 👋 **时间感知问候**：按时间段显示"早上好 / 下午好 / 晚上好 / 夜深了…"
- 📊 **访客统计**：页脚「访问统计」按钮，点击弹出匿名统计面板（总访客 UV / 总浏览 PV / 本页浏览），数据来自[不蒜子](https://busuanzi.ibruce.info)
- 🐔 **小公鸡吉祥物**：全站右下角悬浮（手绘 SVG），自动浮动 / 扇翅膀 / 点头 / 偶发小步走，点击跳起并弹出气泡话
- 🛤️ **「从病床到代码」路线叙事**：首页 4 步成长路线卡（临床训练 → 医学博士 → 生信与代码 → AI 与公开创作）
- 📱 **公众号二维码卡片**：首页公众号精选区「扫码关注 · 树鸡的生信代码」
- 💬 **giscus 评论区**：3 篇文章页 + about 页「访客留言板」，GitHub 账号登录留言，存档于仓库 Discussions
- 📶 **滚动进度条 + 回到顶部**：顶部渐变细线显示阅读进度，右下角"回到顶部"按钮
- ✨ **鼠标光晕跟随**：Stripe 风格柔光晕平滑跟随（深空区荧光青绿 / 内容区靛蓝紫），触屏与减弱动效时自动禁用
- 🎨 **统一设计系统**：滚动淡入动效、卡片 hover 上浮发光、玻璃拟态面板、渐变标题、思源宋体大标题 + 等宽数字点缀

## 结构

| 路径 | 说明 |
|---|---|
| `index.html` | 首页（Hero + 路线 + 技能线 + 公众号精选 + 站点更新） |
| `skills.html` | 公开 GitHub skills 与研究工具中心（三条 lane + 筛选 + 详情弹窗），旧路径 `skills/` 保留跳转 |
| `wechat.html` | 公众号公开检索精选，旧路径 `wechat/` 保留跳转 |
| `posts/` | 文章列表和文章页（含 giscus 评论区） |
| `archives/` | 归档页（时间线） |
| `projects/` | 项目页 |
| `about/` | 关于页（含访客留言板） |
| `assets/` | 样式、脚本、站点图标、静态 JSON 数据 |
| `assets/styles.css` | 全站样式（设计令牌 + 全部组件） |
| `assets/site.js` | 全站脚本（导航/页脚渲染、星空粒子、打字机、统计、公鸡、光晕等） |
| `assets/skills.json` | skills 卡片数据（改这里即可增删技能） |
| `assets/wechat-posts.json` | 公众号精选推文数据 |
| `assets/logo.svg` | 树鸡主题 Logo（公鸡 + DNA 尾羽） |
| `assets/wechat-qr.png` | 公众号二维码 |

## 技术说明

- **字体**：中文走系统字体栈（PingFang SC / 微软雅黑 / 思源宋体等），国内访问无字体加载问题，不用 Google Fonts
- **统计**：不蒜子 JSONP 接口（`jsonpCallback=BusuanziCallback`，按 Referer 域名计数），仅匿名聚合数据
- **评论**：giscus（GitHub Discussions），仓库已启用 Discussions，配置：
  - repo: `sushuqiong/sushuqiong.github.io`
  - repo-id: `R_kgDOTwHTVA`
  - category: `Announcements`（id: `DIC_kwDOTwHTVM4DDDLh`）
- **无障碍**：全站适配 `prefers-reduced-motion`（动画降级），键盘可达（公鸡可 Tab + Enter 互动），语义化标签

## 发布

1. 仓库名使用 `sushuqiong.github.io`
2. GitHub Pages 从 `main` 分支根目录发布
3. 推送到 `main` 后等待 Pages 自动刷新（约 1 分钟）

## 本地预览

```bash
cd sushuqiong.github.io
python -m http.server 8000
```

然后访问 `http://127.0.0.1:8000/`

## 日常维护

- **加/改 skills**：编辑 `assets/skills.json`（name / title / lane / category / tags / summary / detail / repo / demo / updated）
- **加/改公众号精选**：编辑 `assets/wechat-posts.json`（rank / title / topic / date / account / source / summary / searchQuery）
- **改导航**：`assets/site.js` 顶部 `navItems`
- **改打字机短语**：`assets/site.js` 中 `TYPING_PHRASES`
- **换二维码**：覆盖 `assets/wechat-qr.png`（建议 360×360 以上，白底）
- **加评论入口**：在目标页面 `</main>` 前复制 about 页的 giscus 代码块

## 隐私

站点默认只公开可分享的内容，不放手机号、住址、单位地址、私人邮箱、后台入口、登录凭据或其他敏感信息。公众号内容来自公开检索结果和可维护静态清单，不展示后台数据。访问统计仅记录匿名聚合数据（人数与次数），不采集个人身份、IP、位置等隐私信息。
