from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from caption_utils import generate_caption, overlay_caption
from PIL import Image
import io
import base64

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/generate-caption")
async def generate_caption_api(image: UploadFile = File(...)):
    img_bytes = await image.read()
    img = Image.open(io.BytesIO(img_bytes)).convert("RGB")

    caption = generate_caption(img)
    captioned_img = overlay_caption(img, caption)

    buffered = io.BytesIO()
    captioned_img.save(buffered, format="JPEG")
    img_base64 = base64.b64encode(buffered.getvalue()).decode()

    return JSONResponse(content={
        "caption": caption,
        "captioned_image": f"data:image/jpeg;base64,{img_base64}"
    })
