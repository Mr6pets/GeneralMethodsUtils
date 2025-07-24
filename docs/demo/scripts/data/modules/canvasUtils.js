/**
 * Canvas工具模块演示数据 - 专业级Canvas绘图、图像处理和动画工具
 */
export default {
    title: 'Canvas工具',
    icon: 'Palette',
    description: '专业级Canvas绘图、图像处理、动画系统和WebGL工具集',
    methods: {
        CanvasRenderer: {
            name: 'CanvasRenderer',
            description: '高性能Canvas渲染器，支持图层管理、缓存和批量渲染',
            params: [
                { name: 'container', type: 'HTMLElement', required: true, description: '容器元素' },
                { name: 'options', type: 'object', required: false, description: '渲染器配置' }
            ],
            examples: {
                js: `// 创建多图层渲染器
const renderer = new CanvasRenderer(document.getElementById('game-container'), {
  width: 1920,
  height: 1080,
  pixelRatio: window.devicePixelRatio,
  antialias: true,
  preserveDrawingBuffer: true,
  layers: [
    { name: 'background', zIndex: 0, alpha: 1.0 },
    { name: 'game-world', zIndex: 10, alpha: 1.0 },
    { name: 'ui-overlay', zIndex: 100, alpha: 0.9 },
    { name: 'debug', zIndex: 1000, alpha: 0.7, visible: false }
  ]
});

// 游戏场景渲染
class GameScene {
  constructor(renderer) {
    this.renderer = renderer;
    this.entities = [];
    this.camera = { x: 0, y: 0, zoom: 1 };
  }
  
  addEntity(entity) {
    this.entities.push(entity);
  }
  
  render(deltaTime) {
    // 清除画布
    this.renderer.clear('game-world');
    
    // 设置相机变换
    this.renderer.setTransform('game-world', {
      translate: [-this.camera.x, -this.camera.y],
      scale: [this.camera.zoom, this.camera.zoom]
    });
    
    // 批量渲染实体
    const visibleEntities = this.cullEntities();
    this.renderer.batchRender('game-world', visibleEntities, (ctx, entity) => {
      entity.render(ctx, deltaTime);
    });
    
    // 渲染UI层
    this.renderUI();
  }
  
  cullEntities() {
    const viewport = this.getViewport();
    return this.entities.filter(entity => 
      entity.bounds.intersects(viewport)
    );
  }
}`,
                ts: `interface RendererOptions {
  width: number;
  height: number;
  pixelRatio?: number;
  antialias?: boolean;
  preserveDrawingBuffer?: boolean;
  layers?: LayerConfig[];
}

interface LayerConfig {
  name: string;
  zIndex: number;
  alpha: number;
  visible?: boolean;
}

class CanvasRenderer {
  constructor(container: HTMLElement, options: RendererOptions) {}
  
  clear(layerName: string): void {}
  setTransform(layerName: string, transform: Transform): void {}
  batchRender<T>(layerName: string, items: T[], renderFn: (ctx: CanvasRenderingContext2D, item: T) => void): void {}
}

const renderer: CanvasRenderer = new CanvasRenderer(container, options);`
            },
            demo: true
        },
        
        ImageProcessor: {
            name: 'ImageProcessor',
            description: '图像处理工具，支持滤镜、变换、合成和批量处理',
            params: [
                { name: 'canvas', type: 'HTMLCanvasElement', required: true, description: '目标画布' },
                { name: 'options', type: 'object', required: false, description: '处理选项' }
            ],
            examples: {
                js: `// 创建图像处理器
const processor = new ImageProcessor(canvas, {
  webgl: true, // 使用WebGL加速
  preserveAlpha: true,
  colorSpace: 'srgb'
});

// 加载和处理图像
const image = await processor.loadImage('/path/to/image.jpg');

// 应用多重滤镜
const processedImage = await processor
  .brightness(1.2)
  .contrast(1.1)
  .saturation(1.3)
  .gaussianBlur(2)
  .sharpen(0.5)
  .vignette({ strength: 0.3, radius: 0.8 })
  .process(image);

// 高级颜色调整
const colorCorrected = await processor.colorCorrection(image, {
  shadows: { r: 0.95, g: 0.98, b: 1.05 },
  midtones: { r: 1.0, g: 1.0, b: 1.0 },
  highlights: { r: 1.05, g: 1.02, b: 0.95 },
  gamma: 1.1,
  exposure: 0.2
});

// 批量处理
const images = ['img1.jpg', 'img2.jpg', 'img3.jpg'];
const batchResults = await processor.batchProcess(images, [
  { filter: 'resize', params: { width: 800, height: 600, mode: 'cover' } },
  { filter: 'brightness', params: 1.1 },
  { filter: 'contrast', params: 1.05 },
  { filter: 'watermark', params: { 
    text: '© 2024 MyCompany', 
    position: 'bottom-right',
    opacity: 0.7,
    font: '16px Arial'
  }}
], {
  format: 'webp',
  quality: 0.85,
  progressive: true
});`,
                ts: `interface ProcessorOptions {
  webgl?: boolean;
  preserveAlpha?: boolean;
  colorSpace?: 'srgb' | 'rec2020' | 'p3';
}

interface FilterParams {
  filter: string;
  params: any;
}

interface BatchOptions {
  format?: 'jpeg' | 'png' | 'webp';
  quality?: number;
  progressive?: boolean;
}

class ImageProcessor {
  constructor(canvas: HTMLCanvasElement, options?: ProcessorOptions) {}
  
  async loadImage(src: string): Promise<ImageData> {}
  brightness(value: number): ImageProcessor {}
  contrast(value: number): ImageProcessor {}
  async batchProcess(images: string[], filters: FilterParams[], options?: BatchOptions): Promise<Blob[]> {}
}

const processor: ImageProcessor = new ImageProcessor(canvas, options);`
            },
            demo: true
        },
        
        AnimationEngine: {
            name: 'AnimationEngine',
            description: '高性能动画引擎，支持时间轴、缓动函数和复杂动画序列',
            params: [
                { name: 'renderer', type: 'CanvasRenderer', required: true, description: '渲染器实例' },
                { name: 'options', type: 'object', required: false, description: '动画引擎配置' }
            ],
            examples: {
                js: `// 创建动画引擎
const animEngine = new AnimationEngine(renderer, {
  fps: 60,
  interpolation: 'cubic-bezier',
  autoStart: true
});

// 复杂动画序列：Logo展示动画
const logoAnimation = animEngine.createTimeline({
  duration: 5000,
  loop: false,
  onComplete: () => console.log('Logo animation completed')
});

// 添加多个动画轨道
logoAnimation
  .to('.logo', {
    duration: 1000,
    from: { scale: 0, rotation: -180, alpha: 0 },
    to: { scale: 1, rotation: 0, alpha: 1 },
    easing: 'elastic.out'
  })
  .to('.logo-text', {
    duration: 800,
    delay: 500,
    from: { x: -200, alpha: 0 },
    to: { x: 0, alpha: 1 },
    easing: 'back.out'
  })
  .to('.particles', {
    duration: 2000,
    delay: 1000,
    from: { count: 0 },
    to: { count: 100 },
    easing: 'power2.out',
    onUpdate: (progress, values) => {
      particleSystem.setEmissionRate(values.count);
    }
  });

// 交互式动画：拖拽和物理模拟
class DraggableObject {
  constructor(x, y, mass = 1) {
    this.position = { x, y };
    this.velocity = { x: 0, y: 0 };
    this.mass = mass;
    this.isDragging = false;
    this.constraints = [];
  }
  
  addSpringConstraint(target, stiffness = 0.1, damping = 0.8) {
    this.constraints.push({
      type: 'spring',
      target,
      stiffness,
      damping
    });
  }
  
  update(deltaTime) {
    if (!this.isDragging) {
      // 应用约束力
      this.constraints.forEach(constraint => {
        if (constraint.type === 'spring') {
          const dx = constraint.target.x - this.position.x;
          const dy = constraint.target.y - this.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance > 0) {
            const force = distance * constraint.stiffness;
            this.velocity.x += (dx / distance) * force * deltaTime;
            this.velocity.y += (dy / distance) * force * deltaTime;
          }
        }
      });
      
      // 应用阻尼
      this.velocity.x *= 0.98;
      this.velocity.y *= 0.98;
      
      // 更新位置
      this.position.x += this.velocity.x * deltaTime;
      this.position.y += this.velocity.y * deltaTime;
    }
  }
}`,
                ts: `interface AnimationOptions {
  fps?: number;
  interpolation?: 'linear' | 'cubic-bezier';
  autoStart?: boolean;
}

interface TimelineConfig {
  duration: number;
  loop?: boolean;
  onComplete?: () => void;
}

interface AnimationProps {
  duration: number;
  delay?: number;
  from: Record<string, number>;
  to: Record<string, number>;
  easing?: string;
  onUpdate?: (progress: number, values: Record<string, number>) => void;
}

class AnimationEngine {
  constructor(renderer: CanvasRenderer, options?: AnimationOptions) {}
  
  createTimeline(config: TimelineConfig): Timeline {}
  createParticleAnimation(config: any): ParticleAnimation {}
}

class Timeline {
  to(selector: string, props: AnimationProps): Timeline {}
}

const animEngine: AnimationEngine = new AnimationEngine(renderer, options);`
            },
            demo: true
        },
        
        ChartRenderer: {
            name: 'ChartRenderer',
            description: '专业图表渲染器，支持多种图表类型和实时数据可视化',
            params: [
                { name: 'canvas', type: 'HTMLCanvasElement', required: true, description: '画布元素' },
                { name: 'chartType', type: 'string', required: true, description: '图表类型' },
                { name: 'options', type: 'object', required: false, description: '图表配置' }
            ],
            examples: {
                js: `// 创建实时股票图表
const stockChart = new ChartRenderer(canvas, 'candlestick', {
  width: 1200,
  height: 600,
  theme: 'dark',
  realtime: true,
  animations: {
    enabled: true,
    duration: 300,
    easing: 'easeOutQuart'
  },
  grid: {
    show: true,
    color: '#333',
    lineWidth: 1
  },
  axes: {
    x: {
      type: 'time',
      format: 'HH:mm:ss',
      range: 'auto',
      zoom: true,
      pan: true
    },
    y: {
      type: 'linear',
      format: '$,.2f',
      range: 'auto',
      position: 'right'
    }
  },
  series: [
    {
      name: 'AAPL',
      type: 'candlestick',
      data: [],
      style: {
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderUpColor: '#26a69a',
        borderDownColor: '#ef5350',
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350'
      }
    },
    {
      name: 'Volume',
      type: 'histogram',
      yAxis: 'volume',
      data: [],
      style: {
        color: '#42a5f5',
        opacity: 0.6
      }
    }
  ]
});

// 实时数据更新
const ws = new WebSocket('wss://api.example.com/stock/AAPL');
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  stockChart.updateData({
    timestamp: data.timestamp,
    open: data.open,
    high: data.high,
    low: data.low,
    close: data.close,
    volume: data.volume
  });
};`,
                ts: `interface ChartOptions {
  width: number;
  height: number;
  theme?: 'light' | 'dark';
  realtime?: boolean;
  animations?: AnimationConfig;
  grid?: GridConfig;
  axes?: AxesConfig;
  series?: SeriesConfig[];
}

interface SeriesConfig {
  name: string;
  type: 'candlestick' | 'line' | 'histogram' | 'bar' | 'pie';
  data: any[];
  style?: StyleConfig;
  yAxis?: string;
}

class ChartRenderer {
  constructor(canvas: HTMLCanvasElement, chartType: string, options?: ChartOptions) {}
  
  updateData(data: any): void {}
  setTheme(theme: string): void {}
  exportImage(format: 'png' | 'svg' | 'pdf'): Blob {}
}

const chart: ChartRenderer = new ChartRenderer(canvas, 'candlestick', options);`
            },
            demo: true
        },
        
        WebGLRenderer: {
            name: 'WebGLRenderer',
            description: '高性能WebGL渲染器，支持3D图形、着色器和GPU加速',
            params: [
                { name: 'canvas', type: 'HTMLCanvasElement', required: true, description: '画布元素' },
                { name: 'options', type: 'object', required: false, description: 'WebGL配置' }
            ],
            examples: {
                js: `// 创建WebGL渲染器
const glRenderer = new WebGLRenderer(canvas, {
  antialias: true,
  alpha: true,
  depth: true,
  stencil: false,
  preserveDrawingBuffer: false,
  powerPreference: 'high-performance'
});

// 3D场景设置
const scene = glRenderer.createScene({
  background: { type: 'skybox', texture: 'sky.hdr' },
  fog: { type: 'exponential', density: 0.01, color: '#cccccc' },
  lighting: {
    ambient: { color: '#404040', intensity: 0.3 },
    directional: {
      color: '#ffffff',
      intensity: 1.0,
      position: [10, 10, 5],
      shadows: true,
      shadowMapSize: 2048
    }
  }
});

// 自定义着色器材质
const material = glRenderer.createMaterial({
  type: 'custom',
  vertexShader: \`
    attribute vec3 position;
    attribute vec3 normal;
    attribute vec2 uv;
    
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    uniform mat3 normalMatrix;
    uniform float time;
    
    varying vec3 vNormal;
    varying vec2 vUv;
    
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vUv = uv;
      
      // 波浪变形
      vec3 pos = position;
      pos.z += sin(pos.x * 2.0 + time) * 0.1;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  \`,
  fragmentShader: \`
    precision mediump float;
    
    uniform float time;
    uniform vec3 color;
    uniform sampler2D texture1;
    
    varying vec3 vNormal;
    varying vec2 vUv;
    
    void main() {
      vec3 normal = normalize(vNormal);
      vec2 uv = vUv + sin(time * 0.5) * 0.01;
      
      vec4 texColor = texture2D(texture1, uv);
      
      // 简单光照计算
      vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
      float diff = max(dot(normal, lightDir), 0.0);
      
      vec3 finalColor = color * texColor.rgb * (0.3 + diff * 0.7);
      
      gl_FragColor = vec4(finalColor, texColor.a);
    }
  \`,
  uniforms: {
    time: { type: 'float', value: 0 },
    color: { type: 'vec3', value: [1.0, 0.5, 0.2] },
    texture1: { type: 'texture', value: 'diffuse.jpg' }
  }
});`,
                ts: `interface WebGLOptions {
  antialias?: boolean;
  alpha?: boolean;
  depth?: boolean;
  stencil?: boolean;
  preserveDrawingBuffer?: boolean;
  powerPreference?: 'default' | 'high-performance' | 'low-power';
}

interface MaterialConfig {
  type: 'basic' | 'phong' | 'pbr' | 'custom';
  vertexShader?: string;
  fragmentShader?: string;
  uniforms?: Record<string, UniformConfig>;
}

class WebGLRenderer {
  constructor(canvas: HTMLCanvasElement, options?: WebGLOptions) {}
  
  createScene(config: SceneConfig): Scene {}
  createMaterial(config: MaterialConfig): Material {}
  render(scene: Scene, camera: Camera): void {}
}

const glRenderer: WebGLRenderer = new WebGLRenderer(canvas, options);`
            },
            demo: true
        },
        
        CanvasRecorder: {
            name: 'CanvasRecorder',
            description: 'Canvas录制工具，支持视频导出、GIF生成和实时流媒体',
            params: [
                { name: 'canvas', type: 'HTMLCanvasElement', required: true, description: '要录制的画布' },
                { name: 'options', type: 'object', required: false, description: '录制配置' }
            ],
            examples: {
                js: `// 创建录制器
const recorder = new CanvasRecorder(canvas, {
  fps: 60,
  quality: 0.9,
  format: 'webm',
  codec: 'vp9',
  bitrate: 5000000, // 5Mbps
  audio: {
    enabled: true,
    source: 'microphone',
    sampleRate: 48000,
    channels: 2
  }
});

// 录制动画演示
class AnimationRecorder {
  constructor(canvas, duration = 10000) {
    this.canvas = canvas;
    this.duration = duration;
    this.recorder = new CanvasRecorder(canvas, {
      fps: 30,
      format: 'mp4',
      quality: 0.8
    });
  }
  
  async recordAnimation(animationFn) {
    const startTime = Date.now();
    
    // 开始录制
    await this.recorder.start();
    
    // 运行动画
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / this.duration, 1);
      
      // 执行动画函数
      animationFn(progress, elapsed);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // 动画完成，停止录制
        this.recorder.stop().then(blob => {
          this.downloadVideo(blob, 'animation.mp4');
        });
      }
    };
    
    requestAnimationFrame(animate);
  }
}`,
                ts: `interface RecorderOptions {
  fps?: number;
  quality?: number;
  format?: 'webm' | 'mp4' | 'gif' | 'stream';
  codec?: 'vp8' | 'vp9' | 'h264';
  bitrate?: number;
  audio?: AudioConfig;
}

interface AudioConfig {
  enabled: boolean;
  source?: 'microphone' | 'system';
  sampleRate?: number;
  channels?: number;
}

class CanvasRecorder {
  constructor(canvas: HTMLCanvasElement, options?: RecorderOptions) {}
  
  async start(): Promise<void> {}
  async stop(): Promise<Blob> {}
  async startStream(): Promise<MediaStream> {}
}

const recorder: CanvasRecorder = new CanvasRecorder(canvas, options);`
            },
            demo: true
        }
    }
};