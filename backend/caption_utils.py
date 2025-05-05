import base64
import io
import json
import requests
from PIL import Image, ImageDraw, ImageFont

def generate_caption(image: Image.Image) -> str:
    buffered = io.BytesIO()
    image.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode()

    payload = {
        "model": "llava",
        "prompt": "Generate a caption for this image",
        "images": [img_str]
    }

    try:
        response = requests.post("http://localhost:11434/api/generate", json=payload)
        response.raise_for_status()
    except Exception as e:
        return f"Error: {e}"

    captions = []
    for line in response.text.strip().split("\n"):
        try:
            data = json.loads(line)
            if "response" in data:
                captions.append(data["response"])
        except:
            continue

    return "".join(captions).strip()

from PIL import ImageDraw, ImageFont

def overlay_caption(image, caption):
    draw = ImageDraw.Draw(image)
    font = ImageFont.truetype("arial.ttf", size=24)

    # Get text size using textbbox instead of textsize
    text_bbox = draw.textbbox((0, 0), caption, font=font)
    text_width = text_bbox[2] - text_bbox[0]
    text_height = text_bbox[3] - text_bbox[1]

    # Position the caption at the bottom center
    x = (image.width - text_width) / 2
    y = image.height - text_height - 10

    # Draw semi-transparent rectangle for better visibility
    rectangle_xy = [(x - 10, y - 5), (x + text_width + 10, y + text_height + 5)]
    draw.rectangle(rectangle_xy, fill=(0, 0, 0, 180))  # Semi-transparent black

    # Draw text
    draw.text((x, y), caption, font=font, fill=(255, 255, 255))

    return image
