import {
  AIModelOptions,
  ChatMessage,
  ChatResponse,
  ImageAnalysisOptions,
  ImageAnalysisResult,
  TextAnalysisOptions,
  TextAnalysisResult,
  MLModelConfig,
  PredictionResult
} from '../types';

/**
 * AI/ML 集成工具类
 */
export class AIMLManager {
  private apiKey: string;
  private baseURL: string;
  private defaultModel: string;
  private models: Map<string, MLModelConfig> = new Map();

  constructor(options: AIModelOptions = {}) {
    this.apiKey = options.apiKey || '';
    this.baseURL = options.baseURL || 'https://api.openai.com/v1';
    this.defaultModel = options.model || 'gpt-3.5-turbo';
  }

  /**
   * 聊天对话
   */
  async chat(messages: ChatMessage[], options: AIModelOptions = {}): Promise<ChatResponse> {
    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: options.model || this.defaultModel,
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          temperature: options.temperature || 0.7,
          max_tokens: options.maxTokens || 1000
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        message: data.choices[0].message.content,
        usage: data.usage ? {
          promptTokens: data.usage.prompt_tokens,
          completionTokens: data.usage.completion_tokens,
          totalTokens: data.usage.total_tokens
        } : undefined,
        model: data.model
      };
    } catch (error) {
      throw new Error(`Chat request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 图像分析
   */
  async analyzeImage(imageData: string | File, options: ImageAnalysisOptions = {}): Promise<ImageAnalysisResult> {
    try {
      let base64Image: string;
      
      if (typeof imageData === 'string') {
        base64Image = imageData;
      } else {
        base64Image = await this.fileToBase64(imageData);
      }

      // 模拟图像分析结果（实际应用中需要调用真实的图像分析 API）
      const result: ImageAnalysisResult = {};
      
      if (!options.features || options.features.includes('objects')) {
        result.objects = [
          { name: 'person', confidence: 0.95, bbox: [100, 100, 200, 300] },
          { name: 'car', confidence: 0.87, bbox: [300, 150, 500, 250] }
        ];
      }
      
      if (!options.features || options.features.includes('text')) {
        result.text = [
          { text: 'Sample Text', confidence: 0.92, bbox: [50, 50, 150, 70] }
        ];
      }
      
      if (!options.features || options.features.includes('colors')) {
        result.colors = [
          { color: '#FF0000', percentage: 25.5 },
          { color: '#00FF00', percentage: 30.2 },
          { color: '#0000FF', percentage: 44.3 }
        ];
      }

      return result;
    } catch (error) {
      throw new Error(`Image analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 文本分析
   */
  async analyzeText(text: string, options: TextAnalysisOptions = {}): Promise<TextAnalysisResult> {
    try {
      const result: TextAnalysisResult = {};
      
      if (!options.features || options.features.includes('sentiment')) {
        // 简单的情感分析实现
        const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', '好', '棒', '优秀'];
        const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'worst', '坏', '糟糕', '差'];
        
        const words = text.toLowerCase().split(/\s+/);
        let positiveCount = 0;
        let negativeCount = 0;
        
        words.forEach(word => {
          if (positiveWords.some(pw => word.includes(pw))) positiveCount++;
          if (negativeWords.some(nw => word.includes(nw))) negativeCount++;
        });
        
        const score = (positiveCount - negativeCount) / words.length;
        result.sentiment = {
          score,
          label: score > 0.1 ? 'positive' : score < -0.1 ? 'negative' : 'neutral',
          confidence: Math.min(Math.abs(score) * 2 + 0.5, 1)
        };
      }
      
      if (!options.features || options.features.includes('entities')) {
        // 简单的实体识别
        const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
        const phoneRegex = /\b\d{3}-\d{3}-\d{4}\b/g;
        
        result.entities = [];
        
        const emails = text.match(emailRegex);
        if (emails) {
          emails.forEach(email => {
            result.entities!.push({ text: email, type: 'email', confidence: 0.9 });
          });
        }
        
        const phones = text.match(phoneRegex);
        if (phones) {
          phones.forEach(phone => {
            result.entities!.push({ text: phone, type: 'phone', confidence: 0.85 });
          });
        }
      }
      
      if (!options.features || options.features.includes('keywords')) {
        // 简单的关键词提取
        const words = text.toLowerCase().split(/\s+/);
        const wordCount = new Map<string, number>();
        
        words.forEach(word => {
          if (word.length > 3) {
            wordCount.set(word, (wordCount.get(word) || 0) + 1);
          }
        });
        
        result.keywords = Array.from(wordCount.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([text, count]) => ({ text, relevance: count / words.length }));
      }

      return result;
    } catch (error) {
      throw new Error(`Text analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 注册机器学习模型
   */
  registerModel(config: MLModelConfig): void {
    this.models.set(config.name, config);
  }

  /**
   * 预测
   */
  async predict(modelName: string, inputData: any): Promise<PredictionResult> {
    const startTime = performance.now();
    
    try {
      const model = this.models.get(modelName);
      if (!model) {
        throw new Error(`Model '${modelName}' not found`);
      }

      // 预处理数据
      let processedData = inputData;
      if (model.preprocessing) {
        processedData = model.preprocessing(inputData);
      }

      // 模拟预测过程（实际应用中需要调用真实的模型推理）
      let predictions: any[];
      let confidence: number[] | undefined;
      let probabilities: number[][] | undefined;

      switch (model.type) {
        case 'classification':
          predictions = ['class_a'];
          confidence = [0.85];
          probabilities = [[0.85, 0.15]];
          break;
        case 'regression':
          predictions = [42.5];
          confidence = [0.92];
          break;
        case 'clustering':
          predictions = [0];
          break;
        default:
          predictions = [processedData];
      }

      // 后处理结果
      if (model.postprocessing) {
        predictions = model.postprocessing(predictions);
      }

      const processingTime = performance.now() - startTime;

      return {
        predictions,
        confidence,
        probabilities,
        processingTime
      };
    } catch (error) {
      throw new Error(`Prediction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 获取已注册的模型列表
   */
  getModels(): MLModelConfig[] {
    return Array.from(this.models.values());
  }

  /**
   * 文件转 Base64
   */
  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]); // 移除 data:image/...;base64, 前缀
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * 设置 API 密钥
   */
  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  /**
   * 设置基础 URL
   */
  setBaseURL(baseURL: string): void {
    this.baseURL = baseURL;
  }
}

// 创建默认实例
const aimlManager = new AIMLManager();

// 导出工具函数
export const aimlUtils = {
  // AI 聊天
  chat: (messages: ChatMessage[], options?: AIModelOptions) => aimlManager.chat(messages, options),
  
  // 图像分析
  analyzeImage: (imageData: string | File, options?: ImageAnalysisOptions) => 
    aimlManager.analyzeImage(imageData, options),
  
  // 文本分析
  analyzeText: (text: string, options?: TextAnalysisOptions) => 
    aimlManager.analyzeText(text, options),
  
  // 模型管理
  registerModel: (config: MLModelConfig) => aimlManager.registerModel(config),
  predict: (modelName: string, inputData: any) => aimlManager.predict(modelName, inputData),
  getModels: () => aimlManager.getModels(),
  
  // 配置
  setApiKey: (apiKey: string) => aimlManager.setApiKey(apiKey),
  setBaseURL: (baseURL: string) => aimlManager.setBaseURL(baseURL),
  
  // 创建新实例
  createManager: (options?: AIModelOptions) => new AIMLManager(options)
};

export default aimlUtils;