/**
 * 微前端工具模块
 * 提供微应用加载、通信、生命周期管理等功能
 */

/**
 * 微前端管理器
 */
class MicrofrontendManager {
  constructor(options = {}) {
    this.apps = new Map();
    this.eventBus = new EventTarget();
    this.globalState = new Map();
    this.options = {
      sandbox: options.sandbox !== false,
      prefetch: options.prefetch || false,
      timeout: options.timeout || 30000,
      ...options
    };
  }

  /**
   * 注册微应用
   * @param {Object} appConfig 应用配置
   */
  registerApp(appConfig) {
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
    
    const app = {
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
    
    // 预加载
    if (this.options.prefetch) {
      this.prefetchApp(name);
    }
  }

  /**
   * 预加载应用
   * @param {string} appName 应用名称
   */
  async prefetchApp(appName) {
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
   * @param {Object} app 应用对象
   */
  async loadAppResources(app) {
    const { entry } = app;
    
    if (typeof entry === 'string') {
      // HTML 入口
      const html = await this.fetchResource(entry);
      const { scripts, styles } = this.parseHTML(html);
      
      app.resources.scripts = scripts;
      app.resources.styles = styles;
    } else if (Array.isArray(entry)) {
      // 资源数组
      app.resources.scripts = entry.filter(url => url.endsWith('.js'));
      app.resources.styles = entry.filter(url => url.endsWith('.css'));
    }
  }

  /**
   * 获取资源
   * @param {string} url 资源URL
   * @returns {Promise<string>} 资源内容
   */
  async fetchResource(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }
    return await response.text();
  }

  /**
   * 解析HTML
   * @param {string} html HTML内容
   * @returns {Object} 解析结果
   */
  parseHTML(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    const scripts = Array.from(doc.querySelectorAll('script[src]'))
      .map(script => script.src);
    
    const styles = Array.from(doc.querySelectorAll('link[rel="stylesheet"]'))
      .map(link => link.href);
    
    return { scripts, styles };
  }

  /**
   * 挂载应用
   * @param {string} appName 应用名称
   * @param {Object} props 传递给应用的属性
   */
  async mountApp(appName, props = {}) {
    const app = this.apps.get(appName);
    if (!app) {
      throw new Error(`App ${appName} not found`);
    }
    
    if (app.status === 'MOUNTED') {
      return;
    }
    
    try {
      // 加载资源（如果还未加载）
      if (app.status === 'NOT_LOADED') {
        await this.loadAppResources(app);
        app.status = 'LOADED';
      }
      
      // 创建沙箱
      if (this.options.sandbox) {
        app.sandbox = this.createSandbox(app);
      }
      
      // 加载样式
      await this.loadStyles(app);
      
      // 加载脚本
      await this.loadScripts(app);
      
      // 获取生命周期函数
      app.lifecycle = this.getAppLifecycle(app);
      
      // 执行 bootstrap
      if (app.lifecycle.bootstrap) {
        await app.lifecycle.bootstrap({ ...app.props, ...props });
      }
      
      // 执行 mount
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
   * @param {string} appName 应用名称
   */
  async unmountApp(appName) {
    const app = this.apps.get(appName);
    if (!app || app.status !== 'MOUNTED') {
      return;
    }
    
    try {
      // 执行 unmount
      if (app.lifecycle.unmount) {
        await app.lifecycle.unmount(app.props);
      }
      
      // 清理样式
      this.unloadStyles(app);
      
      // 清理沙箱
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
   * @param {Object} app 应用对象
   * @returns {Object} 沙箱对象
   */
  createSandbox(app) {
    const sandbox = {
      name: app.name,
      proxy: null,
      originalWindow: {},
      modifiedKeys: new Set()
    };
    
    // 创建代理对象
    sandbox.proxy = new Proxy(window, {
      get: (target, key) => {
        if (key === 'window' || key === 'self' || key === 'globalThis') {
          return sandbox.proxy;
        }
        return target[key];
      },
      
      set: (target, key, value) => {
        if (!sandbox.modifiedKeys.has(key)) {
          sandbox.originalWindow[key] = target[key];
          sandbox.modifiedKeys.add(key);
        }
        target[key] = value;
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
   * @param {Object} sandbox 沙箱对象
   */
  destroySandbox(sandbox) {
    // 恢复原始值
    sandbox.modifiedKeys.forEach(key => {
      if (sandbox.originalWindow.hasOwnProperty(key)) {
        window[key] = sandbox.originalWindow[key];
      } else {
        delete window[key];
      }
    });
    
    sandbox.modifiedKeys.clear();
    sandbox.originalWindow = {};
    sandbox.proxy = null;
  }

  /**
   * 加载样式
   * @param {Object} app 应用对象
   */
  async loadStyles(app) {
    const { styles } = app.resources;
    
    for (const styleUrl of styles) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = styleUrl;
      link.setAttribute('data-app', app.name);
      
      document.head.appendChild(link);
      
      // 等待样式加载完成
      await new Promise((resolve, reject) => {
        link.onload = resolve;
        link.onerror = reject;
      });
    }
  }

  /**
   * 卸载样式
   * @param {Object} app 应用对象
   */
  unloadStyles(app) {
    const styleElements = document.querySelectorAll(`link[data-app="${app.name}"]`);
    styleElements.forEach(element => {
      element.remove();
    });
  }

  /**
   * 加载脚本
   * @param {Object} app 应用对象
   */
  async loadScripts(app) {
    const { scripts } = app.resources;
    
    for (const scriptUrl of scripts) {
      await this.loadScript(scriptUrl, app);
    }
  }

  /**
   * 加载单个脚本
   * @param {string} scriptUrl 脚本URL
   * @param {Object} app 应用对象
   */
  async loadScript(scriptUrl, app) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = scriptUrl;
      script.setAttribute('data-app', app.name);
      
      script.onload = () => {
        resolve();
      };
      
      script.onerror = () => {
        reject(new Error(`Failed to load script: ${scriptUrl}`));
      };
      
      // 在沙箱环境中执行
      if (app.sandbox) {
        // 这里需要更复杂的脚本隔离实现
        // 简化版本直接添加到 head
      }
      
      document.head.appendChild(script);
    });
  }

  /**
   * 获取应用生命周期函数
   * @param {Object} app 应用对象
   * @returns {Object} 生命周期函数
   */
  getAppLifecycle(app) {
    // 从全局变量中获取生命周期函数
    const globalKey = `__MICRO_APP_${app.name.toUpperCase()}__`;
    const lifecycle = window[globalKey];
    
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
   * @param {string} appName 应用名称
   * @param {string} location 当前位置
   * @returns {boolean} 是否应该激活
   */
  shouldAppBeActive(appName, location = window.location.pathname) {
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
   * @param {string} location 新位置
   */
  async handleRouteChange(location) {
    const promises = [];
    
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
   * @param {string} key 状态键
   * @param {any} value 状态值
   */
  setGlobalState(key, value) {
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
   * @param {string} key 状态键
   * @returns {any} 状态值
   */
  getGlobalState(key) {
    return this.globalState.get(key);
  }

  /**
   * 应用间通信
   * @param {string} targetApp 目标应用
   * @param {string} action 动作
   * @param {any} data 数据
   */
  sendMessage(targetApp, action, data) {
    this.emit('app-message', {
      targetApp,
      action,
      data,
      timestamp: Date.now()
    });
  }

  /**
   * 监听应用消息
   * @param {string} action 动作
   * @param {Function} handler 处理函数
   */
  onMessage(action, handler) {
    this.eventBus.addEventListener('app-message', (event) => {
      if (event.detail.action === action) {
        handler(event.detail);
      }
    });
  }

  /**
   * 触发事件
   * @param {string} type 事件类型
   * @param {any} detail 事件详情
   */
  emit(type, detail) {
    const event = new CustomEvent(type, { detail });
    this.eventBus.dispatchEvent(event);
  }

  /**
   * 监听事件
   * @param {string} type 事件类型
   * @param {Function} handler 处理函数
   */
  on(type, handler) {
    this.eventBus.addEventListener(type, handler);
  }

  /**
   * 移除事件监听
   * @param {string} type 事件类型
   * @param {Function} handler 处理函数
   */
  off(type, handler) {
    this.eventBus.removeEventListener(type, handler);
  }

  /**
   * 获取应用信息
   * @param {string} appName 应用名称
   * @returns {Object} 应用信息
   */
  getAppInfo(appName) {
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
   * @returns {Array} 应用信息数组
   */
  getAllApps() {
    return Array.from(this.apps.keys()).map(name => this.getAppInfo(name));
  }

  /**
   * 销毁管理器
   */
  destroy() {
    // 卸载所有应用
    const unmountPromises = [];
    for (const [appName, app] of this.apps) {
      if (app.status === 'MOUNTED') {
        unmountPromises.push(this.unmountApp(appName));
      }
    }
    
    Promise.all(unmountPromises).then(() => {
      this.apps.clear();
      this.globalState.clear();
    });
  }
}

/**
 * 路由监听器
 */
class RouteListener {
  constructor(microfrontendManager) {
    this.manager = microfrontendManager;
    this.isListening = false;
  }

  /**
   * 开始监听路由变化
   */
  start() {
    if (this.isListening) return;
    
    this.isListening = true;
    
    // 监听 popstate 事件
    window.addEventListener('popstate', this.handleRouteChange.bind(this));
    
    // 劫持 pushState 和 replaceState
    this.hijackHistory();
    
    // 初始路由检查
    this.handleRouteChange();
  }

  /**
   * 停止监听路由变化
   */
  stop() {
    if (!this.isListening) return;
    
    this.isListening = false;
    window.removeEventListener('popstate', this.handleRouteChange.bind(this));
    this.restoreHistory();
  }

  /**
   * 处理路由变化
   */
  handleRouteChange() {
    if (this.manager) {
      this.manager.handleRouteChange(window.location.pathname);
    }
  }

  /**
   * 劫持 History API
   */
  hijackHistory() {
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = (...args) => {
      originalPushState.apply(history, args);
      this.handleRouteChange();
    };
    
    history.replaceState = (...args) => {
      originalReplaceState.apply(history, args);
      this.handleRouteChange();
    };
    
    this.originalPushState = originalPushState;
    this.originalReplaceState = originalReplaceState;
  }

  /**
   * 恢复 History API
   */
  restoreHistory() {
    if (this.originalPushState) {
      history.pushState = this.originalPushState;
    }
    if (this.originalReplaceState) {
      history.replaceState = this.originalReplaceState;
    }
  }
}

// 导出模块
const microfrontendUtils = {
  MicrofrontendManager,
  RouteListener,
  
  /**
   * 创建微前端管理器实例
   * @param {Object} options 配置选项
   * @returns {MicrofrontendManager} 微前端管理器实例
   */
  createMicrofrontendManager(options) {
    return new MicrofrontendManager(options);
  },
  
  /**
   * 创建路由监听器实例
   * @param {MicrofrontendManager} manager 微前端管理器
   * @returns {RouteListener} 路由监听器实例
   */
  createRouteListener(manager) {
    return new RouteListener(manager);
  },
  
  /**
   * 检查浏览器支持
   * @returns {Object} 支持情况
   */
  checkBrowserSupport() {
    return {
      proxy: typeof Proxy !== 'undefined',
      customElements: 'customElements' in window,
      shadowDOM: 'attachShadow' in Element.prototype,
      modules: 'noModule' in HTMLScriptElement.prototype
    };
  }
};

export default microfrontendUtils;