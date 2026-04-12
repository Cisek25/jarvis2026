#!/usr/bin/env python3
"""
IdoBooking Website Generator
Reads config.json → produces DO_WKLEJENIA/ with ready-to-paste files.

Usage:
    python generate.py path/to/config.json
    python generate.py MountainPrestige/config.json --output MountainPrestige/DO_WKLEJENIA
"""

import json
import os
import re
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent
TEMPLATES_DIR = SCRIPT_DIR / "templates"


def hex_to_rgb(hex_color: str) -> str:
    """Convert #RRGGBB to 'R,G,B'."""
    h = hex_color.lstrip("#")
    return f"{int(h[0:2], 16)},{int(h[2:4], 16)},{int(h[4:6], 16)}"


def darken_hex(hex_color: str, amount: int = 20) -> str:
    """Darken a hex color by reducing RGB values."""
    h = hex_color.lstrip("#")
    r = max(0, int(h[0:2], 16) - amount)
    g = max(0, int(h[2:4], 16) - amount)
    b = max(0, int(h[4:6], 16) - amount)
    return f"#{r:02X}{g:02X}{b:02X}"


def lighten_hex(hex_color: str, amount: int = 20) -> str:
    """Lighten a hex color by increasing RGB values."""
    h = hex_color.lstrip("#")
    r = min(255, int(h[0:2], 16) + amount)
    g = min(255, int(h[2:4], 16) + amount)
    b = min(255, int(h[4:6], 16) + amount)
    return f"#{r:02X}{g:02X}{b:02X}"


def build_replacements(config: dict) -> dict:
    """Build the full placeholder → value mapping from config."""
    p = config["palette"]
    f = config["fonts"]
    h = config.get("hero", {})
    prefix = config["prefix"]

    # Auto-generate missing palette values
    accent_rgb = p.get("accent_rgb") or hex_to_rgb(p["accent"])
    text_soft = p.get("text_soft") or lighten_hex(p["text"], 32)
    text_muted = p.get("text_muted") or lighten_hex(p["text"], 64)
    text_light = p.get("text_light") or lighten_hex(p["text"], 112)
    cream2 = p.get("cream2") or darken_hex(p["cream"], 10)
    cream3 = p.get("cream3") or darken_hex(p["cream"], 24)
    dark2 = p.get("dark2") or darken_hex(p["dark"], 12)

    dark_rgb = hex_to_rgb(p["dark"])

    return {
        "{{PREFIX}}": prefix,
        "{{BRAND}}": config["brand"],
        "{{CLIENT_ID}}": config.get("client_id", ""),
        "{{ENGINE_URL}}": config.get("engine_url", f"client{config.get('client_id', '')}.idosell.com"),

        # Palette
        "{{COLOR_WHITE}}": p["white"],
        "{{COLOR_CREAM}}": p["cream"],
        "{{COLOR_CREAM2}}": cream2,
        "{{COLOR_CREAM3}}": cream3,
        "{{COLOR_ACCENT}}": p["accent"],
        "{{COLOR_ACCENT_LIGHT}}": p["accent_light"],
        "{{COLOR_ACCENT_DARK}}": p["accent_dark"],
        "{{COLOR_ACCENT_RGB}}": accent_rgb,
        "{{COLOR_TEXT}}": p["text"],
        "{{COLOR_TEXT_SOFT}}": text_soft,
        "{{COLOR_TEXT_MUTED}}": text_muted,
        "{{COLOR_TEXT_LIGHT}}": text_light,
        "{{COLOR_DARK}}": p["dark"],
        "{{COLOR_DARK2}}": dark2,
        "{{COLOR_DARK_RGB}}": dark_rgb,

        # Fonts
        "{{FONT_HEAD}}": f["heading"],
        "{{FONT_BODY}}": f["body"],
        "{{FONT_IMPORT}}": f["google_import"],

        # Hero
        "{{HERO_SUBTITLE_PL}}": h.get("subtitle_pl", "Apartamenty Premium"),
        "{{HERO_SUBTITLE_EN}}": h.get("subtitle_en", "Premium Apartments"),
        "{{HERO_TITLE_HTML}}": h.get("title_html", f"<strong>{config['brand']}</strong>"),
        "{{HERO_CTA1_TEXT_PL}}": h.get("cta1_text_pl", "NASZE APARTAMENTY"),
        "{{HERO_CTA1_TEXT_EN}}": h.get("cta1_text_en", "OUR APARTMENTS"),
        "{{HERO_CTA1_HREF}}": h.get("cta1_href", "/offers"),
        "{{HERO_CTA2_TEXT_PL}}": h.get("cta2_text_pl", "ODKRYJ"),
        "{{HERO_CTA2_TEXT_EN}}": h.get("cta2_text_en", "DISCOVER"),
        "{{HERO_CTA2_HREF}}": h.get("cta2_href", f"#{prefix}-about"),

        # Nav & booking
        "{{NAV_BOOK_TEXT_PL}}": config.get("nav_book_text_pl", "REZERWUJ"),
        "{{NAV_BOOK_TEXT_EN}}": config.get("nav_book_text_en", "BOOK"),
        "{{NAV_BOOK_HREF}}": config.get("nav_book_href", "/offers"),
        "{{BOOKING_URL}}": config.get("booking", {}).get("url", "/offers"),

        # Featured offers
        "{{FEATURED_HEADING_PL}}": config.get("featured_offers", {}).get("heading_pl", "Nasze apartamenty"),
        "{{FEATURED_HEADING_EN}}": config.get("featured_offers", {}).get("heading_en", "Our Apartments"),
        "{{FEATURED_SUBTITLE_PL}}": config.get("featured_offers", {}).get("subtitle_pl", ""),
        "{{FEATURED_SUBTITLE_EN}}": config.get("featured_offers", {}).get("subtitle_en", ""),

        # Contact
        "{{PHONE}}": config.get("contact", {}).get("phone", ""),
        "{{EMAIL}}": config.get("contact", {}).get("email", ""),
    }


def apply_replacements(template: str, replacements: dict) -> str:
    """Replace all {{PLACEHOLDER}} occurrences in template."""
    result = template
    for key, value in replacements.items():
        result = result.replace(key, value)
    return result


def check_remaining_placeholders(content: str, filename: str) -> list:
    """Find any unreplaced {{...}} placeholders."""
    remaining = re.findall(r"\{\{[A-Z_]+\}\}", content)
    if remaining:
        unique = sorted(set(remaining))
        print(f"  WARNING: {filename} has unreplaced placeholders: {', '.join(unique)}")
    return remaining


def generate(config_path: str, output_dir: str = None):
    """Main generation function."""
    config_path = Path(config_path)
    if not config_path.exists():
        print(f"ERROR: Config not found: {config_path}")
        sys.exit(1)

    with open(config_path, "r", encoding="utf-8") as f:
        config = json.load(f)

    prefix = config["prefix"]
    brand = config["brand"]

    # Output directory
    if output_dir:
        out = Path(output_dir)
    else:
        out = config_path.parent / "DO_WKLEJENIA"
    out.mkdir(parents=True, exist_ok=True)

    replacements = build_replacements(config)

    print(f"\n  IdoBooking Generator")
    print(f"  Brand:  {brand}")
    print(f"  Prefix: {prefix}-")
    print(f"  Output: {out}\n")

    # Template → output file mapping
    file_map = {
        "CSS_BASE.css": "CSS_EDYTOR.css",
        "JS_BASE.html": "KONIEC_BODY.html",
        "HOMEPAGE_BASE.html": f"GLOWNA_PL__body_top.html",
        "META_SEO.html": "META_SEO.html",
        "INSTRUKCJA_BASE.txt": "INSTRUKCJA.txt",
    }

    total_warnings = 0
    for template_name, output_name in file_map.items():
        template_path = TEMPLATES_DIR / template_name
        if not template_path.exists():
            print(f"  SKIP: Template not found: {template_name}")
            continue

        with open(template_path, "r", encoding="utf-8") as f:
            content = f.read()

        content = apply_replacements(content, replacements)
        warnings = check_remaining_placeholders(content, output_name)
        total_warnings += len(warnings)

        output_path = out / output_name
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(content)

        lines = content.count("\n") + 1
        print(f"  OK  {output_name} ({lines} lines)")

    print(f"\n  Done! {len(file_map)} files generated.")
    if total_warnings:
        print(f"  {total_warnings} unreplaced placeholders — check config.json")
    else:
        print(f"  All placeholders resolved.")
    print()


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python generate.py <config.json> [--output <dir>]")
        sys.exit(1)

    config_file = sys.argv[1]
    output = None
    if "--output" in sys.argv:
        idx = sys.argv.index("--output")
        if idx + 1 < len(sys.argv):
            output = sys.argv[idx + 1]

    generate(config_file, output)
