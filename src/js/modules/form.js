/**
 * 表单处理相关工具方法
 */

/**
 * 序列化表单数据
 * @param {HTMLFormElement} form - 表单元素
 * @returns {object} 表单数据对象
 */
export function serializeForm(form) {
  const formData = new FormData(form);
  const data = {};
  
  for (const [key, value] of formData.entries()) {
    if (data[key]) {
      // 处理多选情况
      if (Array.isArray(data[key])) {
        data[key].push(value);
      } else {
        data[key] = [data[key], value];
      }
    } else {
      data[key] = value;
    }
  }
  
  return data;
}

/**
 * 序列化表单为查询字符串
 * @param {HTMLFormElement} form - 表单元素
 * @returns {string} 查询字符串
 */
export function serializeFormToQuery(form) {
  const formData = new FormData(form);
  const params = new URLSearchParams();
  
  for (const [key, value] of formData.entries()) {
    params.append(key, value);
  }
  
  return params.toString();
}

/**
 * 填充表单数据
 * @param {HTMLFormElement} form - 表单元素
 * @param {object} data - 数据对象
 */
export function populateForm(form, data) {
  Object.keys(data).forEach(key => {
    const element = form.elements[key];
    if (!element) return;
    
    const value = data[key];
    
    if (element.type === 'checkbox') {
      element.checked = Boolean(value);
    } else if (element.type === 'radio') {
      const radioButton = form.querySelector(`input[name="${key}"][value="${value}"]`);
      if (radioButton) radioButton.checked = true;
    } else if (element.tagName === 'SELECT') {
      element.value = value;
    } else {
      element.value = value;
    }
  });
}

/**
 * 重置表单
 * @param {HTMLFormElement} form - 表单元素
 */
export function resetForm(form) {
  form.reset();
  
  // 清除自定义验证消息
  const inputs = form.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    input.setCustomValidity('');
  });
}

/**
 * 验证表单
 * @param {HTMLFormElement} form - 表单元素
 * @param {object} rules - 验证规则
 * @returns {object} 验证结果
 */
export function validateForm(form, rules = {}) {
  const errors = {};
  const data = serializeForm(form);
  
  Object.keys(rules).forEach(fieldName => {
    const rule = rules[fieldName];
    const value = data[fieldName];
    const element = form.elements[fieldName];
    
    // 必填验证
    if (rule.required && (!value || value.toString().trim() === '')) {
      errors[fieldName] = rule.message || `${fieldName} 是必填项`;
      if (element) element.setCustomValidity(errors[fieldName]);
      return;
    }
    
    // 自定义验证器
    if (rule.validator && value && !rule.validator(value)) {
      errors[fieldName] = rule.message || `${fieldName} 格式不正确`;
      if (element) element.setCustomValidity(errors[fieldName]);
      return;
    }
    
    // 清除错误状态
    if (element) element.setCustomValidity('');
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * 自动保存表单数据到本地存储
 * @param {HTMLFormElement} form - 表单元素
 * @param {string} key - 存储键名
 * @param {number} interval - 保存间隔（毫秒）
 * @returns {Function} 停止自动保存的函数
 */
export function autoSaveForm(form, key, interval = 5000) {
  const save = () => {
    const data = serializeForm(form);
    localStorage.setItem(key, JSON.stringify(data));
  };
  
  // 立即保存一次
  save();
  
  // 设置定时保存
  const intervalId = setInterval(save, interval);
  
  // 监听表单变化
  const handleChange = () => save();
  form.addEventListener('input', handleChange);
  form.addEventListener('change', handleChange);
  
  // 返回清理函数
  return () => {
    clearInterval(intervalId);
    form.removeEventListener('input', handleChange);
    form.removeEventListener('change', handleChange);
  };
}

/**
 * 从本地存储恢复表单数据
 * @param {HTMLFormElement} form - 表单元素
 * @param {string} key - 存储键名
 * @returns {boolean} 是否成功恢复数据
 */
export function restoreForm(form, key) {
  try {
    const savedData = localStorage.getItem(key);
    if (savedData) {
      const data = JSON.parse(savedData);
      populateForm(form, data);
      return true;
    }
  } catch (error) {
    console.error('Failed to restore form data:', error);
  }
  return false;
}