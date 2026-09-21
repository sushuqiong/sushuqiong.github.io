---
name: deep-space-personal-website
description: 端到端构建并持续迭代一个"深空实验室"主题的 GitHub Pages 个人网站（sushuqiong.github.io）。覆盖设计定论（多轮用户纠偏后确立）、动效体系、滚动叙事、黑胶音乐播放器、公鸡 DJ 吉祥物、主题切换、性能优化、隐私边界、验证方法论与全部踩坑记录。适用于复现、继续迭代本站，或为同类个人网站提供完整参考。
---

# Deep-Space Personal Website（深空实验室个人网站）

纯原生 HTML/CSS/JS 零框架、GitHub Pages 直接托管的个人网站构建全流程沉淀。
从 v1 迭代到 **v87+**，本 skill 记录最终稳定下来的架构、设计原则、验证方法与踩坑经验。

> **这份文档的价值在于"坑"**：下面每条 ⚠️/🐛 都是真实发生过、被用户当面指出的问题。
> 照抄架构很容易，避开这些坑才是省时间的地方。

## 触发场景

- 复现或继续迭代 https://sushuqiong.github.io/
- 构建同风格（深空 hero + 明亮内容区 + 音乐 + 吉祥物 + 滚动叙事）个人网站
- 需要参考"如何给 GitHub Pages 网站加动效 / 播放器 / 主题切换而不翻车"
- 排查静态站"改了没效果 / 页面空白 / 元素重叠 / 文字看不见"这类问题

## 技术栈与规模（v61）

- 零框架零构建：原生 HTML/CSS/JS，GitHub Pages 直接托管
- 15+ 个 HTML 页，共用 `assets/styles.css`（**~246 KB**）+ `assets/site.js`（**~111 KB**）
- 页面：index / skills / skill / wechat / about / archives / projects / posts×3 / road / publications×5 / 404
- 数据：`assets/skills.json`、`assets/wechat-posts.json`
- 图片：全部 WebP（背景图 8 张 + 论文图 40+ + 歌曲封面 6 张 + 二维码）
- 音乐：`assets/music/` 6 首真实 mp3（网易云）+ 官方歌词 JSON + 专辑封面

---

## 一、设计定论（多轮用户纠偏后确立，勿再走回头路）

1. **内容区必须明亮丰富**，忌全站暗色（曾全深空化被否："难看的暗色系还很空洞"）
2. **风景图做背景层融入**（半透明白遮罩透出），忌横幅占位、忌突兀硬切
3. **区块间必须有渐变过渡带**（伪元素渐变桥），忌硬切
4. **色彩层次丰富**：金 + 红 + 蓝 + 紫多色关键词，忌全黄 / 全黑 / 全宋体
5. **宣言区**：黎明背景 + 无衬线金发光大字 + 红/蓝/紫关键词；顶部遮罩 ≤0.62（"黎明不能像夜晚"）
6. **现代无衬线字体栈**：PingFang SC / Microsoft YaHei / Noto Sans SC（中文站点**不要**用 Google Fonts，大陆会加载失败）
7. **动效要克制但丰富**：签名元素 = 公鸡 DJ + 音乐区（全站记忆点）
8. **不做移动端专项优化**（用户明确不需要）；移动端只需不崩
9. **拟物/质感 > 纯堆动效**（用户认可路线：便签拟物化、仪表盘质感）

---

## 二、核心机制（必须先理解，否则改什么都看不到效果）

### ⭐ 版本号缓存机制（最重要）

- **所有** `styles.css` / `site.js` 链接都带版本查询：`href="/assets/styles.css?v61"`
- **每次改 CSS/JS 必须批量 bump**（`?v61` → `?v62`），否则用户浏览器 / GitHub Pages CDN
  继续用旧文件 → 用户会说"你根本没改"（本站真实发生过两次）
- 批量脚本见「复现步骤」；**bump 后必须验证线上版本号**（curl + grep）
- GitHub Pages CDN 边缘缓存：push 后 5–15 分钟同步；验证用 `?cb=$RANDOM` 绕过

### 单文件全站换肤

- 只改 `assets/styles.css` + `assets/site.js` → 全站 15+ 页同时生效
- 页面结构由 JS 统一渲染（导航、页脚、浮动元素），改一处全站变
- **代价**：改 CSS 时容易波及全站（本轮就出现过"统计卡白底黑字变看不清"）→ 改配色后必须回归检查三处：首页 hero、子页面页头、浮动元素

---

## 三、动效模块清单（全部 `prefers-reduced-motion` 保护）

### Hero 区（首页）
- 星空 canvas（430 粒子 + 鼠标排斥 + 亮星连线）、4 层极光、标题渐变流动 + 呼吸发光、3D 微视差
- **光束与光斑层（v61 C 批次）**：`.hero-atmos` 装饰层（`pointer-events:none; z-index:0`，在 hero 内容之下），
  3 条斜向柔光束（`blur(30px)`，17–25s 缓慢漂移）+ 2 个柔光斑（`blur(64px)`，15s 呼吸）。
  ⚠️ 注意 hero 已有 `.hero-canvas(z-index:1)` 和 `.hero .container(z-index:2)`，氛围层必须 `z-index:0`

### 滚动叙事（v59 / v61b）
- **标题"模糊消散"进入**：滚动到区块时标题从 `blur(9px) + translate 0 22px` 消散归位，
  eyebrow → h2 → 副标题级联延迟（0.05 / 0.13 / 0.22s）
  - ⚠️ **用 `translate` 属性而非 `transform`**（否则与其它动效争抢 transform）
  - ⚠️ **初始隐藏态必须挂在 `body.reveal-ready` 下**（JS 失败时文字照常可见），再加 `@media print` / `prefers-reduced-motion` 兜底
- **右侧章节小地图（v59）**：自动读取 `section[id]`，生成右侧固定圆点导航（悬停显示章节名 → 点击平滑滚动 → 当前章节高亮）
  - 条件：`innerWidth ≥ 1100` 且站点有 ≥3 个有效 section；无 id 的 section 自动补 `sec-N`
  - 圆点配色要在**深色 hero 和浅色内容区都可辨**（青绿淡色 45% + 细描边）
- **卡片 staggered 入场**：IO 触发后给 `.road-step / .pub-row / .feature-tile` 等设 `--stagger` 延迟

### 吉祥物：公鸡 DJ（v58 放大）
- SVG 动态注入（渐变身体 + 彩虹尾羽 + 大红鸡冠 + 白羽尖翅 + DJ 墨镜 + 单边耳机 + 迷你打碟机底座）
- 交互：单击 hop + 气泡台词、连点 3 次 dance、随机 360° 旋转、DJ 模式触发播放器
- **尺寸体系（v58：76px → 114px，1.5 倍）**——放大时必须连带调整：
  | 元素 | 原值 → 新值 |
  |---|---|
  | 主体 | 76 → **114px**（边距 20 → 22px） |
  | 唱盘 | 104×30 → **156×45px** |
  | 转盘 / 推子 / 打击垫 | 22 → 33px ｜ 4×16 → 6×24px ｜ 12×12 → 18×18px |
  | 气泡 | 宽 150 → 196px，字号 12.5 → 14px，位置同步外移 |
  | 跳跃 / 舞蹈位移 | 26 → 39px ｜ 7/5 → 10/8px |
  | 移动端 | 62 → 88px |
- **呼吸光晕**：`.rooster::before` 暖金径向光晕（190%，4.2s 呼吸）；⚠️ 光晕在**深色 hero 上要单独调亮**，否则看不见

### 浮动元素垂直排布（v61 修复）
- 公鸡放大后与右下角按钮重叠（`.back-top` 🚀 88px / `.search-fab` 142px / `.stats-pop` 104px vs 公鸡顶部 136px）
- **统一用 CSS 变量**：
  ```css
  :root { --rooster-size: 114px; --rooster-top: calc(22px + var(--rooster-size)); }
  .back-top, .back-to-top { bottom: calc(var(--rooster-top) + 22px) !important; }
  .search-fab              { bottom: calc(var(--rooster-top) + 80px) !important; }
  ```
- **教训**：任何固定定位元素改尺寸，都要检查右下角 / 右下浮动元素的相对关系

### 拟物质感控件（v60，Uiverse 思路）
- **统计仪表卡**：深色玻璃底 + 顶部微光弧（`::before`，**≤12% 透明度**）+ 数字内刻阴影 + 底部刻度线（`repeating-linear-gradient`）
  - 🐛 **血的教训**：曾把卡片改成**白底**，而数字是 `background-clip:text` 的青绿渐变、标签是浅灰
    → **白底上几乎看不见**（用户："站点中枢内容显示不清"）。深空主题的卡片**必须保持深色玻璃**。
- **徽章胶囊**：内高光 + 内阴影 + 细边框（全站徽章统一生效）
- **按钮**：默认底部内阴影（凸起感）→ `:active` 下沉 2px + 内凹阴影

### 黑胶音乐播放器
- 网易云接口：搜索 `music.163.com/api/search/get/web?s=<q>&type=1`；音频 `music.163.com/song/media/outer/url?id=<id>.mp3`；歌词 `api/song/lyric?id=<id>&lv=1`
- UI：黑胶唱片卡（repeating-radial-gradient 密纹 + 真实封面 inset）、唱臂 tonearm、频谱（dock 5 柱 + 音乐区 28 柱）、vinyl-wave 环形光点、歌词面板
- Web Audio 合成打碟 scratch 音效（无音频文件）

### 宣言区
- 黎明背景（蓝→橙渐变 + 深蓝遮罩）
- **文字永远静态存在于 HTML**，JS 只做关键词高亮 + 渐入 —— 🐛 曾用"清空 DOM 再打字"，链路卡住时文字永久消失（用户："你把我的宣言搞没了"）

### 主题切换（亮/暗）
- `html[data-theme="dark"]` 覆盖块；`<head>` 内联脚本首帧前应用（防 FOUC）；未手动选择时跟随系统
- giscus 评论区用 `postMessage({giscus:{setConfig:{theme}}})` 同步

### 站内搜索 / 评论区
- 搜索面板索引 = 公众号推文 + 页面区块；文章页支持 `?q=` 正文高亮
- giscus（repoId + 分类），CTA 引导 + 主题同步

---

---

## 三之二、动效体系扩展（v65 → v87，36 项）

一次"让网站更震撼"的集中迭代中新增的效果。**每项都带 `prefers-reduced-motion` 保护**，
并有低端设备自动降级（见下）。可作为同类站点"动效清单"参考。

### 首屏氛围（9）
| 效果 | 实现要点 |
|---|---|
| 鼠标光晕跟随 | 全屏柔光层 + rAF 缓动插值（`cx += (tx-cx)*0.14`），`mix-blend-mode: screen` |
| 鼠标星光拖尾 | 节流 70ms 生成小光点，0.85s 渐隐上浮 |
| 点击粒子爆散 | 12 颗彩色粒子按角度均分 + 随机扰动，`--dx/--dy` CSS 变量驱动位移 |
| 标题错落浮现 | 只对**已有的** `.hero-title-line` span 加 `nth-child` 级联延迟（不拆 DOM） |
| 元素依次浮现 | panel → actions → scroll-hint 依次 0.5/0.68/0.9s |
| 副标题下划线 | `::after` 宽度 0 → 62% 生长（进入视口后触发） |
| 星空增强 | canvas 上叠 CSS `filter: brightness/contrast`（不改绘制逻辑，零风险） |
| 星空闪烁 | canvas 整体 7.5s opacity 脉动 |
| 流星增强 | 生成概率 ×2.3、同屏上限 3→5、每颗独立着色（白/青绿/淡紫）+ 大流星径向光晕 |

### 滚动叙事（9）
| 效果 | 实现要点 |
|---|---|
| 标题模糊消散 | `blur(9px) + translate 0 22px` → 归位，挂在 `body.reveal-ready` 下 |
| 标题高光扫过 | `::after` 斜向渐变 + `skewX`，进入视口时 left 从 -60% → 118% |
| 章节小地图 | 读取 `section[id]` 生成圆点，IntersectionObserver 高亮，悬停显示名称 |
| 小地图序号 | `::before` + `content: attr(data-idx)`，JS 写入序号 |
| 内容图片淡入 | IO + `img.complete` 判断（已加载立即显示，避免空白）+ 3s 兜底 |
| 顶部进度流光 | 进度条末端 `::after` 径向光斑 + 2.4s 呼吸 |
| 视差纵深 | 卡片分三档深度（0.5/1/1.5），按距视口中心距离算位移，限 40 个元素 |
| 粘性章节标题 | `.section-head { position: sticky; top: 72px }` + 毛玻璃托底 + 渐隐边界 |
| 波浪背景层 | 双层 SVG path + `translateX` 循环（28s），顶部 mask 渐隐避免干扰 |

### 交互质感（10）
按钮涟漪 / 卡片流光边框（`@property --edge-angle` + conic-gradient）/ 卡片光泽斜扫 /
导航栏玻璃增强 / 播放中唱片光晕 / 火箭按钮发射动画（+ 常驻喷射粒子）/ 图片灯箱 /
自定义滚动条 / 文字选中样式 / 列表项 hover 侧光

### 全局氛围（8）
动态渐变背景（`body::before` + background-position 44s 漂移）/ 页面转场（View Transitions）/
主题切换过渡（切换瞬间加类，避免全局常驻 transition）/ 加载光幕扫过（每会话一次）/
章节分隔线生长 / 论文列表左右交替滑入 / 宣言逐行揭示（**clip-path，不删 DOM**）/ 统计数字弹性缓动（backOut）

### 性能自适应（低端设备降级）

```js
const cores = navigator.hardwareConcurrency || 0
const mem = navigator.deviceMemory || 0
const low = (cores > 0 && cores <= 4) || (mem > 0 && mem <= 4) || prefersReducedMotion
if (low) document.documentElement.classList.add("perf-low")
```

`html.perf-low` 下用 CSS 关闭：鼠标光晕、星光拖尾、点击粒子、波浪层、加载光幕、
星空脉动、卡片光泽、内容视差；章节标题改用不透明底替代毛玻璃。
**关键**：检测不到（null/0）时**不降级**，避免误伤正常设备。

### 动效堆叠后的质量体检（建议每轮跑一次）

```
① backdrop-filter 次数   （>12 需警惕，每处都触发合成开销）
② will-change 次数       （>8 会持续占用显存，用完应移除）
③ filter 次数            （>25 需警惕）
④ JS scroll 监听数       （>4 建议合并为一个 rAF 节流处理）
⑤ JS mousemove 监听数    （区分"全局"与"元素级"：全局的必须节流 + rAF）
⑥ ::before/::after 占用冲突（同选择器两者都用时检查是否互相覆盖）
⑦ prefers-reduced-motion 保护块数（应随效果数量同步增长）
```


## 四、外部工具借鉴（本地化 + 渐进增强）

| 灵感源 | 借鉴方式 | 本站落地 |
|---|---|---|
| **Anime.js** | 本地 `assets/vendor/anime.min.js`，`if (!window.anime) return` | 宣言星球/飞船漂浮、太阳呼吸、SVG 描边动画 |
| **Aceternity UI** | 复刻效果（React 组件不能直接用） | Spotlight 聚光灯卡片、**首屏光束/光斑层**、3D 倾斜 |
| **Uiverse** | 直接借鉴纯 CSS 元素 | conic 旋转边框、霓虹 mini-tag、**拟物仪表卡/胶囊按钮** |
| **React Bits** | 复刻效果 | 磁吸按钮、文字流光 |
| **MotionSites / Showreel** | 案例风格参考 | **滚动叙事**、章节小地图、进入补间节奏 |

**原则**：外部库必须**本地化**（禁 CDN 运行时依赖）+ **渐进增强**（缺失时站点照常可用）+ **可回退**；
不要对 CSS 动画已占用的属性做二次动画（transform 冲突）。

---

## 五、隐私红线（重要）

- 网站公开，**不得出现私人邮箱、手机号、住址、后台入口、登录凭据、本机绝对路径**
- 页脚社交行只放 GitHub / 公众号 / 电台；投稿邮箱不出现在公开页
- 路线叙事抽象化（L-Path），不出现具体人名 / 单位名
- 上线前用 grep 扫描：邮箱正则、手机号正则、`C:\Users`、真实姓名

---

## 六、验证方法论（不要靠"应该没问题"）

**每次改动必须走完这一套**（本轮 5 个 bug 全靠它抓出来）：

1. **语法**：`node --check assets/site.js`（⚠️ .js 是普通脚本，直接 check 有时会因 `export` 报错 → 先 `cp x.js _c.mjs && node --check _c.mjs`）
2. **CSS 结构**：花括号平衡检查 `css.count("{") == css.count("}")`
3. **渲染后 DOM**：Edge headless `--dump-dom` → 判断 JS 是否真的执行了（元素是否存在、类名是否加上）
4. **控制台错误**（关键！）：
   ```bash
   msedge --headless=new --enable-logging=stderr --v=1 --dump-dom <url> 2> err.txt
   grep -iE "uncaught|typeerror|referenceerror" err.txt
   ```
   🐛 **一个未捕获的 ReferenceError 会让脚本后续全部不执行**（本轮 `cover` TDZ 就是这样让半个站的初始化静默失效）
5. **像素检测**：截图后用 PIL 统计特征像素（颜色阈值要**考虑半透明混合与背景色**，否则会误判"功能没生效"）
6. **OCR 辅助**：用 rapidocr 读截图，验证文字**真的可见**（像素检测判断不了文字语义）
7. **部署后**：`sleep 75-150` → curl 线上（带 `?cb=$RANDOM`）确认版本号与关键规则已生效

### Edge headless 注意事项
- 必须 `--user-data-dir=<独立目录>`，并在两次截图之间 `taskkill //F //IM msedge.exe`，否则实例复用产生陈旧/空文件
- **默认窗口只有 800×600** → 你的 `innerWidth < 1100` 响应式判断在 headless 下会"意外不生效"；
  截桌面效果必须显式 `--window-size=1440,900`
- 截图只截首屏；需要看内容区要额外注入样式缩小 hero 或滚动后截
- 本机 HTTP_PROXY 已设：本地服务器要用 `curl --noproxy "*"`；Edge 传 `--no-proxy-server`

---

## 七、踩坑记录（按时间倒序，全部真实发生）

### v57–v61 阶段

- 🐛 **`cover` TDZ 报错让半个站静默失效**：音乐模块里 `cover` 在第 2852 行才 `const` 声明，
  却在第 2846 行被使用 → `ReferenceError: Cannot access 'cover' before initialization`
  → **该错误之后的所有顶层初始化全部中断**（黑胶波形、宣言动画、小地图都没跑）。
  排查靠 `--enable-logging=stderr` + grep；修复把使用移到声明之后。
  **经验：任何"某段代码莫名不执行"，先抓控制台错误**
- 🐛 **白卡 + 渐变数字 = 对比度灾难**：给统计卡换白底后，`background-clip:text` 的青绿渐变数字
  和浅灰标签在白底上几乎不可见。**深空主题卡片必须保持深色玻璃**；改配色后必须回归检查文字对比度
- 🐛 **元素放大引发浮动元素重叠**：公鸡 76→114px 后，右下角"🚀 回到顶部""搜索"按钮与它重叠。
  **改尺寸必须检查同区域其它固定元素的相对位置**（改用 CSS 变量统一排布）
- 🐛 **执行顺序导致动画不启用**：`initReveal()` 在文件前部执行时，页面还没有 `.reveal` 元素
  → 提前 `return`，`body.reveal-ready` 永远加不上 → 后面再加 `.reveal` 也没人观察它。
  **修复：标记完成后补跑 initReveal**（或把标记逻辑前置）
- 🐛 **同一种改进在不同页面结构上失效**：滚动叙事原本只挂在 `.hero` / `.section-head` 上，
  而子页面用的是 `.article-header` → "除首页外改进不大"。
  **推广到全站前，先 grep 各页面的类名差异**
- 🐛 **headless 默认 800px 宽**导致响应式分支判断失误（小地图"没生成"，其实是被宽度条件挡了）
- ⚠️ **模糊消散这类"初始不可见"的动效**：务必挂在 JS 添加的类（`body.reveal-ready`）下 + 保留 2s 兜底


### v65–v87 阶段（"36 项动效"集中迭代中踩到的）

- 🐛 **ASI 分号陷阱（本次最严重，隐藏了 7 个批次的成果）**
  ```js
  setTimeout(tagSectionMapIndex, 400)   // ← 缺分号
  (function () { ... })()               // ← 被解析为对 setTimeout 返回值的调用
  ```
  报错 `Uncaught TypeError: setTimeout(...) is not a function`，**该错误之后的所有顶层初始化全部中断**
  —— 批次 6、17-40 的 JS 效果全部静默失效（CSS 部分照常生效，所以从视觉上"看起来有一半做了"，
  极难发现）。**修复**：IIFE 前一律加前置分号 `;(function () { ... })()`。
  **教训**：只要出现"某个时间点之后所有 JS 都不执行"，第一件事就是抓控制台错误。

- 🐛 **验证环境陷阱：`file://` 会掩盖所有 JS 问题**
  用 `file:///.../index.html` 打开验证时，站点里 `/assets/site.js?v87` 这类**绝对路径资源
  在 file:// 协议下解析为 `file:///assets/site.js`，根本加载不到** → 所有 JS 效果都不会执行，
  控制台也不会报错（资源 404 静默）。我曾据此得出"功能未生效"的错误结论。
  **教训**：静态站渲染验证**必须**用 `python -m http.server` + `http://127.0.0.1:port/`；
  只有"纯 DOM 结构检查"才可以用 file://。

- 🐛 **幂等判断过宽导致批次被误跳过**
  用 `f"批次 {patch['id'][-1]}" in css`（取 id 末位字符）做"是否已应用"的检查：
  `batch11` → `"批次 1"` → **匹配到了 CSS 里已有的"批次 1"注释** → 误判为已完成而跳过 4 个批次。
  **教训**：幂等标记必须用**唯一且完整**的字符串（如效果中文名），不要用截断/模糊匹配。

- ⚠️ **先 grep 再动手**：准备实现"星座连线"时，先 grep 发现**站点原本已有该效果**
  → 避免重复实现与样式冲突。**任何"新增"前先确认"是否已存在"**。

### v56 及更早

- 🐛 **宣言文字消失**：JS 清空 DOM 再打字 → 改为静态 HTML + JS 增强
- 🐛 **tilt 3D 失效**：staggered 入场用 `transform: translateY` 覆盖了 tilt 的 `perspective()` → 改用 `translate` 属性
- 🐛 **整页截图 / 慢滚动大片空白**：`.reveal{opacity:0}` 未触发 IO → ① `@media print` / `prefers-reduced-motion` 强制可见 ② **initReveal 加 2s 超时兜底**
- 🐛 **子页 hero 图片消失**：后加的 `background: transparent` 覆盖了各页差异化背景（CSS 同优先级后者赢）→ 在文件末尾重新声明最终意图
- 🐛 **渐变文字隐形**：`color: transparent` + `background-clip: text` 在部分渲染环境完全不可见
  → **关键文字一律纯色 + 光晕**，渐变只用于装饰并加 `@supports not (background-clip: text)` 兜底
- 🐛 **图片误删**：批量删"未引用"图前先 grep 全部引用（曾有封面被误删，靠 `git checkout --` 恢复）
- 🐛 **CDN 旧版**：push 后 curl 新、浏览器旧 → 等 5–15 分钟或 `?cb=$RANDOM` 验证
- 🐛 **公鸡单边耳机**：正面视角双耳罩像平贴 → 改单边侧戴（头带弧线 + 单耳罩）

---

## 八、复现步骤

```bash
git clone https://github.com/sushuqiong/sushuqiong.github.io.git
cd sushuqiong.github.io
python -m http.server 8777          # 本地预览（HTTP_PROXY 环境用 curl --noproxy "*"）
```

**改完 CSS/JS 后（必做）**：

```python
# bump 版本号：?v61 → ?v62（遍历所有 html）
import glob
old, new = "?v61", "?v62"
n = 0
for f in glob.glob("*.html") + glob.glob("*/*.html"):
    t = open(f, encoding="utf-8").read()
    if old in t:
        open(f, "w", encoding="utf-8").write(t.replace(old, new)); n += 1
print("updated", n)
```

```bash
node --check assets/site.js        # 或 cp x.js _c.mjs && node --check _c.mjs
git add -A && git commit -m "update" && git push
sleep 90 && curl -sL --noproxy "*" "https://sushuqiong.github.io/?cb=$RANDOM" | grep -o "styles.css?v[0-9]*"
```

---

## 九、网站文件结构速览

```
site/
├── index.html / skills.html / skill.html / wechat.html / road.html / 404.html
├── about/ archives/ projects/ skills/（各含 index.html）
├── posts/（3 篇，各含 index.html）
├── publications/（5 个论文详情页）
├── skills/personal-website-craft/SKILL.md   ← 本 skill
└── assets/
    ├── styles.css（~246 KB，含全部动效与主题）/ site.js（~111 KB）
    ├── vendor/anime.min.js      ← 本地化的唯一外部库
    ├── backgrounds/（8 张 webp）/ music/（6 mp3 + covers/）/ pub-imgs/（webp）/ wechat-qr.webp
    └── skills.json / wechat-posts.json / logo.svg / og-image.webp
```

---

## 十、给后来者的三句话

1. **改完必 bump 版本号**，否则一切"没效果"的抱怨都从这里来。
2. **每次改动跑完验证四件套**：语法 → DOM → 控制台错误 → 像素/OCR。
3. **动效的安全底线**：任何"初始不可见"的元素，都必须有 JS 失败时的可见兜底 + 超时强制显示。

*本 skill 由网站作者与 AI 助手在 2026 年多轮迭代中共同沉淀。最后更新：v87（新增 36 项动效与性能自适应）。*
