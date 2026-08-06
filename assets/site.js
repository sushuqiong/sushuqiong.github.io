const navItems = [
  { href: "/", label: "首页" },
  { href: "/posts/", label: "文章" },
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
        <p class="footer-title">公开内容只保留文章、项目和可分享链接。</p>
        <p>如果你想联系我，优先从 GitHub 主页或仓库入口开始。</p>
      </div>
      <div class="footer-links">
        <a href="/posts/">文章</a>
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
