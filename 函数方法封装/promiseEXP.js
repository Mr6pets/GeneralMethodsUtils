/**
 * 关于promise的说明
 * */
 
Promise.resolve()//成功的执行：Promise.resolve()的作用将现有对象转为Promise对象resolvedl;Promise.resolve('test')==new Promise(resolve=>resolve('test'))
Promise.reject()//失败的执行：Promise.reject()也是返回一个Promise对象,状态为rejected
Promise.prototype.then()//then() 成功回调
Promise.prototype.catch()//发生错误的回调函数。
Promise.all() // 所有的都有完成，相当于 且 :适合用于所有的结果都完成了才去执行then（）成功的操作
Promise.allSettled() // 不管成功失败都会继续执行:
//:Promise.allSettled()和Promise.all()很像，但是all只要有一个报错，也就是走的rejected，就会跳出并终止，而allSettled不管成功还是失败都会有值，继续执行后面的不会终止
Promise.race() // 完成一个即可，相当于 或 


//letExp:
let promise=new Promise((resolve,reject)=>{
	//模拟执行请求接口
	getData()
	.then((res)=>{resolve(res)})
	.catch(err=>{reject('错误')})
})
promise.then(res=>{
	console.log(res);
})
.catch(error=>{console.log(error)})


// 假如有一个需求，需要同时请求三个接口，三个接口全都返回数据后再做处理，则可以使用Promise.all()这个api。举个栗子：
let p1 =new Promise((resolve,reject)=>{
    // 模拟请求接口1
    getData1().then((res)=>{
        // 标记成功后给定某个数据：res
        resolve(res)
    }).catch(e=>{
        // 标记失败后给定某个数据
        reject('发生错误')
    })
})
let p2 = new Promise((resolve,reject)=>{
    // 模拟请求接口2
    getData2().then((res)=>{
        // 标记成功后给定某个数据：res
        resolve(res)
    }).catch(e=>{
        // 标记失败后给定某个数据
        reject('发生错误')
    })
})
let p3 = new Promise((resolve,reject)=>{
    // 模拟请求接口3
    getData3().then((res)=>{
        // 标记成功后给定某个数据：res
        resolve(res)
    }).catch(e=>{
        // 标记失败后给定某个数据
        reject('发生错误')
    })
})

// results的结果是一个数组，分别代表三个接口的数据
Promise.all([p1, p2, p3]).then((results)=>{
    console.log('success:',results)
}).catch(e=>{ // 失败的时候则返回最先被reject失败状态的值
    console.log("error",e)
})

/**
 * Promse.all()：在处理多个异步处理时非常有用，比如说一个页面上需要等两个或多个ajax的数据回来以后才正常显示，
 * 在此之前只显示loading图标；但是假如其中有一个报错就会终止并跳出。在成功结果的数组里面的数据顺序和Promise.all接收到的数组顺序是一致的，
 * 即p1的结果在前，即便p1的结果获取的比p2要晚。这带来了一个绝大的好处：在前端开发请求数据的过程中，
 * 偶尔会遇到发送多个请求并根据请求顺序获取和使用数据的场景，使用Promise.all毫无疑问可以解决这个问题。
 * */

 /**
  * Promise.race()：Promse.race就是赛跑的意思，意思就是说，
  * Promise.race([p1, p2, p3])里面哪个结果获得的快，就返回那个结果，不管结果本身是成功状态还是失败状态。用法和Promise.all一样
  * */

//Promise.allSettled():和all()一样，但是报错并不影响后面的，会继续执行
let p1 = Promise.resolve(1)
let p2 = Promise.reject('发生错误')
let p3 = Promise.resolve(1)
 
// 可以使用同步写法，也可以和all一样使用then
let res = await Promise.allSettled([p1, p2, p3])
// 返回结果是一个数组
cosnole.log(res)

/**
 * 常会遇到多个相互依赖的异步请求。如有a,b,c三个ajax请求，b需要依赖a返回的数据，
 * c又需要a和b请求返回的数据。如果采用请求嵌套请求的方式自然是不可取的。
 * 导致代码难以维护，如何请求很多。会出现很多问题。
 * */

function a(){
	return new Promise((res,rej)=>{
		$.ajax({
			url:"a",
			type:"GET",
			async:true,
			dataType:"json",
			success:function(data){
				console.log(data,"1");
				res(data)
			}
		})
	})
}

function b(data){
	return new Promise((res,rej)=>{
		$.ajax({
			url:'b',
			type:"POST",
			async:true,
			data:JSON.stringify(data),
			dataType:"json",
			success:function(data){
				console.log(data);
				res();
			}
		})
	})
}

$("#btn").click(function(){
	a().then(function(data){
		b(data);
	}).then(function(){
		
	})
})























