#!/usr/bin/env python3
"""Convert deck/one-pager source media into the site's static assets.

Run from the repo root:  python3 scripts/build-assets.py [--force]

Sources are never modified. Photos become WebP (with an `-800.webp` sibling for
anything used at hero size); client/media logos become white silhouette PNGs at
160 px height, matching the existing marquee assets. See
docs/content-update-plan.md §7 for the mapping this file encodes.
"""
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageOps

ROOT = Path(__file__).resolve().parent.parent
DECK = ROOT / "docs/source/deck-media"
ONEP = ROOT / "docs/source/onepager-media"
OUT = ROOT / "static/assets/attencity"
FORCE = "--force" in sys.argv

# --- photos -----------------------------------------------------------------
# (source, destination, max_width, hero) — hero=True also writes a -800 sibling
# and is allowed a larger byte budget.
PHOTOS = [
    # CES 2026 (insight post + home hero slider)
    (DECK / "s15-01-image181.jpg", "events/ces-2026-1.webp", 2400, True),
    (DECK / "s15-02-image182.jpg", "events/ces-2026-2.webp", 1728, True),
    (DECK / "s15-03-image183.jpg", "events/ces-2026-3.webp", 1639, False),
    (DECK / "s15-04-image184.jpg", "events/ces-2026-4.webp", 1639, False),
    (DECK / "s15-05-image185.jpg", "events/ces-2026-5.webp", 1639, False),
    (DECK / "s15-06-image186.jpg", "events/ces-2026-6.webp", 1639, False),
    (DECK / "s15-07-image187.jpg", "events/ces-2026-7.webp", 1728, False),
    (DECK / "s15-08-image188.jpg", "events/ces-2026-8.webp", 1728, True),
    # NYU Innovation Summit
    (DECK / "s16-04-image192.png", "events/nyu-1.webp", 1178, True),
    (DECK / "s16-07-image195.png", "events/nyu-2.webp", 720, False),
    # F4D First Ladies Luncheon
    (DECK / "s17-01-image196.jpg", "events/f4d-1.webp", 2400, True),
    (DECK / "s17-02-image197.jpg", "events/f4d-2.webp", 1402, False),
    (DECK / "s17-03-image198.jpg", "events/f4d-3.webp", 1402, False),
    (DECK / "s17-04-image199.jpg", "events/f4d-4.webp", 1505, False),
    (DECK / "s17-05-image200.jpg", "events/f4d-5.webp", 2103, False),
    # "Post-80s in the UN" premiere
    (DECK / "s18-01-image201.jpg", "events/post80s-un-1.webp", 2400, True),
    (DECK / "s18-02-image202.jpg", "events/post80s-un-2.webp", 1343, False),
    (DECK / "s18-03-image203.jpg", "events/post80s-un-3.webp", 1383, False),
    (DECK / "s18-04-image204.jpg", "events/post80s-un-4.webp", 1383, False),
    (ONEP / "photo-post80s-un-smg-backdrop.jpg", "events/post80s-un-5.webp", 877, False),
    # Shanghai Day at Lincoln Center
    (DECK / "s19-01-image205.jpg", "events/shanghai-day-1.webp", 2400, True),
    (DECK / "s19-02-image206.jpg", "events/shanghai-day-2.webp", 638, False),
    (DECK / "s19-03-image207.jpg", "events/shanghai-day-3.webp", 1124, False),
    (DECK / "s19-04-image208.jpg", "events/shanghai-day-4.webp", 767, False),
    (DECK / "s19-05-image209.jpg", "events/shanghai-day-5.webp", 849, False),
    (DECK / "s19-06-image210.png", "press/shanghai-day-clipping.webp", 447, False),
    # PR placements (screenshots)
    (DECK / "s22-01-image213.jpg", "press/placement-yahoo-finance.webp", 1296, False),
    (DECK / "s22-02-image214.jpg", "press/placement-marketwatch.webp", 1229, False),
    (DECK / "s22-03-image215.jpg", "press/placement-seeking-alpha.webp", 1256, False),
    (DECK / "s22-04-image216.jpg", "press/placement-cision.webp", 1280, False),
    (DECK / "s22-05-image217.png", "press/placement-business-insider.webp", 1129, False),
    (DECK / "s22-06-image218.png", "press/placement-ap.webp", 1386, False),
    (DECK / "s22-07-image219.png", "press/placement-boston-herald.webp", 1156, False),
    # Beauty & Beyond pop-up
    (DECK / "s24-01-image223.jpg", "work/beauty-beyond-1.webp", 1402, False),
    (DECK / "s24-02-image224.jpg", "work/beauty-beyond-2.webp", 1402, False),
    (DECK / "s24-03-image225.jpg", "work/beauty-beyond-3.webp", 1402, False),
    (DECK / "s24-04-image226.jpg", "work/beauty-beyond-4.webp", 1402, False),
    (DECK / "s24-05-image227.jpg", "work/beauty-beyond-5.webp", 2304, True),
    # MiPalette pop-up
    (DECK / "s25-01-image228.jpg", "work/mipalette-1.webp", 960, True),
    (DECK / "s25-02-image229.png", "work/mipalette-2.webp", 488, False),
    (DECK / "s25-03-image230.png", "work/mipalette-3.webp", 679, False),
    (DECK / "s25-04-image231.png", "work/mipalette-4.webp", 585, False),
    (DECK / "s25-05-image232.png", "work/mipalette-5.webp", 982, False),
    # SoHo Chinese New Year × Valentine's pop-up
    (DECK / "s26-01-image233.jpg", "work/soho-popup-1.webp", 1200, True),
    (DECK / "s26-02-image234.jpg", "work/soho-popup-2.webp", 864, False),
    (DECK / "s26-03-image235.jpg", "work/soho-popup-3.webp", 1200, False),
    (DECK / "s26-04-image236.jpg", "work/soho-popup-4.webp", 900, False),
    (DECK / "s26-05-image237.jpg", "work/soho-popup-5.webp", 1800, False),
    # Ellicor grand opening
    (DECK / "s27-01-image238.jpg", "work/ellicor-1.webp", 1858, True),
    (DECK / "s27-02-image239.jpg", "work/ellicor-2.webp", 1239, False),
    (DECK / "s27-03-image240.jpg", "work/ellicor-3.webp", 1239, False),
    (DECK / "s27-04-image241.jpg", "work/ellicor-4.webp", 720, False),
    (DECK / "s28-02-image242.jpg", "work/ellicor-5.webp", 1239, False),
    # Events service-page mosaic
    (DECK / "s28-03-image243.jpg", "work/gallery-1.webp", 1200, False),
    (DECK / "s28-06-image244.jpg", "work/gallery-2.webp", 896, False),
    (DECK / "s28-07-image245.jpg", "work/gallery-3.webp", 1354, False),
    (DECK / "s28-12-image250.jpg", "work/gallery-4.webp", 964, False),
    (DECK / "s28-13-image251.jpg", "work/gallery-5.webp", 857, False),
    (DECK / "s28-16-image253.jpg", "work/gallery-6.webp", 810, False),
    # Influencer parties
    (DECK / "s29-01-image254.jpg", "work/influencer-party-1.webp", 2400, True),
    (DECK / "s29-02-image255.jpg", "work/influencer-party-2.webp", 538, False),
    (DECK / "s29-03-image256.jpg", "work/influencer-party-3.webp", 555, False),
    (DECK / "s29-04-image257.jpg", "work/influencer-party-4.webp", 555, False),
    # KEDM party series
    (DECK / "s30-01-image260.jpg", "work/kedm-1.webp", 2400, True),
    (DECK / "s30-02-image261.jpg", "work/kedm-2.webp", 1296, False),
    (DECK / "s30-03-image262.jpg", "work/kedm-3.webp", 1402, False),
    # One-pager extras
    (ONEP / "photo-lynn-with-guests-window.jpg", "about/lynn-with-guests.webp", 1402, True),
    (ONEP / "qr-xiaohongshu-nyc-gaoshi-xiaozu.jpg", "contact/xiaohongshu-qr.webp", 558, False),
    (ONEP / "qr-wechat-icelynn.jpg", "contact/wechat-qr.webp", 480, False),
    (ONEP / "qr-instagram-attencitymarketing.png", "contact/instagram-qr.webp", 470, False),
]

# --- logos ------------------------------------------------------------------
# (source, destination stem). Rendered as a white silhouette on transparency so
# they sit on the dark marquee band exactly like the six that already ship.
LOGOS = [
    (DECK / "s08-08-image125.png", "clients/ces-cta"),
    (DECK / "s08-09-image126.png", "clients/tcl"),
    (DECK / "s08-10-image127.png", "clients/hisense"),
    (DECK / "s08-02-image119.png", "clients/segway"),
    (DECK / "s08-11-image128.png", "clients/rokid"),
    (DECK / "s08-05-image122.png", "clients/mobvoi"),
    (DECK / "s08-17-image134.png", "clients/meitu"),
    (DECK / "s08-03-image120.png", "clients/lumimind"),
    (DECK / "s08-07-image124.png", "clients/xtand"),
    (DECK / "s08-12-image129.png", "clients/primebot"),
    (DECK / "s08-13-image130.png", "clients/exumn"),
    (DECK / "s09-04-image137.png", "clients/apothe"),
    (DECK / "s09-05-image138.png", "clients/samu"),
    (DECK / "s09-06-image139.png", "clients/uriid"),
    (DECK / "s09-07-image140.png", "clients/noflex"),
    (DECK / "s09-09-image142.png", "clients/ulike"),
    (DECK / "s09-10-image143.png", "clients/gleamore"),
    (DECK / "s09-02-image135.png", "clients/gob-gorgeous-beauty"),
    (DECK / "s10-09-image151.jpg", "clients/manhattan-elite-club"),
    (DECK / "s10-07-image149.png", "clients/kosmera"),
    (DECK / "s10-05-image147.png", "clients/the-rose-new-york"),
    (DECK / "s10-13-image155.png", "clients/artecho"),
    (DECK / "s10-08-image150.png", "clients/lamu"),
    (DECK / "s11-02-image156.png", "clients/gongcha"),
    (DECK / "s11-03-image157.png", "clients/ellicor"),
    (DECK / "s11-04-image158.png", "clients/meirya"),
    (DECK / "s11-05-image159.png", "clients/lelecha"),
    (DECK / "s11-06-image160.jpg", "clients/hungrypanda"),
    (DECK / "s12-02-image161.png", "clients/hibee"),
    (DECK / "s12-04-image163.png", "clients/merlyn"),
    (DECK / "s12-05-image164.jpg", "clients/italkbb"),
    (DECK / "s12-06-image165.png", "clients/brand-usa"),
    (DECK / "s12-13-image172.jpg", "clients/elitelink"),
    (DECK / "s12-15-image174.png", "clients/rigel-atlas"),
]

LOGO_H = 160


def load(path):
    im = Image.open(path)
    im = ImageOps.exif_transpose(im)
    return im


def save_webp(im, dest: Path, max_bytes):
    """Write WebP, stepping quality down until it fits the byte budget."""
    dest.parent.mkdir(parents=True, exist_ok=True)
    for q in (82, 74, 66, 58, 50, 42):
        im.save(dest, "WEBP", quality=q, method=6)
        if dest.stat().st_size <= max_bytes:
            break
    return dest.stat().st_size


def do_photo(src, rel, max_w, hero):
    dest = OUT / rel
    if dest.exists() and not FORCE:
        return "skip", dest
    im = load(src).convert("RGB")
    if im.width > max_w:
        im = im.resize((max_w, round(im.height * max_w / im.width)), Image.LANCZOS)
    size = save_webp(im, dest, 400_000 if hero else 200_000)
    out = [f"{rel} {im.width}x{im.height} {size // 1024}KB"]
    if hero:
        small = im if im.width <= 800 else im.resize((800, round(im.height * 800 / im.width)), Image.LANCZOS)
        s2 = save_webp(small, dest.with_name(dest.stem + "-800.webp"), 160_000)
        out.append(f"+800 {s2 // 1024}KB")
    return " ".join(out), dest


def silhouette(src):
    """White-on-transparent version of a logo.

    Uses the alpha channel when the source really has one; otherwise thresholds
    against the background colour sampled from the corners, so logos that ship
    as a solid white (or black) box still come out as a clean mark.
    """
    im = load(src).convert("RGBA")
    a = im.getchannel("A")
    transparent = sum(1 for p in a.getdata() if p < 16) / (im.width * im.height)
    if transparent > 0.08:
        mask = a.point(lambda v: 255 if v > 40 else 0)
    else:
        rgb = im.convert("RGB")
        lum = rgb.convert("L")
        w, h = im.size
        corners = [lum.getpixel(p) for p in ((0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1))]
        bg = sum(corners) / 4
        dark = lum.point(lambda v: 255 if v < bg - 40 else 0)
        light = lum.point(lambda v: 255 if v > bg + 40 else 0)
        # On a light plate the mark is the dark pixels and vice versa — except
        # for reversed lockups (white type in a coloured box), where the first
        # guess comes back empty. Fall back to whichever mask has real ink.
        first, second = (dark, light) if bg > 128 else (light, dark)
        area = im.width * im.height
        ink = sum(1 for v in first.getdata() if v) / area
        mask = first if 0.02 <= ink <= 0.9 else second
    box = mask.getbbox()
    if box:
        mask = mask.crop(box)
    out = Image.new("RGBA", mask.size, (255, 255, 255, 0))
    out.putalpha(mask)
    white = Image.new("RGBA", mask.size, (255, 255, 255, 255))
    white.putalpha(mask)
    scale = LOGO_H / white.height
    return white.resize((max(1, round(white.width * scale)), LOGO_H), Image.LANCZOS)


def do_logo(src, rel):
    dest = OUT / (rel + ".png")
    if dest.exists() and not FORCE:
        return "skip", dest
    im = silhouette(src)
    dest.parent.mkdir(parents=True, exist_ok=True)
    im.save(dest, "PNG", optimize=True)
    return f"{rel}.png {im.width}x{im.height} {dest.stat().st_size // 1024}KB", dest


# --- Open Graph cards -------------------------------------------------------
# One 1200x630 PNG per page that has its own hero, cropped from that hero with
# a dark scrim and the white lockup bottom-left. Social crawlers get a branded,
# per-page card instead of one generic site image (plan §8.4).
OG_SIZE = (1200, 630)


def build_og(sources):
    lockup = load(OUT / "logo-lockup-light.webp").convert("RGBA")
    lockup = lockup.resize((300, round(lockup.height * 300 / lockup.width)), Image.LANCZOS)
    made = 0
    for rel, hero in sources:
        dest = OUT / "og" / f"{rel}.jpg"
        if dest.exists() and not FORCE:
            continue
        src = OUT / hero
        if not src.exists():
            print(f"  ! og: missing hero {hero}")
            continue
        im = load(src).convert("RGB")
        # cover-crop to 1200x630
        scale = max(OG_SIZE[0] / im.width, OG_SIZE[1] / im.height)
        im = im.resize((max(1, round(im.width * scale)), max(1, round(im.height * scale))), Image.LANCZOS)
        left = (im.width - OG_SIZE[0]) // 2
        top = round((im.height - OG_SIZE[1]) * 0.35)
        im = im.crop((left, top, left + OG_SIZE[0], top + OG_SIZE[1]))
        # scrim so the lockup always reads
        scrim = Image.new("RGBA", OG_SIZE, (0, 0, 0, 0))
        d = ImageDraw.Draw(scrim)
        for y in range(OG_SIZE[1]):
            a = int(200 * max(0.0, (y - OG_SIZE[1] * 0.45) / (OG_SIZE[1] * 0.55)) ** 1.4)
            d.line([(0, y), (OG_SIZE[0], y)], fill=(10, 10, 12, a))
        card = Image.alpha_composite(im.convert("RGBA"), scrim)
        card.paste(lockup, (64, OG_SIZE[1] - lockup.height - 56), lockup)
        # orange rule under the lockup
        ImageDraw.Draw(card).rectangle(
            [64, OG_SIZE[1] - 40, 64 + 120, OG_SIZE[1] - 34], fill=(255, 80, 0, 255)
        )
        dest.parent.mkdir(parents=True, exist_ok=True)
        card.convert("RGB").save(dest, "JPEG", quality=82, optimize=True, progressive=True)
        made += 1
        print(f"og/{rel}.jpg {dest.stat().st_size // 1024}KB")
    return made


def og_sources():
    """(slug, hero path) for every page with a hero, read from the content
    modules so this never drifts from the site."""
    import json
    import re

    out = []
    svc = (ROOT / "src/lib/content/services.js").read_text()
    for slug, hero in re.findall(r"slug: '([^']+)'[\s\S]*?hero: \{ image: '([^']+)'", svc):
        out.append((f"services-{slug}", hero))
    for folder in ("case-studies", "insights"):
        for md in sorted((ROOT / "src/content" / folder).glob("*.md")):
            fm = md.read_text().split("---")[1]
            if re.search(r"^draft: true$", fm, re.M):
                continue
            m = re.search(r"^hero: '([^']+)'", fm, re.M)
            if m:
                out.append((f"{folder}-{md.stem}", m.group(1)))
    out += [
        ("home", "events/pre-ai-tech-week-nyc-3.webp"),
        ("about", "why-attencity-billboard.webp"),
        ("services", "services-individual-city-glass.webp"),
        ("contact", "contact-bg-woman-city-reflection.webp"),
        ("case-studies", "work/soho-popup-1.webp"),
        ("insights", "events/ces-2026-1.webp"),
    ]
    return out


def write_sizes():
    """Emit src/lib/content/media-sizes.js so components never hard-code a
    width, height or srcset that can drift from the file on disk."""
    rows = []
    files = sorted(list(OUT.rglob("*.webp")) + list(OUT.rglob("*.png")))
    for f in files:
        rel = f.relative_to(OUT).as_posix()
        if rel.endswith("-800.webp") or rel.startswith("og/"):
            continue
        w, h = Image.open(f).size
        small = f.with_suffix("").name + "-800.webp"
        rows.append(f"\t'{rel}': [{w}, {h}{', 1' if (f.parent / small).exists() else ''}],")
    dest = ROOT / "src/lib/content/media-sizes.js"
    dest.write_text(
        "// GENERATED by scripts/build-assets.py — do not edit by hand.\n"
        "// path -> [width, height, hasSmallSibling] for every image in\n"
        "// static/assets/attencity/. Powers dims()/srcset() in attencity.js.\n"
        "export const mediaSizes = {\n" + "\n".join(rows) + "\n};\n"
    )
    print(f"\nmedia-sizes.js: {len(rows)} entries")


if __name__ == "__main__":
    missing = [str(s) for s, *_ in PHOTOS + LOGOS if not s.exists()]
    if missing:
        sys.exit("missing sources:\n  " + "\n  ".join(missing))
    n = 0
    for src, rel, max_w, hero in PHOTOS:
        msg, _ = do_photo(src, rel, max_w, hero)
        if msg != "skip":
            n += 1
            print(msg)
    for src, rel in LOGOS:
        msg, _ = do_logo(src, rel)
        if msg != "skip":
            n += 1
            print(msg)
    n += build_og(og_sources())
    print(f"\n{n} files written to {OUT.relative_to(ROOT)}")
    write_sizes()
