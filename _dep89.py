# -*- coding: utf-8 -*-
"""部署 v89"""
import glob
import os
import subprocess

os.chdir(r"C:\Users\fengq\website-redesign\site")
GIT_ID = ["-c", "user.name=sushuqiong", "-c", "user.email=sushuqiong@users.noreply.github.com"]

n = 0
for f in glob.glob("*.html") + glob.glob("*/*.html"):
    t = open(f, encoding="utf-8").read()
    if "?v88" in t:
        open(f, "w", encoding="utf-8").write(t.replace("?v88", "?v89"))
        n += 1
print("已更新", n, "个 HTML → v89")

msg = """feat(v89): 宣言区永久保护 + 恢复安全效果 + 补充两个明显效果

【⛔ 宣言区永久保护（用户明确要求）】
在 CSS 中写入保护规则并注释理由：.manifesto 内文字强制
clip-path: none / filter: none / opacity: 1（!important），
杜绝再次出现"宣言文字看起来被改错"的问题。

【恢复（安全版）】
· hero 滚动淡出：仅用 opacity 渐隐（1 → 0.28），**不做 blur、不做位移**，
  避免 v88 被回退的"文字发虚 / 内容错位"问题

【回调（此前减弱过度）】
· 首屏标题错落浮现：位移 10→16px、模糊 4→6px
· 章节标题模糊消散：模糊 5→7px、位移 14→18px
· 波浪层：150→175px、透明度 0.30→0.40

【新增（明显且不改文字与布局）】
· 卡片 hover：上浮 4px + 放大 1.4%，阴影加深（scale 不触发文档流重排）
· 列表整行 hover 高亮：论文/路线项悬停时整行淡青绿底

【缓存版本】v88 → v89"""

for cmd in [
    ["git", "add", "-A"],
    ["git"] + GIT_ID + ["commit", "-q", "-m", msg],
    ["git", "push", "-q", "origin", "main"],
]:
    r = subprocess.run(cmd, cwd=".", capture_output=True, text=True, timeout=180)
    if r.returncode != 0 and "nothing to commit" not in (r.stdout + r.stderr):
        print("  ⚠️", cmd[1], (r.stderr or r.stdout)[:200])
print("✅ 已推送 v89")
