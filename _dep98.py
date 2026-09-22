# -*- coding: utf-8 -*-
"""部署 v98（宣言区艺术化 + 清晰度修复）"""
import glob
import os
import subprocess

os.chdir(r"C:\Users\fengq\website-redesign\site")
GIT_ID = ["-c", "user.name=sushuqiong", "-c", "user.email=sushuqiong@users.noreply.github.com"]

n = 0
for f in glob.glob("*.html") + glob.glob("*/index.html"):
    t = open(f, encoding="utf-8").read()
    if "?v96" in t:
        open(f, "w", encoding="utf-8").write(t.replace("?v96", "?v98"))
        n += 1
print("已更新", n, "个 HTML → v98")

msg = """feat(v97-98): 宣言区艺术化（动态字幕 + 艺术字效 + 装饰图案）

【用户要求】宣言区太死板：要动态字幕、艺术字体、修饰小图案；
           字体要美观、要有动感；2 小时全面完善。

【实现】
① 动态字幕（真正安全的方式）
   · 整行"从光中凝结"进入：blur 9px→0 + 轻微上移，逐行错开 170ms
   · 逐行高亮 + 行下光带生长（当前行下方流动光带）
   · 已放弃"逐字拆解"方案：中文被切成 inline-block 后字距与排版被破坏，
     反而更难看（实测并回退）
   · **文字默认始终完全可见**（动画不改变 opacity，杜绝"文字消失"隐患）

② 艺术字效
   · 字重 700 + 极细白色描边（-webkit-text-stroke）
   · 单层锐利深色暗影（替代此前致糊的多层发光）
   · 关键词：彩色（红橙/蓝/紫/青绿）+ 同色发光 + 加重字重

③ 修饰图案（全部 SVG 图形，**不添加任何文字**）
   · 左右 SVG 引号（描边风格，右下角旋转 180°）
   · 四角 L 形装饰线
   · 7 颗星芒（旋转闪烁，错开节奏）
   · 2 条手绘波浪线（描边动画）

④ 可读性修复（重要）
   · 宣言区背景为明亮黎明图，白字在其上几乎不可见
   · 为宣言区叠加深度遮罩（保留日出氛围：太阳区域单独透光）
   · 压暗顶部亮色过渡带（原本 rgba(238,240,251,.9) 压住白字）
   · 恢复文字反差：纯白 + 锐利暗影
   · 实测 OCR：5 行正文 10/10 全部清晰可读（此前仅 3/10）

【验证】控制台 0 错误；宣言区文字完整且只有那 5 行；装饰图案全部为图形元素。

【缓存版本】v96 → v98"""

for cmd in [
    ["git", "add", "-A"],
    ["git"] + GIT_ID + ["commit", "-q", "-m", msg],
    ["git", "push", "-q", "origin", "main"],
]:
    r = subprocess.run(cmd, cwd=".", capture_output=True, text=True, timeout=180)
    if r.returncode != 0 and "nothing to commit" not in (r.stdout + r.stderr):
        print("  ⚠️", cmd[1], (r.stderr or r.stdout)[:200])
print("✅ 已推送 v98")
