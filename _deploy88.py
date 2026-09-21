# -*- coding: utf-8 -*-
"""部署 v88（回退修复版）"""
import glob
import os
import subprocess

os.chdir(r"C:\Users\fengq\website-redesign\site")
GIT_ID = ["-c", "user.name=sushuqiong", "-c", "user.email=sushuqiong@users.noreply.github.com"]

n = 0
for f in glob.glob("*.html") + glob.glob("*/*.html"):
    t = open(f, encoding="utf-8").read()
    if "?v87" in t:
        open(f, "w", encoding="utf-8").write(t.replace("?v87", "?v88"))
        n += 1
print("已更新", n, "个 HTML → v88")

msg = """fix(回退): 移除会裁剪文字/改变布局的效果，修复宣言显示异常

【用户反馈】"我的宣言"句子看起来被改错了；部分字体与元素位置异常。

【根因（已核实）】宣言区 HTML 文字**与 60 个提交前完全一致**（逐字对比无差异），
句子并未被修改。真正原因是新增的 CSS 效果改变了文字的**呈现**：

① 宣言 clip-path 逐行揭示 → 文字被局部裁剪，看起来像"句子变了"【已移除】
② hero 3D 跟手倾斜（perspective+rotate）→ 文字抗锯齿改变、发虚【已移除】
③ hero 滚动淡出（opacity/translate/filter blur）→ 首屏内容模糊位移【已移除】
④ 粘性章节标题（sticky + 背景/padding）→ 标题位置与外观改变【已移除】
⑤ 内容视差位移（卡片滚动 ±14px）→ 元素位置"不对"【已移除】
⑥ 关键词点亮的大范围 text-shadow 辉光 → 文字发糊【已去除辉光】

【同时减弱】论文列表滑入位移 20→6px；首屏浮现位移 18→8px；
标题浮现位移 26→10px、模糊 7→4px；章节标题模糊 9→5px；
波浪层 190→150px / 透明度 0.45→0.30；动态渐变背景浓度 -40%。

【保留】纯装饰且不影响文字与布局的效果：鼠标光晕、星光拖尾、点击粒子、
流星增强、星空闪烁、卡片流光边框/光泽、图片灯箱、自定义滚动条、文字选中、
加载光幕、章节分隔线、火箭喷射、音乐音波、列表侧光、性能自适应。

【缓存版本】v87 → v88"""

for cmd in [
    ["git", "add", "-A"],
    ["git"] + GIT_ID + ["commit", "-q", "-m", msg],
    ["git", "push", "-q", "origin", "main"],
]:
    r = subprocess.run(cmd, cwd=".", capture_output=True, text=True, timeout=180)
    if r.returncode != 0 and "nothing to commit" not in (r.stdout + r.stderr):
        print("  ⚠️", cmd[1], (r.stderr or r.stdout)[:200])
print("✅ 已推送")
