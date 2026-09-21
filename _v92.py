# -*- coding: utf-8 -*-
"""v92：宣言区只显示 5 行宣言（隐藏原有 eyebrow 小标签）"""
import os

os.chdir(r"C:\Users\fengq\website-redesign\site")
css_path = "assets/styles.css"
css = open(css_path, encoding="utf-8").read()

RULE = """

/* ============================================================
   v92 · 宣言区只显示 5 行宣言
   —— 用户明确要求：该区域只显示
      「追求幸福是人的权利，/ 破除幸福是别人恩赐的错误认识，/
        大胆探索自己的道路，/ 在寻找个人幸福的同时 /
        为社会幸福奉献心力。」
   —— 隐藏原有的 eyebrow 小标签（"Manifesto · 我的宣言"），
      以及任何非宣言文字的可见元素；文字内容本身不作改动。
   ============================================================ */

.manifesto-inner > .eyebrow {
  display: none !important;
}

/* 兜底：宣言区里除 5 行宣言外，其余直接文本子元素一律隐藏 */
.manifesto-inner > :not(.manifesto-line):not(.manifesto-inner) {
  display: none !important;
}
"""
if "v92 · 宣言区只显示 5 行宣言" not in css:
    css += RULE
    print("✅ 已加入规则：隐藏宣言区 eyebrow 与其它非宣言文字元素")
else:
    print("（规则已存在）")

open(css_path, "w", encoding="utf-8").write(css)
print("花括号平衡:", css.count("{") == css.count("}"), f"({css.count('{')}/{css.count('}')})")

# 部署 v92
import glob
import subprocess

GIT_ID = ["-c", "user.name=sushuqiong", "-c", "user.email=sushuqiong@users.noreply.github.com"]
n = 0
for f in glob.glob("*.html") + glob.glob("*/*.html"):
    t = open(f, encoding="utf-8").read()
    if "?v91" in t:
        open(f, "w", encoding="utf-8").write(t.replace("?v91", "?v92"))
        n += 1
print("已更新", n, "个 HTML → v92")

msg = """feat(v91-92): 宣言动态字幕与多色彩 + 4 项新效果；宣言区只显示 5 行宣言

【⛔ 宣言区（用户明确要求）】
· 只显示 5 行宣言文字，隐藏原有的 eyebrow 小标签（Manifesto · 我的宣言）
  与其它非宣言文字元素（display:none，文字内容一字未改）
· 新增「动态字幕 + 多色彩」：5 行依次点亮，当前行提亮并带该行专属色辉光
  （青绿 / 紫 / 天蓝 / 粉 / 金），关键句原有 m-key 元素同步发光
· 文字**始终完整可见**（不用 clip-path / filter / opacity；保护规则仍生效）

【新增 4 项效果】
① 鼠标光晕改双层：外层 760px 大范围柔光（跟随较慢）+ 内层 170px 亮核（贴手快）
② 点击冲击波环：双圈扩散（青绿 + 紫，错开 0.11s）
③ 加载星尘爆开：进入页面时从屏幕中部爆开 26 颗彩色星尘（每会话一次）
④ 音乐律动：监听 audio 播放状态，播放时整体氛围层呼吸律动

【缓存版本】v90 → v92"""

for cmd in [
    ["git", "add", "-A"],
    ["git"] + GIT_ID + ["commit", "-q", "-m", msg],
    ["git", "push", "-q", "origin", "main"],
]:
    r = subprocess.run(cmd, cwd=".", capture_output=True, text=True, timeout=180)
    if r.returncode != 0 and "nothing to commit" not in (r.stdout + r.stderr):
        print("  ⚠️", cmd[1], (r.stderr or r.stdout)[:200])
print("✅ 已推送 v92")
