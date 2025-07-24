#!/usr/bin/env node

// CLI工具：添加新方法
const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');

class MethodAdder {
    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    // 询问用户输入
    async question(prompt) {
        return new Promise((resolve) => {
            this.rl.question(prompt, resolve);
        });
    }

    // 主流程
    async run() {
        try {
            console.log('\n=== 添加新方法工具 ===\n');
            
            // 获取现有模块列表
            const modules = await this.getExistingModules();
            console.log('现有模块:');
            modules.forEach((module, index) => {
                console.log(`${index + 1}. ${module}`);
            });
            console.log(`${modules.length + 1}. 创建新模块\n`);
            
            // 选择模块
            const moduleChoice = await this.question('选择模块 (输入数字): ');
            const moduleIndex = parseInt(moduleChoice) - 1;
            
            let moduleName, moduleFile;
            if (moduleIndex === modules.length) {
                // 创建新模块
                moduleName = await this.question('新模块名称: ');
                const moduleKey = await this.question('模块键名 (英文): ');
                const moduleIcon = await this.question('模块图标 (Font Awesome类名): ');
                
                moduleFile = path.join(__dirname, '../data/modules', `${moduleKey}.js`);
                await this.createNewModule(moduleFile, moduleName, moduleIcon);
                
                // 更新index.js
                await this.updateModuleIndex(moduleName, moduleKey);
            } else {
                // 使用现有模块
                moduleName = modules[moduleIndex];
                moduleFile = await this.findModuleFile(moduleName);
            }
            
            // 获取方法信息
            const methodInfo = await this.getMethodInfo();
            
            // 添加方法到模块
            await this.addMethodToModule(moduleFile, methodInfo);
            
            // 询问是否添加演示
            const addDemo = await this.question('是否添加演示? (y/n): ');
            if (addDemo.toLowerCase() === 'y') {
                await this.addMethodDemo(methodInfo);
            }
            
            console.log('\n✅ 方法添加成功!');
            console.log(`📁 模块文件: ${moduleFile}`);
            if (addDemo.toLowerCase() === 'y') {
                console.log('🎯 演示已添加到 demos/index.js');
            }
            
        } catch (error) {
            console.error('❌ 错误:', error.message);
        } finally {
            this.rl.close();
        }
    }

    // 获取现有模块
    async getExistingModules() {
        const modulesDir = path.join(__dirname, '../data/modules');
        const files = await fs.readdir(modulesDir);
        const modules = [];
        
        for (const file of files) {
            if (file.endsWith('.js')) {
                const content = await fs.readFile(path.join(modulesDir, file), 'utf8');
                const titleMatch = content.match(/title:\s*['"]([^'"]+)['"]/);;
                if (titleMatch) {
                    modules.push(titleMatch[1]);
                }
            }
        }
        
        return modules;
    }

    // 查找模块文件
    async findModuleFile(moduleName) {
        const modulesDir = path.join(__dirname, '../data/modules');
        const files = await fs.readdir(modulesDir);
        
        for (const file of files) {
            if (file.endsWith('.js')) {
                const content = await fs.readFile(path.join(modulesDir, file), 'utf8');
                if (content.includes(`title: '${moduleName}'`)) {
                    return path.join(modulesDir, file);
                }
            }
        }
        
        throw new Error(`找不到模块: ${moduleName}`);
    }

    // 获取方法信息
    async getMethodInfo() {
        console.log('\n--- 方法信息 ---');
        
        const name = await this.question('方法名称 (英文): ');
        const description = await this.question('方法描述: ');
        
        // 获取参数
        const params = [];
        console.log('\n添加参数 (输入空行结束):');
        while (true) {
            const paramName = await this.question('参数名称: ');
            if (!paramName.trim()) break;
            
            const paramType = await this.question('参数类型: ');
            const required = await this.question('是否必需? (y/n): ');
            const paramDesc = await this.question('参数描述: ');
            
            params.push({
                name: paramName,
                type: paramType,
                required: required.toLowerCase() === 'y',
                description: paramDesc
            });
        }
        
        // 获取示例代码
        console.log('\n--- JavaScript 示例 ---');
        console.log('输入示例代码 (输入 "END" 结束):');
        const jsExample = await this.getMultilineInput();
        
        console.log('\n--- TypeScript 示例 ---');
        console.log('输入示例代码 (输入 "END" 结束):');
        const tsExample = await this.getMultilineInput();
        
        const hasDemo = await this.question('是否有演示? (y/n): ');
        
        return {
            name,
            description,
            params,
            examples: {
                js: jsExample,
                ts: tsExample
            },
            demo: hasDemo.toLowerCase() === 'y'
        };
    }

    // 获取多行输入
    async getMultilineInput() {
        const lines = [];
        while (true) {
            const line = await this.question('');
            if (line.trim() === 'END') break;
            lines.push(line);
        }
        return lines.join('\n');
    }

    // 创建新模块
    async createNewModule(moduleFile, moduleName, moduleIcon) {
        const template = `// ${moduleName}模块
export default {
    title: '${moduleName}',
    icon: '${moduleIcon}',
    methods: {
        // 方法将在这里添加
    }
};`;
        
        await fs.writeFile(moduleFile, template, 'utf8');
    }

    // 更新模块索引
    async updateModuleIndex(moduleName, moduleKey) {
        const indexFile = path.join(__dirname, '../data/index.js');
        let content = await fs.readFile(indexFile, 'utf8');
        
        // 添加注册语句
        const registerLine = `manager.registerModule('${moduleName}', () => import('./modules/${moduleKey}.js'));`;
        content = content.replace(
            /(manager\.registerModule\([^;]+;\s*\n)/g,
            `$1${registerLine}\n`
        );
        
        await fs.writeFile(indexFile, content, 'utf8');
    }

    // 添加方法到模块
    async addMethodToModule(moduleFile, methodInfo) {
        let content = await fs.readFile(moduleFile, 'utf8');
        
        // 生成方法代码
        const methodCode = this.generateMethodCode(methodInfo);
        
        // 查找methods对象并添加方法
        const methodsMatch = content.match(/(methods:\s*{)([^}]*)(}\s*}\s*;?\s*$)/s);
        if (methodsMatch) {
            const existingMethods = methodsMatch[2].trim();
            const newMethods = existingMethods ? 
                `${existingMethods},\n${methodCode}` : 
                methodCode;
            
            content = content.replace(
                methodsMatch[0],
                `${methodsMatch[1]}\n${newMethods}\n    }\n};`
            );
        }
        
        await fs.writeFile(moduleFile, content, 'utf8');
    }

    // 生成方法代码
    generateMethodCode(methodInfo) {
        const paramsStr = methodInfo.params.map(p => 
            `                { name: '${p.name}', type: '${p.type}', required: ${p.required}, description: '${p.description}' }`
        ).join(',\n');
        
        return `        ${methodInfo.name}: {
            name: '${methodInfo.name}',
            description: '${methodInfo.description}',
            params: [\n${paramsStr}\n            ],
            examples: {
                js: \`${methodInfo.examples.js}\`,
                ts: \`${methodInfo.examples.ts}\`
            },
            demo: ${methodInfo.demo}
        }`;
    }

    // 添加方法演示
    async addMethodDemo(methodInfo) {
        const demoFile = path.join(__dirname, '../demos/index.js');
        let content = await fs.readFile(demoFile, 'utf8');
        
        console.log('\n--- 演示代码 ---');
        console.log('输入演示HTML代码 (输入 "END" 结束):');
        const demoHtml = await this.getMultilineInput();
        
        // 生成演示代码
        const demoCode = `    ${methodInfo.name}: () => \`\n${demoHtml}\n    \`,`;
        
        // 添加到allDemos对象
        content = content.replace(
            /(export const allDemos = {[^}]*)(};)/s,
            `$1    ${demoCode}\n$2`
        );
        
        await fs.writeFile(demoFile, content, 'utf8');
    }
}

// 运行工具
if (require.main === module) {
    const adder = new MethodAdder();
    adder.run().catch(console.error);
}

module.exports = MethodAdder;