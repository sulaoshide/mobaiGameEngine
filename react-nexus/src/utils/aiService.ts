import { AIConfig, getCurrentAIConfig } from './aiConfig';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: ChatMessage;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class AIService {
  private static instance: AIService;
  private config: AIConfig;

  private constructor() {
    this.config = getCurrentAIConfig();
  }

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  public updateConfig(config: AIConfig): void {
    this.config = config;
  }

  public async chatCompletion(
    messages: ChatMessage[],
    options: Partial<AIConfig> = {}
  ): Promise<ChatCompletionResponse> {
    const config = { ...this.config, ...options };

    if (!config.openaiKey) {
      throw new Error('OpenAI API Key 未配置');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.openaiKey}`
      },
      body: JSON.stringify({
        model: config.model,
        messages,
        temperature: config.temperature,
        max_tokens: config.maxTokens
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'API 请求失败');
    }

    return await response.json();
  }

  public async generateText(
    prompt: string,
    systemPrompt: string = '你是一个有帮助的助手。',
    options: Partial<AIConfig> = {}
  ): Promise<string> {
    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt }
    ];

    try {
      const response = await this.chatCompletion(messages, options);
      return response.choices[0].message.content;
    } catch (error) {
      console.error('AI 生成失败:', error);
      throw error;
    }
  }

  public async generateImage(
    prompt: string,
    size: '256x256' | '512x512' | '1024x1024' = '512x512'
  ): Promise<string> {
    if (!this.config.openaiKey) {
      throw new Error('OpenAI API Key 未配置');
    }

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.openaiKey}`
      },
      body: JSON.stringify({
        prompt,
        n: 1,
        size
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || '图片生成失败');
    }

    const data = await response.json();
    return data.data[0].url;
  }
} 