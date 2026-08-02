"""
Generate static/icon.ico with no third-party libraries.

    python tools/make_icon.py

Draws a rounded teal tile with a terminal prompt on it (>_), at 16, 32, 48
and 256 pixels. Written by hand because Pillow is not a dependency of this
project and an icon is not worth adding one for.

ICO is a container: a small directory, then one BMP-ish image per size. Each
image is a BITMAPINFOHEADER whose height is doubled (colour data plus a 1-bit
transparency mask), followed by bottom-up BGRA rows.
"""

import os
import struct

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(BASE_DIR, "static", "icon.ico")

SIZES = [16, 32, 48, 256]

TEAL = (0x0E, 0x7C, 0x70)      # the course accent
INK = (0xFF, 0xFF, 0xFF)


def rounded_tile(size):
    """A size x size RGBA buffer: rounded teal square, white >_ prompt."""
    radius = max(2, size // 5)
    px = [[(0, 0, 0, 0)] * size for _ in range(size)]

    for y in range(size):
        for x in range(size):
            # Distance test only matters near the corners.
            cx = min(x, size - 1 - x)
            cy = min(y, size - 1 - y)
            inside = True
            if cx < radius and cy < radius:
                dx = radius - cx
                dy = radius - cy
                inside = (dx * dx + dy * dy) <= radius * radius
            if inside:
                px[y][x] = (TEAL[0], TEAL[1], TEAL[2], 255)

    stroke = max(1, round(size / 14))
    draw_chevron(px, size, stroke)
    draw_underscore(px, size, stroke)
    return px


def plot(px, size, x, y, thickness):
    """Draw a thickness x thickness dot, clipped to the tile."""
    for oy in range(thickness):
        for ox in range(thickness):
            xx, yy = x + ox, y + oy
            if 0 <= xx < size and 0 <= yy < size:
                px[yy][xx] = (INK[0], INK[1], INK[2], 255)


def draw_chevron(px, size, stroke):
    """The > of the prompt."""
    left = round(size * 0.24)
    top = round(size * 0.30)
    height = round(size * 0.34)
    width = round(size * 0.20)
    steps = max(height, 1)
    for i in range(steps + 1):
        t = i / steps
        x = left + round(width * t)
        y = top + round(height * t / 2)
        plot(px, size, x, y, stroke)                       # upper arm
        y2 = top + height - round(height * t / 2)
        plot(px, size, x, y2, stroke)                      # lower arm


def draw_underscore(px, size, stroke):
    """The _ after the prompt."""
    x0 = round(size * 0.52)
    x1 = round(size * 0.76)
    y = round(size * 0.64)
    for x in range(x0, x1):
        plot(px, size, x, y, stroke)


def image_bytes(px, size):
    """BITMAPINFOHEADER + bottom-up BGRA rows + a 1-bit AND mask."""
    header = struct.pack(
        "<IiiHHIIiiII",
        40,            # header size
        size,          # width
        size * 2,      # height: colour + mask
        1,             # planes
        32,            # bits per pixel
        0,             # BI_RGB
        size * size * 4,
        0, 0, 0, 0,
    )

    colour = bytearray()
    for y in range(size - 1, -1, -1):          # bottom-up
        for x in range(size):
            r, g, b, a = px[y][x]
            colour += bytes((b, g, r, a))

    # The AND mask is ignored for 32bpp alpha, but the format requires it.
    row_bytes = ((size + 31) // 32) * 4
    mask = bytearray(row_bytes * size)

    return header + bytes(colour) + bytes(mask)


def build():
    images = [(size, image_bytes(rounded_tile(size), size)) for size in SIZES]

    out = bytearray(struct.pack("<HHH", 0, 1, len(images)))
    offset = 6 + 16 * len(images)
    for size, data in images:
        out += struct.pack(
            "<BBBBHHII",
            0 if size >= 256 else size,        # 0 means 256 in ICO
            0 if size >= 256 else size,
            0, 0, 1, 32,
            len(data), offset,
        )
        offset += len(data)
    for _, data in images:
        out += data

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "wb") as handle:
        handle.write(out)

    print("wrote %s" % OUT)
    print("  %s bytes, sizes: %s" % (format(len(out), ","), ", ".join(map(str, SIZES))))


if __name__ == "__main__":
    build()
