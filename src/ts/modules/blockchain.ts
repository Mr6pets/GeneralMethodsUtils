/**
 * 区块链工具模块
 * 提供区块链交互、智能合约调用、钱包连接等功能
 */

import {
  BlockchainOptions,
  WalletConnection,
  NetworkInfo,
  TransactionOptions,
  ContractCallOptions,
  TokenInfo,
  TransactionReceipt
} from '../types';

/**
 * 区块链连接管理器
 */
export class BlockchainManager {
  private provider: any = null;
  private signer: any = null;
  private network: NetworkInfo | null = null;
  private eventHandlers = new Map<string, Function[]>();
  private options: Required<BlockchainOptions>;

  constructor(options: BlockchainOptions = {}) {
    this.options = {
      defaultNetwork: options.defaultNetwork || 'mainnet',
      timeout: options.timeout || 30000
    };
  }

  /**
   * 连接到钱包
   */
  async connectWallet(walletType: string = 'metamask'): Promise<WalletConnection> {
    try {
      let provider: any;
      
      switch (walletType.toLowerCase()) {
        case 'metamask':
          if (!(window as any).ethereum) {
            throw new Error('MetaMask not installed');
          }
          provider = (window as any).ethereum;
          break;
        
        case 'walletconnect':
          throw new Error('WalletConnect integration requires additional setup');
        
        default:
          throw new Error(`Unsupported wallet type: ${walletType}`);
      }
      
      const accounts = await provider.request({
        method: 'eth_requestAccounts'
      });
      
      this.provider = provider;
      
      const chainId = await provider.request({
        method: 'eth_chainId'
      });
      
      this.network = {
        chainId: parseInt(chainId, 16),
        name: this.getNetworkName(parseInt(chainId, 16))
      };
      
      this.setupWalletEvents();
      
      const result: WalletConnection = {
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
  private setupWalletEvents(): void {
    if (!this.provider) return;
    
    this.provider.on('accountsChanged', (accounts: string[]) => {
      this.emit('accounts_changed', accounts);
    });
    
    this.provider.on('chainChanged', (chainId: string) => {
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
   */
  private getNetworkName(chainId: number): string {
    const networks: Record<number, string> = {
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
   */
  async switchNetwork(chainId: number): Promise<void> {
    if (!this.provider) {
      throw new Error('No wallet connected');
    }
    
    try {
      await this.provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }]
      });
    } catch (error: any) {
      if (error.code === 4902) {
        await this.addNetwork(chainId);
      } else {
        throw error;
      }
    }
  }

  /**
   * 添加网络
   */
  async addNetwork(chainId: number): Promise<void> {
    const networkConfigs: Record<number, any> = {
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
   */
  async getBalance(address: string, tokenAddress?: string): Promise<string> {
    if (!this.provider) {
      throw new Error('No wallet connected');
    }
    
    if (tokenAddress) {
      return await this.getTokenBalance(address, tokenAddress);
    } else {
      const balance = await this.provider.request({
        method: 'eth_getBalance',
        params: [address, 'latest']
      });
      return parseInt(balance, 16).toString();
    }
  }

  /**
   * 获取代币余额
   */
  async getTokenBalance(address: string, tokenAddress: string): Promise<string> {
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
   */
  async sendTransaction(transaction: TransactionOptions): Promise<string> {
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
   */
  async signMessage(message: string, address: string): Promise<string> {
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
   */
  async callContract(
    contractAddress: string, 
    methodData: string, 
    options: ContractCallOptions = {}
  ): Promise<any> {
    if (!this.provider) {
      throw new Error('No wallet connected');
    }
    
    const callData = {
      to: contractAddress,
      data: methodData,
      ...options
    };
    
    if (options.value || options.gasLimit) {
      return await this.sendTransaction(callData as TransactionOptions);
    } else {
      return await this.provider.request({
        method: 'eth_call',
        params: [callData, 'latest']
      });
    }
  }

  /**
   * 获取交易收据
   */
  async getTransactionReceipt(txHash: string): Promise<TransactionReceipt> {
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
   */
  async waitForTransaction(txHash: string, confirmations: number = 1): Promise<TransactionReceipt> {
    return new Promise((resolve, reject) => {
      const checkTransaction = async () => {
        try {
          const receipt = await this.getTransactionReceipt(txHash);
          
          if (receipt && receipt.blockNumber) {
            const currentBlock = await this.provider.request({
              method: 'eth_blockNumber',
              params: []
            });
            
            const confirmationCount = parseInt(currentBlock, 16) - receipt.blockNumber + 1;
            
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
   */
  on(event: string, handler: Function): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)!.push(handler);
  }

  /**
   * 触发事件
   */
  private emit(event: string, data: any): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }

  /**
   * 断开连接
   */
  disconnect(): void {
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
export class ContractUtils {
  /**
   * 编码函数调用数据
   */
  static encodeFunctionCall(functionSignature: string, params: any[] = []): string {
    const functionSelector = this.getFunctionSelector(functionSignature);
    const encodedParams = this.encodeParameters(params);
    return functionSelector + encodedParams;
  }

  /**
   * 获取函数选择器
   */
  static getFunctionSelector(functionSignature: string): string {
    return '0x' + functionSignature.slice(0, 8);
  }

  /**
   * 编码参数
   */
  static encodeParameters(params: any[]): string {
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
   */
  static decodeReturnData(data: string, types: string[]): any[] {
    const cleanData = data.startsWith('0x') ? data.slice(2) : data;
    const results: any[] = [];
    
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

// 工具函数
export const blockchainUtils = {
  BlockchainManager,
  ContractUtils,
  
  /**
   * 创建区块链管理器实例
   */
  createBlockchainManager(options?: BlockchainOptions): BlockchainManager {
    return new BlockchainManager(options);
  },
  
  /**
   * 检查钱包支持
   */
  checkWalletSupport(): Record<string, boolean> {
    return {
      metamask: !!(window as any).ethereum,
      web3: !!(window as any).web3,
      ethereum: !!(window as any).ethereum
    };
  },
  
  /**
   * 格式化地址
   */
  formatAddress(address: string, startLength: number = 6, endLength: number = 4): string {
    if (!address || address.length < startLength + endLength) {
      return address;
    }
    
    return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
  },
  
  /**
   * 验证地址格式
   */
  isValidAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }
};

export default blockchainUtils;