#!/usr/bin/env bash
# Regenerate the raster brand assets from the SVG mark (public/brand/mark.svg).
# Needs rsvg-convert (librsvg) and ImageMagick 7 (`magick`).
# The social card (public/brand/og.png, 1200x630) is a screenshot of the home page's strata
# figure laid out with the brand fonts; regenerate it by hand when the brand changes.
set -euo pipefail
cd "$(dirname "$0")/../public"
tmp="$(mktemp -d)"; trap 'rm -rf "$tmp"' EXIT

# Full-bleed variant (no rounded corners) for Apple touch and maskable icons.
sed 's|<rect width="64" height="64" rx="15"/></clipPath>|<rect width="64" height="64"/></clipPath>|' brand/mark.svg > brand/mark-square.svg
cp brand/mark.svg favicon.svg

rsvg-convert -w 180 -h 180 brand/mark-square.svg -o apple-touch-icon.png
rsvg-convert -w 192 -h 192 brand/mark.svg -o brand/icon-192.png
rsvg-convert -w 512 -h 512 brand/mark.svg -o brand/icon-512.png

# Maskable: the mark inside the 80% safe zone on a full-bleed forest square.
rsvg-convert -w 410 -h 410 brand/mark-square.svg -o "$tmp/m410.png"
magick -size 512x512 xc:'#17604f' "$tmp/m410.png" -gravity center -composite brand/icon-maskable-512.png

for s in 16 32 48; do rsvg-convert -w "$s" -h "$s" brand/mark.svg -o "$tmp/f$s.png"; done
magick "$tmp/f16.png" "$tmp/f32.png" "$tmp/f48.png" favicon.ico
echo "brand assets regenerated"
