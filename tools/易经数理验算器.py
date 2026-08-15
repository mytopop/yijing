# -*- coding: utf-8 -*-
"""
易经数理验算器 —— 梁致堂《易经数理秘笈》
把"象数理"体系里的离散数学模型全部跑一遍、画出来，肉眼核对。

核心规则（出自《总体概述.md》六张表）：
1. 模12落方位：任一数 n -> n % 12 -> 映射到12地支
2. 三坐标系（按落点余数分）：
   赤道(天):  余数 {1,4,7,10}  -> 子午卯酉
   黄道(地):  余数 {2,5,8,11}  -> 丑未辰戌
   白道(万物):余数 {3,6,9,0}   -> 寅申巳亥  (0按12=亥)
3. 跳步多边形：数k走12步 -> 序列 k,2k,...,12k -> 各自模12 -> 连点画图
   步长3=四边形, 4=三角形, 5=十二芒星, 7=十二芒星(逆)
4. 常数：矩81(空间/9进制), 规60(时间节律)
5. 归九：众和数(数位反复相加)终归9
"""
import math
import os

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib import font_manager

# ---------- 中文字体 ----------
def _pick_cjk_font():
    candidates = [
        "Microsoft YaHei", "SimHei", "SimSun", "KaiTi",
        "Source Han Sans CN", "Noto Sans CJK SC", "DengXian",
    ]
    available = {f.name for f in font_manager.fontManager.ttflist}
    for name in candidates:
        if name in available:
            return name
    return None

CJK = _pick_cjk_font()
if CJK:
    plt.rcParams["font.sans-serif"] = [CJK]
plt.rcParams["axes.unicode_minus"] = False

OUT_DIR = os.path.dirname(os.path.abspath(__file__))

# ---------- 地支与方位 ----------
# 12地支按顺时针排在表盘上，子=正北(90度方向起算)
BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"]
# 子在正北(顶部, 数学角90°), 顺时针。卯=东, 午=南, 酉=西
# 角度: 子=90, 丑=60, 寅=30, 卯=0, ... 亥=120 (顺时针即角度递减)
def branch_angle(idx):
    """idx 0..11 (子=0), 返回数学坐标系角度(度), 顺时针从子起"""
    return 90 - idx * 30

def branch_pos(idx, r=1.0):
    a = math.radians(branch_angle(idx))
    return r * math.cos(a), r * math.sin(a)

# 余数 -> 地支index
def rem_to_idx(rem):
    return 0 if rem == 0 else rem  # 余0=亥? 不, 余0代表整除=12=亥位
    # 注意: 表里余12=亥(idx11), 余0书里也按亥处理。统一: rem in 1..11 -> idx=rem; rem==0 -> idx=11? 不对
    # 实际 12 % 12 = 0, 表记为"12(即0)"落亥。亥idx=11。但 1..11直接对索引。
    # 12对应idx11, 但余0。所以 rem_to_idx: rem==0 -> 11, rem in 1..11 -> rem
def rem2idx(rem):
    """余数(0..11)转地支index(0..11)。
    规律(由书表2数7反推): 余r -> idx=r-1; 余0(=12) -> 亥(idx11)。
    验证: 余7->idx6午, 余2->idx1丑, 余9->idx8申, 余4->idx3卯, 余6->idx5巳。"""
    return 11 if rem == 0 else rem - 1

# 坐标系归属
CHIHDAO = {1, 4, 7, 10}       # 赤道 天
HUANGDAO = {2, 5, 8, 11}      # 黄道 地
BAIDAO = {3, 6, 9, 12}        # 白道 万物 (12即余0)
def system_of(rem12):
    if rem12 == 0:
        rem12 = 12
    if rem12 in CHIHDAO: return "赤道(天)"
    if rem12 in HUANGDAO: return "黄道(地)"
    if rem12 in BAIDAO: return "白道(万物)"
    return "?"

SYSTEM_COLORS = {
    "赤道(天)": "#d62728",   # 红
    "黄道(地)": "#2ca02c",   # 绿
    "白道(万物)": "#1f77b4", # 蓝
}

# ---------- 核心运算 ----------
def mod12(n):
    """模12余数, 0表示12(亥)"""
    return n % 12

def jump_sequence(k, steps=12):
    """数k走steps步的余数序列"""
    return [mod12(k * i) for i in range(1, steps + 1)]

def digit_root(n):
    """众和数(数位反复相加到一位)"""
    n = abs(int(n))
    while n >= 10:
        n = sum(int(d) for d in str(n))
    return n

# ---------- 绘图 ----------
def draw_dial(ax, title=""):
    """画地支表盘底图"""
    ax.set_aspect("equal")
    ax.axis("off")
    theta = [branch_angle(i) for i in range(12)]
    # 外圆
    circle = plt.Circle((0, 0), 1.15, fill=False, color="#888", lw=1)
    ax.add_patch(circle)
    # 12方位刻度+地支名
    for i, b in enumerate(BRANCHES):
        x, y = branch_pos(i, 1.0)
        xl, yl = branch_pos(i, 1.30)
        ax.text(xl, yl, f"{i+1}\n{b}", ha="center", va="center", fontsize=9)
        ax.plot([branch_pos(i,0.92)[0], branch_pos(i,1.0)[0]],
                [branch_pos(i,0.92)[1], branch_pos(i,1.0)[1]], color="#bbb", lw=0.5)
    ax.set_xlim(-1.7, 1.7)
    ax.set_ylim(-1.7, 1.7)
    if title:
        ax.set_title(title, fontsize=13, pad=10)

def plot_jump_polygon(ax, k):
    """画数k的12步跳跃轨迹多边形"""
    seq = jump_sequence(k)          # 余数序列
    idxs = [rem2idx(r) for r in seq] # 地支index序列
    sys_name = system_of(mod12(k))
    color = SYSTEM_COLORS[sys_name]
    pts = [branch_pos(i, 0.8) for i in idxs]
    xs = [p[0] for p in pts] + [pts[0][0]]
    ys = [p[1] for p in pts] + [pts[0][1]]
    ax.plot(xs, ys, "-o", color=color, lw=1.8, ms=5)
    # 标起点
    sx, sy = pts[0]
    ax.plot(sx, sy, "o", color=color, ms=11, mfc="white", mec=color, mew=2)
    ax.text(0, 0, f"{k}", ha="center", va="center", fontsize=16, fontweight="bold", color=color)
    # 子标题
    note = f"{sys_name}  步长{k}"
    ax.text(0, -1.45, note, ha="center", fontsize=9, color=color)

def table_mod12_landings():
    """表1/表3: 1-12 及大数 模12落点"""
    rows = []
    for k in range(1, 13):
        sys_name = system_of(mod12(k))
        seq = jump_sequence(k)
        shape = _shape_name(k, seq)
        rows.append((k, sys_name, shape, seq))
    return rows

def _shape_name(k, seq):
    uniq = len(set(seq))
    return {3: "四边形(4点)", 4: "三角形(3点)", 5: "十二芒星(全周)",
            6: "六边形/对角", 12: "十二边形(全周)"}.get(uniq, f"{uniq}点形")

# ---------- 三大主图 ----------
def fig_three_systems():
    """三坐标系底图: 赤/黄/白道各自高亮"""
    fig, axes = plt.subplots(1, 3, figsize=(16, 6))
    sets = [("赤道(天)", CHIHDAO, "#d62728"),
            ("黄道(地)", HUANGDAO, "#2ca02c"),
            ("白道(万物)", BAIDAO, "#1f77b4")]
    for ax, (name, s, color) in zip(axes, sets):
        draw_dial(ax, name)
        for rem in s:
            idx = rem2idx(rem if rem != 12 else 0)
            x, y = branch_pos(idx, 1.0)
            ax.plot(x, y, "o", color=color, ms=14, alpha=0.6)
        # 连本系统方位
        idxs = sorted(rem2idx(r if r != 12 else 0) for r in s)
        pts = [branch_pos(i, 0.6) for i in idxs]
        pts.append(pts[0])
        ax.plot([p[0] for p in pts], [p[1] for p in pts], "--", color=color, lw=1.5, alpha=0.5)
    fig.suptitle("易经数理 三大坐标系  赤道=天(1/4/7/10) 黄道=地(2/5/8/11) 白道=万物(3/6/9/12)",
                 fontsize=14, fontweight="bold")
    fig.tight_layout(rect=[0, 0, 1, 0.93])
    path = os.path.join(OUT_DIR, "01_三大坐标系底图.png")
    fig.savefig(path, dpi=130, bbox_inches="tight")
    plt.close(fig)
    return path

def fig_jump_all():
    """1-12各数的12步跳跃轨迹, 3x4网格"""
    fig, axes = plt.subplots(3, 4, figsize=(18, 14))
    for ax, k in zip(axes.flat, range(1, 13)):
        draw_dial(ax)
        plot_jump_polygon(ax, k)
    fig.suptitle("易经数理  数1-12的12步跳跃轨迹  (模12余数连点, 圈=起点)",
                 fontsize=16, fontweight="bold")
    fig.tight_layout(rect=[0, 0, 1, 0.96])
    path = os.path.join(OUT_DIR, "02_数1至12跳跃轨迹.png")
    fig.savefig(path, dpi=120, bbox_inches="tight")
    plt.close(fig)
    return path

def fig_number7_star():
    """数7北斗十二芒星(表2) + 余数表"""
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(16, 8), gridspec_kw={"width_ratios": [1.2, 1]})
    draw_dial(ax1, "数7 = 北斗  十二芒星轨迹 (隔五逆跳)")
    seq = jump_sequence(7)
    idxs = [rem2idx(r) for r in seq]
    pts = [branch_pos(i, 0.85) for i in idxs]
    xs = [p[0] for p in pts] + [pts[0][0]]
    ys = [p[1] for p in pts] + [pts[0][1]]
    ax1.plot(xs, ys, "-o", color="#d62728", lw=2, ms=8)
    ax1.plot(pts[0][0], pts[0][1], "o", color="#d62728", ms=14, mfc="white", mec="#d62728", mew=2.5)
    # 逐步标号
    for n, (x, y) in enumerate(pts, 1):
        ax1.text(x*1.12, y*1.12, str(n), color="#d62728", fontsize=10, ha="center",
                 fontweight="bold")
    # 右侧推演表
    ax2.axis("off")
    ax2.set_title("数7 推演表  (7×n -> 余数 -> 落点)", fontsize=13, fontweight="bold")
    header = ["步", "运算", "积", "余12", "地支", "坐标系"]
    data = []
    for n in range(1, 13):
        prod = 7 * n
        rem = mod12(prod)
        idx = rem2idx(rem)
        data.append([str(n), f"7×{n}", str(prod), str(rem if rem else 12),
                     BRANCHES[idx], system_of(rem)])
    tbl = ax2.table(cellText=data, colLabels=header, loc="center", cellLoc="center")
    tbl.auto_set_font_size(False); tbl.set_fontsize(10); tbl.scale(1, 1.5)
    for j in range(len(header)):
        tbl[0, j].set_facecolor("#d62728"); tbl[0, j].set_text_props(color="white", fontweight="bold")
    path = os.path.join(OUT_DIR, "03_数7北斗十二芒星.png")
    fig.savefig(path, dpi=130, bbox_inches="tight")
    plt.close(fig)
    return path

def fig_const_ju81():
    """表4: 10的乘方 经矩81 取余, 验证太阳永在赤道"""
    fig, ax = plt.subplots(figsize=(12, 7))
    ax.axis("off")
    ax.set_title("常数矩(81) 推演  10^n ÷ 81 取余 -> 模12落点  (验证太阳永在赤道)",
                 fontsize=14, fontweight="bold")
    header = ["10的n次方", "数值", "÷81余", "模12", "落点地支", "坐标系", "众和数"]
    data = []
    for n in range(0, 10):
        val = 10 ** n
        rem81 = val % 81
        rem12 = mod12(rem81)
        idx = rem2idx(rem12)
        data.append([f"10^{n}", str(val), str(rem81),
                     str(rem12 if rem12 else 12), BRANCHES[idx],
                     system_of(rem12), str(digit_root(val))])
    tbl = ax.table(cellText=data, colLabels=header, loc="center", cellLoc="center")
    tbl.auto_set_font_size(False); tbl.set_fontsize(10); tbl.scale(1, 1.7)
    for j in range(len(header)):
        tbl[0, j].set_facecolor("#8e44ad"); tbl[0, j].set_text_props(color="white", fontweight="bold")
    # 高亮赤道行
    for i in range(1, len(data) + 1):
        if "赤道" in data[i-1][5]:
            for j in range(len(header)):
                tbl[i, j].set_facecolor("#fce4ec")
    path = os.path.join(OUT_DIR, "04_矩81常数推演.png")
    fig.savefig(path, dpi=130, bbox_inches="tight")
    plt.close(fig)
    return path

def fig_gui_jiu_360():
    """表6: 360度无限对半分割, 众和数终归9"""
    fig, ax = plt.subplots(figsize=(12, 7))
    ax.axis("off")
    ax.set_title("归九律  周天360° 对半分割 -> 众和数恒为9", fontsize=14, fontweight="bold")
    header = ["阶段", "等分份数", "角度", "众和过程", "极数"]
    stages = [("太极", 1), ("两仪", 2), ("四象", 4), ("八卦", 8),
              ("十六", 16), ("三十二", 32), ("六十四", 64), ("一二八", 128),
              ("二五六", 256), ("五一二", 512)]
    data = []
    for name, parts in stages:
        angle = 360 / parts
        # 众和
        s = angle
        steps = []
        v = angle
        while v >= 10:
            v = round(v, 10)
            d = sum(int(c) for c in str(int(round(v))) if c.isdigit())
            steps.append(str(d)); v = d
        # 用纯整数众和更稳: 取角度的整数部分各位和
        intpart = int(round(angle))
        root = digit_root(intpart)
        proc = " -> ".join([str(intpart)] + ([] if intpart < 10 else []))
        data.append([name, f"{parts}份", f"{angle:g}°",
                     f"{intpart} -> {root}", str(root)])
    tbl = ax.table(cellText=data, colLabels=header, loc="center", cellLoc="center")
    tbl.auto_set_font_size(False); tbl.set_fontsize(10); tbl.scale(1, 1.8)
    for j in range(len(header)):
        tbl[0, j].set_facecolor("#2c3e50"); tbl[0, j].set_text_props(color="white", fontweight="bold")
    for i in range(1, len(data) + 1):
        if data[i-1][4] == "9":
            tbl[i, 4].set_facecolor("#fff59d"); tbl[i, 4].set_text_props(fontweight="bold")
    path = os.path.join(OUT_DIR, "05_归九律360度.png")
    fig.savefig(path, dpi=130, bbox_inches="tight")
    plt.close(fig)
    return path

# ---------- 文字报告 ----------
def text_report():
    lines = []
    lines.append("=" * 60)
    lines.append("易经数理验算器 —— 推演结果核对")
    lines.append("=" * 60)
    lines.append("\n【表1/表3】数1-12 模12落点与跳跃形状:")
    lines.append(f"{'数':<4}{'坐标系':<14}{'形状':<18}{'余数序列(12步)'}")
    for k, sys_name, shape, seq in table_mod12_landings():
        seq_show = ",".join(str(s if s else 12) for s in seq)
        lines.append(f"{k:<4}{sys_name:<14}{shape:<18}{seq_show}")
    lines.append("\n关键核对:")
    lines.append("  · 3(白道)只走 寅巳申亥(3,6,9,12) -> 四边形  √")
    lines.append("  · 4(赤道)只走 卯未亥(4,8,12) -> 三角形   √")
    lines.append("  · 5(黄道)走全周 -> 十二芒星              √")
    lines.append("  · 7(赤道)走全周逆 -> 十二芒星(北斗)       √")
    lines.append("\n【表5】永静数6: 乘奇落巳(地户) 乘偶落亥(天门)")
    for m in [1, 2, 3, 4, 5, 6]:
        r = mod12(6 * m)
        idx = rem2idx(r)
        lines.append(f"  6×{m}={6*m:<4} 余{r if r else 12:<3} -> {BRANCHES[idx]}位  ({'奇:地户' if m%2 else '偶:天门'})")
    lines.append("\n【众和归九】360对半分割:")
    for name, p in [("太极",1),("两仪",2),("四象",4),("八卦",8),("64卦",64),("256",256)]:
        a = 360 // p if 360 % p == 0 else 360 / p
        lines.append(f"  360÷{p:<3} = {360//p if 360%p==0 else round(a,3):<8} 众和={digit_root(int(round(a)))}")
    lines.append("\n已生成图:")
    return "\n".join(lines)

# ---------- 入口 ----------
if __name__ == "__main__":
    print(f"使用中文字体: {CJK or '未找到(中文可能乱码)'}")
    print("生成图1: 三大坐标系底图")
    p1 = fig_three_systems()
    print("生成图2: 数1-12跳跃轨迹")
    p2 = fig_jump_all()
    print("生成图3: 数7北斗十二芒星+推演表")
    p3 = fig_number7_star()
    print("生成图4: 矩81常数推演")
    p4 = fig_const_ju81()
    print("生成图5: 归九律360度")
    p5 = fig_gui_jiu_360()
    print("\n" + text_report())
    print(f"\n  {p1}")
    print(f"  {p2}")
    print(f"  {p3}")
    print(f"  {p4}")
    print(f"  {p5}")
