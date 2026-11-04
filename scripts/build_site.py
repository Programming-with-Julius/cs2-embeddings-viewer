"""Preserve the static site and bundle each model's original JPEG bytes."""

import json
import shutil
import struct
from pathlib import Path


def build(source, destination):
    shutil.copytree(source, destination)
    for metadata in sorted(source.glob('embeddings/image_data_*.json')):
        model = metadata.stem.removeprefix('image_data_')
        entries = json.loads(metadata.read_text(encoding='utf-8'))
        image_root = (metadata.parent / ('images_' + model)).resolve()
        images = [(image_root / entry['path']).resolve() for entry in entries]
        if not images or any(image_root not in image.parents for image in images):
            raise ValueError('Invalid image paths in ' + metadata.name)
        sizes = [image.stat().st_size for image in images]
        if any(size <= 0 for size in sizes):
            raise ValueError('Empty image in ' + metadata.name)
        header = json.dumps(sizes, separators=(',', ':')).encode('utf-8')
        bundle = destination / 'embeddings' / ('image_bundle_' + model + '.bin')
        with bundle.open('wb') as output:
            output.write(struct.pack('<I', len(header)))
            output.write(header)
            for image in images:
                with image.open('rb') as original:
                    shutil.copyfileobj(original, output)
        print(f'{model}: {len(images):,} original images, {bundle.stat().st_size:,} bytes', flush=True)


if __name__ == '__main__':
    root = Path(__file__).resolve().parents[1]
    build(root / 'site', root / '_site')
