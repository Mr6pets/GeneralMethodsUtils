// 认证管理模块
import { Utils } from './utils.js';

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.users = {
            'admin': { isMember: true },
            'user': { isMember: false }
        };
        this.init();
    }

    init() {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.updateUI();
        }
    }

    login(username) {
        if (this.users[username]) {
            this.currentUser = { 
                username, 
                ...this.users[username] 
            };
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            Utils.showToast(`欢迎，${username}！`, 'success');
            this.updateUI();
        } else {
            Utils.showToast('登录失败，用户不存在', 'error');
        }
    }

    logout() {
        const username = this.currentUser.username;
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        Utils.showToast(`${username} 已退出登录`, 'info');
        this.updateUI();
    }

    isLoggedIn() {
        return !!this.currentUser;
    }

    isMember() {
        return this.isLoggedIn() && this.currentUser.isMember;
    }

    updateUI() {
        const loginBtn = document.getElementById('loginBtn');
        const upgradeBtn = document.getElementById('upgradeBtn');
        const premiumOverlay = document.getElementById('premiumOverlay');
        const sourceTab = document.getElementById('sourceTab');

        if (this.isLoggedIn()) {
            loginBtn.textContent = `退出 (${this.currentUser.username})`;
            loginBtn.classList.remove('btn-outline');
            loginBtn.classList.add('btn-secondary');
            
            if (this.isMember()) {
                upgradeBtn.style.display = 'none';
                premiumOverlay.style.display = 'none';
                sourceTab.classList.remove('locked');
            } else {
                upgradeBtn.style.display = 'inline-flex';
                premiumOverlay.style.display = 'flex';
                sourceTab.classList.add('locked');
            }
        } else {
            loginBtn.textContent = '登录';
            loginBtn.classList.add('btn-outline');
            loginBtn.classList.remove('btn-secondary');
            upgradeBtn.style.display = 'inline-flex';
            premiumOverlay.style.display = 'flex';
            sourceTab.classList.add('locked');
        }
    }
}

export { AuthManager };

class AuthManager {
    constructor() {
        this.apiUrl = 'http://localhost:3000/api/auth';
        this.token = localStorage.getItem('authToken');
        this.user = JSON.parse(localStorage.getItem('user') || 'null');
    }
    
    async login(email, password) {
        try {
            const response = await fetch(`${this.apiUrl}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.token = data.data.token;
                this.user = data.data.user;
                
                localStorage.setItem('authToken', this.token);
                localStorage.setItem('user', JSON.stringify(this.user));
                
                this.updateUI();
                return { success: true, message: data.message };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('登录错误:', error);
            return { success: false, message: '网络错误，请稍后重试' };
        }
    }
    
    async register(username, email, password) {
        try {
            const response = await fetch(`${this.apiUrl}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('注册错误:', error);
            return { success: false, message: '网络错误，请稍后重试' };
        }
    }
    
    logout() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        this.updateUI();
    }
    
    isLoggedIn() {
        return !!this.token && !!this.user;
    }
    
    updateUI() {
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            if (this.isLoggedIn()) {
                loginBtn.textContent = `${this.user.username} | 退出`;
                loginBtn.classList.add('logged-in');
            } else {
                loginBtn.textContent = '登录';
                loginBtn.classList.remove('logged-in');
            }
        }
    }
}

export { AuthManager };