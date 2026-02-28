import os
from PIL import Image

# 1. Bilder konvertieren
image_folder = 'images'
files_to_convert = [f for f in os.listdir(image_folder) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]

print(f"Starte Konvertierung von {len(files_to_convert)} Bildern...")

for filename in files_to_convert:
    name, ext = os.path.splitext(filename)
    img = Image.open(os.path.join(image_folder, filename))
    img.save(os.path.join(image_folder, f"{name}.webp"), "webp")
    print(f"Erledigt: {name}.webp")

# 2. HTML/CSS Verweise anpassen
html_files = ['index.html', 'rezepte.html', 'zutaten.html']
for html_file in html_files:
    if os.path.exists(html_file):
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Ersetzt Endungen in den Dateien
        new_content = content.replace('.png', '.webp').replace('.jpg', '.webp').replace('.jpeg', '.webp')
        
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Dateipfade in {html_file} wurden auf .webp aktualisiert.")

print("Quest abgeschlossen! Alle Bilder sind nun WebP und die Links angepasst.")