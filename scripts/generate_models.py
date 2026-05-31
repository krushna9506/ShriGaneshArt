import openpyxl
from pathlib import Path

path = Path(r'C:\Users\donge\Downloads\Shri_Ganesh_Art_Model_List (1).xlsx')
wb = openpyxl.load_workbook(path, data_only=False)
ws = wb.active
rows = list(ws.iter_rows(values_only=True))[1:]


def size_to_inches(size_text):
    text = str(size_text).strip().lower()
    if text.endswith('feet'):
        return int(float(text.split()[0]) * 12)
    if text.endswith('inch'):
        return int(float(text.split()[0]))
    return 12


def price_for_size(size_text):
    inches = size_to_inches(size_text)
    # Simple 2026 catalog pricing model derived from the visible size tiers.
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

lines = ['const models = [']
for idx, (code, size, _) in enumerate(rows, start=1):
    code_value = str(code).strip() if code else f'M{idx:03d}'
    size_value = str(size).strip() if size else '12 inch'
    material = 'MDF' if size_to_inches(size_value) >= 18 or size_value.lower().endswith('feet') else 'Clay'
    price = price_for_size(size_value)
    total_stock = 6 + (idx % 5) + (3 if size_to_inches(size_value) >= 18 else 0)
    sold_stock = idx % 4
    remaining_stock = total_stock - sold_stock
    lines.append(
        f"  {{ id: {idx}, code: '{code_value}', name: 'Ganesh Model {code_value}', size: '{size_value}', material: '{material}', price: {price}, totalStock: {total_stock}, soldStock: {sold_stock}, remainingStock: {remaining_stock}, active: true }},"
    )
lines.append('];')

store_path = Path('d:/ganesha/backend/src/data/store.js')
text = store_path.read_text(encoding='utf-8')
start = text.index('const models = [')
end = text.index('];\n\nconst customers = [') + 3
new_text = text[:start] + '\n'.join(lines) + '\n\n' + text[end+3:]  # not correct? let's just use proper split

# easier: replace from start to before 'const customers = ['
new_text = text[:start] + '\n'.join(lines) + '\n\n' + text[text.index('const customers = ['):]
store_path.write_text(new_text, encoding='utf-8')
print('Updated', store_path, 'with', len(rows), 'models')
