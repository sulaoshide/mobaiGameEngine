import React from 'react';

const TopToolbar: React.FC = () => (
  <div className="w-full">
    <div className="flex items-center justify-between px-4" style={{height: 40, background: '#232b39'}}>
      {/* 左侧 */}
      <div className="flex items-center">
        <span className="text-blue-400 text-lg mr-2">🎮</span>
        <span className="text-white font-bold text-base mr-4 select-none">Nexus Game Engine</span>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs mr-2" style={{height: 28}}>▶运行</button>
        <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs mr-2" style={{height: 28}}>💾保存</button>
        <button className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-xs" style={{height: 28}}>➡导出</button>
      </div>
      {/* 右侧 */}
      <div className="flex items-center">
        <input
          className="bg-[#232b39] border border-[#2d3748] rounded px-2 py-1 text-xs text-gray-200 mr-2"
          placeholder="搜索资源或对象..."
          style={{width: 200, height: 28}}
        />
        <button className="text-gray-300 hover:text-white mr-2" title="设置" style={{height: 28}}>
          <i className="fas fa-cog"></i>
        </button>
        <div className="bg-blue-700 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm select-none">U</div>
      </div>
    </div>
  </div>
);

export default TopToolbar; 