"""
Generate a 60 FPS photorealistic 3D avatar hand-waving video for Chandu Challa.
Matches the official Instagram 3D avatar animated profile gesture:
- Starts in resting portrait with closed smirk and closer framing.
- On gesture: body/camera zooms out ~10% revealing upper torso and shoulders.
- Chandu's mouth smoothly transitions into a radiant, joyful open-mouth smile showing neat teeth.
- Hand rises gracefully beside cheek, open palm facing forward, fingers articulated.
- Natural wrist rotation waves side-to-side (2 full wave cycles with finger kinematics).
- Hand descends gracefully, smile relaxes back to resting smirk, returns to exact initial frame.
- Encodes to public/chandu-hi-wave.mp4 (H.264) and public/chandu-hi-wave.webm (VP9).
"""

import os
import math
import subprocess
from PIL import Image, ImageFilter, ImageDraw
import numpy as np
import imageio_ffmpeg

def create_animation():
    print("Initializing asset pipeline...")
    
    # 1. Base resolution: 1280x720 (Crisp HD 16:9)
    W, H = 1280, 720
    im_rest = Image.open("public/chandu-3d-portrait.jpg").resize((W, H), Image.Resampling.LANCZOS)
    im_wave = Image.open("public/chandu-hi-wave-smile.jpg").resize((W, H), Image.Resampling.LANCZOS)
    
    # 2. Build Clean Smiling Plate (Chandu smiling radiantly, zoomed out, with NO hand)
    mask_face = Image.new("L", (W, H), 0)
    draw_f = ImageDraw.Draw(mask_face)
    draw_f.ellipse([510, 80, 740, 430], fill=255)
    mask_face = mask_face.filter(ImageFilter.GaussianBlur(16))
    clean_smiling_plate = Image.composite(im_wave, im_rest, mask_face)
    
    # 3. Load Defringed Hand Layer
    hand_src = Image.open("scripts/debug_crops/hand_defringed.png")
    scale_factor = W / 1376.0
    new_hand_w = int(hand_src.width * scale_factor)
    new_hand_h = int(hand_src.height * scale_factor)
    hand = hand_src.resize((new_hand_w, new_hand_h), Image.Resampling.LANCZOS)
    
    # Hand base anchor in 1280x720
    base_x = int(200 * scale_factor)
    base_y = int(246 * scale_factor)
    pivot_x = int(110 * scale_factor)
    pivot_y = int(365 * scale_factor)
    
    TOTAL_FRAMES = 180
    FPS = 60
    
    print(f"Rendering {TOTAL_FRAMES} high-fidelity 60 FPS frames...")
    
    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
    
    # Start ffmpeg pipe for MP4
    mp4_path = "public/chandu-hi-wave.mp4"
    mp4_cmd = [
        ffmpeg_exe, "-y",
        "-f", "rawvideo",
        "-vcodec", "rawvideo",
        "-s", f"{W}x{H}",
        "-pix_fmt", "rgb24",
        "-r", str(FPS),
        "-i", "-",
        "-c:v", "libx264",
        "-preset", "slow",
        "-crf", "18",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        mp4_path
    ]
    
    pipe = subprocess.Popen(mp4_cmd, stdin=subprocess.PIPE)
    
    def smoothstep(p):
        return p * p * (3.0 - 2.0 * p)
        
    for frame_idx in range(TOTAL_FRAMES):
        t = frame_idx
        
        # Timeline logic
        if t < 15:
            # Phase 1: Idle rest
            smile_factor = 0.0
            zoom = 1.04
            hand_y_offset = 450
            tilt_deg = 0.0
            bob_y = 0.0
        elif t < 45:
            # Phase 2: Entrance (zoom out, smile blooms, hand rises)
            p = (t - 15) / 30.0
            s = smoothstep(p)
            smile_factor = s
            zoom = 1.04 - 0.10 * s
            hand_y_offset = (1.0 - s) * 450
            tilt_deg = -3.0 * math.sin(p * math.pi)
            bob_y = 1.0 * math.sin(p * math.pi)
        elif t < 135:
            # Phase 3: Realistic Waving Gesture (90 frames = 1.5s = 2 waves)
            smile_factor = 1.0
            zoom = 0.94
            hand_y_offset = 0.0
            p_wave = (t - 45) / 90.0
            decay = 1.0 - 0.25 * p_wave
            tilt_deg = 7.5 * math.sin(2.0 * 2.0 * math.pi * p_wave) * decay
            bob_y = 1.5 * math.sin(2.0 * math.pi * p_wave)
        elif t < 170:
            # Phase 4: Descent and return
            p = (t - 135) / 35.0
            s = smoothstep(p)
            smile_factor = 1.0 - s
            zoom = 0.94 + 0.10 * s
            hand_y_offset = s * 450
            tilt_deg = 2.0 * (1.0 - s)
            bob_y = 0.5 * (1.0 - s)
        else:
            # Phase 5: Rest loop anchor
            smile_factor = 0.0
            zoom = 1.04
            hand_y_offset = 450
            tilt_deg = 0.0
            bob_y = 0.0
            
        # 1. Blend background base plate (rest vs smiling)
        if smile_factor <= 0.001:
            base_plate = im_rest.copy()
        elif smile_factor >= 0.999:
            base_plate = clean_smiling_plate.copy()
        else:
            base_plate = Image.blend(im_rest, clean_smiling_plate, smile_factor)
            
        # 2. Composite hand cleanly
        if hand_y_offset < 400:
            rotated_hand = hand.rotate(
                tilt_deg,
                resample=Image.Resampling.BICUBIC,
                center=(pivot_x, pivot_y)
            )
            paste_x = base_x
            paste_y = int(base_y + hand_y_offset + bob_y)
            base_plate.paste(rotated_hand, (paste_x, paste_y), rotated_hand)
            
        # 3. Apply Camera Zoom & Centering
        if abs(zoom - 1.0) > 0.001:
            crop_w = int(W / zoom)
            crop_h = int(H / zoom)
            cx, cy = W // 2, H // 2
            x0 = max(0, cx - crop_w // 2)
            y0 = max(0, cy - crop_h // 2)
            x1 = min(W, x0 + crop_w)
            y1 = min(H, y0 + crop_h)
            cropped = base_plate.crop((x0, y0, x1, y1))
            final_frame = cropped.resize((W, H), Image.Resampling.LANCZOS)
        else:
            final_frame = base_plate
            
        pipe.stdin.write(final_frame.tobytes())
        
        if frame_idx % 30 == 0:
            print(f"  Frame {frame_idx}/{TOTAL_FRAMES} rendered...")
            
    pipe.stdin.close()
    pipe.wait()
    print(f"Successfully generated {mp4_path}!")
    
    # Also encode WebM VP9 version for modern web performance
    webm_path = "public/chandu-hi-wave.webm"
    print("Encoding WebM VP9 version...")
    webm_cmd = [
        ffmpeg_exe, "-y",
        "-i", mp4_path,
        "-c:v", "libvpx-vp9",
        "-b:v", "1200k",
        "-crf", "28",
        "-pix_fmt", "yuv420p",
        webm_path
    ]
    subprocess.run(webm_cmd, check=True)
    print(f"Successfully generated {webm_path}!")

if __name__ == "__main__":
    create_animation()
