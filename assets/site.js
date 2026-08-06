const navItems = [
  { href: "/", label: "首页" },
  { href: "/skills.html", label: "Skills" },
  { href: "/wechat.html", label: "公众号" },
  { href: "/archives/", label: "归档" },
  { href: "/projects/", label: "项目" },
  { href: "/about/", label: "关于" },
]

function isCurrentPath(href) {
  const path = location.pathname.replace(/index\.html$/, "")
  if (href === "/") return path === "/" || path === ""
  return path === href || path.startsWith(href)
}

const shell = document.querySelector("[data-shell]")
if (shell) {
  shell.innerHTML = `
    <header class="site-header">
      <div class="container site-header-inner">
        <a class="brand" href="/" aria-label="返回首页">
          <img class="brand-mark" src="/assets/logo.svg" alt="" width="40" height="40">
          <span class="brand-copy">
            <span class="brand-kicker">GitHub Pages 个人站</span>
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
      <p class="footer-copy">© <span data-year></span> sushuqiong</p>
    </div>
  `
}

document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = String(new Date().getFullYear())
})

async function loadJson(path) {
  const response = await fetch(path)
  if (!response.ok) throw new Error(`Failed to load ${path}`)
  return response.json()
}

function uniqueValues(items, key) {
  return [...new Set(items.flatMap((item) => item[key] || []))]
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

function openDialog(dialog, item) {
  dialog.querySelector("[data-dialog-title]").textContent = item.title || item.name
  dialog.querySelector("[data-dialog-kicker]").textContent = item.category || item.topic || "详情"
  dialog.querySelector("[data-dialog-body]").textContent = item.detail || item.summary
  const link = dialog.querySelector("[data-dialog-link]")
  const href = item.repo || makeWechatSearchUrl(item.searchQuery || item.title)
  link.href = href
  link.textContent = item.repo ? "打开 GitHub 仓库" : "搜索这篇推文"
  dialog.showModal()
}

function closeDialog(dialog) {
  dialog.close()
}

function makeWechatSearchUrl(query) {
  return `https://weixin.sogou.com/weixin?type=2&query=${encodeURIComponent(query)}`
}

function renderSkillCard(item, index) {
  const tags = item.tags.map((tag) => `<span class="mini-tag">${tag}</span>`).join("")
  const demo = item.demo
    ? `<a class="text-link" href="${item.demo}" target="_blank" rel="noopener noreferrer">Demo</a>`
    : ""
  return `
    <article class="feature-card" data-card data-tags="${item.tags.join("|")}" data-index="${index}">
      <div class="feature-topline">
        <span class="badge">${item.category}</span>
        <span class="muted">${item.language || "Public"}</span>
      </div>
      <h3>${item.title}</h3>
      <p>${item.summary}</p>
      <div class="mini-tags">${tags}</div>
      <div class="card-actions">
        <a class="button button-primary" href="${item.repo}" target="_blank" rel="noopener noreferrer">GitHub</a>
        ${demo}
        <button class="button" type="button" data-open-detail="${index}">详情</button>
      </div>
    </article>
  `
}

function renderWechatCard(item, index) {
  return `
    <article class="feature-card wechat-card" data-card data-topic="${item.topic}" data-index="${index}">
      <div class="feature-topline">
        <span class="rank">#${String(item.rank).padStart(2, "0")}</span>
        <span class="badge">${item.topic}</span>
      </div>
      <h3>${item.title}</h3>
      <p>${item.summary}</p>
      <div class="post-meta">
        <span>${item.account}</span>
        <span>·</span>
        <time datetime="${item.date}">${item.date}</time>
      </div>
      <div class="card-actions">
        <a class="button button-primary" href="${makeWechatSearchUrl(item.searchQuery)}" target="_blank" rel="noopener noreferrer">搜索文章</a>
        <button class="button" type="button" data-open-detail="${index}">摘要</button>
      </div>
    </article>
  `
}

async function initSkillGrid() {
  const grid = document.querySelector("[data-skill-grid]")
  if (!grid) return
  const skills = await loadJson("/assets/skills.json")
  const filters = document.querySelector("[data-skill-filters]")
  const dialog = document.querySelector("[data-detail-dialog]")
  if (filters) createFilterButtons(uniqueValues(skills, "tags"), filters)
  grid.innerHTML = skills.map(renderSkillCard).join("")
  if (filters) {
    bindFiltering({
      buttons: filters,
      cards: grid,
      getCardValues: (card) => card.dataset.tags.split("|"),
    })
  }
  grid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-open-detail]")
    if (button && dialog) openDialog(dialog, skills[Number(button.dataset.openDetail)])
  })
}

async function initWechatGrid() {
  const grid = document.querySelector("[data-wechat-grid]")
  if (!grid) return
  const posts = await loadJson("/assets/wechat-posts.json")
  const filters = document.querySelector("[data-wechat-filters]")
  const dialog = document.querySelector("[data-detail-dialog]")
  if (filters) createFilterButtons(uniqueValues(posts, "topic"), filters)
  grid.innerHTML = posts.map(renderWechatCard).join("")
  if (filters) {
    bindFiltering({
      buttons: filters,
      cards: grid,
      getCardValues: (card) => [card.dataset.topic],
    })
  }
  grid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-open-detail]")
    if (button && dialog) openDialog(dialog, posts[Number(button.dataset.openDetail)])
  })
}

document.querySelectorAll("[data-close-dialog]").forEach((button) => {
  button.addEventListener("click", () => closeDialog(button.closest("dialog")))
})

initSkillGrid().catch((error) => console.error(error))
initWechatGrid().catch((error) => console.error(error))
