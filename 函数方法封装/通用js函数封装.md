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

