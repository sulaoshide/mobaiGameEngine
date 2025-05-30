// ai-generate.js
// AI图片生成API调用与本地缓存

// TODO: 实现AI图片生成API请求、结果缓存、与资源管理器集成 

// 工具函数：显示提示
function showAIMsg(msg, type = 'info') {
    alert(msg); // 可替换为更美观的弹窗
}

// 渲染缩略图到预览区
function renderAIPreview(imgUrl) {
    const preview = document.getElementById('ai-preview');
    const placeholder = document.getElementById('ai-preview-placeholder');
    preview.innerHTML = '';
    const img = document.createElement('img');
    img.src = imgUrl;
    img.style.maxWidth = '96px';
    img.style.maxHeight = '96px';
    img.style.borderRadius = '8px';
    img.style.boxShadow = '0 2px 8px #0005';
    img.style.cursor = 'pointer';
    img.title = '点击添加到精灵图资源区';
    img.onclick = function() {
        addSpriteToResource(imgUrl);
        showAIMsg('已添加到精灵图资源区！', 'success');
    };
    preview.appendChild(img);
    preview.classList.add('show');
    if (placeholder) placeholder.style.display = 'none';
}

// 添加图片到精灵图资源区
function addSpriteToResource(imgUrl) {
    const list = document.getElementById('sprites-list');
    const div = document.createElement('div');
    div.className = 'bg-gray-700 rounded-lg p-1 cursor-pointer hover:bg-gray-600 flex flex-col items-center sprite-item';
    div.innerHTML = `<div class="h-12 w-12 rounded flex items-center justify-center mb-1" style="background:#222;"><img src="${imgUrl}" style="max-width:100%;max-height:100%;border-radius:6px;"></div><p class="text-xs truncate text-center">AI生成</p>`;
    list.appendChild(div);
}

// AI图片生成主逻辑
async function generateAIImage() {
    const type = document.getElementById('ai-gen-type').value;
    const style = document.getElementById('ai-gen-style').value;
    const prompt = document.getElementById('ai-prompt').value;
    const api = document.getElementById('ai-api').value;
    const width = document.getElementById('ai-width') ? document.getElementById('ai-width').value : 512;
    const height = document.getElementById('ai-height') ? document.getElementById('ai-height').value : 512;
    const preview = document.getElementById('ai-preview');
    const placeholder = document.getElementById('ai-preview-placeholder');
    preview.innerHTML = '<span class="text-xs text-gray-400">正在生成...</span>';
    if (placeholder) placeholder.style.display = 'none';

    let imgUrl = '';
    try {
        if (api === 'openai') {
            // 需用户自行填写API Key
            const apiKey = window.OPENAI_API_KEY || prompt('请输入OpenAI API Key:');
            if (!apiKey) throw new Error('未提供API Key');
            const res = await fetch('https://api.openai.com/v1/images/generations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + apiKey
                },
                body: JSON.stringify({
                    prompt: `[${type}] [${style}] ${prompt}`,
                    n: 1,
                    size: `${width}x${height}`
                })
            });
            const data = await res.json();
            if (data.data && data.data[0] && data.data[0].url) {
                imgUrl = data.data[0].url;
            } else {
                throw new Error('OpenAI生成失败: ' + (data.error?.message || '未知错误'));
            }
        } else if (api === 'local') {
            // 本地Stable Diffusion WebUI
            const sdUrl = '/sdapi/v1/txt2img';
            const body = {
                prompt: `[${type}] [${style}] ${prompt}`,
                width: parseInt(width),
                height: parseInt(height),
                steps: 20,
                sampler_index: 'Euler',
                cfg_scale: 7
            };
            const res = await fetch(sdUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await res.json();
            if (data.images && data.images[0]) {
                imgUrl = 'data:image/png;base64,' + data.images[0];
            } else {
                throw new Error('本地模型生成失败');
            }
        } else {
            throw new Error('暂不支持该API类型');
        }
        renderAIPreview(imgUrl);
    } catch (e) {
        preview.innerHTML = '';
        if (placeholder) placeholder.style.display = '';
        showAIMsg('生成失败：' + e.message, 'error');
    }
}

// 事件绑定
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        const btn = document.getElementById('ai-generate-btn');
        if (btn) btn.onclick = generateAIImage;
    });
} 