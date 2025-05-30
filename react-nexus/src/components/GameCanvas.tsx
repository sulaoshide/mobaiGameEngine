import React, { useRef, useEffect, useState } from 'react';
import DraggableSprite from './DraggableSprite';

interface GameCanvasProps {
  showGrid: boolean;
  showGuides: boolean;
  gridSize: number;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ showGrid, showGuides, gridSize }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [sprites, setSprites] = useState([
    {
      id: '1',
      imageUrl: '/path/to/your/image.png',
      initialX: 100,
      initialY: 100,
      initialWidth: 100,
      initialHeight: 100,
    },
    // 添加更多精灵...
  ]);

  // 绘制网格
  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    if (!showGrid) return;
    
    const { width, height } = ctx.canvas;
    ctx.strokeStyle = '#232b39';
    ctx.lineWidth = 0.5;

    // 绘制垂直线
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // 绘制水平线
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  // 处理精灵变换
  const handleSpriteTransform = (id: string, transform: { x: number; y: number; width: number; height: number }) => {
    setSprites(sprites.map(sprite => 
      sprite.id === id ? { ...sprite, ...transform } : sprite
    ));
  };

  return (
    <div className="flex-1 relative overflow-hidden bg-[#181e29]">
      {/* 工具栏 */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-[#181e29] border-b border-[#232b39] flex items-center px-4">
        <div className="flex space-x-2">
          <button className="text-white text-xs px-2 py-1 rounded hover:bg-[#232b39]">
            <i className="fas fa-mouse-pointer mr-1"></i>选择
          </button>
          <button className="text-white text-xs px-2 py-1 rounded hover:bg-[#232b39]">
            <i className="fas fa-vector-square mr-1"></i>矩形
          </button>
          <button className="text-white text-xs px-2 py-1 rounded hover:bg-[#232b39]">
            <i className="fas fa-circle mr-1"></i>圆形
          </button>
          <button className="text-white text-xs px-2 py-1 rounded hover:bg-[#232b39]">
            <i className="fas fa-font mr-1"></i>文本
          </button>
        </div>
      </div>

      {/* 画布区域 */}
      <div 
        ref={canvasRef}
        className="absolute top-8 left-0 right-0 bottom-0 overflow-auto"
        style={{
          background: showGrid ? 'linear-gradient(to right, #232b39 1px, transparent 1px), linear-gradient(to bottom, #232b39 1px, transparent 1px)' : 'none',
          backgroundSize: `${gridSize}px ${gridSize}px`,
        }}
      >
        {/* 精灵列表 */}
        {sprites.map(sprite => (
          <DraggableSprite
            key={sprite.id}
            imageUrl={sprite.imageUrl}
            initialX={sprite.initialX}
            initialY={sprite.initialY}
            initialWidth={sprite.initialWidth}
            initialHeight={sprite.initialHeight}
            onTransform={(transform) => handleSpriteTransform(sprite.id, transform)}
            snapToGrid={showGrid}
            gridSize={gridSize}
          />
        ))}

        {/* 辅助线 */}
        {showGuides && (
          <>
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-blue-500 opacity-50"></div>
            <div className="absolute top-1/2 left-0 right-0 h-px bg-blue-500 opacity-50"></div>
          </>
        )}
      </div>

      {/* 缩放控制 */}
      <div className="absolute bottom-4 right-4 flex items-center space-x-2 bg-[#232b39] rounded px-2 py-1">
        <button 
          className="text-white text-xs"
          onClick={() => setScale(scale => Math.max(0.25, scale - 0.25))}
        >
          -
        </button>
        <span className="text-white text-xs">{Math.round(scale * 100)}%</span>
        <button 
          className="text-white text-xs"
          onClick={() => setScale(scale => Math.min(2, scale + 0.25))}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default GameCanvas; 