import os
import math
import subprocess
import numpy as np
from PIL import Image, ImageFilter, ImageDraw
import imageio_ffmpeg

def smooth_step(edge0, edge1, x):
    t = max(0.0, min(1.0, (x - edge0) / (edge1 - edge0)))
    return t * t * (3.0 - 2.0 * t)

def cubic_ease_in_out(t):
    if t < 0.5:
        return 4.0 * t * t * t
    else:
        p = 2.0 * t - 2.0
        return 0.5 * p * p * p + 1.0

def generate_avatar_waving_video():
    print("Loading high-res character assets...")
    w, h = 1024, 576
    fps = 60
    duration = 3.0
    total_frames = int(fps * duration)  # 180 frames

    base = Image.open('public/chandu-3d-portrait.jpg').resize((w, h), Image.Resampling.LANCZOS).convert('RGBA')
    wave = Image.open('public/chandu-waving.jpg').resize((w, h), Image.Resampling.LANCZOS).convert('RGBA')
    arr = np.array(wave)

    # 1. Clean Hand + Peach Cuff Sprite Mask
    mask = np.zeros((h, w), dtype=bool)
    r = arr[:, :340, 0].astype(int)
    g = arr[:, :340, 1].astype(int)
    b = arr[:, :340, 2].astype(int)

    skin = (r > 60) & (r > g) & (g > b * 0.9) & (b > 20)
    peach = (r > 90) & (g > 50) & (b > 40)
    hand_zone = (skin | peach)

    # Cleanly exclude collar peak on the right for y > 430
    hand_zone[430:, 245:] = False
    mask[:515, :340] = hand_zone[:515, :]

    hand_mask_img = Image.fromarray((mask * 255).astype(np.uint8))
    hand_mask_img = hand_mask_img.filter(ImageFilter.MaxFilter(size=3)).filter(ImageFilter.GaussianBlur(radius=1.5))

    hand_sprite = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    hand_sprite.paste(wave, (0, 0), hand_mask_img)

    # Hand crop box & wrist pivot inside the sleeve opening
    hand_bbox = (110, 40, 330, 515)
    cropped_hand = hand_sprite.crop(hand_bbox)
    pivot_x = 190 - hand_bbox[0]
    pivot_y = 505 - hand_bbox[1]

    # 2. Sleeve Sprite Mask (Navy suit jacket opening from y=495 to 576)
    sleeve_mask = np.zeros((h, w), dtype=bool)
    sleeve_mask[495:576, :340] = (arr[495:576, :340].mean(axis=-1) > 18)
    sleeve_mask_im = Image.fromarray((sleeve_mask * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(radius=2.0))
    sleeve_sprite = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    sleeve_sprite.paste(wave, (0, 0), sleeve_mask_im)

    # 3. Facial Expression Blend Mask (Warm open smile from waving photo)
    face_mask = Image.new('L', (w, h), 0)
    draw = ImageDraw.Draw(face_mask)
    draw.ellipse([(440, 260), (660, 430)], fill=255)
    face_mask = face_mask.filter(ImageFilter.GaussianBlur(radius=14.0))

    mp4_path = 'public/chandu-waving.mp4'
    print(f"Generating {total_frames} frames ({fps} FPS, {duration}s) to {mp4_path}...")

    writer = imageio_ffmpeg.write_frames(
        mp4_path,
        (w, h),
        fps=fps,
        codec='libx264',
        pix_fmt_in='rgb24',
        output_params=['-pix_fmt', 'yuv420p', '-crf', '17', '-preset', 'medium', '-movflags', '+faststart']
    )
    writer.send(None)

    for frame_idx in range(total_frames):
        t = frame_idx / fps  # 0.0 to 3.0s

        # Reference video kinematics:
        # 0.0 - 0.4s: Idle resting
        # 0.4 - 0.85s: Hand raises & mouth smiles
        # 0.85 - 2.15s: Active waving (2 full oscillation cycles)
        # 2.15 - 2.6s: Hand lowers & mouth returns to rest
        # 2.6 - 3.0s: Settles into resting pose
        if t < 0.4:
            elev = 0.0
            smile_blend = 0.0
            wave_angle = 0.0
        elif t < 0.85:
            prog = (t - 0.4) / 0.45
            elev = cubic_ease_in_out(prog)
            smile_blend = smooth_step(0.0, 1.0, prog)
            wave_angle = 0.0
        elif t < 2.15:
            elev = 1.0
            smile_blend = 1.0
            wave_t = t - 0.85  # 0.0 to 1.3s
            # 2 natural waves in 1.3 seconds (~1.54 Hz)
            wave_phase = wave_t * (2.0 * math.pi * 1.54)
            wave_angle = 11.5 * math.sin(wave_phase) + 1.5 * math.sin(wave_phase * 2)
        elif t < 2.6:
            prog = (t - 2.15) / 0.45
            elev = 1.0 - cubic_ease_in_out(prog)
            smile_blend = 1.0 - smooth_step(0.0, 1.0, prog)
            wave_angle = 0.0
        else:
            elev = 0.0
            smile_blend = 0.0
            wave_angle = 0.0

        # Subtle natural respiration
        breath_y = 1.5 * math.sin(2.0 * math.pi * 0.7 * t)
        torso_sway = 1.8 * math.sin(wave_phase) if (0.85 <= t < 2.15) else 0.0

        # Base frame assembly
        frame = base.copy()

        # Blend facial smile
        if smile_blend > 0.005:
            scaled_mask = face_mask.point(lambda p: int(p * smile_blend))
            frame.paste(wave, (0, 0), scaled_mask)

        # Elevate hand and sleeve from below frame
        if elev > 0.001:
            dy = (1.0 - elev) * 360.0
            cur_y = int(dy + breath_y * 0.3)
            cur_x = int(torso_sway * 0.4)

            # Rotate hand around wrist pivot
            rot = cropped_hand.rotate(
                -wave_angle,
                resample=Image.Resampling.BICUBIC,
                center=(pivot_x, pivot_y)
            )
            # Paste hand
            frame.paste(rot, (hand_bbox[0] + cur_x, hand_bbox[1] + cur_y), rot)

            # Paste sleeve over opening for perfect seamless occlusion
            frame.paste(sleeve_sprite, (cur_x, cur_y), sleeve_sprite)

        frame_rgb = frame.convert('RGB')
        writer.send(frame_rgb.tobytes())

        if frame_idx == 0:
            frame_rgb.save('public/chandu-waving-poster.jpg', quality=95)

    writer.close()
    print("MP4 generation complete!")

    # Transcode WebM VP9 version
    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
    webm_path = 'public/chandu-waving.webm'
    print(f"Generating WebM VP9 ({webm_path})...")
    subprocess.run([
        ffmpeg_exe, '-y', '-i', mp4_path,
        '-c:v', 'libvpx-vp9', '-crf', '26', '-b:v', '0',
        webm_path
    ], check=True)
    print("WebM generation complete!")

if __name__ == '__main__':
    generate_avatar_waving_video()
