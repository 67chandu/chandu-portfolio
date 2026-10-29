import os
import math
import numpy as np
from PIL import Image, ImageFilter, ImageDraw
import imageio_ffmpeg
import subprocess

def generate_waving_video():
    print("Loading source images...")
    wave_img = Image.open('public/chandu-waving.jpg').convert('RGBA').resize((1024, 576), Image.Resampling.LANCZOS)
    base_img = Image.open('public/chandu-3d-portrait.jpg').convert('RGBA').resize((1024, 576), Image.Resampling.LANCZOS)

    w, h = 1024, 576
    fps = 60
    duration = 2.5
    total_frames = int(fps * duration) # 150 frames

    # Extract Hand Sprite & Mask
    # Hand is in x in [130, 330], y in [180, 520]
    hand_arr = np.array(wave_img)
    mask_arr = np.zeros((h, w), dtype=np.uint8)
    
    # Hand skin / clothing threshold
    hand_crop = hand_arr[180:520, 130:330]
    brightness = hand_crop[:, :, :3].mean(axis=-1)
    hand_mask = (brightness > 35).astype(np.uint8) * 255
    mask_arr[180:520, 130:330] = hand_mask

    # Feather the hand mask smoothly
    hand_mask_im = Image.fromarray(mask_arr).filter(ImageFilter.GaussianBlur(radius=3.5))

    # Hand sprite on transparent canvas
    hand_sprite = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    hand_sprite.paste(wave_img, (0, 0), hand_mask_im)

    # Base background: base_img with wave_img blended for the chest/body
    bg_mask = Image.new('L', (w, h), 0)
    bg_draw = ImageDraw.Draw(bg_mask)
    # Exclude the waving hand area from wave_img when creating the static body/background
    bg_draw.rectangle([(330, 0), (w, h)], fill=255)
    bg_draw.rectangle([(0, 520), (w, h)], fill=255)
    bg_mask = bg_mask.filter(ImageFilter.GaussianBlur(radius=10))

    composite_bg = base_img.copy()
    composite_bg.paste(wave_img, (0, 0), bg_mask)

    # Wrist pivot point in 1024x576 coordinates
    pivot_x = 228
    pivot_y = 485

    # Crop hand sprite tightly around pivot to allow fast rotation
    crop_box = (120, 160, 340, 520)
    cropped_hand = hand_sprite.crop(crop_box)
    local_pivot_x = pivot_x - crop_box[0]
    local_pivot_y = pivot_y - crop_box[1]

    # Pre-generate floating golden sparkles
    np.random.seed(42)
    num_sparkles = 24
    sparkle_x = np.random.uniform(80, 950, num_sparkles)
    sparkle_y = np.random.uniform(50, 520, num_sparkles)
    sparkle_speed = np.random.uniform(18, 42, num_sparkles)
    sparkle_sizes = np.random.uniform(1.8, 3.8, num_sparkles)
    sparkle_phases = np.random.uniform(0, math.pi * 2, num_sparkles)

    mp4_path = 'public/chandu-waving.mp4'
    print(f"Generating {total_frames} frames ({fps} FPS, {duration}s) to {mp4_path}...")

    writer = imageio_ffmpeg.write_frames(
        mp4_path,
        (w, h),
        fps=fps,
        codec='libx264',
        pix_fmt_in='rgb24',
        output_params=['-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'medium', '-movflags', '+faststart']
    )
    writer.send(None)

    for frame_idx in range(total_frames):
        t_norm = frame_idx / total_frames
        t_sec = frame_idx / fps

        # 1. Hand Waving Physics: 3 full harmonic wave oscillations in 2.5s
        wave_cycles = 3.0
        wave_theta = 15.5 * math.sin(2 * math.pi * wave_cycles * t_norm) + 2.5 * math.sin(4 * math.pi * wave_cycles * t_norm)
        wave_dx = 11.0 * math.sin(2 * math.pi * wave_cycles * t_norm)
        wave_dy = -3.5 * abs(math.sin(2 * math.pi * wave_cycles * t_norm))

        # 2. Torso & Head Natural Respiration (2 gentle breaths per loop)
        body_dy = 2.2 * math.sin(2 * math.pi * 2.0 * t_norm)
        head_tilt = 0.8 * math.sin(2 * math.pi * 2.0 * t_norm)

        # 3. Create frame canvas
        frame = composite_bg.copy()

        # 4. Rotate and position hand sprite around local wrist pivot
        # To rotate around local_pivot, we expand canvas or rotate with center
        # Pillow rotate supports center parameter!
        rot_hand = cropped_hand.rotate(
            -wave_theta, # negative for natural coordinate angle
            resample=Image.Resampling.BICUBIC,
            center=(local_pivot_x, local_pivot_y)
        )

        # Paste rotated hand back at target position
        paste_x = int(crop_box[0] + wave_dx)
        paste_y = int(crop_box[1] + wave_dy + body_dy * 0.5)
        frame.paste(rot_hand, (paste_x, paste_y), rot_hand)

        # 5. Render floating 3D golden dust bokeh sparkles
        draw = ImageDraw.Draw(frame)
        for s in range(num_sparkles):
            sy = (sparkle_y[s] - sparkle_speed[s] * t_sec) % (h - 40) + 20
            sx = sparkle_x[s] + 6.0 * math.sin(sparkle_phases[s] + t_sec * 2.0)
            alpha_pulse = 0.45 + 0.35 * math.sin(sparkle_phases[s] + t_norm * math.pi * 4)
            size = sparkle_sizes[s]

            # Soft golden sparkle dot
            r, g, b = int(253 * alpha_pulse), int(224 * alpha_pulse), int(71 * alpha_pulse)
            draw.ellipse([sx - size, sy - size, sx + size, sy + size], fill=(255, 240, 160, int(255 * alpha_pulse)))
            # Outer halo
            halo_size = size * 2.2
            draw.ellipse([sx - halo_size, sy - halo_size, sx + halo_size, sy + halo_size], outline=(245, 158, 11, int(120 * alpha_pulse)))

        # Convert to RGB bytes
        frame_rgb = frame.convert('RGB')
        writer.send(frame_rgb.tobytes())

        if frame_idx == 0:
            frame_rgb.save('public/chandu-waving-poster.jpg', quality=95)

    writer.close()
    print("MP4 generation complete!")

    # Also convert to WebM for ultra-efficient modern browser playback
    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
    webm_path = 'public/chandu-waving.webm'
    print(f"Generating WebM ({webm_path})...")
    subprocess.run([
        ffmpeg_exe, '-y', '-i', mp4_path,
        '-c:v', 'libvpx-vp9', '-crf', '26', '-b:v', '0',
        webm_path
    ], check=True)
    print("WebM generation complete!")

if __name__ == '__main__':
    generate_waving_video()

