import React, { useState, useRef, useEffect } from 'react';

export interface DraggableSpriteProps {
  imageUrl: string;
  initialX: number;
  initialY: number;
  initialWidth: number;
  initialHeight: number;
  onTransform: (transform: { x: number; y: number; width: number; height: number }) => void;
  snapToGrid?: boolean;
  gridSize?: number;
}

const DraggableSprite: React.FC<DraggableSpriteProps> = ({
  imageUrl,
  initialX = 0,
  initialY = 0,
  initialWidth = 100,
  initialHeight = 100,
  onTransform,
  snapToGrid = false,
  gridSize = 20,
}) => {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [size, setSize] = useState({ width: initialWidth, height: initialHeight });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const spriteRef = useRef<HTMLDivElement>(null);

  // 处理拖拽
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === spriteRef.current) {
      setIsDragging(true);
      const rect = spriteRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  // 处理调整大小
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && spriteRef.current) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        setPosition({ x: newX, y: newY });
        onTransform?.({ x: newX, y: newY, width: size.width, height: size.height });
      }
      if (isResizing && spriteRef.current) {
        const rect = spriteRef.current.getBoundingClientRect();
        const newWidth = e.clientX - rect.left;
        const newHeight = e.clientY - rect.top;
        setSize({ width: newWidth, height: newHeight });
        onTransform?.({ x: position.x, y: position.y, width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, position, size, onTransform]);

  return (
    <div
      ref={spriteRef}
      className="absolute cursor-move"
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        border: '2px dashed rgba(255, 255, 255, 0.3)',
        backgroundColor: 'rgba(74, 85, 104, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none'
      }}
      onMouseDown={handleMouseDown}
    >
      <img
        src={imageUrl}
        alt="Sprite"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain'
        }}
      />
      {/* 调整大小的手柄 */}
      <div
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
        onMouseDown={handleResizeMouseDown}
        style={{
          backgroundColor: 'rgba(66, 153, 225, 0.5)',
          borderTopLeftRadius: '4px'
        }}
      />
    </div>
  );
};

export default DraggableSprite; 