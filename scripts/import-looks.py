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

CURATED = {
    "hero": [
        {
            "src": "assets/hero.jpg",
            "alt": "Editorial portrait of Ashliee Moore surrounded by red roses",
            "caption": "Look 01 — Roses",
        },
        {
            "src": "assets/fashion-06.jpg",
            "alt": "Ashliee in a chartreuse gown with oversized ruffle sleeves",
            "caption": "Look 02 — Chartreuse",
        },
        {
            "src": "assets/fashion-04.jpg",
            "alt": "Ashliee in a crimson blazer editorial with crystal jewelry",
            "caption": "Look 03 — Crimson",
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
            "alt": "Ashliee in a chartreuse gown with oversized ruffle sleeves",
            "caption": "Chartreuse",
        },
        {
            "src": "assets/fashion-07.jpg",
            "alt": "Ashliee peeking over a chartreuse ruffle sleeve on the runway",
            "caption": "Over the ruffle",
        },
        {
            "src": "assets/fashion-04.jpg",
            "alt": "Ashliee in a crimson blazer editorial with crystal jewelry",
            "caption": "Crimson hour",
        },
        {
            "src": "assets/runway-02.jpg",
            "alt": "Ashliee in a two-piece fashion look",
            "caption": "Two-piece",
        },
        {
            "src": "assets/runway-03.jpg",
            "alt": "Ashliee in a colorful evening mini dress on a city night street",
            "caption": "City night",
        },
        {
            "src": "assets/runway-04.jpg",
            "alt": "Ashliee styled in handmade fashion for Sac Fashion Pro",
            "caption": "Sac Fashion Pro",
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
            "alt": "Black and white portrait of Ashliee with graphic square jewelry",
            "caption": "Dice & ink",
        },
        {
            "src": "assets/profile.jpg",
            "alt": "Beauty close-up of Ashliee in a grey fur hat",
            "caption": "Fur hour",
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
            "alt": "Ashliee representing LiBush Africa fashion and culture",
            "caption": "LiBush Africa",
        },
        {
            "src": "assets/scene-02.jpg",
            "alt": "Ashliee at a birthday-themed night event look",
            "caption": "Night presence",
        },
        {
            "src": "assets/scene-03.jpg",
            "alt": "Studio portrait collaboration with VVS Studios in downtown Sacramento",
            "caption": "VVS Studios",
        },
        {
            "src": "assets/scene-04.jpg",
            "alt": "Ashliee in a pink lace dress during a sunset shoot",
            "caption": "Sunset editorial",
        },
    ],
}

POOLS = {
    "hero": ("fashion", "Look"),
    "runway": ("fashion", "Look"),
    "glam": ("cosmetology", "Glam"),
    "tasting": ("culinary", "Plate"),
    "scene": ("events", "Scene"),
}


def md5_of(path: pathlib.Path) -> str:
    return hashlib.md5(path.read_bytes()).hexdigest()


def is_jpeg(path: pathlib.Path) -> bool:
    return path.read_bytes()[:3] == b"\xff\xd8\xff"


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


def look_from_file(path: pathlib.Path, label: str) -> dict[str, str]:
    rel = path.relative_to(ROOT).as_posix()
    caption = f"{label} {path.stem}"
    return {
        "src": rel,
        "alt": f"Ashliee Moore — {caption}",
        "caption": caption,
    }


def build_pool(name: str, seen: set[str]) -> list[dict[str, str]]:
    album, label = POOLS[name]
    pool: list[dict[str, str]] = []
    for look in CURATED[name]:
        digest = file_digest(look["src"])
        pool.append(look)
        if digest:
            seen.add(digest)
    for path in album_stills(album):
        if path.stat().st_size < MIN_BYTES:
            continue
        if not is_jpeg(path):
            continue
        digest = md5_of(path)
        if digest in seen:
            continue
        seen.add(digest)
        pool.append(look_from_file(path, label))
    return pool


def render(looks: dict[str, list[dict[str, str]]]) -> str:
    lines = [
        "// Pulled stills live in assets/. Add a line here after each pull. Do not hotlink Google Photos.",
        "// Regenerated by scripts/import-looks.py from assets/library.",
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
    looks = {}
    counts = {}
    for name in POOLS:
        # Hero and runway share fashion stills; glam/tasting/scene stay distinct.
        seen: set[str] = set()
        looks[name] = build_pool(name, seen)
        counts[name] = len(looks[name])
    LOOKS.write_text(render(looks), encoding="utf-8")
    print("wrote", LOOKS.relative_to(ROOT))
    for name, count in counts.items():
        print(f"  {name}: {count}")


if __name__ == "__main__":
    main()
