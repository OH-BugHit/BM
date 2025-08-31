import json
import os
import shutil
from PIL import Image

# Run this script in the same folder as 'samples' and 'metadata.json'
# This script creates folders for labels, thumbnails, generates labels.json and translation
# Output JSON file is named after the current folder (e.g. occupations.json)
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
json_filename = f"{model_name}.json"
json_path = os.path.join(model_name, json_filename)

with open(json_path, 'w', encoding='utf-8') as f:
    json.dump({'labels': labels_obj}, f, ensure_ascii=False, indent=2)

# Create translations-folder
translations_dir = os.path.join(model_name, "_locals")
os.makedirs(translations_dir, exist_ok=True)

# Create en-GB.json
en_translations = {}
for label in labels_obj.keys():
    en_translations[label] = label
with open(os.path.join(translations_dir, "en-GB.json"), 'w', encoding='utf-8') as f:
    json.dump(en_translations, f, ensure_ascii=False, indent=2)

print(f"Done! {json_path} and {os.path.join(translations_dir, 'en-GB.json')} generated and thumbnails created.")

# Delete samples folder
try:
    shutil.rmtree('samples')
    print("Deleted 'samples' folder.")
except Exception as e:
    print(f"Could not delete 'samples' folder: {e}")

# Delete metadata.json
try:
    os.remove('metadata.json')
    print("Deleted 'metadata.json'.")
except Exception as e:
    print(f"Could not delete 'metadata.json': {e}")

# Delete this script file
try:
    os.remove(__file__)
    print(f"Deleted script file: {__file__}")
except Exception as e:
    print(f"Could not delete script file: {e}")