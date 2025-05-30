import React, { useRef } from 'react';

export type LayoutBox = { x: number; y: number; w: number; h: number };

interface Props {
  box: LayoutBox;
  minW?: number;
  minH?: number;
  children: React.ReactNode;
  onChange: (box: LayoutBox) => void;
  style?: React.CSSProperties;
  className?: string;
}

const DraggableResizableBox: React.FC<Props> = ({ box, minW = 120, minH = 80, children, onChange, style, className }) => {
  const dragOffset = useRef<{ x: number; y: number } | null>(null);
  const resizeStart = useRef<{ x: number; y: number; w: number; h: number } | null>(null);

  // 拖拽移动
  function onDragStart(e: React.MouseEvent) {
    dragOffset.current = { x: e.clientX - box.x, y: e.clientY - box.y };
    document.addEventListener('mousemove', onDragging as any);
    document.addEventListener('mouseup', onDragEnd as any);
  }
  function onDragging(e: MouseEvent) {
    if (!dragOffset.current) return;
    onChange({ ...box, x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y });
  }
  function onDragEnd() {
    dragOffset.current = null;
    document.removeEventListener('mousemove', onDragging as any);
    document.removeEventListener('mouseup', onDragEnd as any);
  }

  // 右下角缩放
  function onResizeStart(e: React.MouseEvent) {
    e.stopPropagation();
    resizeStart.current = { x: e.clientX, y: e.clientY, w: box.w, h: box.h };
    document.addEventListener('mousemove', onResizing as any);
    document.addEventListener('mouseup', onResizeEnd as any);
  }
  function onResizing(e: MouseEvent) {
    if (!resizeStart.current) return;
    const dw = e.clientX - resizeStart.current.x;
    const dh = e.clientY - resizeStart.current.y;
    onChange({ ...box, w: Math.max(minW, resizeStart.current.w + dw), h: Math.max(minH, resizeStart.current.h + dh) });
  }
  function onResizeEnd() {
    resizeStart.current = null;
    document.removeEventListener('mousemove', onResizing as any);
    document.removeEventListener('mouseup', onResizeEnd as any);
  }

  return (
    <div
      className={className}
      style={{
        position: 'absolute',
        left: box.x,
        top: box.y,
        width: box.w,
        height: box.h,
        boxShadow: '0 2px 12px #0002',
        borderRadius: 8,
        background: '#232b3a',
        userSelect: 'none',
        ...style,
      }}
    >
      {/* 拖拽栏 */}
      <div
        style={{ height: 28, cursor: 'move', borderTopLeftRadius: 8, borderTopRightRadius: 8, background: 'rgba(60,70,90,0.9)' }}
        onMouseDown={onDragStart}
        className="flex items-center px-2 text-xs text-gray-300 select-none"
      >
        <i className="fas fa-arrows-alt mr-2"></i>可拖拽/缩放
      </div>
      <div style={{ height: `calc(100% - 28px)`, overflow: 'auto' }}>{children}</div>
      {/* 右下角缩放点 */}
      <div
        style={{ position: 'absolute', right: 2, bottom: 2, width: 16, height: 16, cursor: 'nwse-resize', zIndex: 10 }}
        onMouseDown={onResizeStart}
        className="flex items-center justify-center text-gray-400 hover:text-blue-400"
      >
        <i className="fas fa-expand-arrows-alt"></i>
      </div>
    </div>
  );
};

export default DraggableResizableBox; 