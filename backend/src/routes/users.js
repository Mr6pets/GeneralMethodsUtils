const express = require('express');
const { query } = require('../config/database');
const { auth, requireMembership } = require('../middleware/auth');

const router = express.Router();

// 获取用户统计信息
router.get('/stats', auth, async (req, res) => {
  try {
    const stats = await query(`
      SELECT 
        COUNT(*) as totalUsers,
        SUM(CASE WHEN membership_type != 'free' THEN 1 ELSE 0 END) as premiumUsers,
        SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) as newUsersThisMonth
      FROM users
    `);

    res.json({
      success: true,
      data: stats[0]
    });
  } catch (error) {
    console.error('获取统计信息错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 获取会员专享功能列表
router.get('/premium-features', auth, requireMembership('premium'), async (req, res) => {
  try {
    const features = [
      {
        id: 1,
        name: '高级工具包',
        description: '访问所有高级开发工具',
        category: 'tools'
      },
      {
        id: 2,
        name: '源码下载',
        description: '下载完整项目源码',
        category: 'download'
      },
      {
        id: 3,
        name: '技术支持',
        description: '优先技术支持服务',
        category: 'support'
      }
    ];

    res.json({
      success: true,
      data: features
    });
  } catch (error) {
    console.error('获取会员功能错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

module.exports = router;