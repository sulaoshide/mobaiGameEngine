import React, { useState } from 'react';
import { useResource } from '../context/ResourceContext';

const SceneManager: React.FC = () => {
  const { scenes, addScene, deleteScene, renameScene, reorderScenes } = useResource();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="mb-3">
      {/* 分组栏 */}
      <div
        className="flex items-center justify-between px-3 h-9 bg-[#353f4b] rounded-t-lg select-none"
        style={{ borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
      >
        <button
          className="mr-1 focus:outline-none flex items-center"
          onClick={() => setCollapsed(c => !c)}
          aria-label={collapsed ? '展开' : '折叠'}
        >
          <i className={`fas fa-chevron-${collapsed ? 'right' : 'down'} text-xs text-gray-200`}></i>
        </button>
        <span className="font-semibold text-sm text-gray-100 flex-1">场景</span>
        <button
          className="text-xs text-gray-200 hover:text-white px-2 py-1 rounded"
          style={{ background: 'transparent' }}
          onClick={() => {
            const name = prompt('请输入场景名称', '新场景');
            if (name) addScene({ name, icon: 'map', color: 'text-blue-400' });
          }}
        >
          <i className="fas fa-plus"></i>
        </button>
      </div>
      {/* 内容区 */}
      {!collapsed && (
        <div className="bg-[#1c232b] rounded-b-lg pt-2 pb-2">
          {scenes.map((scene, idx) => (
            <div
              key={scene.id}
              className={`flex items-center px-4 py-1 mb-1 transition group ${dragIndex === idx ? 'ring-2 ring-blue-400' : ''}`}
              draggable
              onDragStart={() => setDragIndex(idx)}
              onDragOver={e => { e.preventDefault(); if (dragIndex !== null && dragIndex !== idx) reorderScenes(dragIndex, idx); }}
              onDragEnd={() => setDragIndex(null)}
              style={{ cursor: 'pointer' }}
            >
              <i className={`fas fa-map mr-2 text-lg ${scene.color}`}></i>
              {editingId === scene.id ? (
                <input
                  className="bg-gray-800 border border-gray-600 rounded px-1 text-xs text-gray-100 mr-2 w-24"
                  value={newName}
                  autoFocus
                  onChange={e => setNewName(e.target.value)}
                  onBlur={() => { renameScene(scene.id, newName); setEditingId(null); }}
                  onKeyDown={e => { if (e.key === 'Enter') { renameScene(scene.id, newName); setEditingId(null); }}}
                />
              ) : (
                <span
                  className="flex-1 text-xs text-gray-100 cursor-pointer mr-2"
                  onDoubleClick={() => { setEditingId(scene.id); setNewName(scene.name); }}
                  title={scene.name}
                >
                  {scene.name}
                </span>
              )}
              <button
                className="text-xs text-gray-400 hover:text-white mr-1 opacity-0 group-hover:opacity-100"
                title="重命名"
                onClick={() => { setEditingId(scene.id); setNewName(scene.name); }}
              >
                <i className="fas fa-pen"></i>
              </button>
              <button
                className="text-xs text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100"
                title="删除"
                onClick={() => { if (window.confirm('确定删除该场景？')) deleteScene(scene.id); }}
              >
                <i className="fas fa-trash"></i>
              </button>
              <span className="cursor-move ml-2 text-gray-500 opacity-0 group-hover:opacity-100"><i className="fas fa-grip-vertical"></i></span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SceneManager; 