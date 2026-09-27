# sushuqiong.github.io

个人主页 + skills 展示 + 公众号精选 + 灵感电台的 GitHub Pages 站点。**「深空实验室」主题，v56**。

纯原生 HTML / CSS / JavaScript，零框架、零构建，GitHub Pages 直接托管（17 页 + 20 静态资源，全站 gzip + WebP）。

## ✨ 功能特性（v56 全景）

**设计与动效**
- 🌌 **深空 Hero**：Canvas 星空（430 粒子 + 鼠标排斥 + 亮星连线）、4 层极光（含流动光带）、标题呼吸发光
- 🎬 **Anime.js 本地化**：宣言星球/飞船漂浮、SVG 描边、区块标题弹性入场（渐进增强，无库也正常）
- 🃏 **Aceternity Spotlight**：论文/技能/音乐卡鼠标聚光灯；3D tilt 卡片
- 🧲 **磁吸按钮**（React Bits 风格）：hero 主按钮跟随鼠标；Uiverse 风格渐变旋转边框 + 霓虹标签
- 🌅 **黎明宣言区**：太阳初升水面码头背景、金色发光大字、红蓝紫关键词、萤火虫上浮
- 🏷️ **拟物便签**："树鸡在线 咕咕"（hero）/ "边听边逛"（音乐区）/ "论文都在这里"（学术区）

**音乐与吉祥物**
- 🐔 **公鸡 DJ**：SVG 吉祥物（墨镜 + 金链 + 单边耳机 + 打碟机底座），点击互动三层（hop 台词 / 连点 3 次跳舞 / 点 5 次摘墨镜彩蛋），Web Audio 合成 scratch 音效
- 💿 **灵感电台**：6 首真实 mp3 黑胶播放器（红昭愿 / 游山恋 / 春庭雪 / 琵琶行 / 辞九门回忆 / 莫问归期），官方歌词 + 专辑封面、唱臂、频谱、ON AIR 灯

**功能**
- 🌙 **暗色/亮色主题**：FOUC 防护 + localStorage + 系统跟随 + giscus 主题同步
- 🔍 **站内搜索**：Ctrl/⌘+K 面板（20 推文 + 页面索引）+ 文章 `?q=` 正文高亮
- 💬 **giscus 评论区**：3 文章页 + about 留言板，CTA 引导 + 主题跟随
- 📰 **RSS 订阅**（feed.xml）、上一/下一篇导航、相关阅读、阅读进度环、回到顶部
- 📊 **访客统计**：不蒜子匿名统计面板

**性能与工程**
- ⚡ gzip（CSS 214KB→43KB）+ 全图 WebP（背景图二次压缩 65%）+ 零 CLS + module defer
- 🔒 隐私红线：公开页零私人邮箱/手机号/住址
- 🔍 SEO：全站 OG/Twitter Card + sitemap.xml + robots.txt + JSON-LD Person

## 📦 本站构建 Skill

完整构建过程、设计定论、踩坑记录与复现步骤沉淀为一份可复现 skill：

- 网页展示：https://sushuqiong.github.io/skill.html
- SKILL.md：`skills/personal-website-craft/SKILL.md`（或 [GitHub 查看](https://github.com/sushuqiong/sushuqiong.github.io/blob/main/skills/personal-website-craft/SKILL.md)）

## 🗂️ 结构

| 路径 | 说明 |
|---|---|
| `index.html` | 首页（Hero + 路线 + 宣言 + 灵感电台 + 学术 + Skills + 公众号 + 更新） |
| `skills.html` | 公开 GitHub skills 中心（三条 lane + 筛选 + 详情弹窗） |
| `skill.html` | 本站构建 Skill 展示页 |
| `wechat.html` | 公众号公开检索精选（翻牌卡 + 弹窗） |
| `road.html` | 「从病床到代码」路线 |
| `posts/` | 3 篇文章（含 giscus 评论区、头图、目录、prev/next） |
| `publications/` | 5 个论文沉浸阅读页 |
| `archives/` | 归档时间线 + RSS 订阅入口 |
| `about/` | 关于页（统计卡 + 兴趣标签 + 留言板） |
| `skills/personal-website-craft/` | **本站构建 Skill（SKILL.md）** |
| `assets/` | styles.css（~10700 行）/ site.js / vendor/anime.min.js / backgrounds / music / pub-imgs / og-image.webp |
| `sitemap.xml` / `robots.txt` / `feed.xml` | SEO 与订阅 |

## 🚀 本地预览

```bash
git clone https://github.com/sushuqiong/sushuqiong.github.io.git
cd sushuqiong.github.io
python -m http.server 8777   # 打开 http://127.0.0.1:8777
```

## 📌 隐私声明

站点公开内容不包含私人邮箱、手机号、住址、后台入口或登录凭据；评论区数据存档于本仓库 GitHub Discussions。
