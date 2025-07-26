const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthController {
    static async register(req, res) {
        try {
            const { username, email, password } = req.body;
            
            // 验证输入
            if (!username || !email || !password) {
                return res.status(400).json({
                    success: false,
                    message: '请填写所有必填字段'
                });
            }
            
            // 检查用户是否已存在
            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    message: '邮箱已被注册'
                });
            }
            
            // 创建用户
            const userId = await User.create({ username, email, password });
            
            res.status(201).json({
                success: true,
                message: '注册成功',
                data: { userId }
            });
        } catch (error) {
            console.error('注册错误:', error);
            res.status(500).json({
                success: false,
                message: '服务器内部错误'
            });
        }
    }
    
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            
            // 查找用户
            const user = await User.findByEmail(email);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: '邮箱或密码错误'
                });
            }
            
            // 验证密码
            const isValidPassword = await User.verifyPassword(password, user.password_hash);
            if (!isValidPassword) {
                return res.status(401).json({
                    success: false,
                    message: '邮箱或密码错误'
                });
            }
            
            // 生成JWT令牌
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );
            
            // 更新最后登录时间
            await User.updateLastLogin(user.id);
            
            res.json({
                success: true,
                message: '登录成功',
                data: {
                    token,
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email
                    }
                }
            });
        } catch (error) {
            console.error('登录错误:', error);
            res.status(500).json({
                success: false,
                message: '服务器内部错误'
            });
        }
    }
}

module.exports = AuthController;