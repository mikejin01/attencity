#!/usr/bin/env python3
"""Generate a scannable QR code for every social account that has a URL.

Run from the repo root:  python3 scripts/build-qr-codes.py [--force]

The owner asked for a QR on every account, not just the ones without a public
profile link (feedback PDF, "show QR code for all accounts? is it doable?").
Instagram, Xiaohongshu and WeChat already have official QR cards exported from
those apps and are left alone — this script fills in the rest from their URLs.

Requires `segno` (pure-Python, no build step):  pip install segno
"""
import sys
from pathlib import Path

try:
    import segno
except ImportError:
    sys.exit("segno is not installed — run: pip install segno")
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "static/assets/attencity/contact"
FORCE = "--force" in sys.argv

# (destination, url) — must stay in step with `site.social` in
# src/lib/content/attencity.js. Accounts with an app-exported QR card
# (Instagram, Xiaohongshu, WeChat) are deliberately absent.
CODES = [
    ("tiktok-qr.webp", "https://www.tiktok.com/@attencity_marketing"),
    ("linkedin-qr.webp", "https://www.linkedin.com/company/attencity"),
    ("whatsapp-qr.webp", "https://wa.me/13329993472"),
]

# 24 modules of a 33-module (version 4) symbol at scale 16 plus the quiet zone
# lands near 600px — the same order of magnitude as the exported cards, and
# comfortably above the 260px the dialog renders them at.
SCALE = 16
BORDER = 3


def build(name: str, url: str) -> str:
    dest = OUT / name
    if dest.exists() and not FORCE:
        return "skip"
    tmp = dest.with_suffix(".png")
    # Error correction H survives the rounding and rescaling below, and leaves
    # room to drop a logo in the middle later if the client wants one.
    segno.make(url, error="h").save(tmp, scale=SCALE, border=BORDER)
    img = Image.open(tmp).convert("RGB")
    img.save(dest, "WEBP", quality=92, method=6)
    tmp.unlink()
    return f"{name}: {img.width}×{img.height}, {dest.stat().st_size // 1024} KB"


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    n = 0
    for name, url in CODES:
        msg = build(name, url)
        if msg != "skip":
            n += 1
            print(msg)
    print(f"\n{n} QR codes written to {OUT.relative_to(ROOT)}")
    # Keep dims()/srcset() in step with what is now on disk. build-assets.py has
    # a hyphen in its name, so it is loaded by path rather than imported; its
    # __main__ guard does not fire this way, only write_sizes() runs.
    from importlib.util import module_from_spec, spec_from_file_location

    spec = spec_from_file_location("build_assets", ROOT / "scripts/build-assets.py")
    mod = module_from_spec(spec)
    spec.loader.exec_module(mod)
    mod.write_sizes()
