import React, { useState, useEffect } from 'react';
import { AIConfig, defaultAIConfig, updateAIConfig, validateOpenAIKey, loadAIConfig } from '../utils/aiConfig';

interface AIConfigPanelProps {
  onConfigChange?: (config: AIConfig) => void;
}

export const AIConfigPanel: React.FC<AIConfigPanelProps> = ({ onConfigChange }) => {
  const [config, setConfig] = useState<AIConfig>(defaultAIConfig);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedConfig = loadAIConfig();
    setConfig(savedConfig);
  }, []);

  const handleSave = () => {
    if (!validateOpenAIKey(config.openaiKey)) {
      setError('无效的 OpenAI API Key 格式');
      return;
    }

    const updatedConfig = updateAIConfig(config);
    setConfig(updatedConfig);
    setIsEditing(false);
    setError(null);
    onConfigChange?.(updatedConfig);
  };

  const handleReset = () => {
    setConfig(defaultAIConfig);
    setIsEditing(false);
    setError(null);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">AI 配置</h3>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-3 py-1 text-blue-500 hover:text-blue-600"
          >
            编辑
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              保存
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-1 text-gray-500 hover:text-gray-600"
            >
              取消
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            OpenAI API Key
          </label>
          <input
            type="password"
            value={config.openaiKey}
            onChange={(e) => setConfig({ ...config, openaiKey: e.target.value })}
            disabled={!isEditing}
            className="w-full px-3 py-2 border rounded disabled:bg-gray-100"
            placeholder="sk-..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            模型
          </label>
          <select
            value={config.model}
            onChange={(e) => setConfig({ ...config, model: e.target.value })}
            disabled={!isEditing}
            className="w-full px-3 py-2 border rounded disabled:bg-gray-100"
          >
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            <option value="gpt-4">GPT-4</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            温度 (Temperature)
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={config.temperature}
            onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
            disabled={!isEditing}
            className="w-full"
          />
          <div className="text-sm text-gray-500 text-right">
            {config.temperature}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            最大 Token 数
          </label>
          <input
            type="number"
            min="1"
            max="4000"
            value={config.maxTokens}
            onChange={(e) => setConfig({ ...config, maxTokens: parseInt(e.target.value) })}
            disabled={!isEditing}
            className="w-full px-3 py-2 border rounded disabled:bg-gray-100"
          />
        </div>

        <div className="text-sm text-gray-500">
          最后更新: {new Date(config.lastUpdated).toLocaleString()}
        </div>
      </div>
    </div>
  );
}; 