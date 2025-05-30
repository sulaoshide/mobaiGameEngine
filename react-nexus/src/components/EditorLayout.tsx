import React, { useState } from 'react';

const LAYERS = [
  { name: '玩家', locked: false },
  { name: '敌人', locked: true },
  { name: '金币', locked: false },
  { name: '平台', locked: false },
];

const EditorLayout: React.FC = () => {
  const [showGrid, setShowGrid] = useState(true);
  const [showGuides, setShowGuides] = useState(true);
  const [activeTab, setActiveTab] = useState<'layer' | 'animation' | 'console'>('layer');
  const [selectedLayer, setSelectedLayer] = useState<number>(1);

  return (
    <div className="w-full h-screen flex flex-col bg-[#181e29]">
      {/* 顶部工具栏 */}
      <div className="flex items-center px-4" style={{height: 40, background: '#181e29', borderBottom: '1px solid #232b39'}}>
        <button className="text-white flex items-center mr-2 px-2 py-0.5 rounded text-sm hover:bg-[#232b39]" style={{height: 28}}>
          <i className="fas fa-mouse-pointer mr-1"></i>选择
        </button>
        <button className="text-white flex items-center mr-2 px-2 py-0.5 rounded text-sm hover:bg-[#232b39]" style={{height: 28}}>
          <input type="checkbox" className="mr-1" readOnly style={{accentColor: '#fff'}} />矩形
        </button>
        <button className="text-white flex items-center mr-2 px-2 py-0.5 rounded text-sm hover:bg-[#232b39]" style={{height: 28}}>
          <input type="radio" className="mr-1" readOnly style={{accentColor: '#fff'}} />圆形
        </button>
        <button className="text-white flex items-center mr-2 px-2 py-0.5 rounded text-sm hover:bg-[#232b39]" style={{height: 28}}>
          <span className="font-bold mr-1">A</span>文本
        </button>
        <span className="text-gray-400 text-xs ml-2 mr-1 select-none">缩放:</span>
        <select className="bg-[#232b39] border border-[#2d3748] rounded px-2 py-0.5 text-xs text-gray-200 mr-2" style={{height: 24}}>
          <option>100%</option>
          <option>75%</option>
          <option>50%</option>
          <option>25%</option>
        </select>
        <button
          className={`text-white flex items-center mr-2 px-2 py-0.5 rounded text-sm ${showGuides ? 'bg-blue-600' : 'hover:bg-[#232b39]'}`}
          style={{height: 28}}
          title="辅助线"
          onClick={() => setShowGuides(!showGuides)}
        >
          <i className="fas fa-ruler-combined"></i>
        </button>
        <button
          className="text-white flex items-center mr-2 px-2 py-0.5 rounded text-sm hover:bg-[#232b39]"
          style={{height: 28}}
          title="吸附"
        >
          <i className="fas fa-magnet"></i>
        </button>
        <button
          className={`text-white flex items-center px-2 py-0.5 rounded text-sm ${showGrid ? 'bg-blue-600' : 'hover:bg-[#232b39]'}`}
          style={{height: 28}}
          title="网格"
          onClick={() => setShowGrid(!showGrid)}
        >
          <i className="fas fa-th"></i>
        </button>
      </div>
      {/* 编辑区 */}
      <div className="flex-1 relative" style={{background: '#232b39'}}>
        {/* 网格背景 */}
        {showGrid && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(to right, #2d3748 1px, transparent 1px),
                linear-gradient(to bottom, #2d3748 1px, transparent 1px)
              `,
              backgroundSize: `32px 32px`
            }}
          />
        )}
        {/* 这里可以放置你的主编辑内容 */}
      </div>
      {/* Tab栏 */}
      <div className="bg-[#232b39] border-t border-[#232b39] flex items-center px-2" style={{height: 40}}>
        <button
          className={`flex items-center px-4 py-1 mr-2 rounded-t text-sm font-bold ${activeTab === 'layer' ? 'bg-[#181e29] text-blue-400' : 'text-gray-300 hover:text-white'}`}
          onClick={() => setActiveTab('layer')}
        >
          <i className="fas fa-layer-group mr-1"></i>层级
        </button>
        <button
          className={`flex items-center px-4 py-1 mr-2 rounded-t text-sm font-bold ${activeTab === 'animation' ? 'bg-[#181e29] text-blue-400' : 'text-gray-300 hover:text-white'}`}
          onClick={() => setActiveTab('animation')}
        >
          <i className="fas fa-film mr-1"></i>动画
        </button>
        <button
          className={`flex items-center px-4 py-1 mr-2 rounded-t text-sm font-bold ${activeTab === 'console' ? 'bg-[#181e29] text-blue-400' : 'text-gray-300 hover:text-white'}`}
          onClick={() => setActiveTab('console')}
        >
          <i className="fas fa-terminal mr-1"></i>控制台
        </button>
      </div>
      {/* Tab内容区 */}
      <div className="bg-[#181e29] border-t border-[#232b39] px-0 py-0" style={{minHeight: 60}}>
        {activeTab === 'layer' && (
          <div className="py-2">
            {LAYERS.map((layer, idx) => (
              <div
                key={layer.name}
                className={`flex items-center justify-between px-6 py-2 mb-2 rounded ${selectedLayer === idx ? 'bg-blue-700 text-white' : 'bg-[#232b39] text-gray-200'}`}
                style={{cursor: 'pointer'}}
                onClick={() => setSelectedLayer(idx)}
              >
                <div className="flex items-center">
                  <i className="fas fa-circle text-green-400 mr-2 text-xs"></i>
                  {layer.name}
                </div>
                <i className={`fas fa-lock ${layer.locked ? 'text-white' : 'text-gray-500'}`}></i>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'animation' && (
          <div className="text-gray-400 py-4 px-6">这里是动画内容</div>
        )}
        {activeTab === 'console' && (
          <div className="text-gray-400 py-4 px-6">这里是控制台内容</div>
        )}
      </div>
    </div>
  );
};

export default EditorLayout; 