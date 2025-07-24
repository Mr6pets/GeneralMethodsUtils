/**
 * 微前端工具模块
 * 提供微应用加载、通信、生命周期管理等功能
 */

import {
  MicrofrontendOptions,
  AppConfig,
  AppInfo,
  AppStatus,
  AppLifecycle,
  AppSandbox,
  AppResources,
  AppMessage,
  GlobalStateChange,
  BrowserSupport
} from '../types';

interface App extends AppConfig {
  status: AppStatus;
  sandbox: AppSandbox | null;
  lifecycle: AppLifecycle;
  resources: AppResources;
}

/**
 * 微前端管理器
 */
export class MicrofrontendManager {
  private apps = new Map<string, App>();
  private eventBus = new EventTarget();
  private globalState = new Map<string, any>();
  private options: Required<MicrofrontendOptions>;

  constructor(options: MicrofrontendOptions = {}) {
    this.options = {
      sandbox: options.sandbox !== false,
      prefetch: options.prefetch || false,
      timeout: options.timeout || 30000
    };
  }

  /**
   * 注册微应用
   */
  registerApp(appConfig: AppConfig): void {
    const {
      name,
      entry,
      container,
      activeRule,
      props = {}
    } = appConfig;
    
    if (!name || !entry || !container) {
      throw new Error('App name, entry, and container are required');
    }
    
    const app: App = {
      name,
      entry,
      container,
      activeRule,
      props,
      status: 'NOT_LOADED',
      sandbox: null,
      lifecycle: {},
      resources: {
        scripts: [],
        styles: []
      }
    };
    
    this.apps.set(name, app);
    
    if (this.options.prefetch) {
      this.prefetchApp(name);
    }
  }

  /**
   * 预加载应用
   */
  async prefetchApp(appName: string): Promise<void> {
    const app = this.apps.get(appName);
    if (!app || app.status !== 'NOT_LOADED') {
      return;
    }
    
    try {
      await this.loadAppResources(app);
      app.status = 'LOADED';
    } catch (error) {
      console.error(`Failed to prefetch app ${appName}:`, error);
    }
  }

  /**
   * 加载应用资源
   */
  private async loadAppResources(app: App): Promise<void> {
    const { entry } = app;
    
    if (typeof entry === 'string') {
      const html = await this.fetchResource(entry);
      const { scripts, styles } = this.parseHTML(html);
      
      app.resources.scripts = scripts;
      app.resources.styles = styles;
    } else if (Array.isArray(entry)) {
      app.resources.scripts = entry.filter(url => url.endsWith('.js'));
      app.resources.styles = entry.filter(url => url.endsWith('.css'));
    }
  }

  /**
   * 获取资源
   */
  private async fetchResource(url: string): Promise<string> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }
    return await response.text();
  }

  /**
   * 解析HTML
   */
  private parseHTML(html: string): { scripts: string[]; styles: string[] } {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    const scripts = Array.from(doc.querySelectorAll('script[src]'))
      .map(script => (script as HTMLScriptElement).src);
    
    const styles = Array.from(doc.querySelectorAll('link[rel="stylesheet"]'))
      .map(link => (link as HTMLLinkElement).href);
    
    return { scripts, styles };
  }

  /**
   * 挂载应用
   */
  async mountApp(appName: string, props: Record<string, any> = {}): Promise<void> {
    const app = this.apps.get(appName);
    if (!app) {
      throw new Error(`App ${appName} not found`);
    }
    
    if (app.status === 'MOUNTED') {
      return;
    }
    
    try {
      if (app.status === 'NOT_LOADED') {
        await this.loadAppResources(app);
        app.status = 'LOADED';
      }
      
      if (this.options.sandbox) {
        app.sandbox = this.createSandbox(app);
      }
      
      await this.loadStyles(app);
      await this.loadScripts(app);
      
      app.lifecycle = this.getAppLifecycle(app);
      
      if (app.lifecycle.bootstrap) {
        await app.lifecycle.bootstrap({ ...app.props, ...props });
      }
      
      if (app.lifecycle.mount) {
        await app.lifecycle.mount({ ...app.props, ...props });
      }
      
      app.status = 'MOUNTED';
      this.emit('app-mounted', { name: appName, app });
    } catch (error) {
      app.status = 'LOAD_ERROR';
      this.emit('app-mount-error', { name: appName, error });
      throw error;
    }
  }

  /**
   * 卸载应用
   */
  async unmountApp(appName: string): Promise<void> {
    const app = this.apps.get(appName);
    if (!app || app.status !== 'MOUNTED') {
      return;
    }
    
    try {
      if (app.lifecycle.unmount) {
        await app.lifecycle.unmount(app.props);
      }
      
      this.unloadStyles(app);
      
      if (app.sandbox) {
        this.destroySandbox(app.sandbox);
        app.sandbox = null;
      }
      
      app.status = 'UNMOUNTED';
      this.emit('app-unmounted', { name: appName, app });
    } catch (error) {
      this.emit('app-unmount-error', { name: appName, error });
      throw error;
    }
  }

  /**
   * 创建沙箱
   */
  private createSandbox(app: App): AppSandbox {
    const sandbox: AppSandbox = {
      name: app.name,
      proxy: null,
      originalWindow: {},
      modifiedKeys: new Set()
    };
    
    sandbox.proxy = new Proxy(window, {
      get: (target, key) => {
        if (key === 'window' || key === 'self' || key === 'globalThis') {
          return sandbox.proxy;
        }
        return (target as any)[key];
      },
      
      set: (target, key, value) => {
        if (!sandbox.modifiedKeys.has(key as string)) {
          sandbox.originalWindow[key as string] = (target as any)[key];
          sandbox.modifiedKeys.add(key as string);
        }
        (target as any)[key] = value;
        return true;
      },
      
      has: (target, key) => {
        return key in target;
      }
    });
    
    return sandbox;
  }

  /**
   * 销毁沙箱
   */
  private destroySandbox(sandbox: AppSandbox): void {
    sandbox.modifiedKeys.forEach(key => {
      if (sandbox.originalWindow.hasOwnProperty(key)) {
        (window as any)[key] = sandbox.originalWindow[key];
      } else {
        delete (window as any)[key];
      }
    });
    
    sandbox.modifiedKeys.clear();
    sandbox.originalWindow = {};
    sandbox.proxy = null;
  }

  /**
   * 加载样式
   */
  private async loadStyles(app: App): Promise<void> {
    const { styles } = app.resources;
    
    for (const styleUrl of styles) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = styleUrl;
      link.setAttribute('data-app', app.name);
      
      document.head.appendChild(link);
      
      await new Promise<void>((resolve, reject) => {
        link.onload = () => resolve();
        link.onerror = () => reject(new Error(`Failed to load style: ${styleUrl}`));
      });
    }
  }

  /**
   * 卸载样式
   */
  private unloadStyles(app: App): void {
    const styleElements = document.querySelectorAll(`link[data-app="${app.name}"]`);
    styleElements.forEach(element => {
      element.remove();
    });
  }

  /**
   * 加载脚本
   */
  private async loadScripts(app: App): Promise<void> {
    const { scripts } = app.resources;
    
    for (const scriptUrl of scripts) {
      await this.loadScript(scriptUrl, app);
    }
  }

  /**
   * 加载单个脚本
   */
  private async loadScript(scriptUrl: string, app: App): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = scriptUrl;
      script.setAttribute('data-app', app.name);
      
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${scriptUrl}`));
      
      document.head.appendChild(script);
    });
  }

  /**
   * 获取应用生命周期函数
   */
  private getAppLifecycle(app: App): AppLifecycle {
    const globalKey = `__MICRO_APP_${app.name.toUpperCase()}__`;
    const lifecycle = (window as any)[globalKey];
    
    if (!lifecycle) {
      console.warn(`Lifecycle functions not found for app ${app.name}`);
      return {};
    }
    
    return {
      bootstrap: lifecycle.bootstrap,
      mount: lifecycle.mount,
      unmount: lifecycle.unmount,
      update: lifecycle.update
    };
  }

  /**
   * 检查应用是否应该激活
   */
  shouldAppBeActive(appName: string, location: string = window.location.pathname): boolean {
    const app = this.apps.get(appName);
    if (!app || !app.activeRule) {
      return false;
    }
    
    if (typeof app.activeRule === 'string') {
      return location.startsWith(app.activeRule);
    } else if (typeof app.activeRule === 'function') {
      return app.activeRule(location);
    } else if (app.activeRule instanceof RegExp) {
      return app.activeRule.test(location);
    }
    
    return false;
  }

  /**
   * 路由变化处理
   */
  async handleRouteChange(location: string): Promise<void> {
    const promises: Promise<void>[] = [];
    
    for (const [appName, app] of this.apps) {
      const shouldBeActive = this.shouldAppBeActive(appName, location);
      
      if (shouldBeActive && app.status !== 'MOUNTED') {
        promises.push(this.mountApp(appName));
      } else if (!shouldBeActive && app.status === 'MOUNTED') {
        promises.push(this.unmountApp(appName));
      }
    }
    
    await Promise.all(promises);
  }

  /**
   * 设置全局状态
   */
  setGlobalState(key: string, value: any): void {
    const oldValue = this.globalState.get(key);
    this.globalState.set(key, value);
    
    this.emit('global-state-change', {
      key,
      value,
      oldValue
    });
  }

  /**
   * 获取全局状态
   */
  getGlobalState(key: string): any {
    return this.globalState.get(key);
  }

  /**
   * 应用间通信
   */
  sendMessage(targetApp: string, action: string, data: any): void {
    this.emit('app-message', {
      targetApp,
      action,
      data,
      timestamp: Date.now()
    });
  }

  /**
   * 监听应用消息
   */
  onMessage(action: string, handler: (message: AppMessage) => void): void {
    this.eventBus.addEventListener('app-message', (event: any) => {
      if (event.detail.action === action) {
        handler(event.detail);
      }
    });
  }

  /**
   * 触发事件
   */
  private emit(type: string, detail: any): void {
    const event = new CustomEvent(type, { detail });
    this.eventBus.dispatchEvent(event);
  }

  /**
   * 监听事件
   */
  on(type: string, handler: EventListener): void {
    this.eventBus.addEventListener(type, handler);
  }

  /**
   * 移除事件监听
   */
  off(type: string, handler: EventListener): void {
    this.eventBus.removeEventListener(type, handler);
  }

  /**
   * 获取应用信息
   */
  getAppInfo(appName: string): AppInfo | null {
    const app = this.apps.get(appName);
    if (!app) {
      return null;
    }
    
    return {
      name: app.name,
      status: app.status,
      entry: app.entry,
      container: app.container,
      activeRule: app.activeRule
    };
  }

  /**
   * 获取所有应用信息
   */
  getAllApps(): AppInfo[] {
    return Array.from(this.apps.keys()).map(name => this.getAppInfo(name)!).filter(Boolean);
  }

  /**
   * 销毁管理器
   */
  async destroy(): Promise<void> {
    const unmountPromises: Promise<void>[] = [];
    for (const [appName, app] of this.apps) {
      if (app.status === 'MOUNTED') {
        unmountPromises.push(this.unmountApp(appName));
      }
    }
    
    await Promise.all(unmountPromises);
    this.apps.clear();
    this.globalState.clear();
  }
}

/**
 * 路由监听器
 */
export class RouteListener {
  private manager: MicrofrontendManager;
  private isListening = false;
  private originalPushState?: typeof history.pushState;
  private originalReplaceState?: typeof history.replaceState;

  constructor(microfrontendManager: MicrofrontendManager) {
    this.manager = microfrontendManager;
  }

  /**
   * 开始监听路由变化
   */
  start(): void {
    if (this.isListening) return;
    
    this.isListening = true;
    
    window.addEventListener('popstate', this.handleRouteChange.bind(this));
    this.hijackHistory();
    this.handleRouteChange();
  }

  /**
   * 停止监听路由变化
   */
  stop(): void {
    if (!this.isListening) return;
    
    this.isListening = false;
    window.removeEventListener('popstate', this.handleRouteChange.bind(this));
    this.restoreHistory();
  }

  /**
   * 处理路由变化
   */
  private handleRouteChange(): void {
    if (this.manager) {
      this.manager.handleRouteChange(window.location.pathname);
    }
  }

  /**
   * 劫持 History API
   */
  private hijackHistory(): void {
    this.originalPushState = history.pushState;
    this.originalReplaceState = history.replaceState;
    
    history.pushState = (...args: any[]) => {
      this.originalPushState!.apply(history, args);
      this.handleRouteChange();
    };
    
    history.replaceState = (...args: any[]) => {
      this.originalReplaceState!.apply(history, args);
      this.handleRouteChange();
    };
  }

  /**
   * 恢复 History API
   */
  private restoreHistory(): void {
    if (this.originalPushState) {
      history.pushState = this.originalPushState;
    }
    if (this.originalReplaceState) {
      history.replaceState = this.originalReplaceState;
    }
  }
}

// 工具函数
export const microfrontendUtils = {
  MicrofrontendManager,
  RouteListener,
  
  /**
   * 创建微前端管理器实例
   */
  createMicrofrontendManager(options?: MicrofrontendOptions): MicrofrontendManager {
    return new MicrofrontendManager(options);
  },
  
  /**
   * 创建路由监听器实例
   */
  createRouteListener(manager: MicrofrontendManager): RouteListener {
    return new RouteListener(manager);
  },
  
  /**
   * 检查浏览器支持
   */
  checkBrowserSupport(): BrowserSupport {
    return {
      proxy: typeof Proxy !== 'undefined',
      customElements: 'customElements' in window,
      shadowDOM: 'attachShadow' in Element.prototype,
      modules: 'noModule' in HTMLScriptElement.prototype
    };
  }
};

export default microfrontendUtils;