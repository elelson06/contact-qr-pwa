from PIL import Image, ImageDraw, ImageFont

BG = (15, 23, 42)      # brand-bg
ACCENT = (34, 211, 238)  # brand-accent

def make_icon(size, path, safe_zone_ratio=1.0):
    img = Image.new("RGBA", (size, size), BG)
    draw = ImageDraw.Draw(img)

    # Círculo acento centrado, respetando la "safe zone" si es maskable
    inner = int(size * safe_zone_ratio * 0.6)
    offset = (size - inner) // 2
    draw.ellipse([offset, offset, offset + inner, offset + inner], fill=ACCENT)

    # Simple representación de "QR": cuadrado oscuro dentro del círculo
    qr_size = int(inner * 0.5)
    qr_offset = (size - qr_size) // 2
    draw.rectangle(
        [qr_offset, qr_offset, qr_offset + qr_size, qr_offset + qr_size],
        fill=BG,
    )

    img.save(path)

make_icon(192, "public/icons/icon-192.png")
make_icon(512, "public/icons/icon-512.png")
make_icon(512, "public/icons/icon-maskable-512.png", safe_zone_ratio=0.8)

print("done")
