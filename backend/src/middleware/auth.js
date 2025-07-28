const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

// JWT认证中间件
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: '访问被拒绝，缺少认证令牌'
      });
    }

    // 验证token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 检查用户是否存在且激活
    const users = await query(
      'SELECT id, email, is_active FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (users.length === 0 || !users[0].is_active) {
      return res.status(401).json({
        success: false,
        message: '无效的认证令牌'
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: '无效的认证令牌'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: '认证令牌已过期'
      });
    }
    
    console.error('认证中间件错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
};

// 会员权限检查中间件
const requireMembership = (requiredLevel = 'premium') => {
  return async (req, res, next) => {
    try {
      const users = await query(
        'SELECT membership_type, membership_expires_at FROM users WHERE id = ?',
        [req.user.userId]
      );

      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: '用户不存在'
        });
      }

      const user = users[0];
      const now = new Date();
      
      // 检查会员是否过期
      if (user.membership_expires_at && new Date(user.membership_expires_at) < now) {
        return res.status(403).json({
          success: false,
          message: '会员已过期，请续费'
        });
      }

      // 检查会员等级
      const membershipLevels = { free: 0, premium: 1, annual: 2 };
      const userLevel = membershipLevels[user.membership_type] || 0;
      const requiredLevelNum = membershipLevels[requiredLevel] || 1;

      if (userLevel < requiredLevelNum) {
        return res.status(403).json({
          success: false,
          message: '需要会员权限才能访问此功能'
        });
      }

      next();
    } catch (error) {
      console.error('会员权限检查错误:', error);
      res.status(500).json({
        success: false,
        message: '服务器内部错误'
      });
    }
  };
};

module.exports = {
  auth,
  requireMembership
};