#!/bin/bash
SVG_FILE="$1"

# Add the animated-mermaid-svg class
sed -i '' 's/id="my-svg"/id="my-svg" class="animated-mermaid-svg"/' "$SVG_FILE"

# Inject custom styles for colored lines and text into the SVG's style block
# Using muted colors: coral rose for 402, sage green for 200
sed -i '' 's|</style>|/* Custom MPP colors */ #my-svg .messageLine1[marker-end*="crosshead"] { stroke: #b97676 !important; } #my-svg #crosshead path { fill: #b97676 !important; stroke: #b97676 !important; } #my-svg .messageLine1[marker-end*="arrowhead"] { stroke: #5b9a76 !important; } #my-svg .note { fill: transparent !important; stroke: transparent !important; }</style>|' "$SVG_FILE"
