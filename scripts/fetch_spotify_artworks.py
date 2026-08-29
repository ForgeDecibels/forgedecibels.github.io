import urllib.request
import urllib.parse
import json
import re
import os
import ssl

ssl_context = ssl._create_unverified_context()
covers_dir = "/Users/diegogallardogarcia/repos/forgedecibels.github.io/assets/covers"
os.makedirs(covers_dir, exist_ok=True)

headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Referer": "https://open.spotify.com/"
}

# 1. Fetch artist page to parse tracks and images
artist_url = "https://open.spotify.com/artist/17yZYUD9pmHQQY6EHbY4oq"
try:
    req = urllib.request.Request(artist_url, headers=headers)
    with urllib.request.urlopen(req, timeout=15, context=ssl_context) as resp:
        html = resp.read().decode('utf-8')
        print(f"Fetched Spotify Artist Page: {len(html)} bytes")
except Exception as e:
    print(f"Error fetching artist page: {e}")
    html = ""

# Track list we want to cover
tracks = [
    {"slug": "luna_vem", "title": "LUNA VEM", "spotify": "https://open.spotify.com/track/4US0uzr5PYVZ0nltbPelfD"},
    {"slug": "deyos", "title": "DEYOS", "spotify": "https://open.spotify.com/track/4US0uzr5PYVZ0nltbPelfD"},
    {"slug": "grimdor", "title": "GRIMDOR", "spotify": "https://open.spotify.com/album/0BFMbEyBI2SWsiw6zjs8bn"},
    {"slug": "montagem_sakura", "title": "MONTAGEM SAKURA", "spotify": "https://open.spotify.com/album/0BFMbEyBI2SWsiw6zjs8bn"},
    {"slug": "sento_comi", "title": "SENTO COMI", "spotify": "https://open.spotify.com/track/4US0uzr5PYVZ0nltbPelfD"},
    {"slug": "fluir", "title": "FLUIR!", "spotify": "https://open.spotify.com/album/0BFMbEyBI2SWsiw6zjs8bn"}
]

# Find all Spotify CDN image URLs in the artist page HTML
cdn_images = re.findall(r'https://image-cdn-[a-z0-9]+\.spotifycdn\.com/image/[a-zA-Z0-9]+', html)
unique_images = list(dict.fromkeys(cdn_images))
print(f"Found {len(unique_images)} unique Spotify images on artist page:")
for u in unique_images:
    print(" ->", u)

# Also fetch via oEmbed
image_headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Referer": "https://open.spotify.com/"
}

# Download direct images
for idx, img_url in enumerate(unique_images):
    try:
        out_file = os.path.join(covers_dir, f"spotify_art_{idx + 1}.jpg")
        req_img = urllib.request.Request(img_url, headers=image_headers)
        with urllib.request.urlopen(req_img, timeout=15, context=ssl_context) as img_resp:
            with open(out_file, "wb") as f:
                f.write(img_resp.read())
        print(f"Saved: {out_file}")
    except Exception as e:
        print(f"Failed to save {img_url}: {e}")

# Fetch specific track oEmbed
for t in tracks:
    oembed_url = f"https://open.spotify.com/oembed?url={t['spotify']}"
    try:
        req_oe = urllib.request.Request(oembed_url, headers=headers)
        with urllib.request.urlopen(req_oe, timeout=15, context=ssl_context) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            img_url = data.get("thumbnail_url")
            if img_url:
                out_path = os.path.join(covers_dir, f"{t['slug']}.jpg")
                req_img = urllib.request.Request(img_url, headers=image_headers)
                with urllib.request.urlopen(req_img, timeout=15, context=ssl_context) as img_resp:
                    with open(out_path, "wb") as f:
                        f.write(img_resp.read())
                print(f"Saved track cover: {out_path} ({data.get('title')})")
    except Exception as ex:
        print(f"Error for {t['slug']}: {ex}")

print("Build-time Spotify artwork fetch completed.")
