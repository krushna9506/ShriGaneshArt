import os
import re
import json
import fitz  # PyMuPDF
from PIL import Image
import io
import sys

# Force UTF-8 encoding for standard output to prevent cp1252 crash
sys.stdout.reconfigure(encoding='utf-8')

# Paths
pdf_path = "D:/ganesha/database/Shri Ganesh Art 2026.pdf"
models_json_path = "D:/ganesha/backend/src/data/models.json"
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

def normalize_text(text):
    if not text:
        return ""
    text = text.strip()
    return text

def clean_size(size_str):
    if not size_str:
        return ""
    size_str = re.sub(r"\s+", " ", size_str.strip().lower())
    return size_str

def main():
    # 1. Load models from models.json
    with open(models_json_path, "r", encoding="utf-8") as f:
        db_models = json.load(f)
    
    print(f"Loaded {len(db_models)} models from models.json")
    
    # 2. Open PDF
    doc = fitz.open(pdf_path)
    print(f"Opened PDF with {len(doc)} pages")
    
    matched_count = 0
    
    for page_idx, page in enumerate(doc):
        # Skip cover page
        if page_idx == 0:
            continue
            
        text = page.get_text()
        
        # Extract Model No and Size
        model_match = re.search(r"Model\s*No\.\s*:-\s*([^\n]+)", text, re.IGNORECASE)
        size_match = re.search(r"Size\s*:-\s*([^\n]+)", text, re.IGNORECASE)
        
        if not model_match:
            continue
            
        raw_code = model_match.group(1).strip()
        raw_size = size_match.group(1).strip() if size_match else ""
        
        # Apply normalization maps
        normalized_code = CODE_REPLACEMENTS.get(raw_code, raw_code)
        normalized_size = clean_size(raw_size)
        
        # Find matching model in db
        matched_model = None
        
        # Special manual match for A42 (size is different in PDF vs DB)
        if normalized_code.upper() == "A42":
            matched_model = next((m for m in db_models if m["code"].upper() == "A42"), None)
        
        if not matched_model:
            for m in db_models:
                db_code = normalize_text(m["code"])
                db_size = clean_size(m["size"])
                
                # Direct match or mapped match
                if db_code.lower() == normalized_code.lower() and db_size == normalized_size:
                    matched_model = m
                    break
                    
        # If no direct match, try fuzzy matching code
        if not matched_model:
            for m in db_models:
                db_code = normalize_text(m["code"])
                db_size = clean_size(m["size"])
                if normalized_code.lower() in db_code.lower() and db_size == normalized_size:
                    matched_model = m
                    break
                    
        if matched_model:
            model_id = matched_model["id"]
            model_code = matched_model["code"]
            
            # Extract images from this page
            images = page.get_images(full=True)
            if not images:
                print(f"Page {page_idx+1}: Matched {model_code} ({matched_model['size']}) but NO IMAGES found.")
                continue
                
            # Find the largest image by byte size
            largest_image = None
            max_size = 0
            
            for img_info in images:
                xref = img_info[0]
                base_img = doc.extract_image(xref)
                img_bytes = base_img["image"]
                if len(img_bytes) > max_size:
                    max_size = len(img_bytes)
                    largest_image = base_img
            
            if largest_image:
                img_bytes = largest_image["image"]
                try:
                    # Convert to JPEG and save
                    image = Image.open(io.BytesIO(img_bytes))
                    output_path = os.path.join(output_dir, f"{model_id}.jpg")
                    # Convert RGBA to RGB if necessary before saving as JPEG
                    if image.mode in ("RGBA", "P"):
                        image = image.convert("RGB")
                    image.save(output_path, "JPEG", quality=85)
                    print(f"Page {page_idx+1}: Matched -> Saved {model_code} ({matched_model['size']}) as {model_id}.jpg")
                    matched_count += 1
                except Exception as e:
                    print(f"Page {page_idx+1}: Failed to save image for {model_code}: {e}")
        else:
            print(f"Page {page_idx+1}: Mismatch/No Db Entry for Model='{raw_code}' (Normalized: '{normalized_code}') | Size='{raw_size}' (Normalized: '{normalized_size}')")
            
    print(f"\nExtraction complete! Successfully matched and saved {matched_count} images.")

if __name__ == "__main__":
    main()
