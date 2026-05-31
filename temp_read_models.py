import openpyxl
path = r'C:\Users\donge\Downloads\Shri_Ganesh_Art_Model_List (1).xlsx'
wb = openpyxl.load_workbook(path, data_only=True)
ws = wb.active
rows = list(ws.iter_rows(values_only=True))
print('rows', len(rows))
for r in rows:
    print(r)
