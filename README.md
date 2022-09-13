# General-method-encapsulation

> 这是一个通用代码封装仓库

通用样式css样式文件夹
通用函数方法封装

#### 创建vue 项目
vue create XXX

#### 升级Vue终端
vue add vue-next

#### MAC 打开第三方程序安装
sudo spctl --master-disable

#### 版本时间戳动态
~~~js
document.write("<link rel='stylesheet' type='text/css' href='/css/layout.css?v="+new Date().getTime()+"'>");
~~~

#### vscode 配合使用插件
~~~js
//B站地址：https://www.bilibili.com/video/BV1Xg411X74K/?spm_id_from=333.788.recommend_more_video.7&vd_source=8b749e499334930bb8f03b6f409d8dbb
1、LiveServer（实时更新网页
2、REST Client（客户端请求
3、GitLens（git查看修改
4、CSS Peek（查css代码 
5、Quokka.js（提醒js代码错误
6、CodeSnap（代码截图
7、Auto Rename Tag（自动修改前后标签
8、Snippets（缩写
9、Bracket Pair Colorizer（括号颜色
10、indent-rainbow（缩进颜色
11、vscode-icons（更好识别的图标
12、Prettier（自动整理代码格式
13、Color Highlight（颜色提醒
14、Dracula Official（主题


~~~

#### 分享func
~~~js
//分享大全
    shareQQ(title, url, pic) {
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
    },

    qZone(title, pic) {
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
    },

    weixin() {
      var target_url =
        "http://qr.liantu.com/api.php?text=http://test.qicheyitiao.com";
      window.open(target_url, "weixin", "height=320, width=320");
    },
    
    sinaWeiBo(title, url, pic) {
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
    },
~~~









