"""Resize + number your couple photos for Page 9.

1. Put ALL your original pictures in a folder called  my_photos  (next to this file).
2. Run:  pip install pillow   (once)   then   python prepare_photos.py
3. The numbered, web-friendly pictures appear in  photos/us/  (1.jpg, 2.jpg, ...)
"""
import os
from PIL import Image, ImageOps

SRC, DST, MAXSIDE = "my_photos", os.path.join("photos", "us"), 1400
os.makedirs(DST, exist_ok=True)
files = sorted(f for f in os.listdir(SRC) if f.lower().endswith((".jpg", ".jpeg", ".png", ".webp")))
for n, f in enumerate(files, 1):
    im = ImageOps.exif_transpose(Image.open(os.path.join(SRC, f))).convert("RGB")
    im.thumbnail((MAXSIDE, MAXSIDE))
    im.save(os.path.join(DST, f"{n}.jpg"), quality=84)
    print(n, f)
print("Done:", len(files), "photos in", DST)
