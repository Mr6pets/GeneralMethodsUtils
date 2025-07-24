// 区块链工具模块
export default {
    title: '区块链工具',
    icon: 'fas fa-cube',
    methods: {
        connectWallet: {
            name: 'connectWallet',
            description: '连接加密货币钱包',
            params: [
                { name: 'options', type: 'WalletOptions', required: false, description: '钱包连接选项' }
            ],
            examples: {
                js: `// 连接 MetaMask 钱包\nconst wallet = await blockchainUtils.connectWallet({\n  provider: 'metamask',\n  chainId: 1 // 以太坊主网\n});\n\nconsole.log('钱包地址:', wallet.address);\nconsole.log('余额:', wallet.balance);\nconsole.log('网络:', wallet.network);\n\n// 连接 WalletConnect\nconst wcWallet = await blockchainUtils.connectWallet({\n  provider: 'walletconnect',\n  projectId: 'your-project-id'\n});`,
                ts: `import { blockchainUtils, WalletOptions } from 'general-method-utils';\n\n// 连接 MetaMask 钱包\nconst options: WalletOptions = {\n  provider: 'metamask',\n  chainId: 1 // 以太坊主网\n};\n\nconst wallet = await blockchainUtils.connectWallet(options);\nconsole.log('钱包地址:', wallet.address);`
            },
            demo: false
        },
        callContract: {
            name: 'callContract',
            description: '调用智能合约方法',
            params: [
                { name: 'contractAddress', type: 'string', required: true, description: '合约地址' },
                { name: 'abi', type: 'any[]', required: true, description: '合约 ABI' },
                { name: 'method', type: 'string', required: true, description: '方法名称' },
                { name: 'params', type: 'any[]', required: false, description: '方法参数' }
            ],
            examples: {
                js: `// 调用 ERC-20 代币合约\nconst tokenBalance = await blockchainUtils.callContract(\n  '0x1234...', // 代币合约地址\n  tokenABI,\n  'balanceOf',\n  [wallet.address]\n);\n\nconsole.log('代币余额:', tokenBalance);\n\n// 调用自定义合约\nconst result = await blockchainUtils.callContract(\n  '0x5678...',\n  contractABI,\n  'getUserInfo',\n  [userId]\n);`,
                ts: `import { blockchainUtils } from 'general-method-utils';\n\n// 调用 ERC-20 代币合约\nconst tokenBalance = await blockchainUtils.callContract(\n  '0x1234...', // 代币合约地址\n  tokenABI,\n  'balanceOf',\n  [wallet.address]\n);\n\nconsole.log('代币余额:', tokenBalance);`
            },
            demo: false
        }
    }
};