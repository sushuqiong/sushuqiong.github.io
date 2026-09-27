# -*- coding: utf-8 -*-
"""v114：修复小图标/emoji 变蓝（移除误加的渐变填充），保留 emoji 原色"""
import os

os.chdir(r"C:\Users\fengq\website-redesign\site")
css_path = "assets/styles.css"
css = open(css_path, encoding="utf-8").read()

FIX = """

/* ============================================================
   v114 · 修复：小图标 / emoji 变蓝
   原因：v109 的「列表项艺术化」对 .pub-icon-badge / .road-index / .road-icon
        统一套用了 background-clip:text + 透明填充的渐变，
        而这些元素装的是 **彩色 emoji**（🧬🔬📊🏥💊 等）与编号，
        透明填充会把 emoji 压成单一蓝色（或异常显示）。
   处理：全部恢复原样，emoji 显示自身颜色；编号保留原有样式。
   ============================================================ */

.pub-icon-badge,
.road-icon,
.road-index,
.pub-row .pub-icon-badge {
  background-image: none !important;
  -webkit-background-clip: border-box !important;
  background-clip: border-box !important;
  -webkit-text-fill-color: currentColor !important;
  color: inherit !important;
}

/* 保证 emoji 以其原生彩色字体渲染 */
.pub-icon-badge,
.road-icon {
  font-family: "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif !important;
  -webkit-text-fill-color: initial !important;
  color: initial !important;
}

/* 路线编号：恢复原有的强调色（不再渐变） */
.road-index {
  color: var(--accent, #2563eb) !important;
  -webkit-text-fill-color: var(--accent, #2563eb) !important;
}
"""
if "v114 · 修复：小图标" not in css:
    css += FIX
    print("✅ 已追加修复规则（emoji / 图标恢复原色）")

open(css_path, "w", encoding="utf-8").write(css)
print("花括号平衡:", css.count("{") == css.count("}"), f"({css.count('{')}/{css.count('}')})")
