import sys
import fitz
import re

sys.stdout.reconfigure(encoding='utf-8')

pdf_path = "D:/ganesha/database/Shri Ganesh Art 2026.pdf"
doc = fitz.open(pdf_path)

for idx, page in enumerate(doc):
    text = page.get_text()
    model_match = re.search(r"Model\s*No\.\s*:-\s*([^\n]+)", text, re.IGNORECASE)
    size_match = re.search(r"Size\s*:-\s*([^\n]+)", text, re.IGNORECASE)
    
    model = model_match.group(1).strip() if model_match else "None"
    size = size_match.group(1).strip() if size_match else "None"
    print(f"Page {idx}: Model='{model}' | Size='{size}'")
