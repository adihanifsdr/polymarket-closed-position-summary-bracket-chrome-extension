#!/bin/bash

# Simple script to create basic icon files for the Chrome extension
# These are minimal valid PNG files

echo "Creating extension icons..."

# Create a simple 16x16 green PNG
cat > icon16.png << 'EOF'
iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAABFJREFUOI1jYBgFo2AUEAQAAQQAAakK7ZAAAAAASUVORK5CYII=
EOF

# Create a simple 48x48 green PNG  
cat > icon48.png << 'EOF'
iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABHNCSVQICAgIfAhkiAAAABFJREFUaIHt0EENADAMxMDa/ks7K+AB6SXZgMNVAQAAAMD/qgUYGBgYGBgYGBgYGBgYGBgYGBgY/m8AAAD4xwEZygIbA8D+/gAAAABJRU5ErkJggg==
EOF

# Create a simple 128x128 green PNG
cat > icon128.png << 'EOF'
iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABHNCSVQICAgIfAhkiAAAABFJREFUeJzt0EENADAMxMDa/ks7K+AB6SXZgMNVAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMD/qgUYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBj+bwAAAPhHB1iRAxvJBnxvAAAAAElFTkSuQmCC
EOF

# Decode base64 and create actual PNG files
base64 -d icon16.png.tmp > icon16.png 2>/dev/null || {
    # If base64 decode fails, create using ImageMagick or just use the HTML method
    echo "Note: Please use create-icons.html to generate icons in your browser"
    echo "Or install ImageMagick and run: convert -size 16x16 xc:#10b981 icon16.png"
    rm -f *.png.tmp
    exit 1
}

echo "✓ Icons created successfully!"
echo ""
echo "Files created:"
echo "  - icon16.png"
echo "  - icon48.png"
echo "  - icon128.png"

