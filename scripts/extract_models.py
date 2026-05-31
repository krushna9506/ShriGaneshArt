import argparse
import re
import sys
import json
from pathlib import Path

import openpyxl


def size_to_inches(size_text):
    text = str(size_text).strip().lower()
    if text.endswith('feet') or text.endswith("'"):
        number = re.findall(r'[0-9]+(?:\.[0-9]+)?', text)
        return int(float(number[0]) * 12) if number else 24
    if text.endswith('inches') or text.endswith('inch') or text.endswith('in'):
        number = re.findall(r'[0-9]+(?:\.[0-9]+)?', text)
        return int(float(number[0])) if number else 12
    number = re.findall(r'[0-9]+(?:\.[0-9]+)?', text)
    return int(float(number[0])) if number else 12


def price_for_size(size_text):
    inches = size_to_inches(size_text)
    if inches <= 6:
        return 850
    if inches <= 8:
        return 1100
    if inches <= 10:
        return 1450
    if inches <= 12:
        return 1800
    if inches <= 14:
        return 2400
    if inches <= 16:
        return 3200
    if inches <= 18:
        return 4200
    if inches <= 20:
        return 5200
    return 6500


def sanitize_text(value):
    return str(value).strip() if value is not None else ''


def normalize_model_fields(row):
    model_value = sanitize_text(row[0])
    size_value = sanitize_text(row[1]) or '12 inch'
    stock_qty = sanitize_text(row[2]) if len(row) > 2 else ''
    raw_price = sanitize_text(row[3]) if len(row) > 3 else ''

    if raw_price:
        # Strip currency symbols, commas, and whitespace
        clean_price = re.sub(r'[^\d\.]', '', raw_price)
        if clean_price:
            try:
                price_value = int(float(clean_price))
            except ValueError:
                price_value = price_for_size(size_value)
        else:
            price_value = price_for_size(size_value)
    else:
        price_value = price_for_size(size_value)

    # Convert stock_qty to integer
    try:
        total_stock = int(float(stock_qty)) if stock_qty else 10
    except ValueError:
        total_stock = 10

    code_value = model_value or ''
    if code_value and re.match(r'^[A-Za-z0-9\- ]+$', code_value):
        name_value = f'Ganesh Model {code_value}' if not re.search(r'\s', code_value) else f'Ganesh Model {code_value}'
    else:
        name_value = code_value or f'Ganesh Model'

    if not code_value:
        code_value = f'M{abs(hash(name_value)) % 1000:03d}'

    material = 'MDF' if size_to_inches(size_value) >= 18 or 'feet' in size_value.lower() else 'Clay'
    return code_value, name_value, size_value, price_value, material, total_stock


def main():
    try:
        parser = argparse.ArgumentParser(description='Import Ganesh model catalog from Excel into backend store.')
        workspace_root = Path(__file__).resolve().parent.parent
        default_excel = workspace_root / 'database' / 'Shri_Ganesh_Art_Stock_and_Price.xlsx'
        default_store = workspace_root / 'backend' / 'src' / 'data' / 'store.js'
        
        parser.add_argument('input', nargs='?', default=str(default_excel), help='Path to the input XLSX file')
        parser.add_argument('--store', default=str(default_store), help='Path to the backend store.js file')
        args = parser.parse_args()

        input_path = Path(args.input)
        store_path = Path(args.store)

        if not input_path.exists():
            raise FileNotFoundError(f'Input file not found: {input_path}')
        if not store_path.exists():
            raise FileNotFoundError(f'Store file not found: {store_path}')

        wb = openpyxl.load_workbook(input_path, data_only=True)
        ws = wb.active
        rows = list(ws.iter_rows(values_only=True))
        if not rows:
            raise ValueError('Excel file contains no rows')

        headers = [sanitize_text(cell).lower() for cell in rows[0]]
        data_rows = rows[1:]

        models_list = []
        lines = ['const models = [']
        for idx, row in enumerate(data_rows, start=1):
            code, name, size, price, material, total_stock = normalize_model_fields(row)
            sold_stock = idx % 4
            remaining_stock = total_stock - sold_stock
            
            # Write JS format
            lines.append(
                f"  {{ id: {idx}, code: '{code}', name: '{name}', size: '{size}', material: '{material}', price: {price}, totalStock: {total_stock}, soldStock: {sold_stock}, remainingStock: {remaining_stock}, active: true }},"  # noqa: E501
            )
            
            # Save for JSON file
            models_list.append({
                "id": idx,
                "code": code,
                "name": name,
                "size": size,
                "material": material,
                "price": price,
                "totalStock": total_stock,
                "soldStock": sold_stock,
                "remainingStock": remaining_stock,
                "active": True
            })
        lines.append('];\n')

        # Update store.js
        text = store_path.read_text(encoding='utf-8')
        start = text.index('const models = [')
        end = text.index('];', start) + 2
        suffix = text[end:].lstrip('\n')
        new_text = text[:start] + '\n'.join(lines) + '\n' + suffix
        store_path.write_text(new_text, encoding='utf-8')
        print(f'Updated {store_path} with {len(data_rows)} models from {input_path}')

        # Update models.json
        json_path = store_path.parent / 'models.json'
        json_path.write_text(json.dumps(models_list, indent=2, ensure_ascii=False), encoding='utf-8')
        print(f'Updated {json_path} with {len(data_rows)} models')

    except Exception as e:
        print(f'Warning: Could not sync models from Excel: {e}', file=sys.stderr)
        # Exit with 0 so server startup or pipeline is not blocked
        sys.exit(0)


if __name__ == '__main__':
    main()

