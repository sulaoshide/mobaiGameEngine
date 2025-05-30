import torch
from flask import Flask, request, jsonify
from diffusers import StableDiffusionControlNetImg2ImgPipeline, ControlNetModel, UniPCMultistepScheduler
from PIL import Image
import io
import base64
import os

# 配置模型路径
SD_MODEL = "runwayml/stable-diffusion-v1-5"  # 或本地路径
CONTROLNET_MODEL = "lllyasviel/sd-controlnet-canny"  # 或本地路径
LORA_PATH = None  # 如有LoRA，填本地路径或None

# 初始化模型
controlnet = ControlNetModel.from_pretrained(CONTROLNET_MODEL, torch_dtype=torch.float16).to("cuda")
pipe = StableDiffusionControlNetImg2ImgPipeline.from_pretrained(
    SD_MODEL,
    controlnet=controlnet,
    torch_dtype=torch.float16
).to("cuda")
pipe.scheduler = UniPCMultistepScheduler.from_config(pipe.scheduler.config)

# 加载LoRA（如有）
if LORA_PATH:
    pipe.load_lora_weights(LORA_PATH)

app = Flask(__name__)

def b64_to_pil(img_b64):
    img_data = base64.b64decode(img_b64.split(",")[-1])
    return Image.open(io.BytesIO(img_data)).convert("RGB")

@app.route("/api/generate", methods=["POST"])
def generate():
    data = request.json
    prompt = data.get("prompt", "")
    negative_prompt = data.get("negative_prompt", "")
    control_weight = float(data.get("control_weight", 1.3))
    denoising_strength = float(data.get("denoising_strength", 0.7))
    image_b64 = data.get("image", "")
    if not image_b64:
        return jsonify({"error": "No image provided"}), 400

    # 解析草图
    init_image = b64_to_pil(image_b64)
    control_image = init_image  # 这里假设草图就是controlnet输入

    # LoRA动态加载（如有）
    lora_name = data.get("lora_name")
    lora_weight = float(data.get("lora_weight", 0.8))
    if lora_name:
        pipe.load_lora_weights(lora_name, weight=lora_weight)

    # 推理
    with torch.autocast("cuda"):
        result = pipe(
            prompt=prompt,
            negative_prompt=negative_prompt,
            image=init_image,
            control_image=control_image,
            controlnet_conditioning_scale=control_weight,
            strength=denoising_strength,
            num_inference_steps=30,
            guidance_scale=7.5
        )
    out_img = result.images[0]
    buffered = io.BytesIO()
    out_img.save(buffered, format="PNG")
    out_b64 = "data:image/png;base64," + base64.b64encode(buffered.getvalue()).decode()
    return jsonify({"output": out_b64})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3001) 