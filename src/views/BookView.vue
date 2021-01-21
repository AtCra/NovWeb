<template>
    <div id="readView">
        <h1>{{title}}</h1>
        <p v-html="context"></p>
    </div>
</template>

<script>
import ajax from '../net/conn'
export default {
    data(){
        return {
            index:null,//当前的章节
            title:null,
            context:null,
            defaultBufSize:this.$store.state.settings.read.buf_chapters_num//默认缓存10章
        }
    },
    methods:{
        //==================================以下函数用于数据请求========================================

        //向服务器请求章节列表和阅读记录并缓存
        bufInfo(){
            let t=this,rel=this.relpath()
            let book={
                path:t.relpath(),//相对路径
                chapterNum:null,//章节数
                index:null,//当前阅读到的章节
                chapters:[]//章节列表
            }
            console.log('book-view:bufInfo:向服务器请求章节列表 \trelpath:',rel)

            return new Promise((resolve)=>{
                let finish=0;//载入完成的个数

                //请求当前阅读的章节数
                let act='getPartNo'
                ajax(t.$store.state.apis.bookControl,{act,path:rel}).then(function(resp){
                    let obj=JSON.parse(resp)//{partNo:xxx}
                    book.index=obj.partNo
                    finish++;if(finish==2)resolve(book)
                })

                //请求章节列表
                act='getPartList'
                ajax(t.$store.state.apis.bookControl,{act,path:rel}).then(function(resp){
                    let arr=JSON.parse(resp)
                    //arr中的某个元素示例{ "index": 625, "lineIndex": 36455, "title": "第626章 第六百一十五章：腾飞之始（十一）乌合之众" }
                    book.chapters=arr
                    book.chapterNum=arr.length
                    finish++;if(finish==2)resolve(book)
                })
            }).then((book)=>{
                t.$store.commit('updBook',book)
                console.log('book-view:buf:书籍信息缓存完毕:',book);
            })
        },
        //缓存第index章的章节内容
        //传入book用于检查本章节是否已经缓存
        //返回一个Promise，缓存完成后标记resolve
        bufChapter(book,index){
            // console.log('book-view:bufChapter:缓存章节:index=',index)
            
            let t=this,rel=book.path
            let chap={
                path:rel,//书籍相对路径
                index,//章节编号
                context:null//内容
            }
            //首先检查该章节是否已缓存
            if(undefined!=book.chapters[index].context){
                console.log('book-view:bufChapter:章节已缓存，无需请求服务器:章节index=',index);
                return new Promise((resolve)=>{//保持返回格式统一
                    resolve()
                })
            }else{
                return ajax(t.$store.state.apis.chapterUpd,{partNo:index,path:rel}).then(function(resp){
                let obj=JSON.parse(resp)
                chap.context=obj.context;
                t.$store.commit('updChapter',chap)
                console.log('book-view:bufChapter:已缓存章节:',chap);
            })
            }

            
        },
        //从index章（含）开始，最多缓存bufSize章（若剩余章节数小于bufSize则全部缓存）
        //传入book用于检查下标越界和是否已缓存
        //返回一个Promise，全部完成后标记resolve
        bufChapters(book,index,bufSize){
            let rest=book.chapterNum-1-index//剩余章节数

            if(rest<0){
                throw new Error('book-view:bufChapter:数组越界')
            }else if(rest<bufSize){
                bufSize=rest
            }

            console.log('book-view:批量缓存：path=',book.path,'\t起始章节：',index,'缓存数：',bufSize);
            let finish=0//缓存完成的章节数
            return new Promise((resolve)=>{
                for(let i=index;i<index+bufSize;i++){
                    this.bufChapter(book,i).then(()=>{
                        finish++;if(finish==bufSize)resolve()
                    })
                }
            })
        },
        //从缓存中载入当前章节，缓存不存在则先缓存
        loadToLocal(){
            let t=this,rel=this.relpath()
            let book=t.$store.getters.getbook(rel)
            console.log('book-view:loadToLocal:从缓存中查找:\t路径:',rel,'\t查找结果',book);

            if(undefined==book){
                //如果书籍信息（如章节列表）未缓存则首先缓存书籍信息
                t.bufInfo().then(()=>t.loadToLocal())
            }else{
                let index=book.index
                if(undefined== book.chapters[index].context){
                    //书籍信息缓存了，但是当前阅读的章节未缓存，则先缓存当前章节
                    this.bufChapter(book,index).then(()=>t.loadToLocal())
                }else{
                    //从缓存中载入当前章节
                    t.index=index
                    t.title=book.chapters[index].title
                    t.context=book.chapters[index].context

                    console.log('book-view:loadToLocal:当前阅读章节缓存载入成功');

                    //再缓存defaultBufSize章
                    this.bufChapters(book,index,this.defaultBufSize)
                }
            }
        },

        //==================================以上函数用于数据请求========================================

        //==================================以下函数用于阅读控制========================================
        //设置当前阅读的章节
        setReadIndex(index){
            let t=this,rel=this.relpath()
            let book={
                path:rel,
                index
            }
            //更新缓存
            t.$store.commit('setReadIndex',book)
            //更新本地
            t.index=index
            //更新服务器
            //首先判定：是否存在上次更新
            if(undefined==t.lastSetReadIndexPromise){//用于保证处理方式一致
                t.lastSetReadIndexPromise=new Promise((resolve)=>{resolve()})
            }
            //上次向服务器提交的更新完成后才能再次提交
            t.lastSetReadIndexPromise.then(()=>{
                t.lastSetReadIndexPromise=ajax(this.$store.state.apis.bookControl,{act:"setPartNo",path:rel,partNo:index}).then((resp)=>{
                    console.log('book-view:setReadIndex:更新index为',index,'服务器响应：',resp);
                })
            })            
        },
        test(){
            let t=this
            let p=new Promise((resolve)=>{
                setTimeout(()=>{
                    
                    t.setReadIndex(t.index+1)
                    t.loadToLocal()
                    resolve()
                },30)
            })
            p=p.then(()=>{
                setTimeout(()=>{
                    
                    t.setReadIndex(t.index+1)
                    t.loadToLocal()
                    // resolve()
                },30)
            })
            console.log(p);
        }
    },
    computed:{
        //将context切割为数组，每个元素为一个段落
        ctxArr(){
            let arr=this.context.split('<br>')
            //删除空字符
            arr=arr.filter((item)=>{
                return item.length>0
            })
            arr.shift()//删除第一个元素，第一个元素一般都是标题
            // console.log(arr);
            return arr
        },
    },
    mounted(){
        let t=this
        t.loadToLocal()
        t.test()
    }
}
</script>