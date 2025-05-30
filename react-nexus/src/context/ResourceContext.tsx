import React, { createContext, useContext, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Sprite类型定义，明确必选与可选字段
export type Sprite = {
  id: string;
  name: string;
  icon: string;
  imageUrl?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  type?: string;
  properties?: Record<string, any>;
};
export type Scene = {
  id: string;
  name: string;
  icon: string;
  color: string;
};

interface ResourceContextType {
  sprites: Sprite[];
  addSprite: (sprite: Omit<Sprite, 'id'>) => void;
  deleteSprite: (id: string) => void;
  renameSprite: (id: string, name: string) => void;
  reorderSprites: (startIndex: number, endIndex: number) => void;
  scenes: Scene[];
  addScene: (scene: Omit<Scene, 'id'>) => void;
  deleteScene: (id: string) => void;
  renameScene: (id: string, name: string) => void;
  reorderScenes: (startIndex: number, endIndex: number) => void;
}

const ResourceContext = createContext<ResourceContextType | undefined>(undefined);

export const useResource = (): ResourceContextType => {
  const ctx = useContext(ResourceContext);
  if (!ctx) throw new Error('useResource 必须在 ResourceProvider 内使用');
  return ctx;
};

// Provider组件，管理全局资源状态
export const ResourceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 初始精灵和场景
  const [sprites, setSprites] = useState<Sprite[]>([
    { id: uuidv4(), name: '玩家', icon: 'user' },
    { id: uuidv4(), name: '敌人', icon: 'skull' },
    { id: uuidv4(), name: '金币', icon: 'coins' },
  ]);
  const [scenes, setScenes] = useState<Scene[]>([
    { id: uuidv4(), name: '主场景', icon: 'map', color: 'text-yellow-400' },
    { id: uuidv4(), name: '菜单场景', icon: 'map', color: 'text-blue-400' },
  ]);

  // 新增精灵，自动生成唯一id
  const addSprite = (sprite: Omit<Sprite, 'id'>) => {
    setSprites(prev => [...prev, { ...sprite, id: uuidv4() }]);
  };
  // 删除精灵
  const deleteSprite = (id: string) => {
    setSprites(prev => prev.filter(s => s.id !== id));
  };
  // 重命名精灵
  const renameSprite = (id: string, name: string) => {
    setSprites(prev => prev.map(s => s.id === id ? { ...s, name } : s));
  };
  // 拖拽排序精灵
  const reorderSprites = (startIndex: number, endIndex: number) => {
    setSprites(prev => {
      const updated = [...prev];
      const [removed] = updated.splice(startIndex, 1);
      updated.splice(endIndex, 0, removed);
      return updated;
    });
  };

  // 新增场景，自动生成唯一id
  const addScene = (scene: Omit<Scene, 'id'>) => {
    setScenes(prev => [...prev, { ...scene, id: uuidv4() }]);
  };
  // 删除场景
  const deleteScene = (id: string) => {
    setScenes(prev => prev.filter(s => s.id !== id));
  };
  // 重命名场景
  const renameScene = (id: string, name: string) => {
    setScenes(prev => prev.map(s => s.id === id ? { ...s, name } : s));
  };
  // 拖拽排序场景
  const reorderScenes = (startIndex: number, endIndex: number) => {
    setScenes(prev => {
      const updated = [...prev];
      const [removed] = updated.splice(startIndex, 1);
      updated.splice(endIndex, 0, removed);
      return updated;
    });
  };

  return (
    <ResourceContext.Provider
      value={{
        sprites,
        addSprite,
        deleteSprite,
        renameSprite,
        reorderSprites,
        scenes,
        addScene,
        deleteScene,
        renameScene,
        reorderScenes,
      }}
    >
      {children}
    </ResourceContext.Provider>
  );
}; 