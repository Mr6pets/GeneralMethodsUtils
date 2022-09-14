/***********************************设置cookie**********************************/
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



/**********************************Vant UI的下拉刷新 上拉加载*******************************************************/


/**********************************TinyMce富文本*******************************************************/
//初始化tinymce富文本
    fucntion initTinymce() {
   const _this = this
   console.log('window.tinymce :>> ', window.tinymce.minorVersion);
   console.log('object :>> ', document.querySelector(`#${this.tinymceId}`));
   window.tinymce.init({
     selector: `#${this.tinymceId}`,//挂载在那个dom节点下
     branding: false,
     language: 'zh_CN',
     height: 550,
     body_class: 'panel-body editor-content',
     object_resizing: false,
     toolbar: ['newdocument undo redo | textpattern formatpainter template pastetext selectall| forecolor backcolor bold italic underline | fontborder strikethrough anchor |ltr rtl | alignleft aligncenter alignright alignjustify indent2em lineheight predistance postdistance| \
blockquote subscript superscript removeformat | styleselect formatselect | fontselect fontsizeselect | table image media link charmap emoticons hr pagebreak insertdatetime print preview | fullscreen |   savetooss addnewslink'],
     plugins:['print preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template code codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists wordcount imagetools textpattern help paste emoticons autosave indent2em lineheight postdistance savetooss quickbars formatpainter predistance bdmap fontborder addnewslink axupimgs'],
     init_instance_callback: editor => {
       if (_this.value) {
         editor.setContent(_this.value)
       }
       _this.hasInit = true
       /****改成了只绑定keyup事件   要不然编辑的时候一进来就走这个方法了*/ 
       editor.on('KeyUp', () => {
         _this.hasChange = true
         _this.$emit('input', editor.getContent())
       })
     },
 })


/**********************************页面分享（QQ sina 等）*******************************************************/
//分享大全
       fucntion shareQQ(title, url, pic){
            var p = {
                url: this.shareLink /*获取URL，可加上来自分享到QQ标识，方便统计*/,
                desc: "来自桐乡艺校的分享" /*分享理由(风格应模拟用户对话),支持多分享语随机展现（使用|分隔）*/,
                title: "优质课程一起围观~" /*分享标题(可选)*/,
                summary: "优质课程一起围观~" /*分享描述(可选)*/,
                pics: pic /*分享图片(可选)*/,
                flash: "" /*视频地址(可选)*/,
                //commonClient : true, /*客户端嵌入标志*/
                site: "桐乡艺校" /*分享来源 (可选) ，如：QQ分享*/,
            };
            var s = [];
            for (var i in p) {
                s.push(i + "=" + encodeURIComponent(p[i] || ""));
            }
            var target_url =
                "http://connect.qq.com/widget/shareqq/iframe_index.html?" + s.join("&");
            window.open(target_url, "qq", "height=520, width=720");
        };

        fucntion qZone(title, pic) {
            var p = {
                url: this.shareLink,
                showcount: "1" /*是否显示分享总数,显示：'1'，不显示：'0' */,
                desc: "这篇文章不错,分享一下~~" /*默认分享理由(可选)*/,
                summary: "" /*分享摘要(可选)*/,
                title: '优质课程一起围观~' /*分享标题(可选)*/,
                site: "桐乡艺校" /*分享来源 如：腾讯网(可选)summary*/,
                pics: pic /*分享图片的路径(可选)*/,
                style: "101",
                width: 199,
                height: 30,
            };
            var s = [];
            for (var i in p) {
                s.push(i + "=" + encodeURIComponent(p[i] || ""));
            }
            var target_url =
                "http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?" +
                s.join("&");
            window.open(target_url, "qZone", "height=430, width=400");
        };

        fucntion weixin() {
            var target_url =
                "http://qr.liantu.com/api.php?text=http://test.qicheyitiao.com";
            window.open(target_url, "weixin", "height=320, width=320");
        };

        fucntion sinaWeiBo(title, url, pic) {
            var param = {
                url: this.shareLink,
                type: "3",
                count: "1" /** 是否显示分享数，1显示(可选)*/,
                appkey: "桐乡艺校" /** 您申请的应用appkey,显示分享来源(可选)*/,
                title: "优质课程一起围观~" /** 分享的文字内容(可选，默认为所在页面的title)*/,
                pic: pic,
                /**分享图片的路径(可选)*/
                ralateUid: ""
                /**关联用户的UID，分享微博会@该用户(可选)*/,
                rnd: new Date().valueOf(),
            };
            var temp = [];
            for (var p in param) {
                temp.push(p + "=" + encodeURIComponent(param[p] || ""));
            }
            var target_url ="http://service.weibo.com/share/share.php?" + temp.join("&");
            window.open(target_url, "sinaweibo", "height=430, width=400");
        };





