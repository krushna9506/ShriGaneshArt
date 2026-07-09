import os
import hashlib

output_dir = "D:/ganesha/frontend/public/images/models"
files = [f for f in os.listdir(output_dir) if f.endswith(".jpg")]

hashes = {}
duplicates = []

for f in sorted(files, key=lambda x: int(x.split(".")[0])):
    path = os.path.join(output_dir, f)
    with open(path, "rb") as file_obj:
        h = hashlib.sha256(file_obj.read()).hexdigest()
    if h in hashes:
        duplicates.append((f, hashes[h]))
    else:
        hashes[h] = f

if duplicates:
    print("Found duplicate images:")
    for dup, orig in duplicates:
        print(f"File {dup} is a duplicate of {orig}")
else:
    print("No duplicate images found. All 60 image files are unique!")
