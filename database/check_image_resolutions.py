import os
from PIL import Image

output_dir = "D:/ganesha/frontend/public/images/models"
files = [f for f in os.listdir(output_dir) if f.endswith(".jpg")]

print(f"{'File':<10} | {'Dimensions':<12} | {'Format':<6} | {'Mode':<5}")
print("-" * 45)
for f in sorted(files, key=lambda x: int(x.split(".")[0])):
    path = os.path.join(output_dir, f)
    try:
        with Image.open(path) as img:
            print(f"{f:<10} | {f'{img.width}x{img.height}':<12} | {img.format:<6} | {img.mode:<5}")
    except Exception as e:
        print(f"{f:<10} | Error: {e}")
