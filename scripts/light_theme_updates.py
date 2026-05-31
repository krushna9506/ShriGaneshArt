from pathlib import Path

app = Path('d:/ganesha/frontend/src/App.jsx')
text = app.read_text(encoding='utf-8')

replacements = {
    'bg-slate-950 text-slate-100': 'bg-slate-50 text-slate-900',
    'border-slate-800 bg-slate-900/80': 'border-slate-200 bg-white/90',
    'border-slate-800 bg-slate-900 p-6': 'border-slate-200 bg-white p-6',
    'border-slate-800 bg-slate-950 p-6': 'border-slate-200 bg-white p-6',
    'border-slate-800 bg-slate-950': 'border-slate-200 bg-white',
    'border-slate-800 bg-slate-900': 'border-slate-200 bg-slate-50',
    'bg-slate-800/70': 'bg-slate-100',
    'hover:bg-slate-700': 'hover:bg-slate-200',
    'text-slate-400': 'text-slate-500',
    'text-slate-300': 'text-slate-600',
    'text-slate-200': 'text-slate-700',
    'text-white': 'text-slate-900',
    'text-amber-400': 'text-amber-600',
    'text-emerald-100': 'text-emerald-800',
    'bg-emerald-500/10': 'bg-emerald-100',
    'border-emerald-500/30': 'border-emerald-200',
    'bg-slate-900 px-4 py-2 text-sm text-slate-100': 'bg-slate-100 px-4 py-2 text-sm text-slate-800',
    'bg-slate-950 px-4 py-2 text-sm text-slate-100': 'bg-white px-4 py-2 text-sm text-slate-800',
    'bg-amber-400/10': 'bg-amber-100',
    'border-amber-400/30': 'border-amber-200',
    'text-amber-100': 'text-amber-800',
    'bg-rose-500/10': 'bg-rose-100',
    'border-rose-500/30': 'border-rose-200',
    'text-rose-100': 'text-rose-700',
    'text-slate-100': 'text-slate-800',
}

for old, new in replacements.items():
    text = text.replace(old, new)

text = text.replace('Ganesh Arts', 'Shri Ganesh Art')
text = text.replace('Management System', 'Art Studio Management')
text = text.replace('Ganapati Idol Operations', 'Shri Ganesh Art Operations')
text = text.replace('JWT-ready backend', 'Live catalog + billing')
text = text.replace('Admin console', 'Shri Ganesh Art')
text = text.replace('Dashboard', 'Dashboard')
text = text.replace('Pune', 'Dharashiv, 413501')

# Add contact card in sidebar
old = '        <nav className="mt-8 space-y-2 text-sm">\n'
new = '        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">\n          <p className="font-semibold text-slate-900">Arun Donge</p>\n          <p>Contact: 9423734355</p>\n          <p>Location: Dharashiv, 413501</p>\n        </div>\n        <nav className="mt-6 space-y-2 text-sm">\n'
text = text.replace(old, new, 1)
app.write_text(text, encoding='utf-8')

invoice = Path('d:/ganesha/frontend/src/components/billing/InvoiceTemplate.jsx')
text = invoice.read_text(encoding='utf-8')
text = text.replace('Ganesh Arts', 'Shri Ganesh Art')
text = text.replace('Pune, Maharashtra', 'Dharashiv, 413501')
text = text.replace('Phone: +91 98765 43210', 'Phone: 9423734355')
invoice.write_text(text, encoding='utf-8')
print('Updated light theme and branding in App.jsx and InvoiceTemplate.jsx')
