import React from 'react';

interface GameToolbarProps {
  showGrid: boolean;
  setShowGrid: (v: boolean) => void;
  showGuides: boolean;
  setShowGuides: (v: boolean) => void;
}

const GameToolbar: React.FC<GameToolbarProps> = ({
  showGrid, setShowGrid, showGuides, setShowGuides
}) => (
  <div className="flex items-center px-4" style={{height: 32, background: '#181e29', borderBottom: '1px solid #232b39'}}>
    <button className="text-white flex items-center mr-2 px-2 py-0.5 rounded text-xs hover:bg-[#232b39]" style={{height: 24}}>
      <i className="fas fa-mouse-pointer mr-1"></i>选择
    </button>
    <button className="text-white flex items-center mr-2 px-2 py-0.5 rounded text-xs hover:bg-[#232b39]" style={{height: 24}}>
      <input type="checkbox" className="mr-1" readOnly style={{accentColor: '#fff'}} />矩形
    </button>
    <button className="text-white flex items-center mr-2 px-2 py-0.5 rounded text-xs hover:bg-[#232b39]" style={{height: 24}}>
      <input type="radio" className="mr-1" readOnly style={{accentColor: '#fff'}} />圆形
    </button>
    <button className="text-white flex items-center mr-2 px-2 py-0.5 rounded text-xs hover:bg-[#232b39]" style={{height: 24}}>
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
      className={`text-white flex items-center mr-2 px-2 py-0.5 rounded text-xs ${showGuides ? 'bg-blue-600' : 'hover:bg-[#232b39]'}`}
      style={{height: 24}}
      title="辅助线"
      onClick={() => setShowGuides(!showGuides)}
    >
      <i className="fas fa-ruler-combined"></i>
    </button>
    <button
      className="text-white flex items-center mr-2 px-2 py-0.5 rounded text-xs hover:bg-[#232b39]"
      style={{height: 24}}
      title="吸附"
    >
      <i className="fas fa-magnet"></i>
    </button>
    <button
      className={`text-white flex items-center px-2 py-0.5 rounded text-xs ${showGrid ? 'bg-blue-600' : 'hover:bg-[#232b39]'}`}
      style={{height: 24}}
      title="网格"
      onClick={() => setShowGrid(!showGrid)}
    >
      <i className="fas fa-th"></i>
    </button>
  </div>
);

export default GameToolbar; 