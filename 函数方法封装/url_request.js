//vue 脚手架 请求地址配置
const service = axios.create();
const qs = Qs;
//配置响应时间
service.defaults.timeout = 40000;
//配置请求头
service.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded;charset=UTF-8";

//添加request拦截器
service.interceptors.request.use(
  (config) => {
    // 默认参数设置：所有接口都必须传的值（比如：token）从localstorage中拿
    // const token = window.localStorage.getItem('token');
    // if (token != null) {//这里要和后台商量好
    //   config.headers.accessToken = token;
    // config.headers['accessToken'] = Token;
    // }
    // 目前还没有本地，所以先写死
    // config.data = qs.stringify({
    //   site: 'qqyxt',
    //   api: 'json',
    //   safekey: 'key',
    //   client: "web",
    //   token: token
    // })
    //判断请求的类型：如果是post请求就把默认参数拼到data里面；如果是get请求就拼到params里面
    if (config.method === "post") {
      config.data = qs.stringify({
        site: "qqyxt",
        api: "json",
        safekey: "key",
        client: "web",
        ...config.data,
        // _t: Date.parse(new Date())//时间戳,用于IE
      });
    } else if (config.method === "get") {
      config.params = {
        site: "qqyxt",
        api: "json",
        safekey: "key",
        client: "web",
        ...config.params,
        // _t: Date.parse(new Date())//时间戳,用于IE
      };
    }
    // config.data = qs.stringify(config.data);
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

//添加response拦截器
service.interceptors.response.use(
  (res) => {
    if (res.data.status === "200") {
      return Promise.resolve(res);
    }
    return res;
  },
  (error) => {
    if (error.toString().indexOf("401") > 0) {
    } else if (error.toString().indexOf("400") > 0) {
      this.$message.error("请求相关参数错误");
    } else if (error.toString().indexOf("408") > 0) {
      this.$message.error("请求超时");
    } else if (error.toString().indexOf("404") > 0) {
      this.$message.error("请检查网络情况");
    } else if (error.toString().indexOf("500") > 0) {
      this.$message.error("服务器宕机了");
    }
    return Promise.reject(error);
  }
);

// 公共GET请求
let axios_get = (url, params = {}) => {
  params.t = new Date().getTime(); //get方法加一个时间参数,解决ie下可能缓存问题.
  // params = qs.stringify(params)
  return new Promise((resolve, reject) => {
    service
      .get(url, { params: params })
      .then(
        (response) => {
          resolve(response);
        },
        (err) => {
          reject(err);
        }
      )
      .catch((error) => {
        this.$message.error("服务器宕机了！");
        reject(error);
      });
  });
};
// 公共POST请求
let axios_post = (url, data) => {
  return new Promise((resolve, reject) => {
    service
      .post(url, data)
      .then(
        (response) => {
          resolve(response);
        },
        (err) => {
          reject(err);
        }
      )
      .catch((error) => {
        this.$message.error("服务器宕机了！");
        reject(error);
      });
  });
};

//封装put方法 (resfulAPI常用)
let axios_put = (url, data = {}) => {
  return service({
    url: url,
    method: "put",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
    data: JSON.stringify(data),
  });
};

//删除方法(resfulAPI常用)
let axios_deletes = (url) => {
  return service({
    url: url,
    method: "delete",
    headers: {},
  });
};

//patch方法(resfulAPI常用)
function axios_patch(url) {
  return service({
    url: url,
    method: "patch",
    headers: {},
  });
}
const link = {
  grade: gobalData.uc + "/index.php?mod=school&action=main&do=detail",
  stat_info: gobalData.login + "/khfw/xtsz/stat", // 首页
};
