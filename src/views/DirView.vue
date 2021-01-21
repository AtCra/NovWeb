<template>
	<div class="DirView">
		<!-- 顶栏，放置搜索框和地址栏 -->
		<div class="header">
		</div>


        <!-- 列表，展示所有的文件夹和指定类型文件 -->
			<div class="list">
				<li v-for="dir in dirs" :key="dir.name">
					<router-link :to="'/dir/'+dir.relpath" class="liItem">
							{{dir.name}}
					</router-link>
					<span class="itemSize">子文件数：{{dir.cnum}}</span>
					<span class="lastReadTime">--{{dir.time}}</span>
				</li>
				<hr />
				<li v-for="book in books" :key='book.relpath'>
					<router-link :to="'/book/'+book.relpath" class="liItem">
						{{book.name}}
					</router-link>
					<span class="itemSize">{{Number.parseInt(book.size/1024)}}KB</span>
					<span class="lastReadTime">--{{book.time}}</span>
					
				</li>
			</div>
	</div>
		
		

</template>
<script>
import ajax from '../net/conn.js'
import * as utils from '../js/utils.js'

export default {
    data(){
        return {
            dirs:[],books:[]
        }
    },
    computed:{

    },
    methods:{
        //此方法用于向服务器请求数据,apiurl为请求api的相对地址
        load(apiurl){
            console.log('dir-view:Load:向服务器请求数据\tapi:',apiurl,'\trelpath:',this.relpath())

            return new Promise((resolve)=>{
                ajax(apiurl,{path:this.relpath()}).then(function(resp){
                    let a=JSON.parse(resp)//a是一个数组

                    a.forEach(item => {//将时间戳转化为直观的时间字符串
                        if(undefined!=item.timeStamp)item.time=utils.formatTime(item.timeStamp)
                    });

                    resolve(a)//返回数组
                })
            })
            
        },
        //此方法用于向服务器请求数据并写入缓存
        loadToCatch(){
            //dir用于暂存数据
            let dir={};dir.dirs=[];dir.books=[];dir.path=this.relpath()//初始化dir
            let t=this

            let finish=0//完成的请求个数，finish===2表示书和dirs的载入均完成

            //异步请求开始,注意此处返回的Promise是then方法返回的（而非一开始new出来的）
            return new Promise((resolve)=>{
                t.load(t.$store.state.apis.listDirs).then(arr=>{
                    dir.dirs=arr
                    finish++;if(finish==2)resolve()
                })
                t.load(t.$store.state.apis.listBooks).then(arr=>{
                    dir.books=arr
                    finish++;if(finish==2)resolve()
                })
            }).then(()=>{
                console.log('dir-view:buf:已缓存:',dir)
                t.$store.commit('pushDir',dir)
            })
        },
        //该方法用于向展示的dirs，books两个数组中载入数据，它会首先在缓存中查找，未查找到则先缓存
        loadToLocal(){
            let t=this,rel=this.relpath()
            console.log('dir-view:LoadToLocal:从缓存中查找:\t路径:',rel,'\t查找结果:',this.$store.getters.getdir(rel));
            

            t.dirs.splice(0);t.books.splice(0);//清空展示的数据
            //如果已缓存当前目录
            if(undefined!=this.$store.getters.getdir(rel)){
                let dir=t.$store.getters.getdir(rel)
                t.dirs.push(...(dir.dirs))
                t.books.push(...(dir.books))
            }else{
                //未缓存当前目录，则先缓存
                t.loadToCatch().then(()=>{
                    //缓存完毕后从缓存中载入
                    let dir=t.$store.getters.getdir(rel)
                    t.dirs.push(...(dir.dirs))
                    t.books.push(...(dir.books))
                })
            }
            
        }
    },
    mounted(){
        // this.loadToLocal()
    },
    watch:{
        $route:{
            handler(){
                this.loadToLocal()
            },
            immediate:true
        }
    }
}
</script>