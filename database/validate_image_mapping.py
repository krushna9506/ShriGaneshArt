import sys
import json
import fitz
import re

sys.stdout.reconfigure(encoding='utf-8')

pdf_path = "D:/ganesha/database/Shri Ganesh Art 2026.pdf"
models_json_path = "D:/ganesha/backend/src/data/models.json"

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

with open(models_json_path, "r", encoding="utf-8") as f:
    db_models = json.load(f)

doc = fitz.open(pdf_path)

mappings = {}
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
        mappings[matched_model["id"]] = {
            "page": page_idx,
            "pdf_code": raw_code,
            "pdf_size": raw_size,
            "db_code": matched_model["code"],
            "db_size": matched_model["size"]
        }

print(f"{'DB ID':<6} | {'DB Code':<10} | {'DB Size':<10} | {'PDF Page':<8} | {'PDF Code':<10} | {'PDF Size':<10}")
print("-" * 65)
for m in sorted(db_models, key=lambda x: x["id"]):
    info = mappings.get(m["id"], None)
    if info:
        print(f"{m['id']:<6} | {m['code']:<10} | {m['size']:<10} | {info['page']:<8} | {info['pdf_code']:<10} | {info['pdf_size']:<10}")
    else:
        print(f"{m['id']:<6} | {m['code']:<10} | {m['size']:<10} | NO MATCH!")
