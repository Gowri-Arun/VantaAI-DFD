from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from transformers import AutoImageProcessor, SiglipForImageClassification
from PIL import Image
import io
import torch
import requests

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://vanta-ai-eight.vercel.app","http://localhost:5173",'https://vanta-ai-dfd.vercel.app'],  # Change to frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load deepfake detection model
model_name = "prithivMLmods/deepfake-detector-model-v1"
model = SiglipForImageClassification.from_pretrained(model_name)
processor = AutoImageProcessor.from_pretrained(model_name)

# SerpAPI key for reverse search
SERPAPI_KEY = "062b122798af0f5049dcc1a946fc077752f90d0fc0c12247accd0d236a0fc20b"  # Replace with actual key

@app.post("/analyze")
async def analyze_image(file: UploadFile = File(...)):
    image = Image.open(io.BytesIO(await file.read())).convert("RGB")
    inputs = processor(images=image, return_tensors="pt")
    with torch.no_grad():
        outputs = model(**inputs)
        probs = torch.nn.functional.softmax(outputs.logits, dim=1).squeeze().tolist()

    is_deepfake = probs[0] > probs[1]
    confidence = max(probs)

    return {
        "isDeepfake": is_deepfake,
        "confidence": round(confidence, 3),
        "details": "Deepfake detected with high probability." if is_deepfake else "Image appears to be authentic."
    }

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

        return {"matches": matches}

    except Exception as e:
        return {"matches": [], "error": str(e)}
