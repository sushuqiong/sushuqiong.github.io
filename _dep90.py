# -*- coding: utf-8 -*-
"""部署 v90（全面加强版）"""
import glob
import os
import subprocess

os.chdir(r"C:\Users\fengq\website-redesign\site")
GIT_ID = ["-c", "user.name=sushuqiong", "-c", "user.email=sushuqiong@users.noreply.github.com"]

n = 0
for f in glob.glob("*.html") + glob.glob("*/*.html"):
    t = open(f, encoding="utf-8").read()
    if "?v89" in t:
        open(f, "w", encoding="utf-8").write(t.replace("?v89", "?v90"))
        n += 1
print("已更新", n, "个 HTML → v90")

msg = """feat(v90): 全面加强现有效果（15 处，全部为安全方式）

【流光质感】
· 卡片边框流光：1px → 2px、颜色不透明度 → 100%
· 流光旋转：3.2s → 2.1s
· 卡片光泽斜扫亮度 +75%
· 章节分隔线亮度提升（0.65/0.55 → 0.9/0.8）

【粒子与星空】
· 点击粒子：12 → 20 颗（角度按 20 等分）
· 星光拖尾：节流 70ms → 42ms（更密）
· 流星：概率 0.014 → 0.022、同屏上限 5 → 7
· 星空亮度 1.18 → 1.30、对比 1.06 → 1.10、饱和 1.1 → 1.18

【光晕与氛围】
· 鼠标光晕：460 → 620px、亮度 +50%
· 波浪层：175 → 215px、透明度 0.40 → 0.52
· 加载光幕亮度 +50%

【音乐区（新增）】
· 播放时唱片 9s/圈匀速旋转
· 播放时频谱柱律动加快（0.55s）

【安全边界】本次全部为"亮度/尺寸/速度/旋转"类调整，不引入位移、
不作用于文字、不动宣言区；宣言保护规则仍然生效。

【缓存版本】v89 → v90"""

for cmd in [
    ["git", "add", "-A"],
    ["git"] + GIT_ID + ["commit", "-q", "-m", msg],
    ["git", "push", "-q", "origin", "main"],
]:
    r = subprocess.run(cmd, cwd=".", capture_output=True, text=True, timeout=180)
    if r.returncode != 0 and "nothing to commit" not in (r.stdout + r.stderr):
        print("  ⚠️", cmd[1], (r.stderr or r.stdout)[:200])
print("✅ 已推送 v90")
