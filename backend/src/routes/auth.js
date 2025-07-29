const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { query } = require('../config/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

// 注册验证规则
const registerValidation = [
  body('username')
    .isLength({ min: 3, max: 50 })
    .withMessage('用户名长度必须在3-50个字符之间')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('用户名只能包含字母、数字和下划线'),
  body('email')
    .isEmail()
    .withMessage('请输入有效的邮箱地址')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('密码长度至少6个字符')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('密码必须包含大小写字母和数字')
];

// 登录验证规则
const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('请输入有效的邮箱地址')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('密码不能为空')
];

// 用户注册
router.post('/register', registerValidation, async (req, res) => {
  try {
    // 验证输入
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '输入验证失败',
        errors: errors.array()
      });
    }

    const { username, email, password } = req.body;

    // 检查用户是否已存在
    const existingUser = await query(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({
        success: false,
        message: '用户名或邮箱已存在'
      });
    }

    // 加密密码
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 创建用户
    const result = await query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

    // 生成JWT token
    const token = jwt.sign(
      { userId: result.insertId, email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.status(201).json({
      success: true,
      message: '注册成功',
      data: {
        token,
        user: {
          id: result.insertId,
          username,
          email,
          membershipType: 'free'
        }
      }
    });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 用户登录
router.post('/login', loginValidation, async (req, res) => {
  try {
    // 验证输入
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '输入验证失败',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // 查找用户
    const users = await query(
      'SELECT id, username, email, password, membership_type, membership_expires_at, is_active FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: '邮箱或密码错误'
      });
    }

    const user = users[0];

    // 检查用户是否激活
    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: '账户已被禁用'
      });
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: '邮箱或密码错误'
      });
    }

    // 生成JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    // 检查会员状态
    const now = new Date();
    let membershipType = user.membership_type;
    if (user.membership_expires_at && new Date(user.membership_expires_at) < now) {
      membershipType = 'free';
      // 更新数据库中的会员状态
      await query(
        'UPDATE users SET membership_type = "free" WHERE id = ?',
        [user.id]
      );
    }

    res.json({
      success: true,
      message: '登录成功',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          membershipType,
          membershipExpiresAt: user.membership_expires_at
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
});

// 获取当前用户信息
router.get('/me', auth, async (req, res) => {
  try {
    const users = await query(
      'SELECT id, username, email, membership_type, membership_expires_at, avatar_url, created_at FROM users WHERE id = ?',
      [req.user.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    const user = users[0];

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          membershipType: user.membership_type,
          membershipExpiresAt: user.membership_expires_at,
          avatarUrl: user.avatar_url,
          createdAt: user.created_at
        }
      }
    });
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 会员升级
router.post('/upgrade', auth, async (req, res) => {
  try {
    const { membershipType } = req.body;
    
    if (!['premium', 'annual'].includes(membershipType)) {
      return res.status(400).json({
        success: false,
        message: '无效的会员类型'
      });
    }

    // 计算过期时间
    const now = new Date();
    const expiresAt = new Date(now);
    if (membershipType === 'premium') {
      expiresAt.setMonth(expiresAt.getMonth() + 1); // 1个月
    } else if (membershipType === 'annual') {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1); // 1年
    }

    // 更新用户会员状态
    await query(
      'UPDATE users SET membership_type = ?, membership_expires_at = ? WHERE id = ?',
      [membershipType, expiresAt, req.user.userId]
    );

    res.json({
      success: true,
      message: '会员升级成功',
      data: {
        membershipType,
        membershipExpiresAt: expiresAt
      }
    });
  } catch (error) {
    console.error('会员升级错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

module.exports = router;