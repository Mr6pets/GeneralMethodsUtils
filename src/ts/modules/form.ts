import { FormData, FormValidationRules, FormValidationResult, AutoSaveOptions } from '../types';

/**
 * 序列化表单为对象
 * @param form 表单元素
 * @returns 表单数据对象
 */
export function serializeForm(form: HTMLFormElement): FormData {
  const formData = new FormData(form);
  const result: FormData = {};
  
  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      result[key] = value;
    } else {
      // 处理数字类型
      const numValue = Number(value);
      if (!isNaN(numValue) && value.trim() !== '') {
        result[key] = numValue;
      } else if (value === 'true' || value === 'false') {
        result[key] = value === 'true';
      } else {
        result[key] = value;
      }
    }
  }
  
  return result;
}

/**
 * 序列化表单为查询字符串
 * @param form 表单元素
 * @returns 查询字符串
 */
export function serializeFormToQuery(form: HTMLFormElement): string {
  const formData = new FormData(form);
  const params = new URLSearchParams();
  
  for (const [key, value] of formData.entries()) {
    if (typeof value === 'string') {
      params.append(key, value);
    }
  }
  
  return params.toString();
}

/**
 * 填充表单数据
 * @param form 表单元素
 * @param data 数据对象
 */
export function populateForm(form: HTMLFormElement, data: FormData): void {
  Object.entries(data).forEach(([key, value]) => {
    const element = form.querySelector(`[name="${key}"]`) as HTMLInputElement;
    if (element) {
      if (element.type === 'checkbox' || element.type === 'radio') {
        element.checked = Boolean(value);
      } else if (element.type === 'file') {
        // 文件输入框不能程序化设置值
        return;
      } else {
        element.value = String(value);
      }
    }
  });
}

/**
 * 重置表单
 * @param form 表单元素
 */
export function resetForm(form: HTMLFormElement): void {
  form.reset();
  
  // 清除自定义验证状态
  const inputs = form.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    input.classList.remove('valid', 'invalid');
    const errorElement = form.querySelector(`[data-error-for="${input.getAttribute('name')}"]`);
    if (errorElement) {
      errorElement.textContent = '';
    }
  });
}

/**
 * 验证表单
 * @param form 表单元素
 * @param rules 验证规则
 * @returns 验证结果
 */
export function validateForm(
  form: HTMLFormElement,
  rules: FormValidationRules
): FormValidationResult {
  const formData = serializeForm(form);
  const errors: { [fieldName: string]: string } = {};
  
  Object.entries(rules).forEach(([fieldName, rule]) => {
    const value = formData[fieldName];
    const element = form.querySelector(`[name="${fieldName}"]`) as HTMLInputElement;
    
    // 必填验证
    if (rule.required && (!value || value === '')) {
      errors[fieldName] = `${fieldName} is required`;
      if (element) element.classList.add('invalid');
      return;
    }
    
    // 如果值为空且非必填，跳过其他验证
    if (!value || value === '') {
      if (element) element.classList.remove('invalid');
      return;
    }
    
    // 正则验证
    if (rule.pattern && !rule.pattern.test(String(value))) {
      errors[fieldName] = `${fieldName} format is invalid`;
      if (element) element.classList.add('invalid');
      return;
    }
    
    // 数值范围验证
    if (typeof value === 'number') {
      if (rule.min !== undefined && value < rule.min) {
        errors[fieldName] = `${fieldName} must be at least ${rule.min}`;
        if (element) element.classList.add('invalid');
        return;
      }
      if (rule.max !== undefined && value > rule.max) {
        errors[fieldName] = `${fieldName} must be at most ${rule.max}`;
        if (element) element.classList.add('invalid');
        return;
      }
    }
    
    // 字符串长度验证
    if (typeof value === 'string') {
      if (rule.minLength !== undefined && value.length < rule.minLength) {
        errors[fieldName] = `${fieldName} must be at least ${rule.minLength} characters`;
        if (element) element.classList.add('invalid');
        return;
      }
      if (rule.maxLength !== undefined && value.length > rule.maxLength) {
        errors[fieldName] = `${fieldName} must be at most ${rule.maxLength} characters`;
        if (element) element.classList.add('invalid');
        return;
      }
    }
    
    // 自定义验证器
    if (rule.validator) {
      const result = rule.validator(value);
      if (result === false) {
        errors[fieldName] = `${fieldName} is invalid`;
        if (element) element.classList.add('invalid');
        return;
      } else if (typeof result === 'string') {
        errors[fieldName] = result;
        if (element) element.classList.add('invalid');
        return;
      }
    }
    
    // 验证通过
    if (element) {
      element.classList.remove('invalid');
      element.classList.add('valid');
    }
  });
  
  // 显示错误信息
  Object.entries(errors).forEach(([fieldName, message]) => {
    const errorElement = form.querySelector(`[data-error-for="${fieldName}"]`);
    if (errorElement) {
      errorElement.textContent = message;
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * 自动保存表单
 * @param form 表单元素
 * @param options 自动保存选项
 * @returns 清理函数
 */
export function autoSaveForm(
  form: HTMLFormElement,
  options: AutoSaveOptions
): () => void {
  const { key, interval = 5000, storage = 'localStorage' } = options;
  const storageObj = storage === 'localStorage' ? localStorage : sessionStorage;
  
  const saveForm = () => {
    const formData = serializeForm(form);
    storageObj.setItem(key, JSON.stringify(formData));
  };
  
  // 立即保存一次
  saveForm();
  
  // 设置定时保存
  const intervalId = setInterval(saveForm, interval);
  
  // 监听表单变化
  const handleChange = () => saveForm();
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
 * 恢复表单数据
 * @param form 表单元素
 * @param key 存储键名
 * @param storage 存储类型
 * @returns 是否成功恢复
 */
export function restoreForm(
  form: HTMLFormElement,
  key: string,
  storage: 'localStorage' | 'sessionStorage' = 'localStorage'
): boolean {
  try {
    const storageObj = storage === 'localStorage' ? localStorage : sessionStorage;
    const savedData = storageObj.getItem(key);
    
    if (savedData) {
      const formData = JSON.parse(savedData);
      populateForm(form, formData);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Failed to restore form data:', error);
    return false;
  }
}