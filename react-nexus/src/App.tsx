import React, { useState } from "react";
import "./index.css";
import { ResourceProvider } from './context/ResourceContext';
import SpriteManager from './components/SpriteManager';
import SceneManager from './components/SceneManager';
import AIGeneratorPanel from './components/AIGeneratorPanel';
import GameViewport from './components/GameViewport';
import TopToolbar from './components/TopToolbar';
import GameToolbar from './components/GameToolbar';

const App: React.FC = () => {
  const [audioCollapsed, setAudioCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'layer' | 'animation' | 'console'>('layer');
  // 层级动态数据
  const [hierarchy, setHierarchy] = useState([
    { id: 1, name: '玩家' },
    { id: 2, name: '敌人' },
    { id: 3, name: '金币' },
    { id: 4, name: '平台' },
  ]);
  const [dragIndex, setDragIndex] = useState<number|null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [gridColor, setGridColor] = useState('#ffffff0f');
  const [gridSize, setGridSize] = useState(32);
  const [showGridPanel, setShowGridPanel] = useState(false);
  // 辅助线相关
  const [guides, setGuides] = useState<{type:'h'|'v',pos:number}[]>([
    { type: 'h', pos: 200 },
    { type: 'v', pos: 300 }
  ]);
  const [guideColor, setGuideColor] = useState('#ff4d4d');
  const [showGuidePanel, setShowGuidePanel] = useState(false);
  const [dragGuide, setDragGuide] = useState<null | {idx:number, start:number, startPos:number, type:'h'|'v'}>(null);
  const [showGuideDelete, setShowGuideDelete] = useState<null | {idx:number, x:number, y:number}>(null);
  const [selectedSprite, setSelectedSprite] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [showGuides, setShowGuides] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);

  // 处理精灵变换
  const handleSpriteTransform = (transform: { x: number; y: number; width: number; height: number }) => {
    setSelectedSprite(transform);
  };

  return (
    <ResourceProvider>
      <div className="bg-[#1a202c] text-gray-200 h-screen flex flex-col overflow-hidden">
        {/* 顶部全宽主工具栏 */}
        <TopToolbar />
        <div className="flex-1 flex flex-row min-h-0">
          {/* 左侧资源管理器 */}
          <aside className="bg-[#232b39] border-r border-[#232b39] flex flex-col" style={{width: 260, minWidth:180}}>
            <div className="p-2 text-gray-300 font-bold">资源管理器</div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
              <div className="mb-2">
                <div className="flex items-center justify-between px-2 py-1 bg-gray-700 rounded-t select-none">
                  <span className="text-sm font-medium flex items-center">
                    <i className="fas fa-folder-open mr-2 text-gray-400"></i>
                    资源管理器
                  </span>
                </div>
              </div>
              <AIGeneratorPanel />
              <SceneManager />
              <SpriteManager />
              {/* 音效分组 */}
              <div className="mb-4">
                <div className="flex items-center justify-between px-2 py-1 bg-gray-700 rounded cursor-pointer">
                  <button
                    className="mr-1 focus:outline-none"
                    onClick={() => setAudioCollapsed(c => !c)}
                    aria-label={audioCollapsed ? '展开' : '折叠'}
                  >
                    <i className={`fas fa-chevron-${audioCollapsed ? 'right' : 'down'} text-xs text-gray-300`}></i>
                  </button>
                  <span className="text-sm font-medium flex items-center flex-1">
                    音效
                  </span>
                  <button className="text-xs text-gray-400 hover:text-white">
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
                {!audioCollapsed && (
                  <div className="ml-4 mt-1 space-y-1 left-group-content">
                    <div className="flex items-center px-2 py-1 text-sm rounded hover:bg-gray-700 cursor-pointer">
                      <i className="fas fa-volume-up mr-2 text-purple-400"></i>
                      背景音乐
                    </div>
                    <div className="flex items-center px-2 py-1 text-sm rounded hover:bg-gray-700 cursor-pointer">
                      <i className="fas fa-bell mr-2 text-purple-400"></i>
                      音效1
                    </div>
                  </div>
                )}
              </div>
            </div>
          </aside>
          {/* 中间游戏编辑区 */}
          <div className="flex-1 flex flex-col relative min-w-0">
            {/* 只在中间显示的工具栏 */}
            <GameToolbar
              showGrid={showGrid}
              setShowGrid={setShowGrid}
              showGuides={showGuides}
              setShowGuides={setShowGuides}
            />
            {/* 游戏视口 */}
            <div className="flex-1 min-h-0 relative">
              <GameViewport showGrid={showGrid} showGuides={showGuides} />
            </div>
            {/* 下方Tab栏 */}
            <div className="bg-[#232b39] border-t border-[#232b39] flex items-center px-2" style={{height: 40}}>
              <button
                className={`px-4 py-1 mr-2 rounded-t text-sm font-bold ${activeTab === 'layer' ? 'bg-[#181e29] text-blue-400' : 'text-gray-300 hover:text-white'}`}
                onClick={() => setActiveTab('layer')}
              >
                层级
              </button>
              <button
                className={`px-4 py-1 mr-2 rounded-t text-sm font-bold ${activeTab === 'animation' ? 'bg-[#181e29] text-blue-400' : 'text-gray-300 hover:text-white'}`}
                onClick={() => setActiveTab('animation')}
              >
                动画
              </button>
              <button
                className={`px-4 py-1 mr-2 rounded-t text-sm font-bold ${activeTab === 'console' ? 'bg-[#181e29] text-blue-400' : 'text-gray-300 hover:text-white'}`}
                onClick={() => setActiveTab('console')}
              >
                控制台
              </button>
              {/* 你可以在这里加更多Tab */}
            </div>
            {/* Tab内容区 */}
            <div className="bg-[#181e29] border-t border-[#232b39] px-4 py-2" style={{minHeight: 60}}>
              {activeTab === 'layer' && (
                <div>这里是层级内容</div>
              )}
              {activeTab === 'animation' && (
                <div>这里是动画内容</div>
              )}
              {activeTab === 'console' && (
                <div>这里是控制台内容</div>
              )}
            </div>
          </div>
          {/* 右侧属性栏 */}
          <aside className="bg-[#232b39] border-l border-[#232b39] flex flex-col w-72">
            <div className="p-2 text-gray-300 font-bold">属性</div>
            <div className="p-4">
              {/* 变换分组 */}
              <div className="bg-gray-800 rounded-lg mb-3 p-3 shadow-sm border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm text-gray-100 flex items-center">
                    <i className="fas fa-arrows-alt mr-2 text-xs"></i>变换
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-400 mb-1">X</label>
                      <input className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs text-gray-100 focus:outline-none" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-400 mb-1">Y</label>
                      <input className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs text-gray-100 focus:outline-none" />
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-400 mb-1">宽</label>
                      <input className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs text-gray-100 focus:outline-none" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-400 mb-1">高</label>
                      <input className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs text-gray-100 focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">旋转</label>
                    <input className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs text-gray-100 focus:outline-none" />
                  </div>
                </div>
              </div>
              {/* 精灵渲染器分组 */}
              <div className="bg-gray-800 rounded-lg mb-3 p-3 shadow-sm border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm text-gray-100 flex items-center">
                    <i className="fas fa-image mr-2 text-xs"></i>精灵渲染器
                  </span>
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">精灵图</label>
                    <select className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs text-gray-100 focus:outline-none">
                      <option value="player_sprite">player_sprite</option>
                      <option value="enemy_sprite">enemy_sprite</option>
                      <option value="coin_sprite">coin_sprite</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <label className="block text-xs text-gray-400">颜色</label>
                    <span className="w-6 h-6 rounded-full border-2 border-gray-700 flex items-center justify-center cursor-pointer" style={{background:'#3B82F6', position:'relative'}}>
                      <input type="color" className="opacity-0 absolute w-full h-full left-0 top-0 cursor-pointer" />
                    </span>
                    <input type="text" className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs w-24 text-gray-100" value="#3B82F6" readOnly />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">透明度</label>
                    <input type="range" min="0" max="100" defaultValue="100" className="w-full" />
                  </div>
                </div>
              </div>
              {/* 碰撞体分组 */}
              <div className="bg-gray-800 rounded-lg mb-3 p-3 shadow-sm border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm text-gray-100 flex items-center">
                    <i className="fas fa-cube mr-2 text-xs"></i>碰撞体
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="text-xs text-gray-400 mb-2">无碰撞体组件</div>
                  <button className="w-full bg-gray-700 hover:bg-gray-600 text-xs text-blue-400 rounded py-1 mb-1 transition">+ 添加碰撞体</button>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-xs text-white rounded py-1 transition">+ 添加组件</button>
                </div>
              </div>
            </div>
          </aside>
        </div>
        {/* 底部状态栏 */}
        <div className="bg-[#232b39] text-xs text-gray-400 px-4 py-1 flex items-center justify-between">
          <span>FPS: 16  内存: 118MB  版本: v1.0.0-beta</span>
        </div>
    </div>
    </ResourceProvider>
  );
};

export default App;