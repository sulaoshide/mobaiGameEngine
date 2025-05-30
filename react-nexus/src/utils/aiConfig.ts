// AI 配置相关的工具函数
const AI_CONFIG_KEY = 'ai_config';

export interface AIConfig {
  openaiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
  lastUpdated: string;
}

export const defaultAIConfig: AIConfig = {
  openaiKey: '',
  model: 'gpt-3.5-turbo',
  temperature: 0.7,
  maxTokens: 2000,
  lastUpdated: new Date().toISOString()
};

// 保存 AI 配置到本地存储
export const saveAIConfig = (config: AIConfig): void => {
  try {
    localStorage.setItem(AI_CONFIG_KEY, JSON.stringify(config));
  } catch (error) {
    console.error('Failed to save AI config:', error);
  }
};

// 从本地存储加载 AI 配置
export const loadAIConfig = (): AIConfig => {
  try {
    const config = localStorage.getItem(AI_CONFIG_KEY);
    if (!config) return defaultAIConfig;
    
    const parsedConfig = JSON.parse(config) as AIConfig;
    return {
      ...defaultAIConfig,
      ...parsedConfig,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Failed to load AI config:', error);
    return defaultAIConfig;
  }
};

// 验证 OpenAI Key 格式
export const validateOpenAIKey = (key: string): boolean => {
  return /^sk-[A-Za-z0-9]{48}$/.test(key);
};

// 获取当前 AI 配置
export const getCurrentAIConfig = (): AIConfig => {
  return loadAIConfig();
};

// 更新 AI 配置
export const updateAIConfig = (updates: Partial<AIConfig>): AIConfig => {
  const currentConfig = loadAIConfig();
  const newConfig = {
    ...currentConfig,
    ...updates,
    lastUpdated: new Date().toISOString()
  };
  saveAIConfig(newConfig);
  return newConfig;
}; 