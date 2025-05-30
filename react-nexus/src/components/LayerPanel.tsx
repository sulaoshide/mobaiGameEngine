import React from 'react';

interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  type: 'image' | 'text' | 'shape';
}

interface LayerPanelProps {
  layers: Layer[];
  onLayerVisibilityChange: (id: string, visible: boolean) => void;
  onLayerLockChange: (id: string, locked: boolean) => void;
  onLayerSelect: (id: string) => void;
  selectedLayerId: string | null;
}

const LayerPanel: React.FC<LayerPanelProps> = ({
  layers,
  onLayerVisibilityChange,
  onLayerLockChange,
  onLayerSelect,
  selectedLayerId
}) => {
  return (
    <div className="w-64 bg-[#181e29] border-l border-[#232b39]">
      {/* 标题栏 */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#232b39]">
        <span className="text-white text-sm">层级</span>
        <div className="flex space-x-2">
          <button className="text-gray-400 hover:text-white">
            <i className="fas fa-eye"></i>
          </button>
          <button className="text-gray-400 hover:text-white">
            <i className="fas fa-lock"></i>
          </button>
        </div>
      </div>

      {/* 层级列表 */}
      <div className="overflow-y-auto" style={{ height: 'calc(100vh - 32px)' }}>
        {layers.map((layer) => (
          <div
            key={layer.id}
            className={`flex items-center px-4 py-2 border-b border-[#232b39] cursor-pointer hover:bg-[#232b39] ${
              selectedLayerId === layer.id ? 'bg-[#232b39]' : ''
            }`}
            onClick={() => onLayerSelect(layer.id)}
          >
            {/* 层级图标 */}
            <div className="w-4 h-4 mr-2">
              {layer.type === 'image' && <i className="fas fa-image text-blue-400"></i>}
              {layer.type === 'text' && <i className="fas fa-font text-green-400"></i>}
              {layer.type === 'shape' && <i className="fas fa-shapes text-yellow-400"></i>}
            </div>

            {/* 层级名称 */}
            <span className="text-white text-sm flex-grow">{layer.name}</span>

            {/* 控制按钮 */}
            <div className="flex space-x-2">
              <button
                className={`text-sm ${layer.visible ? 'text-white' : 'text-gray-500'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onLayerVisibilityChange(layer.id, !layer.visible);
                }}
              >
                <i className="fas fa-eye"></i>
              </button>
              <button
                className={`text-sm ${layer.locked ? 'text-white' : 'text-gray-500'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onLayerLockChange(layer.id, !layer.locked);
                }}
              >
                <i className="fas fa-lock"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LayerPanel; 