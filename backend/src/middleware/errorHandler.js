// 全局错误处理中间件
const errorHandler = (err, req, res, next) => {
  console.error('错误详情:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // 默认错误
  let error = { ...err };
  error.message = err.message;

  // MySQL错误处理
  if (err.code === 'ER_DUP_ENTRY') {
    const message = '数据已存在';
    error = { message, statusCode: 400 };
  }

  if (err.code === 'ER_BAD_FIELD_ERROR') {
    const message = '数据库字段错误';
    error = { message, statusCode: 400 };
  }

  // JWT错误处理
  if (err.name === 'JsonWebTokenError') {
    const message = '无效的认证令牌';
    error = { message, statusCode: 401 };
  }

  if (err.name === 'TokenExpiredError') {
    const message = '认证令牌已过期';
    error = { message, statusCode: 401 };
  }

  // 验证错误
  if (err.name === 'ValidationError') {
    const message = '数据验证失败';
    error = { message, statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || '服务器内部错误',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = {
  errorHandler
};