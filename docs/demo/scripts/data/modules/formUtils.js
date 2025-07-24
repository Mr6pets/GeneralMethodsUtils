// 表单处理工具模块
export default {
    title: '表单处理工具',
    icon: 'fas fa-wpforms',
    methods: {
        serializeForm: {
            name: 'serializeForm',
            description: '序列化表单数据为对象',
            params: [
                { name: 'form', type: 'HTMLFormElement', required: true, description: '表单元素' },
                { name: 'options', type: 'object', required: false, description: '序列化选项' }
            ],
            examples: {
                js: `// 序列化表单\nconst form = document.querySelector('#userForm');\nconst data = serializeForm(form);\nconsole.log(data);\n// { name: 'John', email: 'john@example.com', age: '25' }`,
                ts: `import { serializeForm } from 'general-method-utils';\n\nconst form = document.querySelector('#userForm') as HTMLFormElement;\nconst data: Record<string, any> = serializeForm(form);`
            },
            demo: true
        },
        validateForm: {
            name: 'validateForm',
            description: '验证表单数据',
            params: [
                { name: 'form', type: 'HTMLFormElement', required: true, description: '表单元素' },
                { name: 'rules', type: 'object', required: true, description: '验证规则' }
            ],
            examples: {
                js: `// 表单验证\nconst form = document.querySelector('#registerForm');\nconst rules = {\n  username: { required: true, minLength: 3 },\n  email: { required: true, pattern: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/ },\n  password: { required: true, minLength: 6 }\n};\n\nconst result = validateForm(form, rules);`,
                ts: `import { validateForm } from 'general-method-utils';\n\nconst form = document.querySelector('#registerForm') as HTMLFormElement;\nconst result = validateForm(form, rules);`
            },
            demo: true
        },
        resetForm: {
            name: 'resetForm',
            description: '重置表单到初始状态',
            params: [
                { name: 'form', type: 'HTMLFormElement', required: true, description: '表单元素' },
                { name: 'clearErrors', type: 'boolean', required: false, description: '是否清除错误信息' }
            ],
            examples: {
                js: `// 重置表单\nconst form = document.querySelector('#contactForm');\nresetForm(form);\n\n// 重置表单并清除错误\nresetForm(form, true);`,
                ts: `import { resetForm } from 'general-method-utils';\n\nconst form = document.querySelector('#contactForm') as HTMLFormElement;\nresetForm(form, true);`
            },
            demo: true
        },
        populateForm: {
            name: 'populateForm',
            description: '用数据填充表单',
            params: [
                { name: 'form', type: 'HTMLFormElement', required: true, description: '表单元素' },
                { name: 'data', type: 'object', required: true, description: '要填充的数据' }
            ],
            examples: {
                js: `// 填充表单数据\nconst form = document.querySelector('#editUserForm');\nconst userData = {\n  name: 'John Doe',\n  email: 'john@example.com',\n  age: 30\n};\n\npopulateForm(form, userData);`,
                ts: `import { populateForm } from 'general-method-utils';\n\nconst form = document.querySelector('#editUserForm') as HTMLFormElement;\nconst userData = { name: 'John Doe', email: 'john@example.com' };\npopulateForm(form, userData);`
            },
            demo: true
        },
        addFormValidation: {
            name: 'addFormValidation',
            description: '为表单添加实时验证',
            params: [
                { name: 'form', type: 'HTMLFormElement', required: true, description: '表单元素' },
                { name: 'rules', type: 'object', required: true, description: '验证规则' },
                { name: 'options', type: 'object', required: false, description: '验证选项' }
            ],
            examples: {
                js: `// 添加实时验证\nconst form = document.querySelector('#signupForm');\nconst rules = {\n  email: { required: true, pattern: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/ },\n  password: { required: true, minLength: 8 }\n};\n\naddFormValidation(form, rules);`,
                ts: `import { addFormValidation } from 'general-method-utils';\n\nconst form = document.querySelector('#signupForm') as HTMLFormElement;\naddFormValidation(form, rules);`
            },
            demo: true
        },
        getFormData: {
            name: 'getFormData',
            description: '获取表单数据（支持文件上传）',
            params: [
                { name: 'form', type: 'HTMLFormElement', required: true, description: '表单元素' },
                { name: 'asFormData', type: 'boolean', required: false, description: '是否返回FormData对象' }
            ],
            examples: {
                js: `// 获取普通表单数据\nconst form = document.querySelector('#uploadForm');\nconst data = getFormData(form);\n\n// 获取FormData对象\nconst formData = getFormData(form, true);`,
                ts: `import { getFormData } from 'general-method-utils';\n\nconst form = document.querySelector('#uploadForm') as HTMLFormElement;\nconst data = getFormData(form);`
            },
            demo: true
        },
        setFieldError: {
            name: 'setFieldError',
            description: '为表单字段设置错误信息',
            params: [
                { name: 'field', type: 'HTMLElement', required: true, description: '表单字段' },
                { name: 'message', type: 'string', required: true, description: '错误信息' }
            ],
            examples: {
                js: `// 设置字段错误\nconst emailField = document.querySelector('#email');\nsetFieldError(emailField, '邮箱格式不正确');`,
                ts: `import { setFieldError } from 'general-method-utils';\n\nconst emailField = document.querySelector('#email') as HTMLElement;\nsetFieldError(emailField, '邮箱格式不正确');`
            },
            demo: true
        }
    }
};