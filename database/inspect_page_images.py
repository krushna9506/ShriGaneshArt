import fitz

pdf_path = "D:/ganesha/database/Shri Ganesh Art 2026.pdf"
doc = fitz.open(pdf_path)

for page_num in range(53, 59):
    page = doc[page_num]
    images = page.get_images(full=True)
    print(f"\nPDF Page {page_num} (Model Page {page_num}): Found {len(images)} images")
    for idx, img_info in enumerate(images):
        xref = img_info[0]
        base_img = doc.extract_image(xref)
        print(f"  Image {idx}: xref={xref} | Width={base_img['width']} | Height={base_img['height']} | Bytes={len(base_img['image'])} | Ext={base_img['ext']}")
