const navItems = [
  { href: "/", label: "首页" },
  { href: "/skills.html", label: "Skills" },
  { href: "/wechat.html", label: "公众号" },
  { href: "/archives/", label: "归档" },
  { href: "/projects/", label: "项目" },
  { href: "/about/", label: "关于" },
]

const TRACKS = {
  medical: {
    id: "medical",
    label: "医学科研导航",
    kicker: "Medical Research",
    note: "统计、生信、论文输出三条线，适合把一个医学研究问题拆成分析路径。",
    cta: "查看医学科研导航",
    repo: "https://github.com/sushuqiong/med-research-ai-navigator",
    tint: "medical",
  },
  writing: {
    id: "writing",
    label: "知识写作工作台",
    kicker: "Knowledge Writing",
    note: "阅读、可视化、站点、队列和精确提问五个入口，面向知识生产与公开写作。",
    cta: "查看写作工作台",
    repo: "https://github.com/sushuqiong/ai-knowledge-writing-skill",
    tint: "writing",
  },
  visual: {
    id: "visual",
    label: "R 图形风格系统",
    kicker: "R Graphics System",
    note: "以 multiplot 为核心，把常见统计软件图形风格收进 ggplot2 工作流。",
    cta: "查看图形风格系统",
    repo: "https://github.com/sushuqiong/multiplot",
    tint: "visual",
  },
}

const TRACK_ORDER = ["medical", "writing", "visual"]

function isCurrentPath(href) {
  const path = location.pathname.replace(/index\.html$/, "")
  if (href === "/") return path === "/" || path === ""
  return path === href || path.startsWith(href)
}

/* ───────────── 页头 / 页脚 ───────────── */

const shell = document.querySelector("[data-shell]")
if (shell) {
  shell.innerHTML = `
    <header class="site-header">
      <div class="container site-header-inner">
        <a class="brand" href="/" aria-label="返回首页">
          <img class="brand-mark" src="/assets/logo.svg" alt="" width="40" height="40">
          <span class="brand-copy">
            <span class="brand-kicker">医学研究 · 代码 · AI</span>
            <span class="brand-title">sushuqiong</span>
          </span>
        </a>
        <nav class="nav" aria-label="主导航">
          ${navItems
            .map(
              (item) =>
                `<a data-nav-link href="${item.href}"${isCurrentPath(item.href) ? ' aria-current="page"' : ""}>${item.label}</a>`,
            )
            .join("")}
        </nav>
        <a class="button button-primary header-cta" href="https://github.com/sushuqiong/" target="_blank" rel="noopener noreferrer">GitHub 主页</a>
      </div>
    </header>
  `
}

const footer = document.querySelector("[data-footer]")
if (footer) {
  footer.innerHTML = `
    <footer class="site-footer">
      <div class="container site-footer-inner">
        <div class="footer-note">
          <p class="footer-title">公开内容只保留 skills、文章、项目和可分享链接。</p>
          <p>站点不公开手机号、住址、私人邮箱、后台入口或任何登录凭据。</p>
        </div>
        <div class="footer-links">
          <a href="/skills.html">Skills</a>
          <a href="/wechat.html">公众号</a>
          <a href="/projects/">项目</a>
          <a href="/about/">关于</a>
        </div>
        <p class="footer-copy">© <span data-year></span> sushuqiong · Research Workbench</p>
      </div>
    </footer>
  `
}

document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = String(new Date().getFullYear())
})

/* ───────────── 页头滚动变色 ───────────── */

function initHeaderScroll() {
  const header = document.querySelector(".site-header")
  if (!header) return
  const update = () => header.classList.toggle("is-scrolled", window.scrollY > 36)
  update()
  window.addEventListener("scroll", update, { passive: true })
}

/* ───────────── 星空粒子（深空 Hero） ───────────── */

function initStarfield() {
  const canvas = document.getElementById("starfield")
  if (!canvas) return

  const ctx = canvas.getContext("2d")
  const DPR = Math.min(window.devicePixelRatio || 1, 2)
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

  let stars = []
  let width = 0
  let height = 0
  let raf = null
  let mouseX = 0
  let mouseY = 0

  const PALETTE = [
    [214, 236, 255], // 冷白
    [214, 236, 255],
    [214, 236, 255],
    [214, 236, 255],
    [100, 255, 218], // 荧光青绿
    [167, 139, 250], // 星云紫
  ]

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect()
    width = rect.width
    height = rect.height
    canvas.width = Math.floor(width * DPR)
    canvas.height = Math.floor(height * DPR)
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
    createStars()
  }

  function createStars() {
    const count = Math.min(150, Math.floor((width * height) / 6500))
    stars = Array.from({ length: count }, () => {
      const palette = PALETTE[Math.floor(Math.random() * PALETTE.length)]
      const big = Math.random() < 0.06
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        r: big ? Math.random() * 1.1 + 1.3 : Math.random() * 0.9 + 0.3,
        vx: (Math.random() - 0.5) * 0.1,
        vy: -(Math.random() * 0.16 + 0.03),
        tw: Math.random() * Math.PI * 2,
        ts: Math.random() * 0.02 + 0.005,
        color: palette,
        glow: big,
      }
    })
  }

  function draw(t) {
    ctx.clearRect(0, 0, width, height)
    // 鼠标视差（轻微，营造穿行感）
    const px = ((mouseX - width / 2) / width) * 10
    const py = ((mouseY - height / 2) / height) * 6

    for (const s of stars) {
      s.x += s.vx
      s.y += s.vy
      if (s.y < -6) {
        s.y = height + 6
        s.x = Math.random() * width
      }
      if (s.x < -6) s.x = width + 6
      if (s.x > width + 6) s.x = -6
      s.tw += s.ts

      const alpha = 0.28 + Math.abs(Math.sin(s.tw)) * 0.6
      const drawX = s.x + px * s.r
      const drawY = s.y + py * s.r
      const [r, g, b] = s.color

      ctx.beginPath()
      ctx.arc(drawX, drawY, s.r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
      ctx.fill()

      if (s.glow) {
        ctx.beginPath()
        ctx.arc(drawX, drawY, s.r * 3.2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.16})`
        ctx.fill()
      }
    }
    raf = requestAnimationFrame(draw)
  }

  function onMouseMove(event) {
    mouseX = event.clientX
    mouseY = event.clientY
  }

  resize()
  window.addEventListener("resize", resize)

  if (reduced) {
    // 无障碍：只画一帧静态星图
    const t = 0
    for (const s of stars) {
      ctx.beginPath()
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${s.color[0]}, ${s.color[1]}, ${s.color[2]}, 0.55)`
      ctx.fill()
    }
  } else {
    window.addEventListener("mousemove", onMouseMove, { passive: true })
    raf = requestAnimationFrame(draw)
  }
}

/* ───────────── 滚动入场动效 ───────────── */

function initReveal() {
  const targets = document.querySelectorAll(".reveal")
  if (!targets.length) return
  document.body.classList.add("reveal-ready")
  if (!("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-visible"))
    return
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible")
          io.unobserve(entry.target)
        }
      }
    },
    { threshold: 0.1, rootMargin: "0px 0px -48px 0px" },
  )
  targets.forEach((el) => io.observe(el))
}

initHeaderScroll()
initStarfield()
initReveal()

/* ───────────── 数据加载与渲染（保留原功能） ───────────── */

async function loadJson(path) {
  const response = await fetch(path)
  if (!response.ok) throw new Error(`Failed to load ${path}`)
  return response.json()
}

function uniqueValues(items, key) {
  return [...new Set(items.flatMap((item) => item[key] || []))].filter(Boolean)
}

function groupByLane(items) {
  return items.reduce((accumulator, item) => {
    const lane = item.lane || "writing"
    if (!accumulator[lane]) accumulator[lane] = []
    accumulator[lane].push(item)
    return accumulator
  }, {})
}

function sortByDateDesc(items, key = "updated") {
  return [...items].sort((a, b) => String(b[key] || "").localeCompare(String(a[key] || "")))
}

function createFilterButtons(values, target, active = "全部") {
  target.innerHTML = ["全部", ...values]
    .map(
      (value) =>
        `<button class="chip${value === active ? " is-active" : ""}" type="button" data-filter="${value}">${value}</button>`,
    )
    .join("")
}

function bindFiltering({ buttons, cards, getCardValues }) {
  buttons.addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]")
    if (!button) return
    const filter = button.dataset.filter
    buttons.querySelectorAll("[data-filter]").forEach((node) => node.classList.remove("is-active"))
    button.classList.add("is-active")
    cards.querySelectorAll("[data-card]").forEach((card) => {
      const values = getCardValues(card)
      card.hidden = filter !== "全部" && !values.includes(filter)
    })
  })
}

function makeWechatSearchUrl(query) {
  return `https://weixin.sogou.com/weixin?type=2&query=${encodeURIComponent(query)}`
}

function getTrackMeta(lane) {
  return TRACKS[lane] || TRACKS.writing
}

function renderSkillCard(item, index) {
  const track = getTrackMeta(item.lane)
  const tags = item.tags.map((tag) => `<span class="mini-tag">${tag}</span>`).join("")
  const demo = item.demo
    ? `<a class="button button-soft" href="${item.demo}" target="_blank" rel="noopener noreferrer">Demo</a>`
    : ""
  return `
      <article class="feature-card track-card track-card--${track.tint}" data-card data-tags="${item.tags.join("|")}" data-index="${item.__index}" data-lane="${item.lane}">
      <div class="feature-topline">
        <span class="badge badge-${track.tint}">${track.label}</span>
        <span class="muted">更新 ${item.updated}</span>
      </div>
      <h3>${item.title}</h3>
      <p class="card-summary">${item.summary}</p>
      <p class="card-detail">${item.detail}</p>
      <div class="mini-tags">${tags}</div>
      <div class="card-actions">
        <a class="button button-primary" href="${item.repo}" target="_blank" rel="noopener noreferrer">GitHub</a>
        ${demo}
        <button class="button" type="button" data-open-detail="${item.__index}" data-kind="skill">详情</button>
      </div>
    </article>
  `
}

function renderWechatCard(item, index) {
  return `
    <article class="feature-card wechat-card" data-card data-topic="${item.topic}" data-index="${index}">
      <div class="feature-topline">
        <span class="rank">#${String(item.rank).padStart(2, "0")}</span>
        <span class="badge badge-rose">精选</span>
      </div>
      <h3>${item.title}</h3>
      <p class="card-summary">${item.summary}</p>
      <div class="post-meta">
        <span>${item.account}</span>
        <span>·</span>
        <time datetime="${item.date}">${item.date}</time>
      </div>
      <p class="card-detail">${item.source}</p>
      <div class="card-actions">
        <a class="button button-primary" href="${makeWechatSearchUrl(item.searchQuery)}" target="_blank" rel="noopener noreferrer">搜索文章</a>
        <button class="button" type="button" data-open-detail="${index}" data-kind="wechat">摘要</button>
      </div>
    </article>
  `
}

function renderTrackSummary(track, items) {
  const latest = items[0]?.updated || "—"
  return `
    <a class="track-summary track-summary--${track.tint}" href="/skills.html#${track.id}">
      <span class="track-summary-kicker">${track.kicker}</span>
      <strong>${track.label}</strong>
      <span>${items.length} 个公开条目 · 最近更新 ${latest}</span>
    </a>
  `
}

function renderTrackSection(track, items) {
  const sorted = sortByDateDesc(items)
  const filters = uniqueValues(sorted, "tags")
  return `
    <section class="track-panel track-panel--${track.tint}" id="${track.id}" data-lane-panel="${track.id}">
      <div class="track-panel-head">
        <div>
          <p class="eyebrow">${track.kicker}</p>
          <h2>${track.label}</h2>
          <p class="section-lead">${track.note}</p>
        </div>
        <div class="track-panel-meta">
          <span class="track-count">${sorted.length} 项</span>
          <a class="button button-primary" href="${track.repo}" target="_blank" rel="noopener noreferrer">${track.cta}</a>
        </div>
      </div>
      <div class="toolbar track-toolbar" data-skill-filters="${track.id}" aria-label="${track.label} 筛选"></div>
      <div class="feature-grid track-grid" data-skill-grid="${track.id}">
        ${sorted.map((item, index) => renderSkillCard(item, index)).join("")}
      </div>
    </section>
  `
}

function openDialog(dialog, item, kind = "skill") {
  const title = dialog.querySelector("[data-dialog-title]")
  const kicker = dialog.querySelector("[data-dialog-kicker]")
  const body = dialog.querySelector("[data-dialog-body]")
  const meta = dialog.querySelector("[data-dialog-meta]")
  const link = dialog.querySelector("[data-dialog-link]")
  const secondary = dialog.querySelector("[data-dialog-secondary]")

  if (kind === "wechat") {
    title.textContent = item.title
    kicker.textContent = `${item.topic} · ${item.date}`
    body.textContent = item.summary
    meta.textContent = `${item.account} · ${item.source}`
    link.href = makeWechatSearchUrl(item.searchQuery || item.title)
    link.textContent = "搜索公开原文"
    if (secondary) secondary.hidden = true
  } else {
    const track = getTrackMeta(item.lane)
    title.textContent = item.title || item.name
    kicker.textContent = `${track.label} · ${item.category || "公开技能"}`
    body.textContent = item.detail || item.summary
    meta.textContent = `${item.updated || "公开条目"} · ${item.tags.join(" / ")}`
    link.href = item.repo
    link.textContent = "打开 GitHub 仓库"
    if (secondary) {
      if (item.demo) {
        secondary.hidden = false
        secondary.href = item.demo
        secondary.textContent = "打开 Demo"
      } else {
        secondary.hidden = true
      }
    }
  }

  dialog.showModal()
}

function closeDialog(dialog) {
  dialog.close()
}

function bindDialog(dialog, items) {
  const root = dialog.closest("body") || document
  root.querySelectorAll("[data-close-dialog]").forEach((button) => {
    button.addEventListener("click", () => closeDialog(dialog))
  })

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeDialog(dialog)
  })

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && dialog.open) closeDialog(dialog)
  })

  root.addEventListener("click", (event) => {
    const button = event.target.closest("[data-open-detail]")
    if (!button || !items[Number(button.dataset.openDetail)]) return
    openDialog(dialog, items[Number(button.dataset.openDetail)], button.dataset.kind || "skill")
  })
}

async function initHomeStats() {
  const skillNodes = {
    total: document.querySelector("[data-home-skill-count]"),
    lanes: document.querySelector("[data-home-lane-count]"),
  }
  const postNodes = {
    total: document.querySelector("[data-home-post-count]"),
    topics: document.querySelector("[data-home-topic-count]"),
  }
  const [skills, posts] = await Promise.all([loadJson("/assets/skills.json"), loadJson("/assets/wechat-posts.json")])

  if (skillNodes.total) skillNodes.total.textContent = String(skills.length)
  if (skillNodes.lanes) skillNodes.lanes.textContent = String(new Set(skills.map((item) => item.lane)).size)
  if (postNodes.total) postNodes.total.textContent = String(posts.length)
  if (postNodes.topics) postNodes.topics.textContent = String(new Set(posts.map((item) => item.topic)).size)

  document.querySelectorAll("[data-track-count]").forEach((node) => {
    const lane = node.dataset.trackCount
    node.textContent = String(skills.filter((item) => item.lane === lane).length)
  })
}

async function initSkillHub() {
  const sections = document.querySelector("[data-skill-sections]")
  if (!sections) return

  const overview = document.querySelector("[data-skill-overview]")
  const tabs = document.querySelector("[data-skill-track-tabs]")
  const dialog = document.querySelector("[data-detail-dialog]")
  const skills = (await loadJson("/assets/skills.json")).map((item, index) => ({ ...item, __index: index }))
  const grouped = groupByLane(skills)

  if (overview) {
    overview.innerHTML = TRACK_ORDER.map((lane) => renderTrackSummary(getTrackMeta(lane), sortByDateDesc(grouped[lane] || []))).join("")
  }

  if (tabs) {
    tabs.innerHTML = TRACK_ORDER
      .map(
        (lane) =>
          `<button class="chip chip-track" type="button" data-skill-lane-tab="${lane}">${getTrackMeta(lane).label}</button>`,
      )
      .join("")

    tabs.addEventListener("click", (event) => {
      const button = event.target.closest("[data-skill-lane-tab]")
      if (!button) return
      const section = document.querySelector(`#${button.dataset.skillLaneTab}`)
      if (section) section.scrollIntoView({ behavior: "smooth", block: "start" })
    })
  }

  sections.innerHTML = TRACK_ORDER.map((lane) => renderTrackSection(getTrackMeta(lane), grouped[lane] || [])).join("")

  TRACK_ORDER.forEach((lane) => {
    const toolbar = sections.querySelector(`[data-skill-filters="${lane}"]`)
    const grid = sections.querySelector(`[data-skill-grid="${lane}"]`)
    const items = sortByDateDesc(grouped[lane] || [])
    if (!toolbar || !grid) return

    createFilterButtons(uniqueValues(items, "tags"), toolbar)
    bindFiltering({
      buttons: toolbar,
      cards: grid,
      getCardValues: (card) => card.dataset.tags.split("|"),
    })
  })

  if (dialog) bindDialog(dialog, skills)
}

async function initWechatHub() {
  const grid = document.querySelector("[data-wechat-grid]")
  if (!grid) return

  const summary = document.querySelector("[data-wechat-summary]")
  const totalNode = document.querySelector("[data-wechat-total]")
  const topicNode = document.querySelector("[data-wechat-topic-count]")
  const dialog = document.querySelector("[data-detail-dialog]")
  const posts = await loadJson("/assets/wechat-posts.json")

  if (totalNode) totalNode.textContent = `${posts.length} 篇精选`
  if (topicNode) topicNode.textContent = `${new Set(posts.map((item) => item.topic)).size} 个专题`

  if (summary) {
    const topics = [...new Set(posts.map((item) => item.topic))]
    const latest = sortByDateDesc(posts, "date")[0]
    summary.innerHTML = `
      <article class="track-summary track-summary--rose">
        <span class="track-summary-kicker">公开精选</span>
        <strong>${posts.length} 篇推文</strong>
        <span>${topics.length} 个专题 · 最近更新 ${latest?.date || "—"}</span>
      </article>
      <article class="track-summary track-summary--blue">
        <span class="track-summary-kicker">可核验</span>
        <strong>${topics.slice(0, 3).join(" / ")}</strong>
        <span>页面只展示公开检索可见的标题、摘要与链接</span>
      </article>
      <article class="track-summary track-summary--gold">
        <span class="track-summary-kicker">安全边界</span>
        <strong>不展示后台信息</strong>
        <span>不放登录凭据、私人邮箱、手机号或住址</span>
      </article>
    `
  }

  const filters = document.querySelector("[data-wechat-filters]")
  if (filters) createFilterButtons(uniqueValues(posts, "topic"), filters)
  grid.innerHTML = posts.map(renderWechatCard).join("")
  if (filters) {
    bindFiltering({
      buttons: filters,
      cards: grid,
      getCardValues: (card) => [card.dataset.topic],
    })
  }
  if (dialog) bindDialog(dialog, posts)
}

initHomeStats().catch((error) => console.error(error))
initSkillHub().catch((error) => console.error(error))
initWechatHub().catch((error) => console.error(error))
