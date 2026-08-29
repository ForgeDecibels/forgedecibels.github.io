# Default recipe
default: serve

# Serve the website locally
serve port="8000":
    @echo "Serving website at http://localhost:{{port}}..."
    python3 -m http.server {{port}}

# Fetch and download Spotify cover artworks at build time
fetch-covers:
    @echo "Fetching latest Spotify artworks..."
    python3 scripts/fetch_spotify_artworks.py

# Build / verify assets
build: fetch-covers
    @echo "Build complete. All Spotify covers and assets bundled locally."
