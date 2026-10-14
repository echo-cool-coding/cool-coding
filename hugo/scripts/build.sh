#!/bin/bash
# Build the site into hugo/public (pages + Pagefind search index).
#   HUGO=/path/to/hugo hugo/scripts/build.sh
# Needs Python 3 with PyYAML, Node.js, and `npm ci` (or `npm install`) run once in hugo/ for Pagefind.
set -euo pipefail
cd "$(dirname "$0")/.."
python3 scripts/convert.py
mkdir -p data
node scripts/site_config.mjs > data/site.json
rm -rf public
"${HUGO:-hugo}" --gc --minify --logLevel warn
node scripts/search_index.mjs public
n=$(find public -name index.html | wc -l)
echo "built $n pages"
# A template error in one partial can leave public/ almost empty; never let that reach a deploy.
if [ "$n" -lt 19000 ]; then echo "error: expected over 19000 pages" >&2; exit 1; fi
