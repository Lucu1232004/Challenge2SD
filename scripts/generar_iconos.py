"""
Generador de iconos PWA a partir de una imagen.
Uso:
    python scripts/generar_iconos.py "ruta/a/imagen.jpg"

Genera en public/icons/:
    icon-512.png, icon-192.png, icon-180.png,
    icon-maskable-512.png, apple-touch-icon.png,
    favicon-32.png, favicon-16.png

Requiere: pip install pillow
"""
import os
import sys

from PIL import Image, ImageDraw, ImageOps

DEFAULT_SRC = os.path.join('src', 'assets', 'RealMadrid.jpg')
OUT_DIR = os.path.join('public', 'icons')


def generar(src: str, out_dir: str = OUT_DIR) -> None:
    os.makedirs(out_dir, exist_ok=True)
    im = Image.open(src).convert('RGB')

    # crop cuadrado centrado
    w, h = im.size
    side = min(w, h)
    left = (w - side) // 2
    top = (h - side) // 2
    sq = im.crop((left, top, left + side, top + side))

    # máscara de esquinas redondeadas (22% del lado)
    mask = Image.new('L', (side, side), 0)
    d = ImageDraw.Draw(mask)
    radius = int(side * 0.22)
    d.rounded_rectangle([0, 0, side - 1, side - 1], radius=radius, fill=255)

    def rounded(size: int) -> Image.Image:
        out = sq.resize((size, size), Image.LANCZOS)
        rgba = out.convert('RGBA')
        rgba.putalpha(mask.resize((size, size), Image.LANCZOS))
        return rgba

    # iconos con esquinas redondeadas
    for name, size in [
        ('icon-512.png', 512),
        ('icon-192.png', 192),
        ('icon-180.png', 180),
        ('favicon-32.png', 32),
        ('favicon-16.png', 16),
    ]:
        rounded(size).save(os.path.join(out_dir, name))
        print('generado:', name)

    # maskable 512 (sin redondeo: el sistema recorta el 20% exterior)
    sq.resize((512, 512), Image.LANCZOS).save(os.path.join(out_dir, 'icon-maskable-512.png'))
    print('generado: icon-maskable-512.png')

    # apple-touch-icon 180 (RGB sin alpha: iOS no soporta transparencia)
    sq.resize((180, 180), Image.LANCZOS).convert('RGB').save(
        os.path.join(out_dir, 'apple-touch-icon.png')
    )
    print('generado: apple-touch-icon.png')


if __name__ == '__main__':
    src = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_SRC
    generar(src)
    print('Listo. Revisa que el manifest siga apuntando a los mismos nombres.')