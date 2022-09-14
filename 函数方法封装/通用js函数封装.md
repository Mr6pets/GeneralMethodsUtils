##### 这是对common.js的文件的一个说明

>	```js
>	此js 包含设置 设置cookie 获取cookie等封装函数；
>	```

> 关于vant UI 的上拉加载 下拉刷新

~~~js
<van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" v-show='pageData.length'>
  <van-pull-refresh v-model="isLoading" @refresh="onRefresh()">
    这里存放内容
   </van-pull-refresh>
</van-list>

 data() {
   return {
     is_teacher: isteacher,
     is_title: "我的评价",

     loading: false,//加载状态
     finished: false,//是否全部加载完毕
     isLoading: false,
     page: 1,
     total_page:'',//总页数
     pageData:[],
   }
 },
 methods: {
   async getEvaluateList() {
        var url = gobalData.userInfo.openapi + 'XXXXXXXXXXX'
        var params = {
          xxx:xxxx,
          page: this.page,
          limit:10,
        }
        var { data } = await axios.post(url, Qs.stringify(params));
        if (data.code == "1") {
          // 后台成功取消掉加载状态
          this.loading = false;
          var { page_data, page_now, total_page, total_rows } = data.data;
          this.total_page = Number(total_page);
          if (page_data.length) {
            this.pageData = this.pageData.concat(page_data);
            //这里判断目前页数有没有超过后台返回的最大页数
            if (this.page >= Number(total_page)) {
              this.finished = true;
            } else {
              this.page += 1;
            }
          } else {
            this.finished = true;
            this.isloading = false;
            nodata();
          }
        }
      },
        /**下拉刷新*/
      onRefresh() {
        this.loading = true;
        this.isLoading = false;
        this.finished = false;
        this.page = 1
        this.pageData = [];
        this.getEvaluateList()//正常的请求数据的方法，数组重新赋值
      },
      /**上拉加载*/
      onLoad() {
        this.getEvaluateList();
      },
 }
   
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

