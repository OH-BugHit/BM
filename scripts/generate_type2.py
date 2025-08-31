import os
import json
from PIL import Image

# Run this script in the folder containing metadata.json and label directories containing fullsize images
# This script rezises images to max 512px (width and/or height), creates thumbnails, labels.json and translation file

if not os.path.exists('metadata.json'):
    print("metadata.json not found. Place this script in the folder containing label directories and metadata.json.")
    exit(1)
with open('metadata.json', encoding='utf-8') as f:
    meta = json.load(f)

labels = meta['labels']

labels_obj = {}

for label in labels:
    label_dir = os.path.join(label)
    if not os.path.isdir(label_dir):
        continue

    images = []
    thumbnails = []

    for fname in os.listdir(label_dir):
        fpath = os.path.join(label_dir, fname)
        if not os.path.isfile(fpath):
            continue

        if not fname.lower().endswith(('.png', '.jpg', '.jpeg', '.webp', '.bmp', '.gif')):
            continue

        images.append(fname)

        # Thumbnail name
        name, ext = os.path.splitext(fname)
        thumb_name = f"{name}_thumb{ext}"
        thumb_path = os.path.join(label_dir, thumb_name)

        if not os.path.exists(thumb_path):
            try:
                with Image.open(fpath) as im:
                    im.thumbnail((100, 100))
                    im.save(thumb_path)
            except Exception as e:
                print(f"Thumbnail error for {fname}: {e}")

        thumbnails.append(thumb_name)

    labels_obj[label] = {
        "images": images,
        "thumbnails": thumbnails
    }

folder_name = os.path.basename(os.getcwd())
json_filename = f"{folder_name}.json"

with open(json_filename, 'w', encoding='utf-8') as f:
    json.dump({'labels': labels_obj}, f, ensure_ascii=False, indent=2)

# Create translations-folder
translations_dir = "_locals"
os.makedirs(translations_dir, exist_ok=True)

# Create en-GB.json
en_translations = {}
for label in labels_obj.keys():
    en_translations[label] = label
with open(os.path.join(translations_dir, "en-GB.json"), 'w', encoding='utf-8') as f:
    json.dump(en_translations, f, ensure_ascii=False, indent=2)

print(f"Done! {json_filename}, translations/en-GB.json and language jsons generated and thumbnails created.")