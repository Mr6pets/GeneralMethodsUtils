import { ShareOptions } from '../types';

/**
 * 原生分享API
 * @param options 分享选项
 * @returns 是否成功
 */
export async function nativeShare(options: ShareOptions): Promise<boolean> {
  if (!navigator.share) {
    console.warn('当前浏览器不支持原生分享API');
    return false;
  }
  
  try {
    await navigator.share(options);
    return true;
  } catch (error) {
    console.error('分享失败:', error);
    return false;
  }
}

/**
 * 分享到微信
 * @param options 分享选项
 */
export function shareToWeChat(options: ShareOptions): void {
  const { title = '', text = '', url = window.location.href } = options;
  
  if (typeof WeixinJSBridge !== 'undefined') {
    WeixinJSBridge.invoke('sendAppMessage', {
      appid: '',
      img_url: '',
      img_width: '120',
      img_height: '120',
      link: url,
      desc: text,
      title: title
    });
  } else {
    alert('请在微信中打开');
  }
}

/**
 * 分享到QQ
 * @param options 分享选项
 */
export function shareToQQ(options: ShareOptions): void {
  const { title = '', text = '', url = window.location.href } = options;
  
  const shareUrl = `https://connect.qq.com/widget/shareqq/index.html?` +
    `url=${encodeURIComponent(url)}&` +
    `title=${encodeURIComponent(title)}&` +
    `summary=${encodeURIComponent(text)}`;
    
  window.open(shareUrl, '_blank');
}

/**
 * 分享到微博
 * @param options 分享选项
 */
export function shareToWeibo(options: ShareOptions): void {
  const { title = '', text = '', url = window.location.href } = options;
  
  const content = `${title} ${text} ${url}`;
  const shareUrl = `https://service.weibo.com/share/share.php?` +
    `url=${encodeURIComponent(url)}&` +
    `title=${encodeURIComponent(content)}`;
    
  window.open(shareUrl, '_blank');
}

/**
 * 复制链接分享
 * @param url 要分享的链接
 * @returns 是否成功
 */
export async function shareByLink(url: string = window.location.href): Promise<boolean> {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      return true;
    } else {
      // 降级方案
      const textArea = document.createElement('textarea');
      textArea.value = url;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      return success;
    }
  } catch (error) {
    console.error('复制链接失败:', error);
    return false;
  }
}