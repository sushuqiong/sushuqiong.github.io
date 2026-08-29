const navItems = [
  { href: "/", label: "首页" },
  { href: "/skills.html", label: "Skills" },
  { href: "/skill.html", label: "Skill" },
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
          <button class="footer-stats" type="button" data-stats-toggle><span class="dot"></span>访问统计</button>
        </div>
        <div class="footer-links">
          <a href="/skills.html">Skills</a>
          <a href="/wechat.html">公众号</a>
          <a href="/projects/">项目</a>
          <a href="/about/">关于</a>
        </div>
        <div class="footer-social">
          <a href="https://github.com/sushuqiong" target="_blank" rel="noopener noreferrer" aria-label="GitHub">🐙 GitHub</a>
          <a href="/wechat.html" aria-label="公众号">📱 公众号</a>
          <a href="/#music" aria-label="灵感电台">🎧 电台</a>
        </div>
        <p class="footer-copy">© <span data-year></span> sushuqiong · Research Workbench <span class="footer-rooster" aria-hidden="true">🐔</span></p>
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
    [150, 168, 205], // 蓝灰（浅色底可见）
    [165, 180, 215],
    [130, 150, 190],
    [150, 168, 205],
    [100, 255, 218], // 荧光青绿
    [167, 139, 250], // 星云紫
  ]

  function resize() {
    // 全页固定背景：使用视口尺寸
    width = window.innerWidth
    height = window.innerHeight
    canvas.width = Math.floor(width * DPR)
    canvas.height = Math.floor(height * DPR)
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
    createStars()
  }

  function createStars() {
    const count = Math.min(430, Math.floor((width * height) / 3600))
    const bandCount = Math.floor(count * 0.42) // 银河带粒子
    stars = []
    // 银河光带：沿对角线密集分布，暖白为主，缓慢流动
    for (let i = 0; i < bandCount; i++) {
      const t = Math.random()
      const warm = Math.random() < 0.5
      stars.push({
        x: t * width + (Math.random() - 0.5) * width * 0.09,
        y: t * height * 0.8 + (Math.random() - 0.5) * height * 0.16 + height * 0.06,
        r: Math.random() * 1.4 + 0.4,
        vx: (Math.random() - 0.5) * 0.07,
        vy: -(Math.random() * 0.13 + 0.02),
        tw: Math.random() * Math.PI * 2,
        ts: Math.random() * 0.02 + 0.005,
        color: warm ? [255, 244, 220] : [200, 218, 248],
        glow: Math.random() < 0.16,
        band: true,
        bandT: t,
      })
    }
    // 随机星尘（蓝灰色，在浅色内容区上也可见）
    for (let i = bandCount; i < count; i++) {
      const palette = PALETTE[Math.floor(Math.random() * PALETTE.length)]
      const big = Math.random() < 0.05
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: big ? Math.random() * 1.2 + 1.4 : Math.random() * 1 + 0.3,
        vx: (Math.random() - 0.5) * 0.12,
        vy: -(Math.random() * 0.18 + 0.03),
        tw: Math.random() * Math.PI * 2,
        ts: Math.random() * 0.024 + 0.005,
        color: palette,
        glow: big,
        band: false,
      })
    }
  }

  // 彩色星云（缓慢漂移的光团）
  const NEBULAE = [
    { cx: 0.2, cy: 0.28, r: 0.32, color: [168, 85, 247], a: 0.16 },
    { cx: 0.8, cy: 0.52, r: 0.36, color: [56, 189, 248], a: 0.16 },
    { cx: 0.52, cy: 0.86, r: 0.3, color: [100, 255, 218], a: 0.11 },
    { cx: 0.1, cy: 0.75, r: 0.24, color: [244, 114, 182], a: 0.09 },
  ]

  // 流星
  const meteors = []

  function draw(t) {
    ctx.clearRect(0, 0, width, height)

    // 星云光团
    for (const n of NEBULAE) {
      const nx = n.cx * width + Math.sin(t / 8000 + n.cx * 12) * width * 0.05
      const ny = n.cy * height + Math.cos(t / 9000 + n.cy * 12) * height * 0.05
      const nr = n.r * Math.max(width, height)
      const g = ctx.createRadialGradient(nx, ny, 0, nx, ny, nr)
      g.addColorStop(0, `rgba(${n.color[0]}, ${n.color[1]}, ${n.color[2]}, ${n.a})`)
      g.addColorStop(1, "rgba(0, 0, 0, 0)")
      ctx.fillStyle = g
      ctx.fillRect(0, 0, width, height)
    }

    // 流星：偶发划过
    if (Math.random() < 0.006 && meteors.length < 3) {
      meteors.push({
        x: width * 0.3 + Math.random() * width * 0.7,
        y: Math.random() * height * 0.35,
        vx: -(4.5 + Math.random() * 4),
        vy: 1.8 + Math.random() * 1.8,
        life: 55 + Math.random() * 30,
      })
    }
    for (let i = meteors.length - 1; i >= 0; i--) {
      const m = meteors[i]
      m.x += m.vx
      m.y += m.vy
      m.life -= 1
      if (m.life <= 0 || m.x < -80 || m.y > height + 40) {
        meteors.splice(i, 1)
        continue
      }
      const alpha = Math.min(0.9, m.life / 22)
      const tail = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * 12, m.y - m.vy * 12)
      tail.addColorStop(0, `rgba(235, 245, 255, ${alpha})`)
      tail.addColorStop(1, "rgba(235, 245, 255, 0)")
      ctx.strokeStyle = tail
      ctx.lineWidth = 1.8
      ctx.lineCap = "round"
      ctx.beginPath()
      ctx.moveTo(m.x, m.y)
      ctx.lineTo(m.x - m.vx * 12, m.y - m.vy * 12)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(m.x, m.y, 1.8, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
      ctx.fill()
    }

    // 鼠标视差（轻微，营造穿行感）
    const px = ((mouseX - width / 2) / width) * 12
    const py = ((mouseY - height / 2) / height) * 7
    // 银河带整体缓慢摆动（"银河铺开"感）
    const bandShift = Math.sin(t / 4200) * 9

    // 星座连线：亮星之间自动连线（星图效果）
    const bright = stars.filter((s) => s.glow)
    for (let i = 0; i < bright.length; i++) {
      for (let j = i + 1; j < bright.length; j++) {
        const dx = bright[i].x - bright[j].x
        const dy = bright[i].y - bright[j].y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 140) {
          ctx.beginPath()
          ctx.moveTo(bright[i].x, bright[i].y)
          ctx.lineTo(bright[j].x, bright[j].y)
          ctx.strokeStyle = `rgba(167, 139, 250, ${((1 - dist / 140) * 0.22).toFixed(3)})`
          ctx.lineWidth = 0.6
          ctx.stroke()
        }
      }
    }

    // 亮星与鼠标连线（交互感）
    if (mouseX > 0 && mouseY > 0) {
      for (const s of bright) {
        const ddx = s.x - mouseX
        const ddy = s.y - mouseY
        const dist = Math.sqrt(ddx * ddx + ddy * ddy)
        if (dist < 210) {
          ctx.beginPath()
          ctx.moveTo(s.x, s.y)
          ctx.lineTo(mouseX, mouseY)
          ctx.strokeStyle = `rgba(100, 255, 218, ${((1 - dist / 210) * 0.32).toFixed(3)})`
          ctx.lineWidth = 0.8
          ctx.stroke()
        }
      }
    }

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

      const alpha = 0.3 + Math.abs(Math.sin(s.tw)) * 0.65
      // 鼠标轻微排斥（涟漪）
      const mdx = s.x - mouseX
      const mdy = s.y - mouseY
      const mdist = Math.sqrt(mdx * mdx + mdy * mdy)
      const repel = mdist < 130 && mdist > 0.1 ? (130 - mdist) / 130 : 0
      const drawX = s.x + px * s.r + (s.band ? (s.bandT - 0.5) * bandShift : 0) + (mdx / mdist) * repel * 10
      const drawY = s.y + py * s.r + (mdy / mdist) * repel * 10
      const [r, g, b] = s.color

      ctx.beginPath()
      ctx.arc(drawX, drawY, s.r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
      ctx.fill()

      if (s.glow) {
        ctx.beginPath()
        ctx.arc(drawX, drawY, s.r * 3.4, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.18})`
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
          // 内部卡片 staggered 浮现
          const kids = entry.target.querySelectorAll(
            ".road-step, .pub-row, .feature-tile, .music-card, .note-card, .lane-mini",
          )
          kids.forEach((kid, i) => {
            kid.style.setProperty("--stagger", `${i * 0.07}s`)
            kid.classList.add("is-in")
          })
          io.unobserve(entry.target)
        }
      }
    },
    { threshold: 0.08, rootMargin: "0px 0px -48px 0px" },
  )
  targets.forEach((el) => io.observe(el))

  // 兜底：2s 内未触发 IO 则强制全部显示（防截图/慢滚动/异常导致空白）
  setTimeout(() => {
    targets.forEach((el) => {
      if (!el.classList.contains("is-visible")) {
        el.classList.add("is-visible")
        el.querySelectorAll(".road-step, .pub-row, .feature-tile, .music-card, .note-card, .lane-mini").forEach((kid) =>
          kid.classList.add("is-in"),
        )
      }
    })
  }, 2000)
}

/* ───────────── 全站加载动画 ───────────── */

function initPageLoader() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
  if (sessionStorage.getItem("loader_shown")) return
  try {
    sessionStorage.setItem("loader_shown", "1")
  } catch (e) {
    /* 忽略 */
  }
  const loader = document.createElement("div")
  loader.className = "page-loader"
  loader.setAttribute("aria-hidden", "true")
  loader.innerHTML = `
    <div class="loader-ring"></div>
    <div class="loader-logo">🐔</div>
    <p class="loader-name">DEEP-SPACE LAB</p>
    <p class="loader-sub">sushuqiong · 深空实验室</p>
    <span class="loader-pct">0%</span>
  `
  document.body.appendChild(loader)

  const pct = loader.querySelector(".loader-pct")
  let loaded = 0
  const pctTimer = setInterval(() => {
    loaded = Math.min(loaded + 7 + Math.random() * 12, 92)
    if (pct) pct.textContent = `${Math.floor(loaded)}%`
  }, 90)

  function hide() {
    clearInterval(pctTimer)
    if (pct) pct.textContent = "100%"
    loader.classList.add("is-done")
    setTimeout(() => loader.remove(), 650)
  }

  window.addEventListener("load", () => setTimeout(hide, 700))
  setTimeout(hide, 3000) // 兜底
}

/* ───────────── 公鸡打碟音效（Web Audio 合成 scratch） ───────────── */

function initScratch() {
  let ctx = null
  function ensureCtx() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext
      if (!AC) return null
      ctx = new AC()
    }
    return ctx
  }
  function scratch() {
    try {
      const c = ensureCtx()
      if (!c) return
      if (c.state === "suspended") c.resume()
      const dur = 0.24
      const sr = c.sampleRate
      const buffer = c.createBuffer(1, sr * dur, sr)
      const data = buffer.getChannelData(0)
      let phase = 0
      for (let i = 0; i < data.length; i += 1) {
        phase += 1 + Math.sin(i / 520) * 3.2
        const freq = 180 + Math.sin(i / 1800) * 320
        data[i] = Math.sin(phase * 2 * Math.PI * freq / sr) * (1 - i / data.length)
      }
      const src = c.createBufferSource()
      src.buffer = buffer
      const gain = c.createGain()
      gain.gain.setValueAtTime(0.001, c.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.45, c.currentTime + 0.04)
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur)
      src.connect(gain).connect(c.destination)
      src.start()
    } catch (e) {
      /* 忽略音频错误 */
    }
  }
  document.addEventListener("dj-play", scratch)
}

initScratch()

/* ───────────── 自定义光标（桌面端装饰光环） ───────────── */

function initCustomCursor() {
  if (window.matchMedia("(hover: none)").matches) return
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
  const dot = document.createElement("div")
  dot.className = "custom-cursor"
  document.body.appendChild(dot)
  const ring = document.createElement("div")
  ring.className = "custom-cursor-ring"
  document.body.appendChild(ring)
  let mx = -100
  let my = -100
  let rx = -100
  let ry = -100
  let raf = null
  window.addEventListener(
    "mousemove",
    (e) => {
      mx = e.clientX
      my = e.clientY
      dot.style.left = `${mx}px`
      dot.style.top = `${my}px`
      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = null
          rx += (mx - rx) * 0.16
          ry += (my - ry) * 0.16
          ring.style.left = `${rx}px`
          ring.style.top = `${ry}px`
        })
      }
    },
    { passive: true },
  )
  // hover 可点元素时放大
  document.addEventListener(
    "mouseover",
    (e) => {
      if (e.target.closest("a, button, .music-card, .road-step, .pub-row, .feature-tile, .react-btn, input, [role='button']")) {
        ring.classList.add("is-hover")
      }
    },
    { passive: true },
  )
  document.addEventListener("mouseout", (e) => {
    if (e.target.closest("a, button, .music-card, .road-step, .pub-row, .feature-tile, .react-btn, input, [role='button']")) {
      ring.classList.remove("is-hover")
    }
  })
}

initCustomCursor()

/* ───────────── Hero 3D 微视差（面板跟随鼠标倾斜 + 文案位移） ───────────── */

function initHero3D() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
  if (window.matchMedia("(hover: none)").matches) return
  const panel = document.querySelector(".hero-panel")
  const copy = document.querySelector(".hero-copy")
  if (!panel && !copy) return
  let raf = null
  window.addEventListener(
    "mousemove",
    (e) => {
      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = null
          const nx = e.clientX / window.innerWidth - 0.5
          const ny = e.clientY / window.innerHeight - 0.5
          if (panel) {
            panel.style.transform = `perspective(900px) rotateY(${(nx * 5).toFixed(2)}deg) rotateX(${(-ny * 5).toFixed(2)}deg) translateZ(8px)`
          }
          if (copy) {
            copy.style.translate = `${(nx * 8).toFixed(1)}px ${(ny * 5).toFixed(1)}px`
          }
        })
      }
    },
    { passive: true },
  )
  window.addEventListener(
    "mouseleave",
    () => {
      if (panel) panel.style.transform = ""
      if (copy) copy.style.translate = ""
    },
    { passive: true },
  )
}

initHero3D()

/* ───────────── Hero 关键词轮换（打字机换词循环） ───────────── */

function initTitleRotator() {
  const line = document.querySelector(".hero-title-line")
  if (!line) return
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
  const WORDS = ["医学研究，代码与 AI", "肿瘤与胃癌研究", "数据可视化与生信", "开源 · 写作 · AI+医疗"]
  let wi = 0
  function splitAnimate(text) {
    line.textContent = ""
    ;[...text].forEach((ch, i) => {
      const span = document.createElement("span")
      span.className = "char"
      span.textContent = ch
      span.style.animationDelay = `${i * 0.028}s`
      line.appendChild(span)
    })
  }
  function cycle() {
    wi = (wi + 1) % WORDS.length
    line.style.opacity = "0"
    line.style.transition = "opacity 0.28s ease"
    setTimeout(() => {
      splitAnimate(WORDS[wi])
      line.style.opacity = "1"
      line.style.transition = "opacity 0.4s ease"
    }, 300)
  }
  if (!line.querySelector(".char")) splitAnimate(WORDS[0])
  setTimeout(() => setInterval(cycle, 4600), 8000)
}

initTitleRotator()

/* ───────────── 回到顶部飞行按钮 ───────────── */

function initBackTop() {
  const btn = document.createElement("button")
  btn.className = "back-top"
  const hasArticle = !!document.querySelector(".article-content")
  btn.innerHTML = hasArticle
    ? '<svg class="ring" viewBox="0 0 44 44" aria-hidden="true"><circle class="ring-bg" cx="22" cy="22" r="19.5"/><circle class="ring-fg" cx="22" cy="22" r="19.5"/></svg><span class="back-top-rocket">🚀</span>'
    : '<span class="back-top-rocket">🚀</span>'
  btn.setAttribute("aria-label", "回到顶部")
  document.body.appendChild(btn)

  const ringFg = btn.querySelector(".ring-fg")
  const CIRC = 2 * Math.PI * 19.5

  function updateProgress() {
    const article = document.querySelector(".article-content")
    if (ringFg && article) {
      const rect = article.getBoundingClientRect()
      const total = rect.height - window.innerHeight
      const pct = total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0
      ringFg.style.strokeDashoffset = String(CIRC * (1 - pct))
    }
  }

  window.addEventListener(
    "scroll",
    () => {
      btn.classList.toggle("is-show", window.scrollY > 480)
      updateProgress()
    },
    { passive: true },
  )
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
    // 喷气小星星
    for (let i = 0; i < 6; i += 1) {
      const s = document.createElement("span")
      s.className = "trail-star"
      s.style.left = `${btn.getBoundingClientRect().left + 18}px`
      s.style.top = `${btn.getBoundingClientRect().top + 10 + Math.random() * 16}px`
      s.style.width = "7px"
      s.style.height = "7px"
      s.style.background = ["#fbbf24", "#f59e0b", "#fde68a"][i % 3]
      s.style.boxShadow = "0 0 8px #fbbf24"
      document.body.appendChild(s)
      setTimeout(() => s.remove(), 900)
    }
  })
}

/* ───────────── 站内搜索（文章 + 公众号） ───────────── */

async function initSearch() {
  const SEARCH_PAGES = [
    { title: "GitHub Pages 网站搭建记录", url: "/posts/github-pages/", desc: "从零到上线：个人网站的搭建思路、结构与迭代记录" },
    { title: "隐私与数据声明", url: "/posts/privacy/", desc: "网站隐私策略：公开内容、数据边界与安全说明" },
    { title: "站点架构说明", url: "/posts/site-architecture/", desc: "本网站的技术架构：文件组织、样式与脚本设计" },
    { title: "个人宣言", url: "/#manifesto", desc: "追求幸福是人的权利，大胆探索自己的道路" },
    { title: "灵感电台 · 音乐", url: "/#music", desc: "红昭愿 / 游山恋 / 春庭雪 / 琵琶行" },
    { title: "学术成果", url: "/#publications", desc: "SCI 论文、R 包与中文综述" },
    { title: "The Road · 我的路线", url: "/#road", desc: "从临床到代码：个人成长路线" },
    { title: "公众号精选", url: "/wechat.html", desc: "Oncology树鸡的生信代码" },
    { title: "关于我", url: "/about/", desc: "医学博士 · 代码与 AI 爱好者" },
    { title: "技能中心", url: "/skills.html", desc: "公开 skills 与工具链" },
  ]
  let posts = []
  try {
    const data = await loadJson("/assets/wechat-posts.json")
    posts = (data || []).map((p) => ({
      title: p.title || "",
      url: p.url || "/wechat.html",
      desc: `${p.topic || "公众号"} · ${p.date || ""} ${p.summary || ""}`.trim(),
    }))
  } catch (e) {
    /* 索引失败不阻塞 */
  }
  const index = [...posts, ...SEARCH_PAGES].filter((p) => p.title)

  const btn = document.createElement("button")
  btn.className = "search-fab"
  btn.innerHTML = "🔍"
  btn.setAttribute("aria-label", "站内搜索")
  btn.setAttribute("aria-haspopup", "dialog")
  document.body.appendChild(btn)

  const panel = document.createElement("div")
  panel.className = "search-panel"
  panel.setAttribute("role", "dialog")
  panel.setAttribute("aria-label", "站内搜索")
  panel.innerHTML = `
    <div class="search-panel-inner">
      <div class="search-head">
        <span class="search-title">🔍 站内搜索</span>
        <button class="search-close" aria-label="关闭搜索">✕</button>
      </div>
      <input class="search-input" type="search" placeholder="搜索文章、推文、关键词…" autocomplete="off">
      <div class="search-results" role="listbox"></div>
    </div>
  `
  document.body.appendChild(panel)
  const input = panel.querySelector(".search-input")
  const results = panel.querySelector(".search-results")

  function open() {
    panel.classList.add("is-open")
    document.body.classList.add("search-open")
    setTimeout(() => input.focus(), 80)
  }
  function close() {
    panel.classList.remove("is-open")
    document.body.classList.remove("search-open")
  }

  btn.addEventListener("click", open)
  panel.querySelector(".search-close").addEventListener("click", close)
  panel.addEventListener("click", (e) => {
    if (e.target === panel) close()
  })
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close()
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault()
      panel.classList.contains("is-open") ? close() : open()
    }
  })

  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase()
    if (!q) {
      results.innerHTML = '<p class="search-empty">输入关键词开始搜索（Ctrl/⌘+K 唤起）</p>'
      return
    }
    const hits = index
      .filter((p) => (p.title + " " + p.desc).toLowerCase().includes(q))
      .slice(0, 12)
    if (!hits.length) {
      results.innerHTML = '<p class="search-empty">没有找到相关内容，换个词试试？</p>'
      return
    }
    results.innerHTML = hits
      .map(
        (h) => `
        <a class="search-item" href="${h.url}" onclick="document.body.classList.remove('search-open')">
          <strong>${h.title}</strong>
          <span>${h.desc}</span>
        </a>`,
      )
      .join("")
  })
  input.dispatchEvent(new Event("input"))
}

/* ───────────── 文章目录锚点 ───────────── */

function initToc() {
  const article = document.querySelector(".article-content")
  if (!article) return
  const headings = article.querySelectorAll("h2, h3")
  if (headings.length < 2) return
  headings.forEach((h, i) => {
    if (!h.id) h.id = `toc-${i}`
  })
  const toc = document.createElement("nav")
  toc.className = "article-toc"
  toc.setAttribute("aria-label", "文章目录")
  toc.innerHTML =
    '<span class="toc-label">📑 目录</span>' +
    Array.from(headings)
      .map((h, i) => `<a href="#toc-${i}" data-toc="${i}">${h.tagName === "H3" ? "· " : ""}${h.textContent.slice(0, 20)}</a>`)
      .join("")
  const header = document.querySelector(".article-header")
  if (header) header.after(toc)
  else article.before(toc)
  // 滚动高亮当前章节
  const links = toc.querySelectorAll("a[data-toc]")
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = toc.querySelector(`a[data-toc="${entry.target.id.replace("toc-", "")}"]`)
        if (!link) return
        if (entry.isIntersecting) {
          links.forEach((l) => l.classList.remove("is-active"))
          link.classList.add("is-active")
        }
      })
    },
    { rootMargin: "-20% 0px -65% 0px", threshold: 0 },
  )
  headings.forEach((h) => io.observe(h))

  // 桌面端：右侧悬浮目录（增强）
  if (window.matchMedia("(min-width: 1180px)").matches) {
    const side = document.createElement("nav")
    side.className = "toc-side"
    side.setAttribute("aria-label", "章节导航")
    side.innerHTML =
      '<span class="toc-side-label">本章节</span>' +
      Array.from(headings)
        .map((h, i) => `<a href="#toc-${i}" data-toc-side="${i}" class="${h.tagName === "H3" ? "toc-side-sub" : ""}">${h.textContent.slice(0, 22)}</a>`)
        .join("") +
      '<a class="toc-side-top" href="#" data-toc-top>↑ 回到顶部</a>'
    document.body.appendChild(side)
    const sideLinks = side.querySelectorAll("a[data-toc-side]")
    const sideIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const link = side.querySelector(`a[data-toc-side="${entry.target.id.replace("toc-", "")}"]`)
          if (!link) return
          if (entry.isIntersecting) {
            sideLinks.forEach((l) => l.classList.remove("is-active"))
            link.classList.add("is-active")
          }
        })
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 },
    )
    headings.forEach((h) => sideIo.observe(h))
    side.querySelector("[data-toc-top]").addEventListener("click", (e) => {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: "smooth" })
    })
    // 侧栏随滚动淡入
    const onScroll = () => {
      side.classList.toggle("is-show", window.scrollY > 420)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
  }
}

initToc()

/* ───────────── 文章阅读进度条 ───────────── */

function initReadProgress() {
  const article = document.querySelector(".article-content")
  if (!article) return
  const bar = document.createElement("div")
  bar.className = "read-progress"
  bar.setAttribute("aria-hidden", "true")
  document.body.appendChild(bar)
  window.addEventListener(
    "scroll",
    () => {
      const rect = article.getBoundingClientRect()
      const total = rect.height - window.innerHeight
      const pct = total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0
      bar.style.width = `${(pct * 100).toFixed(1)}%`
    },
    { passive: true },
  )
}

initReadProgress()

/* ───────────── 性能优化：图片解码异步 + 尺寸提示 ───────────── */

function initPerfHints() {
  document.querySelectorAll("img").forEach((img) => {
    if (!img.decoding) img.decoding = "async"
    if (!img.hasAttribute("loading") && img.width > 0 && img.width > 400) {
      img.loading = "lazy"
    }
  })
}

initPerfHints()

/* ───────────── 文章代码块复制按钮 ───────────── */

function initCopyCode() {
  const pres = document.querySelectorAll(".article-content pre")
  pres.forEach((pre) => {
    const btn = document.createElement("button")
    btn.className = "copy-btn"
    btn.type = "button"
    btn.textContent = "复制"
    btn.setAttribute("aria-label", "复制代码")
    pre.appendChild(btn)
    btn.addEventListener("click", async () => {
      const text = (pre.innerText || "").replace(/\n+$/, "")
      try {
        await navigator.clipboard.writeText(text)
      } catch (e) {
        const ta = document.createElement("textarea")
        ta.value = text
        document.body.appendChild(ta)
        ta.select()
        document.execCommand("copy")
        ta.remove()
      }
      btn.textContent = "✓ 已复制"
      btn.classList.add("is-copied")
      setTimeout(() => {
        btn.textContent = "复制"
        btn.classList.remove("is-copied")
      }, 1600)
    })
  })

  // 代码块语言徽标（从 class 提取 language-*）
  pres.forEach((pre) => {
    const cls = pre.className || ""
    const m = cls.match(/language-([\w+-]+)/)
    if (!m) return
    const badge = document.createElement("span")
    badge.className = "code-lang-badge"
    badge.textContent = m[1]
    pre.appendChild(badge)
  })
}

initCopyCode()

/* ───────────── 暗色 / 亮色主题切换 ───────────── */

function initThemeToggle() {
  const header = document.querySelector(".site-header-inner")
  if (!header) return
  const btn = document.createElement("button")
  btn.className = "theme-toggle"
  btn.setAttribute("aria-label", "切换暗色/亮色主题")
  const saved = (() => {
    try {
      return localStorage.getItem("theme")
    } catch (e) {
      return null
    }
  })()
  // 未手动选过时：跟随系统暗色偏好
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches
  const initial = saved === "dark" || saved === "light" ? saved : systemDark ? "dark" : "light"
  function apply(theme) {
    document.documentElement.dataset.theme = theme
    btn.textContent = theme === "dark" ? "☀️" : "🌙"
    btn.title = theme === "dark" ? "切换到亮色" : "切换到暗色"
    syncGiscus(theme)
  }
  apply(initial)
  btn.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark"
    apply(next)
    try {
      localStorage.setItem("theme", next)
    } catch (e) {
      /* ignore */
    }
  })
  header.appendChild(btn)

  // 未手动选择时：跟随系统暗色变化
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    const manual = (() => {
      try {
        return localStorage.getItem("theme")
      } catch (err) {
        return null
      }
    })()
    if (!manual) apply(e.matches ? "dark" : "light")
  })

  // giscus 评论区主题跟随（observer 只建一次）
  const giscusObserver = new MutationObserver(() => {
    syncGiscus(document.documentElement.dataset.theme)
  })
  giscusObserver.observe(document.body, { childList: true, subtree: true })

  function syncGiscus(theme) {
    const themeName = theme === "dark" ? "dark" : "light"
    document.querySelectorAll("iframe.giscus-frame").forEach((frame) => {
      try {
        frame.contentWindow.postMessage(
          { giscus: { setConfig: { theme: themeName } } },
          "https://giscus.app",
        )
      } catch (e) {
        /* ignore */
      }
    })
  }
}

initThemeToggle()

/* ───────────── 文章表情反应 ───────────── */

function initReactions() {
  const footer = document.querySelector(".article-footer")
  const article = document.querySelector(".article-content")
  const host = footer || (article && article.parentElement)
  if (!host) return
  const key = "reactions_" + (location.pathname || "page").replace(/\//g, "_")
  let counts = {}
  try {
    counts = JSON.parse(localStorage.getItem(key) || "{}")
  } catch (e) {
    counts = {}
  }
  const box = document.createElement("div")
  box.className = "reactions"
  const EMOJIS = ["❤️", "👍", "🌟", "🔥", "🎉"]
  box.innerHTML =
    '<span class="reactions-label">这篇文章怎么样？</span>' +
    EMOJIS.map(
      (emo) =>
        `<button class="react-btn" aria-label="${emo}"><span class="react-emo">${emo}</span><span class="react-count">${counts[emo] || 0}</span></button>`,
    ).join("")
  EMOJIS.forEach((emo) => {
    const btn = box.querySelectorAll(".react-btn")[EMOJIS.indexOf(emo)]
    btn.addEventListener("click", () => {
      counts[emo] = (counts[emo] || 0) + 1
      try {
        localStorage.setItem(key, JSON.stringify(counts))
      } catch (e) {
        /* ignore */
      }
      btn.querySelector(".react-count").textContent = counts[emo]
      btn.classList.remove("is-pop")
      void btn.offsetWidth
      btn.classList.add("is-pop")
    })
  })
  if (footer) footer.before(box)
  else host.insertBefore(box, article.nextSibling)
}

initReactions()

/* ───────────── 相关阅读推荐（文章页） ───────────── */

function initRelatedPosts() {
  const content = document.querySelector(".article-content")
  const footer = document.querySelector(".article-footer")
  if (!content || !footer) return
  const ALL = [
    { title: "GitHub Pages 网站搭建记录", url: "/posts/github-pages/", desc: "从零到上线：个人网站的搭建思路、结构与迭代记录" },
    { title: "隐私与数据声明", url: "/posts/privacy/", desc: "网站隐私策略：公开内容、数据边界与安全说明" },
    { title: "站点架构说明", url: "/posts/site-architecture/", desc: "本网站的技术架构：文件组织、样式与脚本设计" },
  ]
  const current = location.pathname
  const others = ALL.filter((p) => current !== p.url)
  if (others.length < 1) return
  const wrap = document.createElement("div")
  wrap.className = "related-posts"
  wrap.innerHTML =
    '<span class="related-label">📚 继续阅读</span><div class="related-grid">' +
    others
      .slice(0, 2)
      .map((p) => `<a href="${p.url}"><strong>${p.title}</strong><span>${p.desc}</span></a>`)
      .join("") +
    "</div>"
  footer.before(wrap)
}

initRelatedPosts()

/* ───────────── 文章搜索高亮（?q= 关键词 + 正文高亮） ───────────── */

function initArticleHighlight() {
  const article = document.querySelector(".article-content")
  if (!article) return
  const params = new URLSearchParams(location.search)
  const q = (params.get("q") || "").trim()
  if (!q) return
  const walker = document.createTreeWalker(article, NodeFilter.SHOW_TEXT)
  const nodes = []
  while (walker.nextNode()) nodes.push(walker.currentNode)
  let first = null
  nodes.forEach((node) => {
    if (!node.textContent.toLowerCase().includes(q.toLowerCase())) return
    const frag = document.createDocumentFragment()
    const lower = node.textContent.toLowerCase()
    const needle = q.toLowerCase()
    let last = 0
    let idx = lower.indexOf(needle)
    while (idx !== -1) {
      frag.appendChild(document.createTextNode(node.textContent.slice(last, idx)))
      const mark = document.createElement("mark")
      mark.className = "search-hit"
      mark.textContent = node.textContent.slice(idx, idx + q.length)
      if (!first) first = mark
      frag.appendChild(mark)
      last = idx + q.length
      idx = lower.indexOf(needle, last)
    }
    frag.appendChild(document.createTextNode(node.textContent.slice(last)))
    node.replaceWith(frag)
  })
  if (first) {
    first.scrollIntoView({ behavior: "smooth", block: "center" })
    first.classList.add("is-flash")
  }
}

initArticleHighlight()

/* ───────────── 文章头图（差异化横幅） ───────────── */

function initArticleHero() {
  const header = document.querySelector(".article-header")
  if (!header) return
  const MAP = [
    { match: "github-pages", img: "/assets/backgrounds/city-sunrise.webp", tag: "🌆 网站建设" },
    { match: "privacy", img: "/assets/backgrounds/lake.webp", tag: "🛡️ 隐私保护" },
    { match: "site-architecture", img: "/assets/backgrounds/nebula.webp", tag: "🧭 技术架构" },
  ]
  const path = location.pathname
  const hit = MAP.find((m) => path.includes(m.match))
  if (!hit) return
  const fig = document.createElement("figure")
  fig.className = "article-hero"
  fig.innerHTML = `<img src="${hit.img}" alt="${hit.tag.replace(/^[^\s]+\s/, "")}" width="1200" height="500" loading="lazy"><span class="article-hero-tag">${hit.tag}</span>`
  header.before(fig)
}

initArticleHero()

/* ───────────── 评论区引导横幅 ───────────── */

function initCommentsCta() {
  const giscus = document.querySelector(".giscus")
  const giscusWrap = document.querySelector(".giscus-wrap")
  if (!giscus || !giscusWrap) return
  if (document.querySelector(".comments-cta")) return
  const cta = document.createElement("div")
  cta.className = "comments-cta"
  cta.innerHTML =
    '<span class="comments-cta-emoji">💬</span>' +
    '<span class="comments-cta-text">有想法？欢迎留言交流，每条留言都会存档在 GitHub Discussions</span>' +
    '<button type="button" class="comments-cta-btn">写留言</button>'
  const head = giscusWrap.querySelector(".giscus-section-head")
  if (head) head.after(cta)
  else giscusWrap.insertBefore(cta, giscus)
  cta.querySelector(".comments-cta-btn").addEventListener("click", () => {
    giscus.scrollIntoView({ behavior: "smooth", block: "start" })
    setTimeout(() => {
      const input = giscus.querySelector("textarea, input")
      if (input) input.focus()
    }, 900)
  })
}

initCommentsCta()

initHeaderScroll()
initStarfield()
initReveal()
initPageLoader()
initBackTop()
initSearch()

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
      <article class="track-summary track-summary--rose flip-card" tabindex="0">
        <div class="flip-inner">
          <div class="flip-face">
            <span class="track-summary-kicker">公开精选</span>
            <strong>${posts.length} 篇推文</strong>
            <span>${topics.length} 个专题 · 最近更新 ${latest?.date || "—"}</span>
          </div>
          <div class="flip-face flip-back">
            <strong>🔄 翻面看看</strong>
            <span>所有内容均来自公众号公开推文，标题与摘要可点击原文核验。</span>
          </div>
        </div>
      </article>
      <article class="track-summary track-summary--blue flip-card" tabindex="0">
        <div class="flip-inner">
          <div class="flip-face">
            <span class="track-summary-kicker">可核验</span>
            <strong>${topics.slice(0, 3).join(" / ")}</strong>
            <span>页面只展示公开检索可见的标题、摘要与链接</span>
          </div>
          <div class="flip-face flip-back">
            <strong>🔍 全程留痕</strong>
            <span>每条推文都保留公众号原文链接，可点击跳转验证，不伪造内容。</span>
          </div>
        </div>
      </article>
      <article class="track-summary track-summary--gold flip-card" tabindex="0">
        <div class="flip-inner">
          <div class="flip-face">
            <span class="track-summary-kicker">安全边界</span>
            <strong>不展示后台信息</strong>
            <span>不放登录凭据、私人邮箱、手机号或住址</span>
          </div>
          <div class="flip-face flip-back">
            <strong>🛡️ 隐私优先</strong>
            <span>公开的是作品与内容，私人信息一律留在后台，保护自己也保护读者。</span>
          </div>
        </div>
      </article>`
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

/* ───────────── 公众号精选：首页紧凑列表 ───────────── */

async function initWechatCompact() {
  const list = document.querySelector("[data-wechat-compact]")
  if (!list) return
  try {
    const posts = await loadJson("/assets/wechat-posts.json")
    if (!posts.length) return
    list.innerHTML = posts
      .slice(0, 20)
      .map(
        (post) => `
        <li>
          <time class="wc-date" datetime="${post.date}">${post.date}</time>
          <span class="wc-title" title="${post.title}">${post.title}</span>
        </li>`,
      )
      .join("")
  } catch (e) {
    list.innerHTML = "<li>精选推文加载失败</li>"
  }
}

initWechatCompact()

/* ───────────── 小公鸡吉祥物 ───────────── */

const ROOSTER_PHRASES = ["咕咕！", "咯咯哒！", "今天也要加油鸭~", "看，有人来了！", "咕～", "🎧 想听哪首？点我！", "🎚️ 打个碟再走？", "🎵 深空电台 24h 营业", "🐔 DJ 树鸡在线", "👋 欢迎来深空实验室"]

function renderRooster() {
  const wrapper = document.querySelector(".rooster")
  if (wrapper) return

  const rooster = document.createElement("div")
  rooster.className = "rooster"
  rooster.setAttribute("role", "button")
  rooster.setAttribute("tabindex", "0")
  rooster.setAttribute("aria-label", "小公鸡吉祥物，点击互动")
  rooster.innerHTML = `
    <svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="rooster-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#fde047"/>
          <stop offset="0.45" stop-color="#fbbf24"/>
          <stop offset="1" stop-color="#f97316"/>
        </linearGradient>
        <linearGradient id="rooster-wing" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#f97316"/>
          <stop offset="1" stop-color="#dc2626"/>
        </linearGradient>
        <linearGradient id="rooster-head" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#fbbf24"/>
          <stop offset="1" stop-color="#f97316"/>
        </linearGradient>
      </defs>
      <!-- 彩虹尾羽：红橙黄绿蓝紫 -->
      <g class="rooster-tail">
        <path d="M26 46 Q8 38 4 22 Q18 32 26 40 Z" fill="#ef4444"/>
        <path d="M26 48 Q6 46 2 34 Q16 42 26 44 Z" fill="#f97316"/>
        <path d="M26 50 Q8 54 6 46 Q18 48 26 48 Z" fill="#facc15"/>
        <path d="M26 52 Q10 60 10 53 Q18 53 26 50 Z" fill="#22c55e"/>
        <path d="M26 54 Q12 66 14 60 Q20 58 26 52 Z" fill="#3b82f6"/>
        <path d="M26 56 Q14 72 18 65 Q22 61 26 54 Z" fill="#a855f7"/>
      </g>
      <g stroke="#b45309" stroke-width="3" stroke-linecap="round" fill="none">
        <line x1="40" y1="74" x2="38" y2="85"/>
        <line x1="48" y1="74" x2="50" y2="85"/>
        <path d="M33 85 L38 85 L43 85"/>
        <path d="M45 85 L50 85 L55 85"/>
      </g>
      <ellipse class="rooster-body" cx="44" cy="54" rx="26" ry="22" fill="url(#rooster-body)"/>
      <!-- 翅膀：橙红渐变 + 白色羽尖 -->
      <g class="rooster-wing">
        <path d="M36 46 Q24 42 28 30 Q38 34 42 44 Z" fill="url(#rooster-wing)" stroke="#b91c1c" stroke-width="1.5"/>
        <path d="M30 36 Q34 32 36 38 Q32 40 30 36 Z" fill="#fef3c7"/>
        <path d="M32 41 Q36 37 38 42 Q34 44 32 41 Z" fill="#fef3c7"/>
      </g>
      <g class="rooster-head">
        <circle cx="66" cy="34" r="13" fill="url(#rooster-head)"/>
        <!-- 大红色鸡冠 -->
        <path d="M58 26 Q56 14 62 12 Q60 18 64 18 Q63 8 70 10 Q68 16 72 16 Q72 20 74 22 L74 26 Z" fill="#dc2626"/>
        <path d="M58 25 Q54 18 60 16 Q59 21 62 21 Q61 14 67 13 Q66 19 70 18 Q70 22 72 23 L72 25 Z" fill="#ef4444"/>
        <!-- 金色嘴 -->
        <path d="M77 34 L91 35 L77 40 Z" fill="#fbbf24" stroke="#b45309" stroke-width="1"/>
        <!-- 红色肉垂 -->
        <ellipse cx="74" cy="44" rx="3.5" ry="5.5" fill="#dc2626"/>
        <!-- 亮眼睛 -->
        <circle cx="68" cy="31" r="4.2" fill="#ffffff"/>
        <circle cx="69" cy="31" r="2.2" fill="#1e293b"/>
        <circle cx="69.8" cy="30.2" r="0.8" fill="#ffffff"/>
        <!-- 金色羽毛点缀 -->
        <path d="M60 40 Q66 36 72 40 Q66 42 60 40 Z" fill="#fbbf24" opacity="0.6"/>
      </g>
      <!-- DJ 墨镜 -->
      <g class="rooster-glasses">
        <path d="M57 30 L59 26.5 L75 26.5 L77 30 Q77 34.5 72.5 34.5 L61.5 34.5 Q57 34.5 57 30 Z" fill="#0f172a"/>
        <path d="M57 29.5 L51.5 26" stroke="#0f172a" stroke-width="2.2" stroke-linecap="round" fill="none"/>
        <path d="M77 29.5 L82.5 26" stroke="#0f172a" stroke-width="2.2" stroke-linecap="round" fill="none"/>
        <path d="M61.5 30.5 L66 30.5" stroke="rgba(255, 255, 255, 0.55)" stroke-width="1.6" stroke-linecap="round"/>
        <path d="M70 30.5 L73.5 30.5" stroke="rgba(255, 255, 255, 0.35)" stroke-width="1.6" stroke-linecap="round"/>
      </g>
      <!-- 金色链子 -->
      <g class="rooster-chain">
        <path d="M37 50 Q44 60 51 50" fill="none" stroke="#fbbf24" stroke-width="2.2" stroke-linecap="round"/>
        <circle cx="44" cy="57" r="3.4" fill="#f59e0b" stroke="#d97706" stroke-width="1"/>
      </g>
      <!-- DJ 耳机（单边侧戴视角） -->
      <g class="dj-headphones">
        <path d="M66 14 Q60 20 58 27 L58 34 L63 34 L63 27 Q63 20 66 20 Z" fill="#7c3aed" stroke="#5b21b6" stroke-width="1"/>
        <circle cx="58" cy="34" r="4.5" fill="#7c3aed" stroke="#5b21b6" stroke-width="1"/>
        <circle cx="58" cy="34" r="1.8" fill="#fbbf24"/>
      </g>
      <ellipse cx="48" cy="89" rx="22" ry="3" fill="rgba(7, 13, 31, 0.16)"/>
    </svg>
    <div class="dj-deck" aria-hidden="true">
      <span class="dj-turntable"></span>
      <span class="dj-fader"><i></i></span>
      <span class="dj-pad dj-pad-1"></span>
      <span class="dj-pad dj-pad-2"></span>
    </div>
  `
  document.body.appendChild(rooster)

  const bubble = document.createElement("div")
  bubble.className = "rooster-bubble"
  bubble.textContent = ROOSTER_PHRASES[0]
  document.body.appendChild(bubble)

  function hop() {
    rooster.classList.remove("is-hopping")
    void rooster.offsetWidth
    rooster.classList.add("is-hopping")
    bubble.textContent = ROOSTER_PHRASES[Math.floor(Math.random() * ROOSTER_PHRASES.length)]
    bubble.classList.add("is-show")
    setTimeout(() => bubble.classList.remove("is-show"), 1600)
  }

  // 连点 3 次触发舞蹈模式
  let clickCount = 0
  let danceTimer = null

  function dance() {
    rooster.classList.add("is-dancing")
    bubble.textContent = "🎶 跳舞时间！"
    bubble.classList.add("is-show")
    clearTimeout(danceTimer)
    danceTimer = setTimeout(() => {
      rooster.classList.remove("is-dancing")
      bubble.classList.remove("is-show")
    }, 5200)
  }

  function interact() {
    hop()
    clickCount += 1
    if (clickCount >= 3) {
      clickCount = 0
      dance()
    }
    // DJ 模式：戴上耳机并触发音乐播放（音乐播放器监听 dj-play）
    rooster.classList.remove("is-dj")
    void rooster.offsetWidth
    rooster.classList.add("is-dj")
    setTimeout(() => rooster.classList.remove("is-dj"), 3600)
    document.dispatchEvent(new CustomEvent("dj-play"))
    bubble.textContent = "🎧 开播！"
    bubble.classList.add("is-show")
    setTimeout(() => bubble.classList.remove("is-show"), 1800)
  }

  rooster.addEventListener("click", interact)
  rooster.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      interact()
    }
  })

  // 偶发小步走（7–12 秒随机一次）
  function scheduleWalk() {
    setTimeout(() => {
      rooster.classList.remove("is-walking")
      void rooster.offsetWidth
      rooster.classList.add("is-walking")
      scheduleWalk()
    }, 7000 + Math.random() * 5000)
  }
  scheduleWalk()

  // 偶发旋转彩蛋（20–35 秒随机一次，不与舞蹈同时）
  function scheduleSpin() {
    setTimeout(() => {
      if (!rooster.classList.contains("is-dancing")) {
        rooster.classList.remove("is-spinning")
        void rooster.offsetWidth
        rooster.classList.add("is-spinning")
      }
      scheduleSpin()
    }, 20000 + Math.random() * 15000)
  }
  scheduleSpin()
}

/* ───────────── 访客统计（不蒜子） ───────────── */

const STATS = {
  uv: null,
  pv: null,
  pagePv: null,
  loaded: false,
  failed: false,
}

function renderStatsValues() {
  const nodes = {
    site_uv: document.querySelector('[data-stat="site_uv"]'),
    site_pv: document.querySelector('[data-stat="site_pv"]'),
    page_pv: document.querySelector('[data-stat="page_pv"]'),
  }
  const fmt = (value) => (value == null ? "—" : Number(value).toLocaleString("zh-CN"))
  if (nodes.site_uv) nodes.site_uv.textContent = STATS.failed ? "—" : fmt(STATS.uv)
  if (nodes.site_pv) nodes.site_pv.textContent = STATS.failed ? "—" : fmt(STATS.pv)
  if (nodes.page_pv) nodes.page_pv.textContent = STATS.failed ? "—" : fmt(STATS.pagePv)
}

function loadBusuanzi() {
  if (STATS.loaded || STATS.failed) return
  const script = document.createElement("script")
  // 服务端固定调用全局 BusuanziCallback，且按 Referer 域名计数
  script.src = "https://busuanzi.ibruce.info/busuanzi?jsonpCallback=BusuanziCallback"
  const timeout = setTimeout(() => {
    STATS.failed = true
    renderStatsValues()
  }, 7000)
  window.BusuanziCallback = (data) => {
    clearTimeout(timeout)
    if (!data || typeof data.site_uv === "undefined") {
      STATS.failed = true
    } else {
      STATS.uv = data.site_uv
      STATS.pv = data.site_pv
      STATS.pagePv = data.page_pv
      STATS.loaded = true
    }
    renderStatsValues()
  }
  script.onerror = () => {
    clearTimeout(timeout)
    STATS.failed = true
    renderStatsValues()
  }
  document.head.appendChild(script)
}

function initStats() {
  const pop = document.querySelector("[data-stats-pop]")
  if (!pop) {
    const node = document.createElement("div")
    node.className = "stats-pop"
    node.dataset.statsPop = ""
    node.innerHTML = `
      <div class="stats-pop-head">
        <strong>👀 访客统计</strong>
        <button class="stats-pop-close" type="button" data-stats-close aria-label="关闭">×</button>
      </div>
      <div class="stats-grid">
        <div><strong data-stat="site_uv">—</strong><span>总访客 UV</span></div>
        <div><strong data-stat="site_pv">—</strong><span>总浏览量 PV</span></div>
        <div><strong data-stat="page_pv">—</strong><span>本页浏览 PV</span></div>
        <div class="stats-info"><span>匿名 · 无身份记录</span></div>
      </div>
      <p class="stats-note">统计由不蒜子提供，仅记录匿名聚合数据（人数与次数），不采集个人身份、IP、位置等隐私信息。GitHub Pages 为纯静态托管，无法识别具体访客身份。</p>
    `
    document.body.appendChild(node)
  }
  const panel = document.querySelector("[data-stats-pop]")
  const toggle = document.querySelector("[data-stats-toggle]")
  const close = document.querySelector("[data-stats-close]")
  if (!toggle || !panel) return

  loadBusuanzi()

  const show = (on) => {
    panel.classList.toggle("is-show", on)
    if (on) loadBusuanzi()
  }

  toggle.addEventListener("click", () => show(!panel.classList.contains("is-show")))
  if (close) close.addEventListener("click", () => show(false))
  document.addEventListener("click", (event) => {
    if (!panel.contains(event.target) && !toggle.contains(event.target)) show(false)
  })
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") show(false)
  })
}

renderRooster()
initStats()

/* ───────────── 时间感知问候 ───────────── */

function initGreeting() {
  const node = document.querySelector("[data-greeting]")
  if (!node) return
  const hour = new Date().getHours()
  let greeting = "你好"
  if (hour >= 5 && hour < 9) greeting = "早上好"
  else if (hour >= 9 && hour < 12) greeting = "上午好"
  else if (hour >= 12 && hour < 14) greeting = "中午好"
  else if (hour >= 14 && hour < 18) greeting = "下午好"
  else if (hour >= 18 && hour < 23) greeting = "晚上好"
  else greeting = "夜深了"
  node.textContent = `${greeting} 👋 欢迎来到树鸡的工作台`
}

/* ───────────── Hero 打字机 ───────────── */

const TYPING_PHRASES = [
  "我在研究肿瘤与胃癌的分子特征",
  "我在写生信分析代码：TCGA · GEO · 单细胞",
  "我在把 AI 装进医学科研工作流",
  "我在打磨 R 可视化：multiplot",
  "我在读医学博士：肿瘤与胃癌方向",
  "我在探索 AI + 医疗的交叉可能",
  "我在公众号持续公开写作",
]

function initTypewriter() {
  const node = document.querySelector("[data-typewriter]")
  if (!node) return
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    node.textContent = TYPING_PHRASES[0]
    return
  }

  let phraseIndex = 0
  let charIndex = 0
  let deleting = false
  let timer = null

  function tick() {
    const phrase = TYPING_PHRASES[phraseIndex]
    if (!deleting) {
      charIndex += 1
      node.textContent = phrase.slice(0, charIndex)
      if (charIndex === phrase.length) {
        deleting = true
        timer = setTimeout(tick, 2200)
        return
      }
      timer = setTimeout(tick, 78 + Math.random() * 60)
    } else {
      charIndex -= 1
      node.textContent = phrase.slice(0, charIndex)
      if (charIndex === 0) {
        deleting = false
        phraseIndex = (phraseIndex + 1) % TYPING_PHRASES.length
        timer = setTimeout(tick, 420)
        return
      }
      timer = setTimeout(tick, 38)
    }
  }
  timer = setTimeout(tick, 900)
}

/* ───────────── 滚动进度条 + 回到顶部 ───────────── */

function initScrollChrome() {
  // 进度条
  const bar = document.createElement("div")
  bar.className = "progress-bar"
  bar.setAttribute("aria-hidden", "true")
  document.body.appendChild(bar)

  // 回到顶部
  const topBtn = document.createElement("button")
  topBtn.className = "back-to-top"
  topBtn.type = "button"
  topBtn.setAttribute("aria-label", "回到顶部")
  topBtn.textContent = "↑"
  document.body.appendChild(topBtn)
  topBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }))

  let ticking = false
  const update = () => {
    ticking = false
    const scrollTop = window.scrollY
    const height = document.documentElement.scrollHeight - window.innerHeight
    const progress = height > 0 ? Math.min(1, scrollTop / height) : 0
    bar.style.width = `${progress * 100}%`
    topBtn.classList.toggle("is-show", scrollTop > 560)
  }
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    },
    { passive: true },
  )
  update()
}

initGreeting()
initTypewriter()
initScrollChrome()

/* ───────────── K: 鼠标光晕跟随 ───────────── */

function initFollowerGlow() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
  if (!window.matchMedia("(hover: hover)").matches) return

  const glow = document.createElement("div")
  glow.className = "follower-glow"
  glow.setAttribute("aria-hidden", "true")
  document.body.appendChild(glow)

  let targetX = window.innerWidth / 2
  let targetY = window.innerHeight / 2
  let curX = targetX
  let curY = targetY
  let visible = false
  let raf = null

  function loop() {
    curX += (targetX - curX) * 0.12
    curY += (targetY - curY) * 0.12
    glow.style.transform = `translate3d(${curX}px, ${curY}px, 0) translate(-50%, -50%)`
    if (visible || Math.abs(curX - targetX) > 1 || Math.abs(curY - targetY) > 1) {
      raf = requestAnimationFrame(loop)
    } else {
      raf = null
    }
  }

  window.addEventListener(
    "mousemove",
    (event) => {
      targetX = event.clientX
      targetY = event.clientY
      if (!visible) {
        visible = true
        glow.style.opacity = "1"
        if (!raf) raf = requestAnimationFrame(loop)
      }
    },
    { passive: true },
  )

  document.documentElement.addEventListener("mouseleave", () => {
    visible = false
    glow.style.opacity = "0"
  })
}

initFollowerGlow()

/* ───────────── WELCOME 开场仪式 ───────────── */

function initIntro() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
  try {
    if (sessionStorage.getItem("site_intro_seen")) return
    sessionStorage.setItem("site_intro_seen", "1")
  } catch (e) {
    return
  }
  const overlay = document.createElement("div")
  overlay.className = "intro-overlay"
  overlay.setAttribute("aria-hidden", "true")
  overlay.innerHTML = `
    <p class="intro-title">WELCOME<span class="accent">.</span></p>
    <p class="intro-sub">SUSHUQIONG · RESEARCH LAB</p>
    <span class="intro-dot"></span>
  `
  document.body.appendChild(overlay)
  setTimeout(() => overlay.classList.add("is-done"), 1750)
  setTimeout(() => overlay.remove(), 2700)
}

initIntro()

/* ───────────── Hero 标题逐字浮现 ───────────── */

function initTitleChars() {
  const lines = document.querySelectorAll(".hero-title-line")
  if (!lines.length) return
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
  lines.forEach((line, lineIndex) => {
    if (line.querySelector(".char")) return // 已被轮换器拆字
    const text = line.textContent
    line.textContent = ""
    ;[...text].forEach((ch, i) => {
      const span = document.createElement("span")
      span.className = "char"
      span.textContent = ch
      span.style.animationDelay = `${0.15 + lineIndex * 0.25 + i * 0.03}s`
      line.appendChild(span)
    })
  })
}

/* ───────────── 点击星星特效 ───────────── */

function initClickStars() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
  const colors = ["#64ffda", "#a78bfa", "#93c5fd", "#fde68a", "#f9a8d4"]
  document.addEventListener("click", (event) => {
    const count = 6 + Math.floor(Math.random() * 4)
    for (let i = 0; i < count; i++) {
      const star = document.createElement("span")
      star.className = "click-star"
      const color = colors[Math.floor(Math.random() * colors.length)]
      star.style.background = color
      star.style.left = `${event.clientX + (Math.random() - 0.5) * 30}px`
      star.style.top = `${event.clientY + (Math.random() - 0.5) * 30}px`
      const angle = Math.random() * Math.PI * 2
      const dist = 26 + Math.random() * 34
      star.style.setProperty("--dx", `${Math.cos(angle) * dist}px`)
      star.style.setProperty("--dy", `${Math.sin(angle) * dist}px`)
      document.body.appendChild(star)
      setTimeout(() => star.remove(), 750)
    }
  })
}

initTitleChars()
initClickStars()

/* ───────────── 卡片 3D tilt（鼠标跟随旋转） ───────────── */

function initTilt() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
  const cards = document.querySelectorAll(".pub-row, .road-step, .feature-tile")
  if (!cards.length) return
  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      card.style.setProperty("--rx", `${(-y * 4).toFixed(2)}deg`)
      card.style.setProperty("--ry", `${(x * 6).toFixed(2)}deg`)
    })
    card.addEventListener("mouseleave", () => {
      card.style.setProperty("--rx", "0deg")
      card.style.setProperty("--ry", "0deg")
    })
  })
}

/* ───────────── Hero 滚动视差 ───────────── */

function initParallax() {
  const heroContent = document.querySelector(".hero-copy")
  const hero = document.querySelector(".hero")
  if (!heroContent || !hero) return
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
  window.addEventListener(
    "scroll",
    () => {
      const y = window.scrollY
      if (y < window.innerHeight * 1.2) {
        heroContent.style.transform = `translateY(${y * 0.16}px)`
        heroContent.style.opacity = String(Math.max(0, 1 - y / (window.innerHeight * 0.75)))
      }
    },
    { passive: true },
  )
}

/* ───────────── 星空鼠标拖尾 ───────────── */

function initStarTrail() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
  if (window.matchMedia("(hover: none)").matches) return
  const colors = ["#64ffda", "#a78bfa", "#93c5fd", "#fde68a", "#f9a8d4", "#fbbf24", "#38bdf8"]
  let last = 0
  document.addEventListener(
    "mousemove",
    (e) => {
      const now = Date.now()
      if (now - last < 46) return
      last = now
      const star = document.createElement("span")
      star.className = "trail-star"
      const size = 7 + Math.random() * 9
      star.style.left = `${e.clientX}px`
      star.style.top = `${e.clientY}px`
      star.style.width = `${size}px`
      star.style.height = `${size}px`
      star.style.background = colors[Math.floor(Math.random() * colors.length)]
      star.style.boxShadow = `0 0 ${size * 0.9}px ${colors[Math.floor(Math.random() * colors.length)]}`
      star.style.animationDelay = `${Math.random() * 0.12}s`
      // 十字光斑（15% 概率）
      if (Math.random() < 0.15) {
        star.classList.add("trail-cross")
        star.style.width = `${size * 2.4}px`
        star.style.height = `${size * 0.5}px`
      }
      document.body.appendChild(star)
      setTimeout(() => star.remove(), 950)
    },
    { passive: true },
  )
}

initTilt()
initParallax()
initStarTrail()

/* ───────────── 区块滚动视差（各 section 内容随滚动轻微位移） ───────────── */

function initSectionParallax() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
  if (window.matchMedia("(hover: none)").matches) return
  const containers = document.querySelectorAll(
    "#road > .container, #music > .container, #publications > .container, #skills-hub > .container, #wechat > .container, #notes > .container",
  )
  if (!containers.length) return
  let raf = null
  function update() {
    raf = null
    const vh = window.innerHeight
    containers.forEach((el) => {
      const r = el.getBoundingClientRect()
      const center = r.top + r.height / 2 - vh / 2
      const speed = 0.05
      const offset = Math.max(-22, Math.min(22, center * speed))
      el.style.translate = `0 ${offset.toFixed(1)}px`
    })
  }
  window.addEventListener(
    "scroll",
    () => {
      if (!raf) raf = requestAnimationFrame(update)
    },
    { passive: true },
  )
  update()
}

initSectionParallax()

/* ───────────── 极光鼠标联动 ───────────── */

function initAuroraMouse() {
  const auroras = document.querySelectorAll(".aurora")
  const hero = document.querySelector(".hero")
  if (!auroras.length || !hero) return
  const weights = [0.07, -0.06, 0.045]
  let raf = null
  window.addEventListener(
    "mousemove",
    (e) => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = null
        const r = hero.getBoundingClientRect()
        const nx = (e.clientX - r.left) / r.width - 0.5
        const ny = (e.clientY - r.top) / r.height - 0.5
        auroras.forEach((a, i) => {
          const w = weights[i] || 0.05
          a.style.translate = `${(nx * w * 1100).toFixed(1)}px ${(ny * w * 800).toFixed(1)}px`
        })
      })
    },
    { passive: true },
  )
}

initAuroraMouse()

/* ───────────── 论文图表 lightbox（点击放大） ───────────── */

function initLightbox() {
  const figures = document.querySelectorAll(".pub-figure img")
  if (!figures.length) return
  const overlay = document.createElement("div")
  overlay.className = "lightbox"
  overlay.setAttribute("role", "dialog")
  overlay.setAttribute("aria-label", "图表放大预览")
  overlay.innerHTML =
    '<button class="lightbox-close" aria-label="关闭">✕</button><img class="lightbox-img" alt="">'
  document.body.appendChild(overlay)

  const lbImg = overlay.querySelector(".lightbox-img")
  const close = overlay.querySelector(".lightbox-close")

  function open(img) {
    lbImg.src = img.src
    lbImg.alt = img.alt
    overlay.classList.add("is-open")
    document.body.style.overflow = "hidden"
  }

  function closeLb() {
    overlay.classList.remove("is-open")
    document.body.style.overflow = ""
  }

  figures.forEach((img) => {
    img.style.cursor = "zoom-in"
    img.addEventListener("click", () => open(img))
  })
  close.addEventListener("click", closeLb)
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeLb()
  })
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLb()
  })
}

initLightbox()

/* ───────────── 灵感电台：音乐播放器 ───────────── */

const SONGS = [
  {
    "id": "hongzhaoyuan",
    "title": "红昭愿",
    "artist": "音阙诗听 · 单循",
    "year": "2018",
    "emoji": "❤️",
    "color": "#ef4444",
    "desc": "国风电子 · 红颜将军的相思",
    "src": "/assets/music/hongzhaoyuan.mp3",
    "cover": "/assets/music/covers/hongzhaoyuan.jpg",
    "lyrics": [
      "（此版本为正式授权作品，未经著作权人许可，不得翻唱、翻录或使用）",
      "手中雕刻生花 刀锋千转蜿蜒成画",
      "盛名功德塔 是桥畔某处人家",
      "春风绕过发梢红纱 刺绣赠他",
      "眉目刚烈拟作妆嫁",
      "轰烈流沙枕上白发 杯中酒比划",
      "年少风雅鲜衣怒马 也不过一刹那",
      "难免疏漏儿时檐下 莫测变化",
      "隔却山海 转身 从容煎茶",
      "（一生长）",
      "重寄一段过往",
      "将希冀都流放 可曾添些荒唐",
      "才记得你的模样",
      "（一身霜）",
      "谁提笔只两行",
      "换一隅你安康 便销得这沧桑",
      "你还在我的心上",
      "彼时南面隔春风 一刀裁入断玲珑",
      "寥落晨时须臾问 长游不归莫相送",
      "何年东君迟来久 细数银丝鬓上逢",
      "恐有街头胭脂色 柳絮沾白雪沾红",
      "轰烈流沙枕上白发 杯中酒比划",
      "年少风雅鲜衣怒马 也不过一刹那",
      "难免疏漏儿时檐下 莫测变化",
      "隔却山海 转身 从容煎茶",
      "（一生长）",
      "重寄一段过往",
      "将希冀都流放 可曾添些荒唐",
      "才记得你的模样",
      "（一身霜）",
      "谁提笔只两行",
      "换一隅你安康 便销得这沧桑",
      "你还在我的心上",
      "（一生长）",
      "重寄一段过往",
      "将希冀都流放 可曾添些荒唐",
      "才记得你的模样",
      "（一身霜）",
      "谁提笔只两行",
      "换一隅你安康 便销得这沧桑",
      "你还在我的心上"
    ]
  },
  {
    "id": "youshanlian",
    "title": "游山恋",
    "artist": "海伦",
    "year": "2020",
    "emoji": "⛰️",
    "color": "#10b981",
    "desc": "古风戏腔 · 醉游寒山的洒脱",
    "src": "/assets/music/youshanlian.mp3",
    "cover": "/assets/music/covers/youshanlian.webp",
    "lyrics": [
      "我醉提酒游寒山",
      "霜华满天",
      "一吸寒气冷风翻",
      "酒洒河山",
      "仰望 蓝水云烟",
      "翩翩雀落人间",
      "抬手间",
      "我酒落湿衫前",
      "你看雪花 飘散",
      "芊芊换白观",
      "白发老人背着孩下山",
      "远观天仙舞欢",
      "我今醉酒悠哉",
      "一别寒山",
      "我何时归来",
      "我欲迎风再留住几步",
      "怎舍寒风吹动我痛处",
      "我说寒山别哭",
      "我带你出",
      "我敬滴酒带你出",
      "我欲成冰再也无退路",
      "怎舍寒冰冰冻我心窟",
      "我说寒山别哭",
      "我带你出",
      "我画美观带你出",
      "我醉提酒游寒山",
      "难舍美观",
      "仙着衣裳抚琴欢",
      "美人奏弦",
      "你看白雪人间",
      "你看冰川璀璨",
      "来者恋",
      "如大梦眼前",
      "我欲迎风再留住几步",
      "怎舍寒风吹动我痛处",
      "我说寒山别哭",
      "我带你出",
      "我敬滴酒带你出",
      "我欲成冰再也无退路",
      "怎舍寒冰冰冻我心窟",
      "我说寒山别哭",
      "我带你出",
      "我画美观带你出",
      "二胡 : 沛瑶",
      "竹笛 : 庞士强",
      "音乐总监 : 张赫",
      "艺人统筹 : 孙鑫/孙巧莲",
      "OP : 联合音乐×诚利千代",
      "「版权所有未经许可请勿使用」"
    ]
  },
  {
    "id": "chuntingxue",
    "title": "春庭雪",
    "artist": "等什么君",
    "year": "2021",
    "emoji": "❄️",
    "color": "#60a5fa",
    "desc": "古风 · 春雪落满离人苑",
    "src": "/assets/music/chuntingxue.mp3",
    "cover": "/assets/music/covers/chuntingxue.webp",
    "lyrics": [
      "庭中梨花谢又一年",
      "立清宵月华洒空阶",
      "梦里笙箫奏旧乐",
      "梦醒泪染胭脂面",
      "小重山念一遍又一遍",
      "闻更漏咽频教前尘辞长夜",
      "久无眠深坐对宫檐",
      "多情最是春庭雪",
      "年年落满离人苑",
      "薛涛笺上言若如初见",
      "这一世",
      "太漫长却止步咫尺天涯间",
      "谁仍记那梨花若雪时节",
      "我心匪石不可转",
      "我心匪席不可卷",
      "空凝眸情字深浅无解",
      "庭中梨花谢又一年",
      "立清宵月华洒空阶",
      "梦里笙箫奏旧乐",
      "梦醒泪染胭脂面",
      "小重山念一遍又一遍",
      "闻更漏咽频教前尘辞长夜",
      "久无眠深坐对宫檐",
      "多情最是春庭雪",
      "年年落满离人苑",
      "薛涛笺上言若如初见",
      "这一世",
      "太漫长却止步咫尺天涯间",
      "谁仍记那梨花若雪时节",
      "我心匪石不可转",
      "我心匪席不可卷",
      "空凝眸情字深浅无解",
      "这一世",
      "太漫长却止步咫尺天涯间",
      "谁仍记那梨花若雪时节",
      "我心匪石不可转",
      "我心匪席不可卷",
      "空凝眸情字深浅无解",
      "春欲晚梨花谢又一年"
    ]
  },
  {
    "id": "pipaxing",
    "title": "琵琶行",
    "artist": "奇然 · 沈谧仁",
    "year": "2017",
    "emoji": "🪕",
    "color": "#a855f7",
    "desc": "古风吟唱 · 白居易长诗谱曲",
    "src": "/assets/music/pipaxing.mp3",
    "cover": "/assets/music/covers/pipaxing.webp",
    "lyrics": [
      "和音 : 奇然/沈谧仁",
      "琵琶 : 远坂麦芽",
      "浔阳江头夜送客， 枫叶荻花秋瑟瑟。",
      "主人下马客在船， 举酒欲饮无管弦。",
      "醉不成欢惨将别， 别时茫茫江浸月。",
      "忽闻水上琵琶声， 主人忘归客不发。",
      "寻声暗问弹者谁？ 琵琶声停欲语迟。",
      "移船相近邀相见， 添酒回灯重开宴。",
      "千呼万唤始出来， 犹抱琵琶半遮面。",
      "转轴拨弦三两声， 未成曲调先有情。",
      "弦弦掩抑声声思， 似诉平生不得志。",
      "低眉信手续续弹， 说尽心中无限事。",
      "轻拢慢捻抹复挑， 初为霓裳后六幺。",
      "大弦嘈嘈如急雨， 小弦切切如私语，如私语。",
      "嘈嘈切切错杂弹， 大珠小珠落玉盘，落玉盘。",
      "间关莺语花底滑， 幽咽泉流冰下难。",
      "冰泉冷涩弦凝绝， 凝绝不通声暂歇。",
      "别有幽愁暗恨生， 此时无声胜有声，胜有声。",
      "银瓶乍破水浆迸， 铁骑突出刀枪鸣，刀枪鸣。",
      "东船西舫悄无言， 唯见江心秋月白，秋月白。",
      "（念白）",
      "沉吟放拨插弦中， 整顿衣裳起敛容。",
      "自言本是京城女， 家在虾蟆陵下住。",
      "十三学得琵琶成， 名属教坊第一部。",
      "五陵年少争缠头， 一曲红绡不知数。",
      "钿头银篦击节碎， 血色罗裙翻酒污。",
      "今年欢笑复明年， 秋月春风等闲度。",
      "弟走从军阿姨死， 暮去朝来颜色故。",
      "门前冷落鞍马稀， 老大嫁作商人妇，商人妇。",
      "商人重利轻别离， 前月浮梁买茶去，买茶去。",
      "去来江口守空船， 绕船月明江水寒，江水寒。",
      "夜深忽梦少年事， 梦啼妆泪红阑干，红阑干。",
      "我闻琵琶已叹息， 又闻此语重唧唧。",
      "同是天涯沦落人， 相逢何必曾相识！",
      "我从去年辞帝京， 谪居卧病浔阳城。",
      "浔阳地僻无音乐， 终岁不闻丝竹声。",
      "住近湓江地低湿， 黄芦苦竹绕宅生。",
      "其间旦暮闻何物？ 杜鹃啼血猿哀鸣。",
      "春江花朝秋月夜， 往往取酒还独倾。",
      "岂无山歌与村笛？ 呕哑嘲哳难为听。",
      "今夜闻君琵琶语， 如听仙乐耳暂明。",
      "莫辞更坐弹一曲， 为君翻作琵琶行，琵琶行。",
      "感我此言良久立， 却坐促弦弦转急，弦转急。",
      "凄凄不似向前声， 满座重闻皆掩泣，皆掩泣。",
      "座中泣下谁最多？ 江州司马青衫湿，青衫湿。",
      "江州司马青衫湿。"
    ]
  },

  {
    "id": "cijiumen",
    "title": "辞九门回忆",
    "artist": "解忧草 · 冰幽",
    "year": "2019",
    "emoji": "🏯",
    "color": "#f59e0b",
    "desc": "古风戏腔 · 一曲定重楼",
    "src": "/assets/music/cijiumen.mp3",
    "cover": "/assets/music/covers/cijiumen.webp",
    "lyrics": [
      "一曲定重楼",
      "一眼半生筹",
      "看的全都是那诡谲云涌",
      "入得此门不回首",
      "无需宣之于口",
      "我对案再拜那风雨瓢泼的残陋",
      "再聚首",
      "戏子多秋",
      "可怜一处情深旧",
      "满座衣冠皆老朽",
      "黄泉故事无止休",
      "戏无骨难左右",
      "换过一折又重头",
      "只道最是人间不能留",
      "误闯天家",
      "劝余放下手中砂",
      "张口欲唱声却哑",
      "粉面披衣叫个假",
      "怜余来安座下",
      "不敢沾染佛前茶",
      "只作凡人赴雪月风花",
      "绕过胭脂楼",
      "打散结发扣",
      "唱的全都是那情深不寿",
      "入得此门不回首",
      "无需宣之于口",
      "我对镜遮掩那风雨瓢泼的残陋",
      "碑已旧",
      "戏子多秋",
      "可怜一处情深旧",
      "满座衣冠皆老朽",
      "黄泉故事无止休",
      "戏无骨难左右",
      "换过一折又重头",
      "只道最是人间不能留",
      "误闯天家",
      "劝余放下手中砂",
      "送那人御街打马",
      "才子佳人断佳话",
      "怜余来苦咽下",
      "求不得佛前茶",
      "只留三寸土种二月花"
    ]
  },
  {
    "id": "mowenguiqi",
    "title": "莫问归期",
    "artist": "蒋雪儿",
    "year": "2020",
    "emoji": "🌙",
    "color": "#8b5cf6",
    "desc": "古风 · 藏进心口的刺",
    "src": "/assets/music/mowenguiqi.mp3",
    "cover": "/assets/music/covers/mowenguiqi.webp",
    "lyrics": [
      "藏进心口的刺",
      "不枉寻也如此",
      "沉默有时最后因你放肆",
      "浓墨难沾心事",
      "寒夜怎寄相思",
      "沉默有时念想有时",
      "谁诀别相思成疾莫问天涯",
      "也莫问归期",
      "怎奈何无人了解",
      "情断之时冷暖自知",
      "谁诀别相思成疾莫问天涯",
      "也莫问归期",
      "怎奈何无人了解",
      "我心思",
      "藏进心口的刺",
      "不枉寻也如此",
      "沉默有时最后因你放肆",
      "浓墨难沾心事",
      "寒夜怎寄相思",
      "沉默有时念想有时",
      "谁诀别相思成疾莫问天涯",
      "也莫问归期",
      "怎奈何无人了解",
      "情断之时冷暖自知",
      "谁诀别相思成疾莫问天涯",
      "也莫问归期",
      "怎奈何无人了解",
      "我心思",
      "谁诀别相思成疾莫问天涯",
      "也莫问归期",
      "怎奈何无人了解",
      "情断之时冷暖自知",
      "谁诀别相思成疾莫问天涯",
      "也莫问归期",
      "怎奈何无人了解",
      "我心思",
      "键盘 : 谭侃侃",
      "合声 : 刘涛、金天、张子薇"
    ]
  }

]

function initMusicPlayer() {
  const grid = document.querySelector("[data-music-grid]")
  if (!grid) return

  // 渲染歌曲卡片
  grid.innerHTML = SONGS.map(
    (song) => `
    <button class="music-card" data-song="${song.id}" style="--song-color: ${song.color};" aria-label="播放《${song.title}》">
      <span class="music-cover"><img src="${song.cover}" alt="${song.title} 封面" loading="lazy"></span>
      <span class="music-info">
        <strong>${song.title}</strong>
        <small>${song.artist} · ${song.year}</small>
        <em>${song.desc}</em>
      </span>
      <span class="music-play">▶</span>
      <span class="card-eq" aria-hidden="true"><span></span><span></span><span></span></span>
    </button>`,
  ).join("")

  // 播放器 dock
  const dock = document.createElement("div")
  dock.className = "music-dock"
  dock.innerHTML = `
    <div class="tonearm" aria-hidden="true">
      <svg viewBox="0 0 64 84" class="tonearm-svg">
        <circle cx="58" cy="5" r="5" fill="#0a192f" stroke="#64ffda" stroke-width="1.5"/>
        <path d="M58 5 L12 68" stroke="#64748b" stroke-width="4.5" stroke-linecap="round"/>
        <path d="M5 64 L21 72 L9 80 Z" fill="#334155"/>
        <circle cx="12" cy="68" r="3.5" fill="#f59e0b"/>
      </svg>
    </div>
    <div class="music-dock-inner">
      <span class="music-cover-rot"><img data-music-cover alt="歌曲封面"></span>
      <div class="music-now">
        <strong data-music-title>红昭愿</strong>
        <span data-music-artist>音阙诗听 · 2018</span>
      </div>
      <div class="music-controls">
        <button class="music-btn" data-music-prev aria-label="上一首">⏮</button>
        <button class="music-btn music-play-btn" data-music-toggle aria-label="播放/暂停">▶</button>
        <button class="music-btn" data-music-next aria-label="下一首">⏭</button>
      </div>
      <div class="music-progress" data-music-progress><span></span></div>
      <div class="music-eq" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span></div>
      <button class="music-lyrics-btn" data-music-lyrics aria-label="展开歌词">歌词</button>
    </div>
  `
  document.body.appendChild(dock)

  const lyricsPanel = document.createElement("div")
  lyricsPanel.className = "music-lyrics-panel"
  lyricsPanel.setAttribute("aria-label", "歌词面板")
  document.body.appendChild(lyricsPanel)

  // 音乐区背景大频谱
  const bandEq = document.createElement("div")
  bandEq.className = "music-band-eq"
  bandEq.setAttribute("aria-hidden", "true")
  for (let i = 0; i < 28; i += 1) {
    const s = document.createElement("span")
    bandEq.appendChild(s)
  }
  const musicSection = document.querySelector("#music")
  if (musicSection) {
    musicSection.classList.add("has-band-eq")
    musicSection.appendChild(bandEq)
    // 双转盘混音台装饰（记忆点）
    const deck = document.createElement("div")
    deck.className = "music-deck"
    deck.setAttribute("aria-hidden", "true")
    deck.innerHTML = '<span class="deck-platter"></span><span class="deck-mixer"></span><span class="deck-platter"></span>'
    musicSection.insertBefore(deck, musicSection.firstChild)
  }

  const audio = new Audio()
  audio.preload = "none"

  // 黑胶封面环形波形频谱
  const vinylWave = document.createElement("div")
  vinylWave.className = "vinyl-wave"
  vinylWave.setAttribute("aria-hidden", "true")
  for (let i = 0; i < 12; i += 1) {
    const dot = document.createElement("i")
    dot.style.setProperty("--deg", `${i * 30}deg`)
    dot.style.animationDelay = `${(i % 4) * 0.13}s`
    vinylWave.appendChild(dot)
  }
  cover.closest(".music-dock-inner")?.appendChild(vinylWave)

  let current = 0
  let playing = false
  let lyricsOpen = false

  const cover = dock.querySelector("[data-music-cover]")
  const title = dock.querySelector("[data-music-title]")
  const artist = dock.querySelector("[data-music-artist]")
  const toggle = dock.querySelector("[data-music-toggle]")
  const progress = dock.querySelector("[data-music-progress] span")
  const lyricsBtn = dock.querySelector("[data-music-lyrics]")

  function loadSong(index, autoplay) {
    current = (index + SONGS.length) % SONGS.length
    const song = SONGS[current]
    cover.src = song.cover || ""
    cover.style.background = `linear-gradient(140deg, ${song.color}, #1e2a63)`
    title.textContent = song.title
    artist.textContent = `${song.artist} · ${song.year}`
    audio.src = song.src
    if (autoplay) {
      audio.play().catch(() => {})
    }
    progress.style.width = "0%"
    renderLyrics()
    setPlaying(false)
    // 当前播放卡片高亮
    grid.querySelectorAll(".music-card.is-playing").forEach((c) => c.classList.remove("is-playing"))
    const active = grid.querySelector(`[data-song="${song.id}"]`)
    if (active) active.classList.add("is-playing")
  }

  function setPlaying(play) {
    playing = play
    toggle.textContent = play ? "⏸" : "▶"
    dock.classList.toggle("is-playing", play)
    document.body.classList.toggle("music-playing", play)
    if (musicSection) musicSection.classList.toggle("music-live", play)
    if (play) {
      cover.classList.add("is-spin")
    } else {
      cover.classList.remove("is-spin")
    }
  }

  function renderLyrics() {
    const song = SONGS[current]
    lyricsPanel.innerHTML = `
      <div class="lyrics-head">
        <strong>${song.title}</strong>
        <span>${song.artist}</span>
        <button class="lyrics-close" data-lyrics-close aria-label="收起歌词">✕</button>
      </div>
      <div class="lyrics-body">
        ${song.lyrics.map((line) => `<p>${line}</p>`).join("")}
      </div>
    `
    lyricsPanel.querySelector("[data-lyrics-close]").addEventListener("click", closeLyrics)
  }

  function openLyrics() {
    lyricsOpen = true
    lyricsPanel.classList.add("is-open")
    lyricsBtn.classList.add("is-active")
  }

  function closeLyrics() {
    lyricsOpen = false
    lyricsPanel.classList.remove("is-open")
    lyricsBtn.classList.remove("is-active")
  }

  grid.addEventListener("click", (e) => {
    const card = e.target.closest("[data-song]")
    if (!card) return
    const idx = SONGS.findIndex((s) => s.id === card.dataset.song)
    loadSong(idx, true)
    dock.classList.add("is-visible")
  })

  toggle.addEventListener("click", () => {
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      audio.play().catch(() => {
        title.textContent = "音频待添加"
        artist.textContent = "把 mp3 放入 assets/music/ 后自动生效"
      })
      setPlaying(true)
    }
  })

  dock.querySelector("[data-music-prev]").addEventListener("click", () => loadSong(current - 1, true))
  dock.querySelector("[data-music-next]").addEventListener("click", () => loadSong(current + 1, true))

  audio.addEventListener("timeupdate", () => {
    if (audio.duration) {
      progress.style.width = `${(audio.currentTime / audio.duration) * 100}%`
    }
  })
  audio.addEventListener("ended", () => loadSong(current + 1, true))
  audio.addEventListener("error", () => {
    title.textContent = "音频待添加"
    artist.textContent = "把 mp3 放入 assets/music/ 后自动生效"
  })

  lyricsBtn.addEventListener("click", () => (lyricsOpen ? closeLyrics() : openLyrics()))

  // 公鸡 DJ：点击公鸡播放音乐
  document.addEventListener("dj-play", () => {
    dock.classList.add("is-visible")
    if (!audio.src || audio.paused || !audio.currentTime) {
      loadSong(current, true)
    } else {
      audio.play().catch(() => {})
      setPlaying(true)
    }
    // 音乐区卡片滚动到视野
    const musicSection = document.querySelector("#music")
    if (musicSection) musicSection.scrollIntoView({ behavior: "smooth", block: "center" })
  })
}

initMusicPlayer()

/* ───────────── 数字滚动动画 ───────────── */

function initCountUp() {
  const items = document.querySelectorAll("[data-count]")
  if (!items.length) return
  const fmt = (el, val) => {
    const decimals = parseInt(el.dataset.decimals || "0", 10)
    const suffix = el.dataset.suffix || ""
    return val.toFixed(decimals) + suffix
  }
  const run = (el) => {
    const target = parseFloat(el.dataset.count)
    const dur = 1100
    const start = performance.now()
    function tick(now) {
      const t = Math.min((now - start) / dur, 1)
      const ease = 1 - Math.pow(1 - t, 3)
      el.textContent = fmt(el, target * ease)
      if (t < 1) requestAnimationFrame(tick)
      else el.textContent = fmt(el, target)
    }
    requestAnimationFrame(tick)
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          run(entry.target)
          io.unobserve(entry.target)
        }
      }
    },
    { threshold: 0.5 },
  )
  items.forEach((el) => io.observe(el))
}

initCountUp()

/* ───────────── 宣言逐行浮现（文字始终可见，关键词高亮 + 动态流光） ───────────── */

function initManifesto() {
  const section = document.querySelector(".manifesto")
  const lines = Array.from(document.querySelectorAll(".manifesto-line"))
  if (!lines.length) return

  // 文字默认就在 HTML 里（静态可见）；此处仅做关键词高亮包装 + 渐入动画
  const KEYWORDS = ["社会幸福", "大胆探索", "幸福", "恩赐"]

  function highlight(text) {
    // 占位符防嵌套（社会幸福 含 幸福）
    let t = text
    const ph = (s) => `\u0000${s}\u0001`
    t = t.replaceAll("社会幸福", ph("社会幸福"))
    t = t.replaceAll("大胆探索", ph("大胆探索"))
    t = t.replaceAll("幸福", ph("幸福"))
    t = t.replaceAll("恩赐", ph("恩赐"))
    return t.replace(/\u0000([^\u0001]+)\u0001/g, '<span class="m-key">$1</span>')
  }

  // 关键词高亮（HTML 已有 span，仅兜底重新包装）
  lines.forEach((l, i) => {
    if (!l.querySelector(".m-key")) {
      l.innerHTML = highlight(l.textContent)
    }
  })

  // 渐入动画（IO 触发，防 JS 挂掉时文字仍可见——默认 opacity:1）
  const io = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        lines.forEach((l) => l.classList.add("is-in"))
        io.disconnect()
      }
    },
    { threshold: 0.3 },
  )
  io.observe(section)
  // 兜底：1.2s 后强制渐入完成
  setTimeout(() => {
    lines.forEach((l) => l.classList.add("is-in"))
  }, 1200)
}

initManifesto()
