from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import requests

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5178"],  # Replace with specific frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Replace with your actual SerpAPI key
SERPAPI_KEY = "062b122798af0f5049dcc1a946fc077752f90d0fc0c12247accd0d236a0fc20b"

@app.post("/scan-image")
async def scan_image(image: UploadFile = File(...)):
    try:
        image_bytes = await image.read()

        url = "https://serpapi.com/search"
        params = {
            "engine": "google_lens",
            "api_key": SERPAPI_KEY
        }
        files = {
            "file": (image.filename, image_bytes, image.content_type)
        }

        response = requests.post(url, params=params, files=files)

        try:
            data = response.json()
        except Exception:
            return {
                "matches": [],
                "error": "SerpAPI returned invalid response.",
                "raw_response": response.text[:200]
            }

        if "error" in data:
            return {
                "matches": [],
                "error": data["error"]
            }

        matches = []
        for m in data.get("visual_matches", []):
            matches.append({
                "name": m.get("title"),
                "url": m.get("link")
            })

        return { "matches": matches }

    except Exception as e:
        return { "matches": [], "error": str(e) }
