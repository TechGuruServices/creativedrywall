from pathlib import Path
from datetime import datetime, timezone
import os

# ===== CONFIG =====
SITE_URL = "https://creativedrywall.buzz"   # Production custom domain
BUILD_DIR = Path("dist")                         # change to your build output folder
OUTPUT_FILE = BUILD_DIR / "sitemap.xml"

# File types that represent pages
PAGE_FILES = {"index.html"}

# Paths to exclude
EXCLUDE_DIRS = {".git", ".github", "assets", "static", "images", "img", "css", "js"}
EXCLUDE_FILES = {"404.html"}  # add more if needed

# SPA Section URLs to include (hash-based navigation)
SECTION_URLS = [
    {"path": "#services", "priority": "0.9", "changefreq": "monthly"},
    {"path": "#about", "priority": "0.8", "changefreq": "monthly"},
    {"path": "#gallery", "priority": "0.7", "changefreq": "monthly"},
    {"path": "#quote-calculator", "priority": "0.8", "changefreq": "monthly"},
    {"path": "#contact", "priority": "0.9", "changefreq": "monthly"},
    {"path": "#service-area-missoula", "priority": "0.9", "changefreq": "monthly"},
]

def iso_date_from_mtime(path: Path) -> str:
    ts = path.stat().st_mtime
    return datetime.fromtimestamp(ts, tz=timezone.utc).date().isoformat()

def get_today_iso() -> str:
    return datetime.now(tz=timezone.utc).date().isoformat()

def url_from_path(html_path: Path) -> str:
    # dist/services/index.html -> /services/
    rel = html_path.relative_to(BUILD_DIR)
    parts = rel.parts

    # root index.html
    if rel.name == "index.html" and len(parts) == 1:
        return SITE_URL.rstrip("/") + "/"

    # folder index.html
    if rel.name == "index.html":
        folder = "/".join(parts[:-1])
        return SITE_URL.rstrip("/") + "/" + folder.strip("/") + "/"

    # non-index html: dist/about.html -> /about.html (usually you don't want these for pretty URLs)
    return SITE_URL.rstrip("/") + "/" + "/".join(parts)

def should_skip(path: Path) -> bool:
    if path.name in EXCLUDE_FILES:
        return True
    for part in path.parts:
        if part in EXCLUDE_DIRS:
            return True
    return False

def main():
    if not BUILD_DIR.exists():
        raise SystemExit(f"BUILD_DIR not found: {BUILD_DIR.resolve()}")

    urls = []
    today = get_today_iso()
    
    for root, dirs, files in os.walk(BUILD_DIR):
        root_path = Path(root)

        # prune excluded dirs
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]

        for f in files:
            p = root_path / f
            if should_skip(p):
                continue
            if f.lower() in PAGE_FILES:
                loc = url_from_path(p)
                lastmod = iso_date_from_mtime(p)
                urls.append({"loc": loc, "lastmod": lastmod, "priority": "1.0", "changefreq": "weekly"})

    # Add SPA section URLs
    for section in SECTION_URLS:
        urls.append({
            "loc": SITE_URL + "/" + section["path"],
            "lastmod": today,
            "priority": section["priority"],
            "changefreq": section["changefreq"]
        })

    # Sort by loc
    urls = sorted(urls, key=lambda x: x["loc"])

    xml_lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]
    for url in urls:
        xml_lines += [
            "  <url>",
            f"    <loc>{url['loc']}</loc>",
            f"    <lastmod>{url['lastmod']}</lastmod>",
            f"    <changefreq>{url['changefreq']}</changefreq>",
            f"    <priority>{url['priority']}</priority>",
            "  </url>",
        ]
    xml_lines.append("</urlset>")
    OUTPUT_FILE.write_text("\n".join(xml_lines) + "\n", encoding="utf-8")

    print(f"Wrote {OUTPUT_FILE} with {len(urls)} URLs")

if __name__ == "__main__":
    main()
