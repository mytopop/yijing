import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.font_manager import FontProperties
import os

def draw_sensor_4x4(save_path):
    # Constants (in mm)
    TOTAL_WIDTH = 170
    TOTAL_HEIGHT = 170
    
    # Layout parameters (estimated to match visual style)
    # Assuming the total 170mm includes the outer shell
    
    SHELL_THICKNESS = 4
    EDGE_SHIELD_THICKNESS = 4
    INTER_ELECTRODE_GAP = 2
    
    # Inner area for electrodes
    # Width available for electrodes = Total - 2*Shell - 2*Shield
    inner_width = TOTAL_WIDTH - 2 * SHELL_THICKNESS - 2 * EDGE_SHIELD_THICKNESS
    inner_height = TOTAL_HEIGHT - 2 * SHELL_THICKNESS - 2 * EDGE_SHIELD_THICKNESS
    
    # 4x4 grid
    ROWS = 4
    COLS = 4
    
    # Electrode size
    # Total width of electrodes = inner_width - (COLS - 1) * GAP
    elec_width = (inner_width - (COLS - 1) * INTER_ELECTRODE_GAP) / COLS
    elec_height = (inner_height - (ROWS - 1) * INTER_ELECTRODE_GAP) / ROWS
    
    # Create figure
    fig, ax = plt.subplots(figsize=(10, 8))
    
    # Set limits and aspect
    # Add padding for labels
    ax.set_xlim(-40, TOTAL_WIDTH + 80) 
    ax.set_ylim(-40, TOTAL_HEIGHT + 20)
    ax.set_aspect('equal')
    ax.axis('off')
    
    # Font - Try to find Microsoft YaHei
    font_path = r"C:\Windows\Fonts\msyh.ttc"
    if not os.path.exists(font_path):
        font_path = r"C:\Windows\Fonts\simhei.ttf" # Fallback
        
    font = FontProperties(fname=font_path, size=12)
    font_large = FontProperties(fname=font_path, size=14)
    font_num = FontProperties(fname=font_path, size=16)
    
    # 1. Draw Insulating Shell (Outer Box)
    # Center it at (0,0) to (TOTAL_WIDTH, TOTAL_HEIGHT)
    rect_shell = patches.Rectangle((0, 0), TOTAL_WIDTH, TOTAL_HEIGHT, 
                                   linewidth=2, edgecolor='black', facecolor='white')
    ax.add_patch(rect_shell)
    
    # 2. Draw Edge Shielding (Inner Box)
    start_shield = SHELL_THICKNESS
    width_shield = TOTAL_WIDTH - 2 * SHELL_THICKNESS
    height_shield = TOTAL_HEIGHT - 2 * SHELL_THICKNESS
    
    # The image shows the shield as a frame. 
    # Let's draw the shield background first (the gap between shell and electrodes)
    # Actually, the image has:
    # - White outer border
    # - Then a gap? Or is the shield the frame?
    # Let's assume the structure is:
    # [Shell (White)] [Shield (Gray/Blue)] [Electrodes (Orange)]
    
    rect_shield = patches.Rectangle((start_shield, start_shield), width_shield, height_shield, 
                                    linewidth=1, edgecolor='black', facecolor='#dbeafe') # Light blueish
    ax.add_patch(rect_shield)
    
    # 3. Draw Electrodes
    # The electrodes are inside the shield.
    start_elec_x = start_shield + EDGE_SHIELD_THICKNESS
    start_elec_y = start_shield + EDGE_SHIELD_THICKNESS
    
    # Draw a background for the electrode area (the gaps)
    # In the image, the gaps are white/light.
    # Let's just draw the electrodes on top.
    
    for row in range(ROWS):
        for col in range(COLS):
            # Grid coordinates (row 0 is bottom)
            # Note: In the image, 1 is bottom-left.
            x = start_elec_x + col * (elec_width + INTER_ELECTRODE_GAP)
            y = start_elec_y + row * (elec_height + INTER_ELECTRODE_GAP)
            
            # Draw Electrode
            rect_elec = patches.Rectangle((x, y), elec_width, elec_height, 
                                          linewidth=1.5, edgecolor='black', facecolor='#fdb076') # Orange
            ax.add_patch(rect_elec)
            
            # Add Number (1 to 16, starting bottom-left)
            num = row * COLS + col + 1
            ax.text(x + elec_width/2, y + elec_height/2, str(num), 
                    ha='center', va='center', fontproperties=font_num)

    # 4. Add Dimensions
    # Total Height Arrow (Left side)
    ax.annotate('', xy=(-15, 0), xytext=(-15, TOTAL_HEIGHT),
                arrowprops=dict(arrowstyle='<|-|>', lw=1.5, color='black'))
    ax.text(-25, TOTAL_HEIGHT/2, f'{TOTAL_HEIGHT} mm', 
            rotation=90, va='center', ha='center', fontproperties=font_large)
    
    # Total Width Arrow (Bottom)
    ax.annotate('', xy=(0, -15), xytext=(TOTAL_WIDTH, -15),
                arrowprops=dict(arrowstyle='<|-|>', lw=1.5, color='black'))
    ax.text(TOTAL_WIDTH/2, -25, f'{TOTAL_WIDTH} mm', 
            ha='center', va='center', fontproperties=font_large)
    
    # Electrode Size (Top Left - row=3, col=0)
    tl_x = start_elec_x
    tl_y = start_elec_y + 3 * (elec_height + INTER_ELECTRODE_GAP)
    
    # Width dim (Red arrow above)
    dim_y = tl_y + elec_height + 5
    ax.annotate('', xy=(tl_x, dim_y), xytext=(tl_x + elec_width, dim_y),
                arrowprops=dict(arrowstyle='<|-|>', color='#dc2626', lw=1.5))
    ax.text(tl_x + elec_width/2, dim_y + 8, f'{elec_width:.1f} mm', 
            ha='center', color='black', fontproperties=font)
    
    # Height dim (Red arrow left)
    dim_x = tl_x - 5
    ax.annotate('', xy=(dim_x, tl_y), xytext=(dim_x, tl_y + elec_height),
                arrowprops=dict(arrowstyle='<|-|>', color='#dc2626', lw=1.5))
    ax.text(dim_x - 8, tl_y + elec_height/2, f'{elec_height:.1f} mm', 
            va='center', rotation=90, color='black', fontproperties=font)

    # 5. Add Labels (Right side)
    label_x_start = TOTAL_WIDTH + 15
    
    # Helper to draw line and text
    def add_label(y_pos, text, target_xy):
        # Draw text
        ax.text(label_x_start + 40, y_pos, text, 
                va='center', ha='left', fontproperties=font_large)
        # Draw line
        # Use annotate with arrowstyle='-' for a line
        ax.annotate('', xy=target_xy, xytext=(label_x_start + 35, y_pos),
                    arrowprops=dict(arrowstyle='-', color='black', lw=1.5))
    
    # "绝缘外壳" -> Outer shell (Top Right corner area)
    add_label(TOTAL_HEIGHT - 20, "绝缘外壳", (TOTAL_WIDTH, TOTAL_HEIGHT - 10))
    
    # "边缘屏蔽" -> Shield (Right side, middle of shield frame)
    shield_mid_y = TOTAL_HEIGHT/2 + 30
    add_label(shield_mid_y, "边缘屏蔽", (TOTAL_WIDTH - SHELL_THICKNESS, shield_mid_y))
    
    # "测量电极" -> An electrode (e.g., #12 or #16)
    # Point to #12 (Row 2, Col 3) -> 3rd row, 4th col
    # Let's point to the rightmost one in the 2nd row from top (Row 2) -> #12
    # Row 2 (0-indexed) is the 3rd row from bottom.
    # Col 3 (0-indexed) is the 4th col (rightmost).
    e12_x = start_elec_x + 3 * (elec_width + INTER_ELECTRODE_GAP) + elec_width
    e12_y = start_elec_y + 2 * (elec_height + INTER_ELECTRODE_GAP) + elec_height/2
    add_label(e12_y, "测量电极", (e12_x, e12_y))
    
    # "极间屏蔽" -> Gap
    # Point to gap between row 1 and 2 (horizontal gap)
    gap_y_loc = start_elec_y + 1 * (elec_height + INTER_ELECTRODE_GAP) + elec_height + INTER_ELECTRODE_GAP/2
    gap_x_loc = start_elec_x + 3 * (elec_width + INTER_ELECTRODE_GAP) + elec_width/2
    add_label(gap_y_loc - 30, "极间屏蔽", (gap_x_loc, gap_y_loc))

    plt.savefig(save_path, dpi=300, bbox_inches='tight')
    print(f"Diagram saved to {save_path}")
    plt.close()

if __name__ == "__main__":
    draw_sensor_4x4(r"e:\文档\我的文档\中红\sensor_4x4.png")
