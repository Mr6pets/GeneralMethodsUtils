/**
 * 表单验证相关工具方法
 */

/**
 * 邮箱验证
 * @param {string} email - 邮箱地址
 * @returns {boolean} 是否有效
 */
export function isEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * 手机号验证
 * @param {string} phone - 手机号
 * @returns {boolean} 是否有效
 */
export function isPhone(phone) {
  const regex = /^1[3-9]\d{9}$/;
  return regex.test(phone);
}

/**
 * 身份证验证
 * @param {string} idCard - 身份证号
 * @returns {boolean} 是否有效
 */
export function isIdCard(idCard) {
  const regex = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  return regex.test(idCard);
}

/**
 * 银行卡号验证
 * @param {string} cardNumber - 银行卡号
 * @returns {boolean} 是否有效
 */
export function isCreditCard(cardNumber) {
  const regex = /^\d{16,19}$/;
  if (!regex.test(cardNumber)) return false;
  
  // Luhn 算法验证
  let sum = 0;
  let isEven = false;
  
  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber[i]);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
}

/**
 * URL 验证
 * @param {string} url - URL 地址
 * @returns {boolean} 是否有效
 */
export function isUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * IP 地址验证
 * @param {string} ip - IP 地址
 * @returns {boolean} 是否有效
 */
export function isIP(ip) {
  const regex = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;
  return regex.test(ip);
}

/**
 * 密码强度检查
 * @param {string} password - 密码
 * @returns {object} 强度信息
 */
export function checkPasswordStrength(password) {
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };
  
  const score = Object.values(checks).filter(Boolean).length;
  
  let level = 'weak';
  if (score >= 4) level = 'strong';
  else if (score >= 3) level = 'medium';
  
  return {
    score,
    level,
    checks,
    suggestions: getSuggestions(checks)
  };
}

function getSuggestions(checks) {
  const suggestions = [];
  
  if (!checks.length) suggestions.push('密码长度至少8位');
  if (!checks.lowercase) suggestions.push('包含小写字母');
  if (!checks.uppercase) suggestions.push('包含大写字母');
  if (!checks.number) suggestions.push('包含数字');
  if (!checks.special) suggestions.push('包含特殊字符');
  
  return suggestions;
}

/**
 * 创建表单验证器
 * @param {object} rules - 验证规则
 * @returns {Function} 验证函数
 */
export function createValidator(rules) {
  return function(data) {
    const errors = {};
    
    Object.keys(rules).forEach(field => {
      const rule = rules[field];
      const value = data[field];
      
      if (rule.required && (!value || value.toString().trim() === '')) {
        errors[field] = rule.message || `${field} 是必填项`;
        return;
      }
      
      if (value && rule.validator && !rule.validator(value)) {
        errors[field] = rule.message || `${field} 格式不正确`;
      }
    });
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };
}