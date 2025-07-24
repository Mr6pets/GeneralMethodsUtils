/**
 * AI/ML 集成工具模块
 * 提供机器学习模型集成、数据预处理、预测等功能
 */

/**
 * 简单的线性回归模型
 */
class LinearRegression {
  constructor() {
    this.weights = null;
    this.bias = null;
    this.trained = false;
  }

  /**
   * 训练模型
   * @param {Array} X 特征数据
   * @param {Array} y 目标数据
   * @param {Object} options 训练选项
   */
  train(X, y, options = {}) {
    const { learningRate = 0.01, epochs = 1000, verbose = false } = options;
    
    // 初始化权重和偏置
    this.weights = new Array(X[0].length).fill(0).map(() => Math.random() * 0.01);
    this.bias = 0;
    
    const m = X.length;
    
    for (let epoch = 0; epoch < epochs; epoch++) {
      // 前向传播
      const predictions = X.map(x => this.predict(x));
      
      // 计算损失
      const loss = predictions.reduce((sum, pred, i) => sum + Math.pow(pred - y[i], 2), 0) / (2 * m);
      
      // 反向传播
      const dWeights = new Array(this.weights.length).fill(0);
      let dBias = 0;
      
      for (let i = 0; i < m; i++) {
        const error = predictions[i] - y[i];
        for (let j = 0; j < this.weights.length; j++) {
          dWeights[j] += error * X[i][j];
        }
        dBias += error;
      }
      
      // 更新参数
      for (let j = 0; j < this.weights.length; j++) {
        this.weights[j] -= learningRate * dWeights[j] / m;
      }
      this.bias -= learningRate * dBias / m;
      
      if (verbose && epoch % 100 === 0) {
        console.log(`Epoch ${epoch}, Loss: ${loss}`);
      }
    }
    
    this.trained = true;
  }

  /**
   * 预测
   * @param {Array} x 输入特征
   * @returns {number} 预测值
   */
  predict(x) {
    if (!this.trained) {
      throw new Error('Model not trained yet');
    }
    
    return x.reduce((sum, val, i) => sum + val * this.weights[i], this.bias);
  }

  /**
   * 批量预测
   * @param {Array} X 输入特征数组
   * @returns {Array} 预测值数组
   */
  predictBatch(X) {
    return X.map(x => this.predict(x));
  }
}

/**
 * K-Means 聚类算法
 */
class KMeans {
  constructor(k = 3, maxIterations = 100) {
    this.k = k;
    this.maxIterations = maxIterations;
    this.centroids = null;
    this.labels = null;
    this.trained = false;
  }

  /**
   * 训练聚类模型
   * @param {Array} data 数据点
   */
  fit(data) {
    const n = data.length;
    const dimensions = data[0].length;
    
    // 随机初始化质心
    this.centroids = [];
    for (let i = 0; i < this.k; i++) {
      this.centroids.push(
        new Array(dimensions).fill(0).map(() => Math.random())
      );
    }
    
    for (let iteration = 0; iteration < this.maxIterations; iteration++) {
      // 分配数据点到最近的质心
      const newLabels = data.map(point => {
        let minDistance = Infinity;
        let closestCentroid = 0;
        
        for (let i = 0; i < this.k; i++) {
          const distance = this.euclideanDistance(point, this.centroids[i]);
          if (distance < minDistance) {
            minDistance = distance;
            closestCentroid = i;
          }
        }
        
        return closestCentroid;
      });
      
      // 检查收敛
      if (this.labels && this.arraysEqual(newLabels, this.labels)) {
        break;
      }
      
      this.labels = newLabels;
      
      // 更新质心
      for (let i = 0; i < this.k; i++) {
        const clusterPoints = data.filter((_, index) => this.labels[index] === i);
        
        if (clusterPoints.length > 0) {
          for (let j = 0; j < dimensions; j++) {
            this.centroids[i][j] = clusterPoints.reduce((sum, point) => sum + point[j], 0) / clusterPoints.length;
          }
        }
      }
    }
    
    this.trained = true;
  }

  /**
   * 预测数据点的聚类
   * @param {Array} point 数据点
   * @returns {number} 聚类标签
   */
  predict(point) {
    if (!this.trained) {
      throw new Error('Model not trained yet');
    }
    
    let minDistance = Infinity;
    let closestCentroid = 0;
    
    for (let i = 0; i < this.k; i++) {
      const distance = this.euclideanDistance(point, this.centroids[i]);
      if (distance < minDistance) {
        minDistance = distance;
        closestCentroid = i;
      }
    }
    
    return closestCentroid;
  }

  /**
   * 计算欧几里得距离
   * @param {Array} a 点A
   * @param {Array} b 点B
   * @returns {number} 距离
   */
  euclideanDistance(a, b) {
    return Math.sqrt(a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0));
  }

  /**
   * 比较两个数组是否相等
   * @param {Array} a 数组A
   * @param {Array} b 数组B
   * @returns {boolean} 是否相等
   */
  arraysEqual(a, b) {
    return a.length === b.length && a.every((val, i) => val === b[i]);
  }
}

/**
 * 数据预处理工具
 */
class DataPreprocessor {
  /**
   * 标准化数据
   * @param {Array} data 原始数据
   * @returns {Object} 标准化后的数据和参数
   */
  static standardize(data) {
    const features = data[0].length;
    const means = new Array(features).fill(0);
    const stds = new Array(features).fill(0);
    
    // 计算均值
    for (let i = 0; i < features; i++) {
      means[i] = data.reduce((sum, row) => sum + row[i], 0) / data.length;
    }
    
    // 计算标准差
    for (let i = 0; i < features; i++) {
      const variance = data.reduce((sum, row) => sum + Math.pow(row[i] - means[i], 2), 0) / data.length;
      stds[i] = Math.sqrt(variance);
    }
    
    // 标准化
    const standardizedData = data.map(row => 
      row.map((val, i) => stds[i] === 0 ? 0 : (val - means[i]) / stds[i])
    );
    
    return {
      data: standardizedData,
      means,
      stds
    };
  }

  /**
   * 归一化数据
   * @param {Array} data 原始数据
   * @returns {Object} 归一化后的数据和参数
   */
  static normalize(data) {
    const features = data[0].length;
    const mins = new Array(features).fill(Infinity);
    const maxs = new Array(features).fill(-Infinity);
    
    // 找到最小值和最大值
    data.forEach(row => {
      row.forEach((val, i) => {
        mins[i] = Math.min(mins[i], val);
        maxs[i] = Math.max(maxs[i], val);
      });
    });
    
    // 归一化
    const normalizedData = data.map(row => 
      row.map((val, i) => {
        const range = maxs[i] - mins[i];
        return range === 0 ? 0 : (val - mins[i]) / range;
      })
    );
    
    return {
      data: normalizedData,
      mins,
      maxs
    };
  }

  /**
   * 独热编码
   * @param {Array} categories 类别数组
   * @returns {Array} 独热编码后的数组
   */
  static oneHotEncode(categories) {
    const uniqueCategories = [...new Set(categories)];
    const categoryMap = new Map(uniqueCategories.map((cat, i) => [cat, i]));
    
    return categories.map(category => {
      const encoded = new Array(uniqueCategories.length).fill(0);
      encoded[categoryMap.get(category)] = 1;
      return encoded;
    });
  }

  /**
   * 训练测试集分割
   * @param {Array} X 特征数据
   * @param {Array} y 目标数据
   * @param {number} testSize 测试集比例
   * @returns {Object} 分割后的数据
   */
  static trainTestSplit(X, y, testSize = 0.2) {
    const shuffledIndices = Array.from({ length: X.length }, (_, i) => i)
      .sort(() => Math.random() - 0.5);
    
    const splitIndex = Math.floor(X.length * (1 - testSize));
    const trainIndices = shuffledIndices.slice(0, splitIndex);
    const testIndices = shuffledIndices.slice(splitIndex);
    
    return {
      XTrain: trainIndices.map(i => X[i]),
      XTest: testIndices.map(i => X[i]),
      yTrain: trainIndices.map(i => y[i]),
      yTest: testIndices.map(i => y[i])
    };
  }
}

/**
 * 模型评估工具
 */
class ModelEvaluator {
  /**
   * 计算均方误差
   * @param {Array} yTrue 真实值
   * @param {Array} yPred 预测值
   * @returns {number} MSE
   */
  static meanSquaredError(yTrue, yPred) {
    return yTrue.reduce((sum, val, i) => sum + Math.pow(val - yPred[i], 2), 0) / yTrue.length;
  }

  /**
   * 计算平均绝对误差
   * @param {Array} yTrue 真实值
   * @param {Array} yPred 预测值
   * @returns {number} MAE
   */
  static meanAbsoluteError(yTrue, yPred) {
    return yTrue.reduce((sum, val, i) => sum + Math.abs(val - yPred[i]), 0) / yTrue.length;
  }

  /**
   * 计算R²分数
   * @param {Array} yTrue 真实值
   * @param {Array} yPred 预测值
   * @returns {number} R²分数
   */
  static r2Score(yTrue, yPred) {
    const yMean = yTrue.reduce((sum, val) => sum + val, 0) / yTrue.length;
    const totalSumSquares = yTrue.reduce((sum, val) => sum + Math.pow(val - yMean, 2), 0);
    const residualSumSquares = yTrue.reduce((sum, val, i) => sum + Math.pow(val - yPred[i], 2), 0);
    
    return 1 - (residualSumSquares / totalSumSquares);
  }

  /**
   * 计算准确率（分类）
   * @param {Array} yTrue 真实标签
   * @param {Array} yPred 预测标签
   * @returns {number} 准确率
   */
  static accuracy(yTrue, yPred) {
    const correct = yTrue.reduce((count, val, i) => count + (val === yPred[i] ? 1 : 0), 0);
    return correct / yTrue.length;
  }

  /**
   * 计算混淆矩阵
   * @param {Array} yTrue 真实标签
   * @param {Array} yPred 预测标签
   * @returns {Array} 混淆矩阵
   */
  static confusionMatrix(yTrue, yPred) {
    const labels = [...new Set([...yTrue, ...yPred])].sort();
    const matrix = labels.map(() => new Array(labels.length).fill(0));
    
    yTrue.forEach((trueLabel, i) => {
      const predLabel = yPred[i];
      const trueIndex = labels.indexOf(trueLabel);
      const predIndex = labels.indexOf(predLabel);
      matrix[trueIndex][predIndex]++;
    });
    
    return { matrix, labels };
  }
}

/**
 * TensorFlow.js 集成（如果可用）
 */
class TensorFlowIntegration {
  constructor() {
    this.tf = null;
    this.model = null;
    this.checkTensorFlow();
  }

  /**
   * 检查TensorFlow.js是否可用
   */
  checkTensorFlow() {
    if (typeof tf !== 'undefined') {
      this.tf = tf;
      console.log('TensorFlow.js is available');
    } else {
      console.warn('TensorFlow.js not found. Please include TensorFlow.js library.');
    }
  }

  /**
   * 创建简单的神经网络
   * @param {Object} config 网络配置
   * @returns {Object} 模型
   */
  createNeuralNetwork(config = {}) {
    if (!this.tf) {
      throw new Error('TensorFlow.js not available');
    }

    const {
      inputShape = [1],
      hiddenLayers = [10],
      outputUnits = 1,
      activation = 'relu',
      outputActivation = 'linear'
    } = config;

    const model = this.tf.sequential();

    // 输入层
    model.add(this.tf.layers.dense({
      inputShape,
      units: hiddenLayers[0],
      activation
    }));

    // 隐藏层
    for (let i = 1; i < hiddenLayers.length; i++) {
      model.add(this.tf.layers.dense({
        units: hiddenLayers[i],
        activation
      }));
    }

    // 输出层
    model.add(this.tf.layers.dense({
      units: outputUnits,
      activation: outputActivation
    }));

    this.model = model;
    return model;
  }

  /**
   * 编译模型
   * @param {Object} config 编译配置
   */
  compileModel(config = {}) {
    if (!this.model) {
      throw new Error('Model not created yet');
    }

    const {
      optimizer = 'adam',
      loss = 'meanSquaredError',
      metrics = ['mae']
    } = config;

    this.model.compile({
      optimizer,
      loss,
      metrics
    });
  }

  /**
   * 训练模型
   * @param {Array} X 训练数据
   * @param {Array} y 目标数据
   * @param {Object} config 训练配置
   * @returns {Promise} 训练历史
   */
  async trainModel(X, y, config = {}) {
    if (!this.model) {
      throw new Error('Model not created yet');
    }

    const {
      epochs = 100,
      batchSize = 32,
      validationSplit = 0.2,
      verbose = 1
    } = config;

    const xs = this.tf.tensor2d(X);
    const ys = this.tf.tensor2d(y);

    const history = await this.model.fit(xs, ys, {
      epochs,
      batchSize,
      validationSplit,
      verbose
    });

    xs.dispose();
    ys.dispose();

    return history;
  }

  /**
   * 预测
   * @param {Array} X 输入数据
   * @returns {Array} 预测结果
   */
  predict(X) {
    if (!this.model) {
      throw new Error('Model not created yet');
    }

    const xs = this.tf.tensor2d(X);
    const predictions = this.model.predict(xs);
    const result = predictions.dataSync();
    
    xs.dispose();
    predictions.dispose();
    
    return Array.from(result);
  }

  /**
   * 保存模型
   * @param {string} path 保存路径
   * @returns {Promise} 保存结果
   */
  async saveModel(path) {
    if (!this.model) {
      throw new Error('Model not created yet');
    }

    return await this.model.save(path);
  }

  /**
   * 加载模型
   * @param {string} path 模型路径
   * @returns {Promise} 加载的模型
   */
  async loadModel(path) {
    if (!this.tf) {
      throw new Error('TensorFlow.js not available');
    }

    this.model = await this.tf.loadLayersModel(path);
    return this.model;
  }
}

// 导出所有类和函数
export {
  LinearRegression,
  KMeans,
  DataPreprocessor,
  ModelEvaluator,
  TensorFlowIntegration
};

// 便捷函数
export function createLinearRegression() {
  return new LinearRegression();
}

export function createKMeans(k, maxIterations) {
  return new KMeans(k, maxIterations);
}

export function createTensorFlowIntegration() {
  return new TensorFlowIntegration();
}

export function standardizeData(data) {
  return DataPreprocessor.standardize(data);
}

export function normalizeData(data) {
  return DataPreprocessor.normalize(data);
}

export function oneHotEncode(categories) {
  return DataPreprocessor.oneHotEncode(categories);
}

export function trainTestSplit(X, y, testSize) {
  return DataPreprocessor.trainTestSplit(X, y, testSize);
}

export function evaluateRegression(yTrue, yPred) {
  return {
    mse: ModelEvaluator.meanSquaredError(yTrue, yPred),
    mae: ModelEvaluator.meanAbsoluteError(yTrue, yPred),
    r2: ModelEvaluator.r2Score(yTrue, yPred)
  };
}

export function evaluateClassification(yTrue, yPred) {
  return {
    accuracy: ModelEvaluator.accuracy(yTrue, yPred),
    confusionMatrix: ModelEvaluator.confusionMatrix(yTrue, yPred)
  };
}