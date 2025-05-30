import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { Resource } from '../types/resource';
import { 
  createResourceFromFile, 
  exportProject, 
  importProject, 
  downloadBlob,
  validateResource,
  formatFileSize,
  saveResourcesToLocalStorage,
  loadResourcesFromLocalStorage,
  deleteResourceFromIndexedDB
} from '../utils/resourceUtils';
import { AIConfigPanel } from './AIConfigPanel';
import { AIService } from '../utils/aiService';
import { AIConfig } from '../utils/aiConfig';

interface ResourceManagerProps {
  resources: Resource[];
  onResourcesChange: (resources: Resource[]) => void;
  projectData: any; // 使用实际的ProjectExport类型
}

export const ResourceManager: React.FC<ResourceManagerProps> = ({
  resources,
  onResourcesChange,
  projectData,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedResources, setSelectedResources] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [error, setError] = useState<string | null>(null);

  // 添加功能菜单状态
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // 添加 AI 配置状态
  const [showAIConfig, setShowAIConfig] = useState(false);

  // 功能菜单项
  const menuItems = [
    {
      id: 'import',
      label: '导入资源',
      icon: '📥',
      description: '导入图片、音频等资源文件'
    },
    {
      id: 'export',
      label: '导出项目',
      icon: '📤',
      description: '将项目导出为zip文件'
    },
    {
      id: 'organize',
      label: '资源整理',
      icon: '📁',
      description: '整理和分类资源'
    },
    {
      id: 'preview',
      label: '预览资源',
      icon: '👁️',
      description: '预览和管理资源'
    },
    {
      id: 'settings',
      label: '资源设置',
      icon: '⚙️',
      description: '管理资源相关设置'
    },
    {
      id: 'ai',
      label: 'AI 配置',
      icon: '🤖',
      description: '配置 AI 相关设置'
    }
  ];

  // 过滤和排序资源
  const filteredResources = useMemo(() => {
    return resources
      .filter(resource => {
        const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || resource.type === filterType;
        return matchesSearch && matchesType;
      })
      .sort((a, b) => {
        const order = sortOrder === 'asc' ? 1 : -1;
        switch (sortBy) {
          case 'name':
            return order * a.name.localeCompare(b.name);
          case 'date':
            return order * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
          case 'size':
            return order * (a.size - b.size);
          default:
            return 0;
        }
      });
  }, [resources, searchTerm, filterType, sortBy, sortOrder]);

  const handleFileDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);

    try {
      const files = Array.from(e.dataTransfer.files);
      const newResources = await Promise.all(
        files.map(file => createResourceFromFile(file))
      );

      // 验证所有资源
      const validResources = newResources.filter(validateResource);
      if (validResources.length !== newResources.length) {
        setError('部分资源导入失败，请检查文件格式');
      }

      onResourcesChange([...resources, ...validResources]);
    } catch (error) {
      setError('资源导入失败，请重试');
      console.error('Import failed:', error);
    }
  }, [resources, onResourcesChange]);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const files = Array.from(e.target.files || []);
    
    try {
      const newResources = await Promise.all(
        files.map(file => createResourceFromFile(file))
      );

      const validResources = newResources.filter(validateResource);
      if (validResources.length !== newResources.length) {
        setError('部分资源导入失败，请检查文件格式');
      }

      onResourcesChange([...resources, ...validResources]);
    } catch (error) {
      setError('资源导入失败，请重试');
      console.error('Import failed:', error);
    }
  }, [resources, onResourcesChange]);

  const handleExport = useCallback(async () => {
    setError(null);
    try {
      const blob = await exportProject(projectData, resources);
      downloadBlob(blob, 'project.zip');
    } catch (error) {
      setError('项目导出失败，请重试');
      console.error('Export failed:', error);
    }
  }, [projectData, resources]);

  const handleImport = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const importedData = await importProject(file);
      // 处理导入的数据
      console.log('Imported project:', importedData);
      // 这里需要根据实际需求处理导入的数据
    } catch (error) {
      setError('项目导入失败，请检查文件格式');
      console.error('Import failed:', error);
    }
  }, []);

  const handleResourceSelect = useCallback((resourceId: string, multiSelect: boolean = false) => {
    setSelectedResources(prev => {
      const newSelection = new Set(multiSelect ? prev : []);
      if (newSelection.has(resourceId)) {
        newSelection.delete(resourceId);
      } else {
        newSelection.add(resourceId);
      }
      return newSelection;
    });
  }, []);

  const handleDeleteSelected = useCallback(async () => {
    if (selectedResources.size === 0) return;
    
    // 从 IndexedDB 中删除资源
    await Promise.all(
      Array.from(selectedResources).map(id => deleteResourceFromIndexedDB(id))
    );
    
    const newResources = resources.filter(
      resource => !selectedResources.has(resource.id)
    );
    onResourcesChange(newResources);
    setSelectedResources(new Set());
  }, [resources, selectedResources, onResourcesChange]);

  // 加载本地存储的资源
  useEffect(() => {
    const loadLocalResources = async () => {
      const localResources = await loadResourcesFromLocalStorage();
      if (localResources.length > 0) {
        onResourcesChange(localResources);
      }
    };
    loadLocalResources();
  }, [onResourcesChange]);

  // 保存资源到本地存储
  useEffect(() => {
    saveResourcesToLocalStorage(resources);
  }, [resources]);

  // 处理 AI 配置变更
  const handleAIConfigChange = useCallback((config: AIConfig) => {
    const aiService = AIService.getInstance();
    aiService.updateConfig(config);
  }, []);

  // 渲染功能菜单
  const renderMenu = () => (
    <div className="mb-4 p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">资源管理</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveMenu(item.id)}
            className={`
              p-4 rounded-lg border-2 transition-all
              ${activeMenu === item.id 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
              }
            `}
          >
            <div className="text-2xl mb-2">{item.icon}</div>
            <div className="font-medium">{item.label}</div>
            <div className="text-sm text-gray-500 mt-1">{item.description}</div>
          </button>
        ))}
      </div>
    </div>
  );

  // 渲染功能面板
  const renderPanel = () => {
    switch (activeMenu) {
      case 'import':
        return (
          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">导入资源</h3>
            <div
              className={`
                border-2 border-dashed rounded-lg p-8 text-center
                ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
              `}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleFileDrop}
            >
              <input
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                id="file-input"
              />
              <label
                htmlFor="file-input"
                className="cursor-pointer text-blue-500 hover:text-blue-600"
              >
                点击或拖拽文件到此处上传
              </label>
            </div>
          </div>
        );

      case 'export':
        return (
          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">导出项目</h3>
            <div className="space-y-4">
              <button
                onClick={handleExport}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                导出为ZIP文件
              </button>
              <div className="text-sm text-gray-500">
                导出包含所有资源和项目配置
              </div>
            </div>
          </div>
        );

      case 'organize':
        return (
          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">资源整理</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="搜索资源..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded"
                />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border rounded"
                >
                  <option value="all">所有类型</option>
                  <option value="image">图片</option>
                  <option value="audio">音频</option>
                  <option value="video">视频</option>
                  <option value="sprite">精灵</option>
                  <option value="scene">场景</option>
                </select>
              </div>
              <div className="flex gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 border rounded"
                >
                  <option value="name">按名称</option>
                  <option value="date">按日期</option>
                  <option value="size">按大小</option>
                </select>
                <button
                  onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                  className="px-3 py-2 border rounded"
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>
            </div>
          </div>
        );

      case 'preview':
        return (
          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">资源预览</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredResources.map((resource) => (
                <div
                  key={resource.id}
                  className={`
                    border rounded-lg p-2 cursor-pointer
                    ${selectedResources.has(resource.id) ? 'ring-2 ring-blue-500' : ''}
                  `}
                  onClick={() => handleResourceSelect(resource.id, true)}
                >
                  {resource.type === 'image' && (
                    <img
                      src={resource.url}
                      alt={resource.name}
                      className="w-full h-32 object-cover rounded"
                    />
                  )}
                  {resource.type === 'audio' && (
                    <div className="w-full h-32 bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-4xl">🔊</span>
                    </div>
                  )}
                  <div className="mt-2 text-sm">
                    <div className="font-medium truncate">{resource.name}</div>
                    <div className="text-gray-500">
                      {formatFileSize(resource.size)}
                    </div>
                    <div className="text-gray-500 text-xs">
                      {new Date(resource.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">资源设置</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>自动压缩图片</span>
                <input type="checkbox" className="form-checkbox" />
              </div>
              <div className="flex items-center justify-between">
                <span>自动生成缩略图</span>
                <input type="checkbox" className="form-checkbox" />
              </div>
              <div className="flex items-center justify-between">
                <span>资源备份</span>
                <button className="px-3 py-1 bg-blue-500 text-white rounded">
                  立即备份
                </button>
              </div>
            </div>
          </div>
        );

      case 'ai':
        return (
          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">AI 配置</h3>
            <AIConfigPanel onConfigChange={handleAIConfigChange} />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-4">
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {renderMenu()}
      {activeMenu && renderPanel()}

      {/* 保持原有的资源列表显示 */}
      <div className="mt-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="搜索资源..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border rounded"
            />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border rounded"
            >
              <option value="all">所有类型</option>
              <option value="image">图片</option>
              <option value="audio">音频</option>
              <option value="video">视频</option>
              <option value="sprite">精灵</option>
              <option value="scene">场景</option>
            </select>
          </div>
          {selectedResources.size > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              删除选中 ({selectedResources.size})
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredResources.map((resource) => (
            <div
              key={resource.id}
              className={`
                border rounded-lg p-2 cursor-pointer
                ${selectedResources.has(resource.id) ? 'ring-2 ring-blue-500' : ''}
              `}
              onClick={() => handleResourceSelect(resource.id, true)}
            >
              {resource.type === 'image' && (
                <img
                  src={resource.url}
                  alt={resource.name}
                  className="w-full h-32 object-cover rounded"
                />
              )}
              {resource.type === 'audio' && (
                <div className="w-full h-32 bg-gray-100 rounded flex items-center justify-center">
                  <span className="text-4xl">🔊</span>
                </div>
              )}
              <div className="mt-2 text-sm">
                <div className="font-medium truncate">{resource.name}</div>
                <div className="text-gray-500">
                  {formatFileSize(resource.size)}
                </div>
                <div className="text-gray-500 text-xs">
                  {new Date(resource.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 