/**设置cookie*/
function setCookie(name, value) {
	var Days = 30;
	var exp = new Date();
	exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
	document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}
/**获取cookie**/
function getcookie(key) { //获取cookie方法
	/*获取cookie参数*/
	var getCookie = document.cookie.replace(/[]/g, ""); //获取cookie，并且将获得的cookie格式化，去掉空格字符
	var arrCookie = getCookie.split(";") //将获得的cookie以"分号"为标识 将cookie保存到arrCookie的数组中
	  // document.domain = 'bozedu.net';
	var tips; //声明变量tips
	for (var i = 0; i < arrCookie.length; i++) { //使用for循环查找cookie中的tips变量
	  var arr = arrCookie[i].trim().split("=");
    // console.log(arr) //将单条cookie用"等号"为标识，将单条cookie保存为arr数组
    if (key == arr[0]) { //匹配变量名称，其中arr[0]是指的cookie名称，如果该条变量为tips则执行判断语句中的赋值操作
      tips = arr[1]; //将cookie的值赋给变量tips
      break; //终止for循环遍历
    }
	}
	return tips;
}
/**获取URL地址栏参数*/
function GetQueryString(name){
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]); return null;
}
/**运行设备的判断*/
function equipmentType(){
	var u = navigator.userAgent;
	var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
	var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
	if (isAndroid) {
		return 'android'
	}
	if (isiOS) {
		return 'ios'
	}
}
/**********************************前端和APP交互*******************************************************/
/*调用安卓APP调用方法(goBack为安卓提供的方法)**/
window.android.goBack();

/*调用IOS APP调用方法**/

setupWebViewJavascriptBridge(function(bridge) {
	bridge.callHandler('goBack', {}, function(resp) {});	
})

function setupWebViewJavascriptBridge(callback) {
	if (window.WebViewJavascriptBridge) {
		return callback(WebViewJavascriptBridge); 
	}
	if (window.WVJBCallbacks) { 
		return window.WVJBCallbacks.push(callback); 
	}
  window.WVJBCallbacks = [callback];
  var WVJBIframe = document.createElement('iframe');
  WVJBIframe.style.display = 'none';
  WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
  document.documentElement.appendChild(WVJBIframe);
  setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
}

/*注册监听事件（固定代码）使用时去掉BACK1**/
function setupWebViewJavascriptBridgeBACK1(callback) {
	if (window.WebViewJavascriptBridge) {//Android使用
		callback(WebViewJavascriptBridge)
	} else {//ios使用
		document.addEventListener(
			'WebViewJavascriptBridgeReady',
			function() {
				callback(WebViewJavascriptBridge)
			},
			false
		);
	}

/*添加原生调起js方法**/
setupWebViewJavascriptBridge(function(bridge) {
     /* Initialize your app here */
     //所有与iOS交互的JS代码放这里！
    //js注册方法让原生调起（原生调用js）
    //name： 和原生约定的调用方法名
    //function(data,callback)：调用方法的具体内容，data为原生传过来的参数，callback为js给原生的回调函数             
    bridge.registerHandler("jsFunction",function(data,responseCallback){
        alert("do sth with"+data)
        responseCallback("js calls back to oc");
    });
    
    //js唤起原生的方法（js调用原生）
    //name： 和原生约定的调用方法名
    //data： 向原生传递的参数
    //function： 原生调用后的回调函数（回调结果处理）
    bridge.callHandler('ocFunction',data,function(res){
         alert("js has received the result:"+res);
    });
});




/*********************************BEGAIN******************************/
//注册iOS事件
// setupWebViewJavascriptBridge();
//安卓注册事件监听
// function connectWebViewJavascriptBridge(callback) {
// 		if (window.WebViewJavascriptBridge) {
// 				callback(WebViewJavascriptBridge)
// 		} else {
// 				document.addEventListener(
// 						'WebViewJavascriptBridgeReady'
// 						, function() {
// 								callback(WebViewJavascriptBridge)
// 						},
// 						false
// 				);
// 		}
// }

//注册回调函数，第一次连接时调用 初始化函数
	// connectWebViewJavascriptBridge(function(bridge) {
 //       //初始化
 //      bridge.init(function(message, responseCallback) {
 //          //var data = {'Javascript Responds': 'Wee!'};
 //          responseCallback(data);
 //      });
 //      //Android调用js方法：functionInJs方法名称需要保持一致 ，并返回给Android通知
 //      bridge.registerHandler("functionInJs", function(data, responseCallback) {
 //          responseCallback(data);
 //      });
 //  })
/********************************END*******************************/

/**
 * 数组排序
 */ 
/**简单的数组排序*/








