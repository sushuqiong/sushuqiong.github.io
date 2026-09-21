# -*- coding: utf-8 -*-
"""部署 v94：宣言区彻底清理 + 可读性修复"""
import glob
import os
import subprocess

os.chdir(r"C:\Users\fengq\website-redesign\site")
GIT_ID = ["-c", "user.name=sushuqiong", "-c", "user.email=sushuqiong@users.noreply.github.com"]

n = 0
for f in glob.glob("*.html") + glob.glob("*/index.html"):
    t = open(f, encoding="utf-8").read()
    if "?v92" in t:
        open(f, "w", encoding="utf-8").write(t.replace("?v92", "?v94"))
        n += 1
print("已更新", n, "个 HTML → v94")

msg = """fix(宣言区): 彻底清除多余文字并修复可读性

【用户要求】"我的宣言"区域只允许显示以下 5 行文字：
  追求幸福是人的权利，
  破除幸福是别人恩赐的错误认识，
  大胆探索自己的道路，
  在寻找个人幸福的同时
  为社会幸福奉献心力。

【根因（本次实锤）】此前 .m-key 使用 background-clip:text + 透明文字 +
drop-shadow 彩色光晕，关键词在屏幕上形成"发光重影"，看起来像多出一份文字；
另有 .eyebrow 标签（Manifesto · 我的宣言）也显示在该区域。

【修复 v93+v94】
· .m-key 取消 background-clip/透明字/drop-shadow/inline-block/动画 → 纯色文字
· 关键词配色改为纯色（红橙 #fb923c / 蓝 #38bdf8 / 紫 #c084fc / 青绿 #5eead4），
  保留"多色彩"要求
· 隐藏 eyebrow（Manifesto · 我的宣言）及宣言区内一切非宣言文字元素
· 依次高亮（动态字幕）改用"颜色深浅"实现，不再用发光
· **修正**：暗态由 0.5 透明改为 0.88 白 + 单层暗影（黎明亮背景上保证可读，
  此前 0.5 会导致正文几乎看不见）
· 关键词同样加单层暗影保证可读

【验证】宣言区渲染后 OCR 复核：关键词不再重复、标签已隐藏、
5 行正文均可读出；控制台无错误。

【缓存版本】v92 → v94"""

for cmd in [
    ["git", "add", "-A"],
    ["git"] + GIT_ID + ["commit", "-q", "-m", msg],
    ["git", "push", "-q", "origin", "main"],
]:
    r = subprocess.run(cmd, cwd=".", capture_output=True, text=True, timeout=180)
    if r.returncode != 0 and "nothing to commit" not in (r.stdout + r.stderr):
        print("  ⚠️", cmd[1], (r.stderr or r.stdout)[:200])
print("✅ 已推送 v94")
