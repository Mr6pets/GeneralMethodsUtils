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
