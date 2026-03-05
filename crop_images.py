from PIL import Image
import os

output_dir = 'public/courses'
os.makedirs(output_dir, exist_ok=True)

# Hard-coded crop for the phone screenshots - just take the banner area
# Image 1000616982: banner is roughly in the middle (rows ~490 to ~1000 out of 1600)
img = Image.open('cursosparaadaptar/1000616982.jpg')
w, h = img.size
print(f"1000616982: {w}x{h}")
# Scan to find the colorful band (not black)
rgb = img.convert('RGB')
bands = []
in_band = False
band_start = 0
for y in range(h):
    row_sum = sum(sum(rgb.getpixel((x, y))) for x in range(0, w, 6))
    avg = row_sum / (w / 6)
    if avg > 80 and not in_band:
        in_band = True
        band_start = y
    elif avg <= 80 and in_band:
        in_band = False
        bands.append((band_start, y))
if in_band:
    bands.append((band_start, h))

print(f"  Bands found: {bands}")
# Take the largest band
if bands:
    largest = max(bands, key=lambda b: b[1] - b[0])
    cropped = img.crop((0, largest[0], w, largest[1]))
    cropped.save(f'{output_dir}/1000616982_crop.jpg', 'JPEG', quality=92)
    print(f"  Saved: {largest} -> {cropped.size}")

# Same for 1000616987
img = Image.open('cursosparaadaptar/1000616987.jpg')
w, h = img.size
print(f"1000616987: {w}x{h}")
rgb = img.convert('RGB')
bands = []
in_band = False
band_start = 0
for y in range(h):
    row_sum = sum(sum(rgb.getpixel((x, y))) for x in range(0, w, 6))
    avg = row_sum / (w / 6)
    if avg > 80 and not in_band:
        in_band = True
        band_start = y
    elif avg <= 80 and in_band:
        in_band = False
        bands.append((band_start, y))
if in_band:
    bands.append((band_start, h))

print(f"  Bands found: {bands}")
if bands:
    largest = max(bands, key=lambda b: b[1] - b[0])
    cropped = img.crop((0, largest[0], w, largest[1]))
    cropped.save(f'{output_dir}/1000616987_crop.jpg', 'JPEG', quality=92)
    print(f"  Saved: {largest} -> {cropped.size}")

# Clean images - just copy
for fname in ['1000616989.jpg', '1000616997.jpg', '1000616998.jpg']:
    img = Image.open(f'cursosparaadaptar/{fname}')
    out_name = fname.replace('.jpg', '_crop.jpg')
    img.save(f'{output_dir}/{out_name}', 'JPEG', quality=92)
    print(f"Copied {fname}: {img.size}")

print("Done!")
