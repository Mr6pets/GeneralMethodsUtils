/**
 * 区块链工具模块
 * 提供区块链交互、智能合约调用、钱包连接等功能
 */

/**
 * 区块链连接管理器
 */
class BlockchainManager {
  constructor(options = {}) {
    this.provider = null;
    this.signer = null;
    this.network = null;
    this.eventHandlers = new Map();
    this.options = {
      defaultNetwork: options.defaultNetwork || 'mainnet',
      timeout: options.timeout || 30000
    };
  }

  /**
   * 连接到钱包
   * @param {string} walletType 钱包类型
   * @returns {Promise<Object>} 连接结果
   */
  async connectWallet(walletType = 'metamask') {
    try {
      let provider;
      
      switch (walletType.toLowerCase()) {
        case 'metamask':
          if (!window.ethereum) {
            throw new Error('MetaMask not installed');
          }
          provider = window.ethereum;
          break;
        
        case 'walletconnect':
          // WalletConnect 集成需要额外的库
          throw new Error('WalletConnect integration requires additional setup');
        
        default:
          throw new Error(`Unsupported wallet type: ${walletType}`);
      }
      
      // 请求账户访问
      const accounts = await provider.request({
        method: 'eth_requestAccounts'
      });
      
      this.provider = provider;
      
      // 获取网络信息
      const chainId = await provider.request({
        method: 'eth_chainId'
      });
      
      this.network = {
        chainId: parseInt(chainId, 16),
        name: this.getNetworkName(parseInt(chainId, 16))
      };
      
      // 设置事件监听器
      this.setupWalletEvents();
      
      const result = {
        accounts,
        network: this.network,
        provider: this.provider
      };
      
      this.emit('wallet_connected', result);
      return result;
    } catch (error) {
      this.emit('wallet_connection_error', error);
      throw error;
    }
  }

  /**
   * 设置钱包事件监听器
   */
  setupWalletEvents() {
    if (!this.provider) return;
    
    this.provider.on('accountsChanged', (accounts) => {
      this.emit('accounts_changed', accounts);
    });
    
    this.provider.on('chainChanged', (chainId) => {
      this.network = {
        chainId: parseInt(chainId, 16),
        name: this.getNetworkName(parseInt(chainId, 16))
      };
      this.emit('network_changed', this.network);
    });
    
    this.provider.on('disconnect', () => {
      this.emit('wallet_disconnected');
    });
  }

  /**
   * 获取网络名称
   * @param {number} chainId 链ID
   * @returns {string} 网络名称
   */
  getNetworkName(chainId) {
    const networks = {
      1: 'Ethereum Mainnet',
      3: 'Ropsten Testnet',
      4: 'Rinkeby Testnet',
      5: 'Goerli Testnet',
      42: 'Kovan Testnet',
      56: 'BSC Mainnet',
      97: 'BSC Testnet',
      137: 'Polygon Mainnet',
      80001: 'Polygon Mumbai'
    };
    return networks[chainId] || `Unknown Network (${chainId})`;
  }

  /**
   * 切换网络
   * @param {number} chainId 目标链ID
   * @returns {Promise<void>}
   */
  async switchNetwork(chainId) {
    if (!this.provider) {
      throw new Error('No wallet connected');
    }
    
    try {
      await this.provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }]
      });
    } catch (error) {
      // 如果网络不存在，尝试添加
      if (error.code === 4902) {
        await this.addNetwork(chainId);
      } else {
        throw error;
      }
    }
  }

  /**
   * 添加网络
   * @param {number} chainId 链ID
   * @returns {Promise<void>}
   */
  async addNetwork(chainId) {
    const networkConfigs = {
      56: {
        chainId: '0x38',
        chainName: 'Binance Smart Chain',
        nativeCurrency: {
          name: 'BNB',
          symbol: 'BNB',
          decimals: 18
        },
        rpcUrls: ['https://bsc-dataseed.binance.org/'],
        blockExplorerUrls: ['https://bscscan.com/']
      },
      137: {
        chainId: '0x89',
        chainName: 'Polygon',
        nativeCurrency: {
          name: 'MATIC',
          symbol: 'MATIC',
          decimals: 18
        },
        rpcUrls: ['https://polygon-rpc.com/'],
        blockExplorerUrls: ['https://polygonscan.com/']
      }
    };
    
    const config = networkConfigs[chainId];
    if (!config) {
      throw new Error(`Network configuration not found for chain ID: ${chainId}`);
    }
    
    await this.provider.request({
      method: 'wallet_addEthereumChain',
      params: [config]
    });
  }

  /**
   * 获取账户余额
   * @param {string} address 账户地址
   * @param {string} tokenAddress 代币地址（可选）
   * @returns {Promise<string>} 余额
   */
  async getBalance(address, tokenAddress = null) {
    if (!this.provider) {
      throw new Error('No wallet connected');
    }
    
    if (tokenAddress) {
      // ERC-20 代币余额
      return await this.getTokenBalance(address, tokenAddress);
    } else {
      // 原生代币余额
      const balance = await this.provider.request({
        method: 'eth_getBalance',
        params: [address, 'latest']
      });
      return parseInt(balance, 16).toString();
    }
  }

  /**
   * 获取代币余额
   * @param {string} address 账户地址
   * @param {string} tokenAddress 代币地址
   * @returns {Promise<string>} 代币余额
   */
  async getTokenBalance(address, tokenAddress) {
    // ERC-20 balanceOf 方法的函数签名
    const data = '0x70a08231' + address.slice(2).padStart(64, '0');
    
    const result = await this.provider.request({
      method: 'eth_call',
      params: [{
        to: tokenAddress,
        data: data
      }, 'latest']
    });
    
    return parseInt(result, 16).toString();
  }

  /**
   * 发送交易
   * @param {Object} transaction 交易对象
   * @returns {Promise<string>} 交易哈希
   */
  async sendTransaction(transaction) {
    if (!this.provider) {
      throw new Error('No wallet connected');
    }
    
    const txHash = await this.provider.request({
      method: 'eth_sendTransaction',
      params: [transaction]
    });
    
    this.emit('transaction_sent', { hash: txHash, transaction });
    return txHash;
  }

  /**
   * 签名消息
   * @param {string} message 要签名的消息
   * @param {string} address 签名地址
   * @returns {Promise<string>} 签名结果
   */
  async signMessage(message, address) {
    if (!this.provider) {
      throw new Error('No wallet connected');
    }
    
    const signature = await this.provider.request({
      method: 'personal_sign',
      params: [message, address]
    });
    
    return signature;
  }

  /**
   * 调用智能合约方法
   * @param {string} contractAddress 合约地址
   * @param {string} methodData 方法数据
   * @param {Object} options 调用选项
   * @returns {Promise<any>} 调用结果
   */
  async callContract(contractAddress, methodData, options = {}) {
    if (!this.provider) {
      throw new Error('No wallet connected');
    }
    
    const callData = {
      to: contractAddress,
      data: methodData,
      ...options
    };
    
    if (options.value || options.gasLimit) {
      // 发送交易
      return await this.sendTransaction(callData);
    } else {
      // 只读调用
      return await this.provider.request({
        method: 'eth_call',
        params: [callData, 'latest']
      });
    }
  }

  /**
   * 获取交易收据
   * @param {string} txHash 交易哈希
   * @returns {Promise<Object>} 交易收据
   */
  async getTransactionReceipt(txHash) {
    if (!this.provider) {
      throw new Error('No wallet connected');
    }
    
    return await this.provider.request({
      method: 'eth_getTransactionReceipt',
      params: [txHash]
    });
  }

  /**
   * 等待交易确认
   * @param {string} txHash 交易哈希
   * @param {number} confirmations 确认数
   * @returns {Promise<Object>} 交易收据
   */
  async waitForTransaction(txHash, confirmations = 1) {
    return new Promise((resolve, reject) => {
      const checkTransaction = async () => {
        try {
          const receipt = await this.getTransactionReceipt(txHash);
          
          if (receipt && receipt.blockNumber) {
            const currentBlock = await this.provider.request({
              method: 'eth_blockNumber',
              params: []
            });
            
            const confirmationCount = parseInt(currentBlock, 16) - parseInt(receipt.blockNumber, 16) + 1;
            
            if (confirmationCount >= confirmations) {
              resolve(receipt);
            } else {
              setTimeout(checkTransaction, 2000);
            }
          } else {
            setTimeout(checkTransaction, 2000);
          }
        } catch (error) {
          reject(error);
        }
      };
      
      checkTransaction();
    });
  }

  /**
   * 注册事件处理器
   * @param {string} event 事件名称
   * @param {Function} handler 处理函数
   */
  on(event, handler) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event).push(handler);
  }

  /**
   * 触发事件
   * @param {string} event 事件名称
   * @param {any} data 事件数据
   */
  emit(event, data) {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }

  /**
   * 断开连接
   */
  disconnect() {
    this.provider = null;
    this.signer = null;
    this.network = null;
    this.eventHandlers.clear();
    this.emit('disconnected');
  }
}

/**
 * 智能合约工具
 */
class ContractUtils {
  /**
   * 编码函数调用数据
   * @param {string} functionSignature 函数签名
   * @param {Array} params 参数数组
   * @returns {string} 编码后的数据
   */
  static encodeFunctionCall(functionSignature, params = []) {
    // 简化的 ABI 编码实现
    const functionSelector = this.getFunctionSelector(functionSignature);
    const encodedParams = this.encodeParameters(params);
    return functionSelector + encodedParams;
  }

  /**
   * 获取函数选择器
   * @param {string} functionSignature 函数签名
   * @returns {string} 函数选择器
   */
  static getFunctionSelector(functionSignature) {
    // 这里需要使用 keccak256 哈希，简化实现
    // 实际应用中应该使用专业的 Web3 库
    return '0x' + functionSignature.slice(0, 8);
  }

  /**
   * 编码参数
   * @param {Array} params 参数数组
   * @returns {string} 编码后的参数
   */
  static encodeParameters(params) {
    // 简化的参数编码实现
    return params.map(param => {
      if (typeof param === 'string' && param.startsWith('0x')) {
        return param.slice(2).padStart(64, '0');
      } else if (typeof param === 'number') {
        return param.toString(16).padStart(64, '0');
      } else {
        return param.toString().padStart(64, '0');
      }
    }).join('');
  }

  /**
   * 解码返回数据
   * @param {string} data 返回数据
   * @param {Array} types 返回类型数组
   * @returns {Array} 解码后的数据
   */
  static decodeReturnData(data, types) {
    // 简化的数据解码实现
    const cleanData = data.startsWith('0x') ? data.slice(2) : data;
    const results = [];
    
    let offset = 0;
    for (const type of types) {
      const chunk = cleanData.slice(offset, offset + 64);
      
      if (type === 'uint256' || type === 'uint') {
        results.push(parseInt(chunk, 16));
      } else if (type === 'address') {
        results.push('0x' + chunk.slice(24));
      } else if (type === 'bool') {
        results.push(parseInt(chunk, 16) === 1);
      } else {
        results.push(chunk);
      }
      
      offset += 64;
    }
    
    return results;
  }
}

// 导出模块
const blockchainUtils = {
  BlockchainManager,
  ContractUtils,
  
  /**
   * 创建区块链管理器实例
   * @param {Object} options 配置选项
   * @returns {BlockchainManager} 区块链管理器实例
   */
  createBlockchainManager(options) {
    return new BlockchainManager(options);
  },
  
  /**
   * 检查钱包支持
   * @returns {Object} 支持情况
   */
  checkWalletSupport() {
    return {
      metamask: !!window.ethereum,
      web3: !!window.web3,
      ethereum: !!window.ethereum
    };
  },
  
  /**
   * 格式化地址
   * @param {string} address 地址
   * @param {number} startLength 开始长度
   * @param {number} endLength 结束长度
   * @returns {string} 格式化后的地址
   */
  formatAddress(address, startLength = 6, endLength = 4) {
    if (!address || address.length < startLength + endLength) {
      return address;
    }
    
    return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
  },
  
  /**
   * 验证地址格式
   * @param {string} address 地址
   * @returns {boolean} 是否有效
   */
  isValidAddress(address) {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }
};

export default blockchainUtils;