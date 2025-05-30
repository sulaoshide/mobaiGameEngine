import React, { useState } from 'react';
import { useResource } from '../context/ResourceContext';

const iconColorMap: Record<string, string> = {
  user: 'bg-blue-500',
  skull: 'bg-red-500',
  coins: 'bg-green-500',
};

const SpriteManager: React.FC = () => {
  const { sprites, addSprite, deleteSprite, renameSprite, reorderSprites } = useResource();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  // 处理拖拽开始
  const handleDragStart = (e: React.DragEvent, sprite: any) => {
    e.dataTransfer.setData('spriteData', JSON.stringify({
      imageUrl: sprite.imageUrl,
      name: sprite.name
    }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <button
          className="mr-1 focus:outline-none"
          onClick={() => setCollapsed(c => !c)}
          aria-label={collapsed ? '展开' : '折叠'}
        >
          <i className={`fas fa-chevron-${collapsed ? 'right' : 'down'} text-xs text-gray-300`}></i>
        </button>
        <span className="font-semibold text-sm text-gray-100 flex items-center flex-1">
          <i className="fas fa-images mr-2 text-xs"></i>精灵图
        </span>
        <button
          className="text-xs bg-blue-600 hover:bg-blue-700 text-white rounded px-2 py-1"
          onClick={() => {
            const name = prompt('请输入精灵名称', '新精灵');
            if (name) addSprite({ name, icon: 'user' });
          }}
        >
          +
        </button>
      </div>
      {!collapsed && (
        <div className="grid grid-cols-3 gap-2">
          {sprites.map((sprite, idx) => (
            <div
              key={sprite.id}
              className={`relative group bg-gray-700 rounded-lg p-1 flex flex-col items-center sprite-item transition-shadow ${dragIndex === idx ? 'ring-2 ring-blue-400' : ''}`}
              draggable
              onDragStart={(e) => handleDragStart(e, sprite)}
              onDragOver={e => { e.preventDefault(); if (dragIndex !== null && dragIndex !== idx) reorderSprites(dragIndex, idx); }}
              onDragEnd={() => setDragIndex(null)}
              style={{ minHeight: 80 }}
            >
              {/* 图标或图片 */}
              <div className={`${iconColorMap[sprite.icon] || 'bg-gray-500'} h-12 w-12 rounded flex items-center justify-center mb-1`}>
                {sprite.imageUrl ? (
                  <img
                    src={sprite.imageUrl}
                    alt={sprite.name}
                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                  />
                ) : (
                  <i className={`fas fa-${sprite.icon} text-2xl text-white`}></i>
                )}
              </div>
              {/* 名称或编辑框 */}
              {editingId === sprite.id ? (
                <input
                  className="bg-gray-800 border border-gray-600 rounded px-1 text-xs text-gray-100 mt-1 w-full text-center"
                  value={newName}
                  autoFocus
                  onChange={e => setNewName(e.target.value)}
                  onBlur={() => { renameSprite(sprite.id, newName); setEditingId(null); }}
                  onKeyDown={e => { if (e.key === 'Enter') { renameSprite(sprite.id, newName); setEditingId(null); }}}
                />
              ) : (
                <p
                  className="text-xs truncate text-center w-full mt-1 cursor-pointer"
                  onDoubleClick={() => { setEditingId(sprite.id); setNewName(sprite.name); }}
                  title={sprite.name}
                >
                  {sprite.name}
                </p>
              )}
              {/* 操作按钮（悬浮显示） */}
              <div className="absolute top-1 right-1 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  className="text-xs text-gray-400 hover:text-white"
                  title="重命名"
                  onClick={() => { setEditingId(sprite.id); setNewName(sprite.name); }}
                >
                  <i className="fas fa-pen"></i>
                </button>
                <button
                  className="text-xs text-gray-400 hover:text-red-400"
                  title="删除"
                  onClick={() => { if (window.confirm('确定删除该精灵？')) deleteSprite(sprite.id); }}
                >
                  <i className="fas fa-trash"></i>
                </button>
                <span className="cursor-move text-gray-500"><i className="fas fa-grip-vertical"></i></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SpriteManager; 