//request
function Request() {
  var prefix = gobalData.yzy;//从config文件获取配置文件
  this.axios = function (url, data) {
    var instance = axios.create({
      method: 'post',
      Headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      }
    });
    instance.interceptors.request.use(function (config) {
      // $('body').html('请求中.......')
      return config;
    }, function (error) {
      return Promise.reject(error);
    });
    instance.interceptors.response.use(function (response) {
      // $('body').html('请求成功')
      return response;
    }, function (error) {
      return Promise.reject(error);
    });
    return instance({
      url: url,
      data: qs.stringify(data)
    });
  }
  this.url = {
    fileimg: prefix,
    file: prefix + '/index.php?mod=upload&action=main&do=file',
    tokentouser: jl + '/user/main/token2user',
    
  }
}

//原型上添加方法
Request.prototype = {
  constructor: Request,
  tokentouser: function (params, callback) {
    var params = { ...publicParams, ...params }
    var requesUrl = this.url.tokentouser;
    this.axios(requesUrl, params).then(function (res) {
      callback(res.data)
    })
  },
  bigdata: function (params, callback) {
    var params = { ...params, ...publicParams }
    var requesUrl = this.url.bigdata;
    this.axios(requesUrl, params).then(function (res) {
      callback(res.data)
    })
  },
  //重置密码
  resetpwd: function (params, callback) {
    var params = { ...params, ...publicParams }
    var requesUrl = this.url.resetpwd;
    this.axios(requesUrl, params).then(function (res) {
      callback(res.data)
    })
  },
}


/**
 * 使用方法:
 * 
*/
var http = new Request();
var params = {
  site: 'XXXX',
  api: 'XXXXX',
  safekey: 'XXXXX',
  reset_type: 1,
  
}
http.resetpwd(params, function(res) {
  if (res.code == 1) {
    var responseData = res.data;
  } else {
      return self.$message.error(res.msg);
  }
})







































