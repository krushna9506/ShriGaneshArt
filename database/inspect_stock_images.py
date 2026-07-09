import os
from PIL import Image

stock_dir = "D:/ganesha/database/stock"
files = sorted([f for f in os.listdir(stock_dir) if f.endswith(".jpg")])

for f in files[:5]:
    path = os.path.join(stock_dir, f)
    with Image.open(path) as img:
        print(f"{f}: {img.width}x{img.height}")
