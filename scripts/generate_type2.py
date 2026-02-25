import os
import json
from PIL import Image

# Run this script in the folder containing metadata.json and label directories
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

        # Skip if already done thumb image
        if "_thumb.jpg" in fname or not fname.lower().endswith(('.png', '.jpg', '.jpeg', '.webp', '.bmp', '.gif')):
            continue

        try:
            with Image.open(fpath) as im:
                # If RGBA
                if im.mode in ("RGBA", "P"):
                    im = im.convert("RGB")
                else:
                    im = im.convert("RGB")

                # 1. Resize if ovver 512
                im.thumbnail((512, 512), Image.Resampling.LANCZOS)
                
                name, _ = os.path.splitext(fname)
                new_main_name = f"{name}.jpg"
                new_main_path = os.path.join(label_dir, new_main_name)
                
                im.save(new_main_path, "JPEG", quality=90)
                images.append(new_main_name)

                # 2. Create thumbnail
                im.thumbnail((100, 100), Image.Resampling.LANCZOS)
                thumb_name = f"{name}_thumb.jpg"
                thumb_path = os.path.join(label_dir, thumb_name)
                
                im.save(thumb_path, "JPEG", quality=85)
                thumbnails.append(thumb_name)

                # If original not jpg
                if fname != new_main_name: os.remove(fpath)

        except Exception as e:
            print(f"Error processing {fname}: {e}")

    labels_obj[label] = {
        "images": images,
        "thumbnails": thumbnails
    }

# generate files
folder_name = os.path.basename(os.getcwd())
json_filename = f"{folder_name}.json"

with open(json_filename, 'w', encoding='utf-8') as f:
    json.dump({'labels': labels_obj}, f, ensure_ascii=False, indent=2)

translations_dir = "_locals"
os.makedirs(translations_dir, exist_ok=True)

en_translations = {label: label for label in labels_obj.keys()}
with open(os.path.join(translations_dir, "en-GB.json"), 'w', encoding='utf-8') as f:
    json.dump(en_translations, f, ensure_ascii=False, indent=2)

print(f"Valmis! Kuvat skaalattu, {json_filename} ja en-GB.json luotu.")