import sys
import os
import re
import json
import fitz
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8')

# Paths
pdf_path = "D:/ganesha/database/Shri Ganesh Art 2026.pdf"
models_json_path = "D:/ganesha/backend/src/data/models.json"
stock_dir = "D:/ganesha/database/stock"
output_dir = "D:/ganesha/frontend/public/images/models"

os.makedirs(output_dir, exist_ok=True)

# Normalization map for codes
CODE_REPLACEMENTS = {
    "48": "A48",
    "ɟवठ्ठल": "विठ्ठल",
    "नंदʍ": "नंदी",
    "91": "91 उंदीर",
    "A 34": "A34",
    "A 36": "A36",
    "ओम": "ओम",
    "विठ्ठल": "विठ्ठल (Vittal)",
    "नंदी": "नंदी (Nandi)",
    "दगडु": "दगडु",
}

def clean_size(size_str):
    if not size_str:
        return ""
    return re.sub(r"\s+", " ", size_str.strip().lower())

def main():
    # 1. Load models
    with open(models_json_path, "r", encoding="utf-8") as f:
        db_models = json.load(f)
    print(f"Loaded {len(db_models)} models from models.json")

    # 2. Open PDF to get page text mapping
    doc = fitz.open(pdf_path)
    print(f"Opened PDF with {len(doc)} pages")

    matched_count = 0
    mismatch_count = 0

    for page_idx, page in enumerate(doc):
        if page_idx == 0:
            continue
        
        text = page.get_text()
        model_match = re.search(r"Model\s*No\.\s*:-\s*([^\n]+)", text, re.IGNORECASE)
        size_match = re.search(r"Size\s*:-\s*([^\n]+)", text, re.IGNORECASE)
        
        if not model_match:
            continue
            
        raw_code = model_match.group(1).strip()
        raw_size = size_match.group(1).strip() if size_match else ""
        
        normalized_code = CODE_REPLACEMENTS.get(raw_code, raw_code)
        normalized_size = clean_size(raw_size)
        
        # Find matching model in database
        matched_model = None
        if normalized_code.upper() == "A42":
            matched_model = next((m for m in db_models if m["code"].upper() == "A42"), None)
        
        if not matched_model:
            for m in db_models:
                if m["code"].lower() == normalized_code.lower() and clean_size(m["size"]) == normalized_size:
                    matched_model = m
                    break
        
        if not matched_model:
            for m in db_models:
                if normalized_code.lower() in m["code"].lower() and clean_size(m["size"]) == normalized_size:
                    matched_model = m
                    break
                    
        if matched_model:
            model_id = matched_model["id"]
            model_code = matched_model["code"]
            
            # Formulate the stock image filename
            stock_filename = f"Shri Ganesh Art 2026_page-{page_idx+1:04d}.jpg"
            stock_image_path = os.path.join(stock_dir, stock_filename)
            
            if not os.path.exists(stock_image_path):
                print(f"Page {page_idx+1}: Mapped to {model_code} but stock file {stock_filename} does not exist!")
                continue
                
            try:
                # Open the full page stock image
                with Image.open(stock_image_path) as img:
                    # Crop the central statue photo (original size 1241x1755)
                    # We crop: Left=60, Top=80, Right=1181, Bottom=1380
                    # This removes page borders, header text, and bottom model text
                    left = 60
                    top = 80
                    right = 1181
                    bottom = 1380
                    
                    cropped_img = img.crop((left, top, right, bottom))
                    
                    # Save to frontend models directory
                    output_path = os.path.join(output_dir, f"{model_code}.jpg")
                    cropped_img.save(output_path, "JPEG", quality=90)
                    
                print(f"Page {page_idx+1}: Matched -> Saved cropped {model_code} ({matched_model['size']}) as {model_code}.jpg")
                matched_count += 1
            except Exception as e:
                print(f"Page {page_idx+1}: Failed to process image for {model_code}: {e}")
        else:
            print(f"Page {page_idx+1}: Mismatch/No DB Entry for Model='{raw_code}' (Normalized: '{normalized_code}') | Size='{raw_size}'")
            mismatch_count += 1

    print(f"\nCompleted! Successfully matched, cropped, and saved {matched_count} images.")
    if mismatch_count > 0:
        print(f"Warning: {mismatch_count} pages had no DB matches.")

if __name__ == "__main__":
    main()
