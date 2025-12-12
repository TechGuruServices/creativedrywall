from pathlib import Path
from datetime import datetime, timezone
import os

# ===== CONFIG =====
SITE_URL = "https://creativedrywall.pages.dev"   # change if you add a custom domain
BUILD_DIR = Path("dist")                         # change to your build output folder
OUTPUT_FILE = BUILD_DIR / "sitemap.xml"

# File types that represent pages
PAGE_FILES = {"index.html"}

# Paths to exclude
EXCLUDE_DIRS = {".git", ".github", "assets", "static", "images", "img", "css", "js"}
EXCLUDE_FILES = {"404.html"}  # add more if needed

def iso_date_from_mtime(path: Path) -> str:
    ts = path.stat().st_mtime
    return datetime.fromtimestamp(ts, tz=timezone.utc).date().isoformat()

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
                urls.append((loc, lastmod))

    urls = sorted(set(urls), key=lambda x: x[0])

    xml_lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">',
    ]
    for loc, lastmod in urls:
        xml_lines += [
            "  <url>",
            f"    <loc>{loc}</loc>",
            f"    <lastmod>{lastmod}</lastmod>",
            "  </url>",
        ]
    xml_lines.append("</urlset>")
    OUTPUT_FILE.write_text("\n".join(xml_lines) + "\n", encoding="utf-8")

    print(f"Wrote {OUTPUT_FILE} with {len(urls)} URLs")

if __name__ == "__main__":
    main()