# -*- coding: utf-8 -*-
import os
import shutil
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle

# 设置系统中文正常显示
plt.rcParams['font.sans-serif'] = ['Microsoft YaHei', 'SimHei', 'SimSun', 'sans-serif']
plt.rcParams['axes.unicode_minus'] = False

out_dir = r'E:\文档\我的文档\易经数理\assets\palace_tables'
brain_dir = r'C:\Users\Lenovo\.gemini\antigravity\brain\51193f4f-e140-49f2-ad83-a408adcc79a2\palace_tables'

os.makedirs(out_dir, exist_ok=True)
os.makedirs(brain_dir, exist_ok=True)

zhi_map = {1: '子', 2: '丑', 3: '寅', 4: '卯', 5: '辰', 6: '巳', 7: '午', 8: '未', 9: '申', 10: '酉', 11: '戌', 0: '亥'}
c_names = {1: '一', 2: '二', 3: '三', 4: '四', 5: '五', 6: '六', 7: '七', 8: '八', 9: '九'}

palace_configs = {
    1: {
        'name': '坎一宫', 'tag': '赤标1', 'orbit': '赤道', 'branches': '子、午、卯、酉 (四正)',
        'bg_theme': '#FAF7F2', 'header_bg': '#8C2D19', 'header_fg': '#FFFFFF',
        'cell_even': '#FFFFFF', 'cell_odd': '#FDFBF7', 'border_color': '#8C2D19',
        'sub_color': '#B33924', 'note': '本宫自乘81格全部落入一宫 (一1至一9)，地支纯收敛于赤道四正'
    },
    2: {
        'name': '坤二宫', 'tag': '黄标2', 'orbit': '黄道', 'branches': '子、午、卯、酉 (四正交感)',
        'bg_theme': '#FAF8F0', 'header_bg': '#8C6D19', 'header_fg': '#FFFFFF',
        'cell_even': '#FFFFFF', 'cell_odd': '#FCFBF5', 'border_color': '#8C6D19',
        'sub_color': '#A6821E', 'note': '本宫自乘81格全部落入四宫 (四1至四9)，黄道二二得四平方剩余'
    },
    3: {
        'name': '震三宫', 'tag': '白标3', 'orbit': '白道', 'branches': '寅、申、巳、亥 (四生四绝)',
        'bg_theme': '#F2F7F6', 'header_bg': '#1F5E5B', 'header_fg': '#FFFFFF',
        'cell_even': '#FFFFFF', 'cell_odd': '#F7FAF9', 'border_color': '#1F5E5B',
        'sub_color': '#2A7A76', 'note': '本宫自乘81格全部落入九宫 (九1至九9)，地支绝对收敛于白道四隅'
    },
    4: {
        'name': '巽四宫', 'tag': '赤标4', 'orbit': '赤道', 'branches': '子、午、卯、酉 (四正交感)',
        'bg_theme': '#FAF7F2', 'header_bg': '#9E3824', 'header_fg': '#FFFFFF',
        'cell_even': '#FFFFFF', 'cell_odd': '#FDFBF7', 'border_color': '#9E3824',
        'sub_color': '#C2472F', 'note': '本宫自乘81格全部落入七宫 (七1至七9)，四四一十六归七'
    },
    5: {
        'name': '中五宫', 'tag': '黄标5', 'orbit': '黄道', 'branches': '子、午、卯、酉 (四正交感)',
        'bg_theme': '#FAF8F0', 'header_bg': '#9C7A28', 'header_fg': '#FFFFFF',
        'cell_even': '#FFFFFF', 'cell_odd': '#FCFBF5', 'border_color': '#9C7A28',
        'sub_color': '#BD9432', 'note': '本宫自乘81格全部落入七宫 (七1至七9)，五五二十五归七'
    },
    6: {
        'name': '乾六宫', 'tag': '白标6', 'orbit': '白道', 'branches': '寅、申、巳、亥 (四生四绝)',
        'bg_theme': '#F2F7F6', 'header_bg': '#265463', 'header_fg': '#FFFFFF',
        'cell_even': '#FFFFFF', 'cell_odd': '#F7FAF9', 'border_color': '#265463',
        'sub_color': '#336F82', 'note': '本宫自乘81格全部落入九宫 (九1至九9)，六六三十六归九'
    },
    7: {
        'name': '兑七宫', 'tag': '赤标7', 'orbit': '赤道', 'branches': '子、午、卯、酉 (四正交感)',
        'bg_theme': '#FAF7F2', 'header_bg': '#8F281E', 'header_fg': '#FFFFFF',
        'cell_even': '#FFFFFF', 'cell_odd': '#FDFBF7', 'border_color': '#8F281E',
        'sub_color': '#B53326', 'note': '本宫自乘81格全部落入四宫 (四1至四9)，七七四十九归四'
    },
    8: {
        'name': '艮八宫', 'tag': '黄标8', 'orbit': '黄道', 'branches': '子、午、卯、酉 (四正交感)',
        'bg_theme': '#FAF8F0', 'header_bg': '#7A5E1E', 'header_fg': '#FFFFFF',
        'cell_even': '#FFFFFF', 'cell_odd': '#FCFBF5', 'border_color': '#7A5E1E',
        'sub_color': '#9C7827', 'note': '本宫自乘81格全部落入一宫 (一1至一9)，八八六十四归一'
    },
    9: {
        'name': '离九宫', 'tag': '白标9', 'orbit': '白道', 'branches': '寅、申、巳、亥 (四生四绝)',
        'bg_theme': '#F2F7F6', 'header_bg': '#194A6B', 'header_fg': '#FFFFFF',
        'cell_even': '#FFFFFF', 'cell_odd': '#F7FAF9', 'border_color': '#194A6B',
        'sub_color': '#236591', 'note': '本宫自乘81格全部落入九宫 (九1至九9)，九九八十一归九大圆满'
    }
}

def get_tag_and_branch(v):
    r = v % 81
    if r == 0:
        r = 81
    g = r % 9
    if g == 0:
        g = 9
    w = (r - 1) // 9 + 1
    z = zhi_map[v % 12]
    return f'{c_names[g]}{w}{z}'

def render_palace_table(palace_num):
    cfg = palace_configs[palace_num]
    base = [palace_num + 9 * k for k in range(9)]
    steps = [r * 9 for r in base]

    fig = plt.figure(figsize=(13, 12.8), dpi=220)
    ax = fig.add_axes([0, 0, 1, 1])
    ax.set_facecolor(cfg['bg_theme'])
    ax.set_xlim(0, 1300)
    ax.set_ylim(150, 1380)
    ax.axis('off')

    # 1. 绘制顶部大标题区域
    ax.text(650, 1335, f'九宫纪周天气数一览表·第{c_names[palace_num]}张表 ({cfg["name"]}·{cfg["tag"]})',
            ha='center', va='center', fontsize=22, fontweight='bold', color=cfg['header_bg'])
    ax.text(650, 1295, f'三道坐标：{cfg["orbit"]}轨道 · 运行地支：{cfg["branches"]} · 9×9 经纬自乘全息方阵',
            ha='center', va='center', fontsize=12, color='#555555')

    # 2. 表格几何布局计算
    table_left = 60
    table_top = 1250
    cell_w_header = 95
    cell_w_data = 110
    cell_w_step = 95
    
    row_h_header = 70
    row_h_data = 100
    row_h_step = 60

    xs = [table_left]
    xs.append(xs[-1] + cell_w_header)
    for _ in range(9):
        xs.append(xs[-1] + cell_w_data)
    xs.append(xs[-1] + cell_w_step)

    ys = [table_top]
    ys.append(ys[-1] - row_h_header)
    for _ in range(9):
        ys.append(ys[-1] - row_h_data)
    ys.append(ys[-1] - row_h_step)

    # 绘制外边框
    border = Rectangle((xs[0], ys[-1]), xs[-1] - xs[0], ys[0] - ys[-1],
                       fill=False, edgecolor=cfg['border_color'], linewidth=2.5)
    ax.add_patch(border)

    # 绘制表头行背景
    h_bg = Rectangle((xs[0], ys[1]), xs[-1] - xs[0], row_h_header,
                     fill=True, facecolor=cfg['header_bg'])
    ax.add_patch(h_bg)

    # 绘制表头列背景
    v_bg = Rectangle((xs[0], ys[-1]), cell_w_header, ys[0] - ys[-1],
                     fill=True, facecolor=cfg['header_bg'])
    ax.add_patch(v_bg)

    # 绘制交点 0
    ax.text((xs[0] + xs[1]) / 2, (ys[0] + ys[1]) / 2, '0',
            ha='center', va='center', fontsize=16, fontweight='bold', color=cfg['header_fg'])

    # 绘制横轴标头 (顶部)
    for j in range(9):
        x_c = (xs[j + 1] + xs[j + 2]) / 2
        y_c = (ys[0] + ys[1]) / 2
        base_val = base[j]
        base_tag = get_tag_and_branch(base_val)
        ax.text(x_c, y_c + 12, str(base_val),
                ha='center', va='center', fontsize=14, fontweight='bold', color=cfg['header_fg'])
        ax.text(x_c, y_c - 14, f'{c_names[palace_num]}{j + 1} {base_tag[-1]}',
                ha='center', va='center', fontsize=10, color='#EFEFEF')

    # 横轴末尾：进位数
    ax.text((xs[10] + xs[11]) / 2, (ys[0] + ys[1]) / 2, '进位数',
            ha='center', va='center', fontsize=13, fontweight='bold', color=cfg['header_fg'])

    # 绘制纵轴标头 (左侧)
    for i in range(9):
        x_c = (xs[0] + xs[1]) / 2
        y_c = (ys[i + 1] + ys[i + 2]) / 2
        base_val = base[i]
        base_tag = get_tag_and_branch(base_val)
        ax.text(x_c, y_c + 12, str(base_val),
                ha='center', va='center', fontsize=14, fontweight='bold', color=cfg['header_fg'])
        ax.text(x_c, y_c - 14, f'{c_names[palace_num]}{i + 1} {base_tag[-1]}',
                ha='center', va='center', fontsize=10, color='#EFEFEF')

    # 纵轴底角：进位数
    ax.text((xs[0] + xs[1]) / 2, (ys[10] + ys[11]) / 2, '进位数',
            ha='center', va='center', fontsize=13, fontweight='bold', color=cfg['header_fg'])

    # 绘制数据单元格
    for i in range(9):
        for j in range(9):
            x1, x2 = xs[j + 1], xs[j + 2]
            y1, y2 = ys[i + 2], ys[i + 1]
            val = base[i] * base[j]
            tag = get_tag_and_branch(val)

            bg_c = cfg['cell_even'] if (i + j) % 2 == 0 else cfg['cell_odd']
            cell_box = Rectangle((x1, y1), x2 - x1, y2 - y1,
                                 fill=True, facecolor=bg_c, edgecolor='#D5CCC0', linewidth=0.8)
            ax.add_patch(cell_box)

            xc = (x1 + x2) / 2
            yc = (y1 + y2) / 2
            ax.text(xc, yc + 15, str(val),
                    ha='center', va='center', fontsize=15, fontweight='bold', color='#1A1A1A')
            ax.text(xc, yc - 16, tag,
                    ha='center', va='center', fontsize=12, fontweight='bold', color=cfg['sub_color'])

    # 绘制右侧行进位数
    for i in range(9):
        x1, x2 = xs[10], xs[11]
        y1, y2 = ys[i + 2], ys[i + 1]
        step_val = steps[i]
        bg_step = '#EBE5D8' if i % 2 == 0 else '#F4EFE6'
        step_box = Rectangle((x1, y1), x2 - x1, y2 - y1,
                             fill=True, facecolor=bg_step, edgecolor='#D5CCC0', linewidth=0.8)
        ax.add_patch(step_box)
        ax.text((x1 + x2) / 2, (y1 + y2) / 2, str(step_val),
                ha='center', va='center', fontsize=14, fontweight='bold', color='#2B2B2B')

    # 绘制底部列进位数
    for j in range(9):
        x1, x2 = xs[j + 1], xs[j + 2]
        y1, y2 = ys[11], ys[10]
        step_val = steps[j]
        bg_step = '#EBE5D8' if j % 2 == 0 else '#F4EFE6'
        step_box = Rectangle((x1, y1), x2 - x1, y2 - y1,
                             fill=True, facecolor=bg_step, edgecolor='#D5CCC0', linewidth=0.8)
        ax.add_patch(step_box)
        ax.text((x1 + x2) / 2, (y1 + y2) / 2, str(step_val),
                ha='center', va='center', fontsize=14, fontweight='bold', color='#2B2B2B')

    # 右下角空角单元格
    corner_box = Rectangle((xs[10], ys[11]), cell_w_step, row_h_step,
                           fill=True, facecolor=cfg['header_bg'], edgecolor=cfg['border_color'], linewidth=1)
    ax.add_patch(corner_box)
    ax.text((xs[10] + xs[11]) / 2, (ys[10] + ys[11]) / 2, '+81',
            ha='center', va='center', fontsize=12, fontweight='bold', color='#FFFFFF')

    # 绘制网格线加固
    for x in xs:
        ax.plot([x, x], [ys[0], ys[-1]], color=cfg['border_color'], linewidth=1.2)
    for y in ys:
        ax.plot([xs[0], xs[-1]], [y, y], color=cfg['border_color'], linewidth=1.2)

    file_name = f'table_palace_{palace_num}.png'
    out_path = os.path.join(out_dir, file_name)
    brain_path = os.path.join(brain_dir, file_name)

    if os.path.exists(out_path):
        os.remove(out_path)
    if os.path.exists(brain_path):
        os.remove(brain_path)

    plt.savefig(out_path, dpi=220)
    plt.savefig(brain_path, dpi=220)
    plt.close(fig)
    print(f'Rendered: {file_name}')

for p in range(1, 10):
    render_palace_table(p)

print('All 9 palace tables rendered successfully!')
