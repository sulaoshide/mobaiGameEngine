import React, { useRef, useState } from 'react';
import DraggableSprite from './DraggableSprite';
import { useResource, Sprite } from '../context/ResourceContext';

interface GameViewportProps {
  onSpriteTransform?: (transform: { x: number; y: number; width: number; height: number }) => void;
  showGrid: boolean;
  showGuides: boolean;
  snapToGrid?: boolean;
  gridSize?: number;
}

// 辅助线类型
interface Guides {
  vertical: number[];
  horizontal: number[];
}

const GameViewport: React.FC<GameViewportProps> = ({ 
  onSpriteTransform,
  showGrid,
  showGuides,
  snapToGrid = true,
  gridSize = 20
}) => {
  // 全局资源
  const { sprites, addSprite } = useResource();
  const [guides, setGuides] = useState<Guides>({ vertical: [], horizontal: [] });
  const viewportRef = useRef<HTMLDivElement>(null);

  // 拖放处理
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    try {
      const spriteData = JSON.parse(e.dataTransfer.getData('spriteData'));
      if (viewportRef.current) {
        const rect = viewportRef.current.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        // 网格对齐
        if (snapToGrid) {
          x = Math.round(x / gridSize) * gridSize;
          y = Math.round(y / gridSize) * gridSize;
        }
        // 添加到全局资源
        addSprite({
          name: spriteData.name || '新精灵',
          icon: 'image',
          imageUrl: spriteData.imageUrl,
          x,
          y,
          width: 100,
          height: 100
        });
        // 通知外部
        onSpriteTransform?.({ x, y, width: 100, height: 100 });
      }
    } catch (error) {
      console.error('拖放处理错误:', error);
    }
  };

  // 拖拽悬停处理
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  // 精灵变换处理
  const handleSpriteTransform = (id: string, transform: { x: number; y: number; width: number; height: number }) => {
    let { x, y } = transform;
    if (snapToGrid) {
      x = Math.round(x / gridSize) * gridSize;
      y = Math.round(y / gridSize) * gridSize;
    }
    if (showGuides) {
      updateGuides(x, y, transform.width, transform.height);
    }
    onSpriteTransform?.({ ...transform, x, y });
  };

  // 更新辅助线
  const updateGuides = (x: number, y: number, width: number, height: number) => {
    const verticalGuides = new Set<number>([x, x + width]);
    const horizontalGuides = new Set<number>([y, y + height]);
    sprites.forEach((sprite: Sprite) => {
      if (
        sprite.x !== undefined &&
        sprite.y !== undefined &&
        sprite.width !== undefined &&
        sprite.height !== undefined
      ) {
        verticalGuides.add(sprite.x);
        verticalGuides.add(sprite.x + sprite.width);
        horizontalGuides.add(sprite.y);
        horizontalGuides.add(sprite.y + sprite.height);
      }
    });
    setGuides({
      vertical: Array.from(verticalGuides),
      horizontal: Array.from(horizontalGuides)
    });
  };

  return (
    <div 
      ref={viewportRef}
      className="flex-1 relative bg-gray-900 overflow-hidden"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {/* 网格背景 */}
      {showGrid && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, #2d3748 1px, transparent 1px),
              linear-gradient(to bottom, #2d3748 1px, transparent 1px)
            `,
            backgroundSize: `${gridSize}px ${gridSize}px`
          }}
        />
      )}
      {/* 辅助线 */}
      {showGuides && (
        <div className="absolute inset-0 pointer-events-none">
          {guides.vertical.map(x => (
            <div
              key={`guide-v${x}`}
              className="absolute top-0 bottom-0 w-px bg-blue-500 opacity-50"
              style={{ left: x }}
            />
          ))}
          {guides.horizontal.map(y => (
            <div
              key={`guide-h${y}`}
              className="absolute left-0 right-0 h-px bg-blue-500 opacity-50"
              style={{ top: y }}
            />
          ))}
        </div>
      )}
      {/* 精灵层 */}
      <div className="absolute inset-0">
        {sprites.map((sprite: Sprite) =>
          sprite.x !== undefined && sprite.y !== undefined && sprite.width !== undefined && sprite.height !== undefined && (
            <DraggableSprite
              key={sprite.id}
              imageUrl={sprite.imageUrl || ''}
              initialX={sprite.x}
              initialY={sprite.y}
              initialWidth={sprite.width}
              initialHeight={sprite.height}
              onTransform={transform => handleSpriteTransform(sprite.id, transform)}
              snapToGrid={snapToGrid}
              gridSize={gridSize}
            />
          )
        )}
      </div>
    </div>
  );
};

export default GameViewport; 