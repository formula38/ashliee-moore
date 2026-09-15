#!/usr/bin/env python3
"""Copy-filter album stills into js/looks.js for site rotation.

Full dumps live in assets/library/{fashion,culinary,cosmetology,press,events}/.
Press stays library-only. Website pools skip files under MIN_BYTES and
duplicates already used as curated fallbacks.
"""
from __future__ import annotations

import hashlib
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
LIBRARY = ROOT / "assets" / "library"
LOOKS = ROOT / "js" / "looks.js"
MIN_BYTES = 90 * 1024
# Reject anamorphically stretched dumps and extreme phone/landscape stills
# that look warped inside the site's 4:5 frames.
ASPECT_BANDS = {
    "fashion": (0.70, 0.86),
    "cosmetology": (0.70, 0.86),
    "events": (0.70, 0.90),
    "culinary": (0.70, 1.40),
    "press": (0.55, 1.40),
}

CURATED = {
    "hero": [
        {
            "src": "assets/hero.jpg",
            "alt": "Editorial portrait of Ashliee Moore surrounded by red roses",
            "caption": "Look 01 — Roses",
        },
        {
            "src": "assets/fashion-06.jpg",
            "alt": "Outdoors, a model in black lace and a metallic gold ruffled collar holds a large bouquet of pink and white chrysanthemums.",
            "caption": "Garden ruff",
        },
        {
            "src": "assets/fashion-04.jpg",
            "alt": "A model in a yellow damask hoodie, brown textured pants, and cream train leans against a bold black-white-and-orange mural.",
            "caption": "Mural profile",
        },
        {
            "src": "assets/fashion-08.jpg",
            "alt": "Ashliee walking an outdoor night runway in a black blazer and tulle",
            "caption": "Look 04 — Night walk",
        },
    ],
    "runway": [
        {
            "src": "assets/runway-01.jpg",
            "alt": "Ashliee Moore on the Be ExquisiteU fashion show runway",
            "caption": "Be ExquisiteU",
        },
        {
            "src": "assets/fashion-08.jpg",
            "alt": "Ashliee walking an outdoor night runway in a black blazer and tulle",
            "caption": "Night walk",
        },
        {
            "src": "assets/fashion-06.jpg",
            "alt": "Outdoors, a model in black lace and a metallic gold ruffled collar holds a large bouquet of pink and white chrysanthemums.",
            "caption": "Garden ruff",
        },
        {
            "src": "assets/fashion-07.jpg",
            "alt": "A model peeks over massive neon yellow ruffles of a sculptural gown, looking back over her shoulder on a dark runway.",
            "caption": "Tiered citron",
        },
        {
            "src": "assets/fashion-04.jpg",
            "alt": "A model in a yellow damask hoodie, brown textured pants, and cream train leans against a bold black-white-and-orange mural.",
            "caption": "Mural profile",
        },
        {
            "src": "assets/runway-02.jpg",
            "alt": "Ashliee in an aqua evening gown",
            "caption": "Aqua gown",
        },
        {
            "src": "assets/runway-03.jpg",
            "alt": "Ashliee in a colorful evening mini dress on a city night street",
            "caption": "City night",
        },
        {
            "src": "assets/runway-04.jpg",
            "alt": "A woman in a black faux-leather shirt-dress sits in a wingback chair beside pampas grass under moody purple-tinted light.",
            "caption": "Leather repose",
        },
        {
            "src": "assets/fashion-01.jpg",
            "alt": "Ashliee walking a night street runway as the audience watches",
            "caption": "Street runway",
        },
    ],
    "glam": [
        {
            "src": "assets/glam-01.jpg",
            "alt": "Black and white beauty close-up of Ashliee in a denim jacket",
            "caption": "Denim, unbothered",
        },
        {
            "src": "assets/glam-03.jpg",
            "alt": "Beauty portrait of Ashliee with magenta eyeshadow and red lipstick",
            "caption": "Magenta hour",
        },
        {
          "src": "assets/glam-02.jpg",
          "alt": "A beauty close-up shows pink glitter eyeshadow, matte red lips, and gold rings against a grey backdrop and burgundy velvet neckline.",
          "caption": "Velvet shimmer",
        },
    ],
    "tasting": [
        {
            "src": "assets/kitchen-02.jpg",
            "alt": "Plated lobster tail with roasted lemon on a charcoal dish",
            "caption": "The plate",
        },
        {
            "src": "assets/kitchen-03.jpg",
            "alt": "King crab, lobster, and garlic bread on a red platter",
            "caption": "The catch",
        },
        {
            "src": "assets/kitchen-06.jpg",
            "alt": "Prawn, mussels, and clams over linguine in a red sauce",
            "caption": "Linguine",
        },
        {
            "src": "assets/kitchen-05.jpg",
            "alt": "Blackened salmon with rosemary, peppers, and lemon",
            "caption": "Blackened",
        },
        {
            "src": "assets/kitchen-04.jpg",
            "alt": "Crab boil in a dutch oven with a glass of red wine",
            "caption": "The boil",
        },
    ],
    "scene": [
        {
            "src": "assets/scene-01.jpg",
            "alt": "In black and white, a woman in a buttoned denim jacket stands centered among four softly blurred figures behind her.",
            "caption": "Denim ensemble",
        },
        {
            "src": "assets/scene-02.jpg",
            "alt": "Ashliee at a birthday-themed night event look",
            "caption": "Night presence",
        },
        {
            "src": "assets/scene-03.jpg",
            "alt": "On a reflective runway beside a vintage locomotive, a model wears a black tulle crop top and colorful printed maxi skirt.",
            "caption": "Engine stride",
        },
        {
            "src": "assets/scene-04.jpg",
            "alt": "A model in a black off-shoulder tulle top and geometric print maxi skirt poses in front of a dark steam engine with red wheels.",
            "caption": "Tulle and steam",
        },
    ],
}

POOLS = {
    "hero": ("fashion", "fashion"),
    "runway": ("fashion", "fashion"),
    "glam": ("cosmetology", "cosmetology"),
    "tasting": ("culinary", "culinary"),
    "scene": ("events", "events"),
}

# Used only when captions.json has no entry for a still.
CAPTION_BANKS = {
    "fashion": [
        ("Aqua gown", "Ashliee in an aqua evening gown"),
        ("Red cape", "Ashliee in a dramatic red cape look"),
        ("Velvet night", "Ashliee in a velvet evening look"),
        ("Gold hour", "Ashliee in a gold editorial look"),
        ("Street stride", "Ashliee walking a night street runway"),
        ("Blazer cut", "Ashliee in a sharp blazer fashion look"),
        ("Tulle lift", "Ashliee in tulle on the runway"),
        ("Crystal light", "Ashliee styled with crystal jewelry"),
        ("Rooftop wind", "Ashliee on a rooftop fashion set"),
        ("Print play", "Ashliee in a bold print look"),
        ("Coat check", "Ashliee in a structured coat look"),
        ("Night floral", "Ashliee in a floral evening dress"),
        ("Runway pause", "Ashliee pausing mid-walk on the runway"),
        ("Side profile", "Editorial side profile of Ashliee"),
        ("Back glance", "Ashliee glancing back in a fashion look"),
        ("Hemline", "Full-length fashion still of Ashliee"),
        ("Stage light", "Ashliee under stage lights"),
        ("Editorial stare", "Close editorial portrait of Ashliee"),
        ("Motion blur", "Ashliee mid-movement in a fashion look"),
        ("Sequin hour", "Ashliee in a sequined fashion look"),
        ("Soft power", "Ashliee in a soft power fashion look"),
        ("Crown work", "Ashliee styled with statement headpiece"),
        ("Beach editorial", "Ashliee in an outdoor beach editorial"),
        ("Ladder set", "Ashliee on a location fashion set"),
        ("Crowd walk", "Ashliee walking with audience in frame"),
        ("Mirror pose", "Ashliee posing in a fashion look"),
        ("Color block", "Ashliee in a color-blocked outfit"),
        ("Satin line", "Ashliee in a satin fashion look"),
        ("Leather edge", "Ashliee in a leather-edged look"),
        ("White heat", "Ashliee in a high-contrast white look"),
        ("Blackout", "Ashliee in an all-black fashion look"),
        ("Pink lace", "Ashliee in pink lace"),
        ("Yellow flash", "Ashliee in a yellow Time Capsule look"),
        ("Orange print", "Ashliee in an orange print look"),
        ("Plaid coat", "Ashliee in a plaid coat look"),
        ("Green hat", "Ashliee in a green hat fashion look"),
        ("Maxi flow", "Ashliee in a flowing maxi look"),
        ("Mini night", "Ashliee in a night mini dress"),
        ("Two-piece set", "Ashliee in a two-piece fashion set"),
        ("Handmade", "Ashliee in a handmade fashion look"),
        ("Getty red", "Ashliee in a Getty red-carpet style look"),
        ("Time Capsule", "Ashliee in a Time Capsule fashion look"),
        ("ExquisiteU", "Ashliee on the Be ExquisiteU runway"),
        ("Sac Pro", "Ashliee at Sac Fashion Pro"),
        ("Night tulle", "Ashliee in black blazer and tulle"),
        ("Chartreuse wing", "Ashliee in chartreuse ruffle sleeves"),
        ("Crimson cut", "Ashliee in a crimson blazer editorial"),
        ("Pearl light", "Ashliee styled with pearl accents"),
        ("Smoke set", "Ashliee on a smoky editorial set"),
        ("City glass", "Ashliee against city glass and light"),
        ("Doorway", "Ashliee framed in a doorway pose"),
        ("Stair climb", "Ashliee on stairs in a fashion look"),
        ("Wind coat", "Ashliee in a windblown coat look"),
        ("Spotlight", "Ashliee caught in a spotlight"),
        ("Final walk", "Ashliee on a closing runway walk"),
    ],
    "culinary": [
        ("The plate", "A plated dish by Ashliee"),
        ("The catch", "A seafood platter"),
        ("The boil", "A seafood boil service"),
        ("Blackened", "Blackened fish with garnish"),
        ("Linguine", "Seafood pasta in red sauce"),
        ("Oven ready", "A dish prepped for the oven"),
        ("Pan sear", "Food hitting a hot pan"),
        ("Citrus finish", "A plated dish finished with citrus"),
        ("Host table", "A hosted table spread"),
        ("Family style", "A family-style serving"),
        ("Fire side", "Cooking over heat"),
        ("Fresh prep", "Fresh ingredients in prep"),
        ("Sauce work", "Sauce finishing a plate"),
        ("Shell game", "Shellfish plated for service"),
        ("Herb lift", "Herbs finishing a dish"),
        ("Night service", "A late-night plated service"),
        ("Kitchen pass", "A dish at the kitchen pass"),
        ("Guest plate", "A guest-ready plated meal"),
        ("Steam rise", "A hot dish with rising steam"),
        ("Chop board", "Prep on the cutting board"),
        ("Cast iron", "Food in a cast-iron vessel"),
        ("Glass bake", "A dish in a glass baking dish"),
        ("Red sauce", "A red-sauce pasta plate"),
        ("Lemon heat", "Citrus and heat on a plated fish"),
        ("Crab night", "A crab-forward seafood plate"),
        ("Lobster hour", "A lobster plating"),
        ("Garlic bread", "Seafood with garlic bread"),
        ("Wine side", "A plated meal with wine"),
        ("Dutch oven", "A dutch-oven boil or braise"),
        ("Market haul", "Fresh seafood and produce"),
        ("Platter pass", "A shared platter for the table"),
        ("Microgreen", "A plated dish with microgreens"),
        ("Char edge", "A dish with a charred edge"),
        ("Soft boil", "A boil service ready to pour"),
        ("Chef taste", "A tasting plate from the kitchen"),
    ],
    "cosmetology": [
        ("Soft glam", "Beauty portrait with soft glam makeup"),
        ("Lash hour", "Beauty close-up highlighting lashes"),
        ("Clean beat", "Clean beauty portrait of Ashliee"),
        ("Bold lip", "Beauty still with a bold lip"),
        ("Smoke eye", "Beauty still with smoked eye makeup"),
        ("Glow up", "Glowing beauty close-up of Ashliee"),
        ("Edge work", "Beauty portrait with sharp edges"),
        ("Studio light", "Beauty still under studio light"),
    ],
    "events": [
        ("Night presence", "Ashliee at a night event"),
        ("Brand energy", "Ashliee representing brand energy"),
        ("Crowd pulse", "Ashliee with the room at an event"),
        ("Stage side", "Ashliee stage-side at an event"),
        ("After hours", "Ashliee in an after-hours look"),
        ("Set day", "Ashliee on a production set"),
        ("Guest list", "Ashliee at a guest-list event"),
        ("Flash walk", "Ashliee caught in event flash"),
        ("Room take", "Ashliee owning the room"),
        ("Culture night", "Ashliee at a culture-forward event"),
        ("Promo hour", "Ashliee on promo duty"),
        ("Door drop", "Ashliee at an event entrance"),
    ],
}


def md5_of(path: pathlib.Path) -> str:
    return hashlib.md5(path.read_bytes()).hexdigest()


def is_jpeg(path: pathlib.Path) -> bool:
    return path.read_bytes()[:3] == b"\xff\xd8\xff"


def aspect_ok(path: pathlib.Path, album: str) -> bool:
    try:
        from PIL import Image
    except ImportError:
        return True
    band = ASPECT_BANDS.get(album)
    if not band:
        return True
    lo, hi = band
    with Image.open(path) as im:
        width, height = im.size
    if height <= 0:
        return False
    ratio = width / height
    return lo <= ratio <= hi


def file_digest(src: str) -> str | None:
    path = ROOT / src
    if not path.is_file():
        return None
    return md5_of(path)


def album_stills(album: str) -> list[pathlib.Path]:
    folder = LIBRARY / album
    if not folder.is_dir():
        return []
    return sorted(p for p in folder.glob("*.jpg") if p.is_file())


CAPTIONS_FILE = LIBRARY / "captions.json"


def load_caption_book() -> dict:
    if not CAPTIONS_FILE.is_file():
        return {"_skip": []}
    data = json.loads(CAPTIONS_FILE.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        return {"_skip": []}
    return data


def look_from_file(
    path: pathlib.Path,
    album: str,
    book: dict,
    used_captions: set[str],
    bank_index: list[int],
) -> dict[str, str] | None:
    rel_lib = f"{album}/{path.name}"
    skip = set(book.get("_skip") or [])
    if rel_lib in skip:
        return None
    entry = book.get(rel_lib) or {}
    caption = str(entry.get("caption") or "").strip()
    alt = str(entry.get("alt") or "").strip()
    if not caption:
        bank = CAPTION_BANKS.get(album) or []
        if not bank:
            return None
        idx = bank_index[0] % len(bank)
        bank_index[0] += 1
        for step in range(len(bank)):
            candidate, candidate_alt = bank[(idx + step) % len(bank)]
            if candidate not in used_captions:
                caption = candidate
                if not alt:
                    alt = candidate_alt
                break
        else:
            caption = f"{bank[idx][0]} · {path.stem}"
            if not alt:
                alt = bank[idx][1]
    if caption in used_captions:
        caption = f"{caption} · {path.stem}"
    used_captions.add(caption)
    if not alt:
        alt = f"Ashliee Moore — {caption}"
    return {
        "src": path.relative_to(ROOT).as_posix(),
        "alt": alt,
        "caption": caption,
    }


def build_pool(name: str, seen: set[str], book: dict) -> list[dict[str, str]]:
    album, _label = POOLS[name]
    pool: list[dict[str, str]] = []
    used_captions: set[str] = set()
    bank_index = [0]
    for look in CURATED[name]:
        digest = file_digest(look["src"])
        pool.append(look)
        used_captions.add(look["caption"])
        if digest:
            seen.add(digest)
    for path in album_stills(album):
        if path.stat().st_size < MIN_BYTES:
            continue
        if not is_jpeg(path):
            continue
        if not aspect_ok(path, album):
            continue
        digest = md5_of(path)
        if digest in seen:
            continue
        look = look_from_file(path, album, book, used_captions, bank_index)
        if not look:
            continue
        seen.add(digest)
        pool.append(look)
    return pool


def render(looks: dict[str, list[dict[str, str]]]) -> str:
    lines = [
        "// Pulled stills live in assets/. Add a line here after each pull. Do not hotlink Google Photos.",
        "// Regenerated by scripts/import-looks.py from assets/library (+ captions.json when present).",
        "window.AshlieeLooks = {",
    ]
    names = list(looks)
    for name in names:
        lines.append(f"  {name}: [")
        items = looks[name]
        for i, look in enumerate(items):
            comma = "," if i < len(items) - 1 else ""
            src = json.dumps(look["src"], ensure_ascii=False)
            alt = json.dumps(look["alt"], ensure_ascii=False)
            caption = json.dumps(look["caption"], ensure_ascii=False)
            lines.append("    {")
            lines.append(f"      src: {src},")
            lines.append(f"      alt: {alt},")
            lines.append(f"      caption: {caption},")
            lines.append(f"    }}{comma}")
        comma = "," if name != names[-1] else ""
        lines.append(f"  ]{comma}")
    lines.append("};")
    lines.append("")
    return "\n".join(lines)


def main() -> None:
    book = load_caption_book()
    looks = {}
    counts = {}
    for name in POOLS:
        seen: set[str] = set()
        looks[name] = build_pool(name, seen, book)
        counts[name] = len(looks[name])
    LOOKS.write_text(render(looks), encoding="utf-8")
    print("wrote", LOOKS.relative_to(ROOT))
    for name, count in counts.items():
        print(f"  {name}: {count}")
    mapped = sum(1 for k in book if k != "_skip")
    print(f"captions.json mapped: {mapped} skip: {len(book.get('_skip') or [])}")


if __name__ == "__main__":
    main()
