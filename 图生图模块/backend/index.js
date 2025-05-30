import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.post("/api/generate", async (req, res) => {
  const { image, prompt, negative_prompt, control_weight, denoising_strength } = req.body;
  try {
    // 调用本地SD WebUI的ControlNet接口
    const response = await fetch("http://127.0.0.1:7860/sdapi/v1/img2img", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        negative_prompt,
        init_images: [image],
        denoising_strength: denoising_strength ?? 0.7,
        alwayson_scripts: {
          controlnet: {
            args: [
              {
                input_image: image,
                module: "canny",
                model: "control_canny-fp16 [e3fe7712]", // 你可以根据实际模型名称调整
                weight: control_weight ?? 1.3
              }
            ]
          }
        }
      })
    });
    const data = await response.json();
    if (data.images && data.images[0]) {
      res.json({ output: "data:image/png;base64," + data.images[0] });
    } else {
      res.status(500).json({ error: "本地SD未返回图片", detail: data });
    }
  } catch (err) {
    res.status(500).json({ error: "本地SD生成失败", detail: err.message });
  }
});

app.listen(3001, () => console.log("后端API服务已启动，端口3001")); 