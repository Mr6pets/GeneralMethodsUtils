/**
 * 社交分享相关工具方法
 */

/**
 * 分享到 QQ
 * @param {object} options - 分享配置
 * @param {string} options.title - 分享标题
 * @param {string} options.url - 分享链接
 * @param {string} options.pic - 分享图片
 * @param {string} options.desc - 分享描述
 */
export function shareToQQ({ title, url, pic, desc = "来自分享" }) {
  const params = {
    url: url,
    desc: desc,
    title: title,
    summary: title,
    pics: pic,
    flash: "",
    site: "网站分享"
  };
  
  const queryString = Object.keys(params)
    .map(key => `${key}=${encodeURIComponent(params[key] || "")}`)
    .join("&");
    
  const targetUrl = `http://connect.qq.com/widget/shareqq/iframe_index.html?${queryString}`;
  window.open(targetUrl, "qq", "height=520, width=720");
}

/**
 * 分享到 QQ 空间
 * @param {object} options - 分享配置
 */
export function shareToQZone({ title, url, pic, desc = "这篇文章不错,分享一下~~" }) {
  const params = {
    url: url,
    showcount: "1",
    desc: desc,
    summary: "",
    title: title,
    site: "网站分享",
    pics: pic,
    style: "101",
    width: 199,
    height: 30
  };
  
  const queryString = Object.keys(params)
    .map(key => `${key}=${encodeURIComponent(params[key] || "")}`)
    .join("&");
    
  const targetUrl = `http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?${queryString}`;
  window.open(targetUrl, "qZone", "height=430, width=400");
}

/**
 * 分享到新浪微博
 * @param {object} options - 分享配置
 */
export function shareToWeibo({ title, url, pic }) {
  const params = {
    url: url,
    type: "3",
    count: "1",
    appkey: "网站分享",
    title: title,
    pic: pic,
    ralateUid: "",
    rnd: new Date().valueOf()
  };
  
  const queryString = Object.keys(params)
    .map(key => `${key}=${encodeURIComponent(params[key] || "")}`)
    .join("&");
    
  const targetUrl = `http://service.weibo.com/share/share.php?${queryString}`;
  window.open(targetUrl, "sinaweibo", "height=430, width=400");
}