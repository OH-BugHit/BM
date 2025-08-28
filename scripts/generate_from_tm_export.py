import json
import os
import shutil
from PIL import Image

# Run this script in the same folder as 'samples' and 'metadata.json'
# This script creates folders for labels, thumbnails and generates labels.json
# Output JSON file is named after the current folder (e.g. testimalli1.json)
if not os.path.exists('samples'):
    print("Folder 'samples' not found. Place this script to folder containing samples-folder and metadata.json.")
    exit(1)
if not os.path.exists('metadata.json'):
    print("metadata.json not found. Place this script to folder containing samples-folder and metadata.json.")
    exit(1)
with open('metadata.json', encoding='utf-8') as f:
    meta = json.load(f)

model_name = meta['modelName']
labels = meta['labels']

os.makedirs(model_name, exist_ok=True)
for label in labels:
    os.makedirs(os.path.join(model_name, label), exist_ok=True)

labels_obj = {}

for fname in os.listdir('samples'):
    if '_' in fname and fname.split('_')[0].isdigit():
        idx = int(fname.split('_')[0])
        if idx < len(labels):
            label = labels[idx]
            src = os.path.join('samples', fname)
            dst = os.path.join(model_name, label, fname)
            shutil.move(src, dst)

            # Tee thumbnail, max 100px toisessa mitassa, kuvasuhde säilyy
            thumb_name = fname.replace('.png', '_thumb.png')
            thumb_path = os.path.join(model_name, label, thumb_name)
            try:
                with Image.open(dst) as im:
                    im.thumbnail((100, 100))
                    im.save(thumb_path)
            except Exception as e:
                print(f"Thumbnail error for {fname}: {e}")

            if label not in labels_obj:
                labels_obj[label] = {"images": [], "thumbnails": []}
            labels_obj[label]["images"].append(fname)
            labels_obj[label]["thumbnails"].append(thumb_name)

# Do filenames regarding modelname
folder_name = os.path.basename(os.getcwd())
json_filename = f"{folder_name}.json"

with open(json_filename, 'w', encoding='utf-8') as f:
    json.dump({'labels': labels_obj}, f, ensure_ascii=False, indent=2)

# Create translations.json
translations = {}
for label in labels_obj.keys():
    translations[label] = {
        "en-GB": label,
        "fi-FI": "NULL"
    }

with open('translations.json', 'w', encoding='utf-8') as f:
    json.dump(translations, f, ensure_ascii=False, indent=2)

print(f"Done! {json_filename} and translations.json generated and thumbnails created.")
