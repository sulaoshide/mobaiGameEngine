import React, { useState, useRef } from 'react';
import { useResource } from '../context/ResourceContext';

const AIGeneratorPanel: React.FC = () => {
  const { addSprite } = useResource();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [advanced, setAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const typeRef = useRef<HTMLSelectElement>(null);
  const styleRef = useRef<HTMLSelectElement>(null);
  const promptRef = useRef<HTMLTextAreaElement>(null);
  const apiRef = useRef<HTMLSelectElement>(null);
  const widthRef = useRef<HTMLInputElement>(null);
  const heightRef = useRef<HTMLInputElement>(null);
  const paramRef = useRef<HTMLInputElement>(null);
  const refImgRef = useRef<HTMLInputElement>(null);

  // 生成按钮点击事件
  const handleGenerate = async () => {
    setLoading(true);
    setPreviewUrl(null);
    try {
      const type = typeRef.current?.value || 'sprite';
      const style = styleRef.current?.value || 'pixel';
      const prompt = promptRef.current?.value || '';
      const api = apiRef.current?.value || 'local';
      const width = widthRef.current?.value || '512';
      const height = heightRef.current?.value || '512';
      const steps = paramRef.current?.value || '10';
      let refImgBase64 = '';
      // 参考图处理（可选）
      if (refImgRef.current && refImgRef.current.files && refImgRef.current.files[0]) {
        const file = refImgRef.current.files[0];
        refImgBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve((reader.result as string).split(',')[1]);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }
      if (api === 'local') {
        // 本地Stable Diffusion WebUI
        const sdUrl = 'http://localhost:7860/sdapi/v1/txt2img';  // 使用完整URL
        const body: any = {
          prompt: `[${type}] [${style}] ${prompt}`,
          negative_prompt: "",
          width: parseInt(width),
          height: parseInt(height),
          steps: parseInt(steps),
          sampler_name: "Euler a",
          cfg_scale: 7,
          batch_size: 1,
          enable_hr: false,
          denoising_strength: 0.7,
          restore_faces: false
        };
        if (refImgBase64) {
          body.init_images = [refImgBase64];
        }
        try {
          const res = await fetch(sdUrl, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            mode: 'cors',
            body: JSON.stringify(body)
          });
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          const data = await res.json();
          if (data.images && data.images[0]) {
            setPreviewUrl('data:image/png;base64,' + data.images[0]);
          } else {
            throw new Error('本地模型生成失败');
          }
        } catch (error) {
          console.error('API请求错误:', error);
          throw error;
        }
      } else {
        alert('暂不支持该API类型');
      }
    } catch (e: any) {
      setPreviewUrl(null);
      alert('生成失败：' + (e.message || e.toString()));
    } finally {
      setLoading(false);
    }
  };

  // 修改处理图片点击的函数
  const handleImageClick = () => {
    if (previewUrl) {
      // 使用ResourceContext的addSprite函数添加新精灵
      addSprite({
        name: 'AI生成',
        icon: 'image', // 使用image图标
        imageUrl: previewUrl // 添加图片URL
      });
      alert('已添加到精灵图资源区！');
    }
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between px-2 py-1 bg-gray-700 rounded-t cursor-default select-none">
        <span className="text-sm font-medium flex items-center">
          <i className="fas fa-robot mr-2 text-purple-400"></i>
          AI资源生成
        </span>
      </div>
      <div className="ai-generator-panel bg-gray-900 rounded-b p-2" style={{overflow:'auto'}}>
        <div className="mb-3">
          <label className="block text-xs text-gray-400 mb-1">生成类型</label>
          <select ref={typeRef} className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs">
            <option value="sprite">精灵图</option>
            <option value="background">游戏背景</option>
            <option value="character">游戏角色</option>
            <option value="tile">瓦片地图</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="block text-xs text-gray-400 mb-1">风格</label>
          <select ref={styleRef} className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs">
            <option value="pixel">像素风格</option>
            <option value="cartoon">卡通风格</option>
            <option value="realistic">写实风格</option>
            <option value="lowpoly">低多边形</option>
            <option value="anime">动漫风格</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="block text-xs text-gray-400 mb-1">提示词</label>
          <textarea ref={promptRef} className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs h-16" placeholder="描述你想要生成的资源..."></textarea>
        </div>
        <div className="mb-3">
          <label className="block text-xs text-gray-400 mb-1">API选择</label>
          <select ref={apiRef} className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs">
            <option value="openai">OpenAI DALL-E</option>
            <option value="stability">Stability AI</option>
            <option value="midjourney">Midjourney</option>
            <option value="local">本地模型</option>
          </select>
        </div>
        <div className="flex justify-between items-center mb-2">
          <button className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-sm flex items-center" onClick={handleGenerate} disabled={loading}>
            <i className="fas fa-magic mr-1"></i> {loading ? '生成中...' : '生成'}
          </button>
          <div className="flex items-center space-x-2">
            <label className="text-xs text-gray-400">高级</label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={advanced} onChange={()=>setAdvanced(v=>!v)} className="sr-only peer" />
              <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
        {/* 高级选项展开区 */}
        {advanced && (
          <div className="transition-all duration-200">
            <div className="flex space-x-2 mb-2">
              <div className="flex-1">
                <label className="block text-xs text-gray-400 mb-1">宽</label>
                <input ref={widthRef} className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs text-gray-100 focus:outline-none" defaultValue="512" />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-400 mb-1">高</label>
                <input ref={heightRef} className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs text-gray-100 focus:outline-none" defaultValue="512" />
              </div>
            </div>
            <div className="mb-2">
              <label className="block text-xs text-gray-400 mb-1">参考图</label>
              <label className="block w-full h-20 bg-[#232b3a] border border-dashed border-gray-500 rounded flex flex-col items-center justify-center cursor-pointer text-xs text-gray-400 hover:border-blue-400">
                <i className="fas fa-image text-2xl mb-1"></i>
                点击上传参考图
                <input ref={refImgRef} type="file" accept="image/*" className="hidden" />
              </label>
            </div>
            <div className="mb-2">
              <label className="block text-xs text-gray-400 mb-1">模型参数</label>
              <input ref={paramRef} type="range" min="1" max="20" defaultValue="10" className="w-full" />
            </div>
          </div>
        )}
        {/* 缩略图预览区始终可见 */}
        <div className="mt-3 ai-preview show flex items-center justify-center" style={{minHeight:100,background:'#232b3a',borderRadius:8,border:'2px dashed #60a5fa'}}>
          {previewUrl ? (
            <img 
              src={previewUrl} 
              alt="AI预览" 
              style={{
                maxWidth:96,
                maxHeight:96,
                borderRadius:8,
                boxShadow:'0 2px 8px #0005',
                cursor:'pointer'
              }}
              onClick={handleImageClick}
              title="点击添加到精灵图资源区"
            />
          ) : (
            <span className="text-xs text-blue-400 w-full text-center">{loading ? '生成中...' : '缩略图将在此处显示'}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIGeneratorPanel; 