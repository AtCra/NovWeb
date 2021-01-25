<template>
    <div id="readView">
        
        <!-- 阅读视图，含章节标题，章节正文，底栏页码 -->
        <read-section :chapIndex="index" :ctxArr="ctxArr" :title="title"
                        @next_chap="handleSwitchChap(index+1)" @previous_chap="handleSwitchChap(index-1)"></read-section>
    </div>
</template>

<script>
import ajax from '../net/conn'
import ReadSection from '../components/ReadSection.vue'

export default {
    components:{ReadSection},
    data(){
        return {
            index:null,//当前的章节
            title:null,
            context:null,
            chaptersBuf:[],//用于在章节列表未加载完毕的时候临时缓存章节内容
            defaultBufSize:this.$store.state.settings.read.buf_chapters_num//默认缓存10章
        }
    },
    methods:{
        //==================================以下函数用于数据请求========================================

        //向服务器请求阅读记录并缓存
        bufInfo(){
            let t=this,rel=this.relpath()
            let book={
                path:t.relpath(),//相对路径
                index:null,//当前阅读到的章节
            }
            // console.log('book-view:bufInfo:向服务器请求章节列表 \trelpath:',rel)

            //请求当前阅读的章节数
            let act='getPartNo'
            return ajax(t.$store.state.apis.bookControl,{act,path:rel}).then(function(resp){
                let obj=JSON.parse(resp)//{partNo:xxx}
                book.index=obj.partNo
                t.$store.commit('updBook',book)
                console.log('book-view:bufInfo:阅读记录缓存完毕:',book);
            })
        },
        //缓存章节列表
        bufChapList(){
            //如果已经缓存了就直接返回
            let b_catch=this.$store.getters.getbook(this.relpath())
            if(b_catch!=undefined && b_catch.chapters != undefined)return new Promise((resolve)=>resolve())

            //请求章节列表
            let act='getPartList'
            let t=this,rel=this.relpath()
            let book={
                path:t.relpath(),//相对路径
                chapters:[],//章节列表
                chapterNum:null,//章节数
            }
            return ajax(t.$store.state.apis.bookControl,{act,path:rel}).then(function(resp){
                let arr=JSON.parse(resp)
                //arr中的某个元素示例{ "index": 625, "lineIndex": 36455, "title": "第626章 第六百一十五章：腾飞之始（十一）乌合之众" }
                book.chapters=arr
                book.chapterNum=arr.length
                t.$store.commit('updBook',book)

                //创建自定义事件并触发之
                let chapListBufed=new CustomEvent('章节列表缓存完毕',{
                    book
                })
                window.dispatchEvent(chapListBufed)
                console.log('book-view:bufChapList:章节列表缓存完毕:',book);
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
            //章节列表未缓存则：请求章节并写入临时缓存,待章节列表加载完毕再写入缓存
            if(undefined == book.chapters){
                return ajax(t.$store.state.apis.chapterUpd,{partNo:index,path:rel}).then(function(resp){
                    let obj=JSON.parse(resp)
                    chap.context=obj.context;
                    chap.title=obj.title

                    //写入临时缓存
                    t.chaptersBuf.push(chap)

                    //章节列表加载完毕后写缓存
                    window.addEventListener('章节列表缓存完毕',()=>{
                        t.$store.commit('updChapter',chap)
                        console.log('book-view:bufChapter:将临时章节写入缓存:',chap);
                    })
                    console.log('book-view:bufChapter:已临时缓存章节:',chap);
                })
            }
            //章节列表已缓存，检查该章节是否已缓存
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
        //从缓存中载入当前章节，缓存不存在则先缓存。缓存顺序：书籍阅读记录->当前阅读章节->目录和后续章节
        loadToLocal(){
            let t=this,rel=this.relpath()
            let book=t.$store.getters.getbook(rel)
            console.log('book-view:loadToLocal:从缓存中查找:\t路径:',rel,'\t查找结果',book);

            if(undefined==book||   (undefined!=book && undefined==book.index)  ){
                //如果书没缓存/书缓存了但阅读记录未缓存则首先缓存阅读记录
                t.bufInfo().then(()=>t.loadToLocal())
            }else{
                let index=book.index
                //章节目录未缓存
                if(undefined == book.chapters){
                    this.bufChapter(book,index).then(()=>{
                        t.chaptersBuf.forEach((chap)=>{
                            if(chap.index==index){
                                t.index=chap.index
                                t.title=chap.title
                                t.context=chap.context
                            }
                        })

                        //缓存目录//再缓存defaultBufSize章
                        t.bufChapList().then(()=>t.bufChapters(book,index,this.defaultBufSize))
                    })
                }else{//章节目录已缓存

                    if(undefined== book.chapters[index].context){
                        //当前阅读的章节未缓存，则先缓存当前章节
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
                
            }
        },

        //==================================以上函数用于数据请求========================================

        //==================================以下函数用于阅读控制========================================
        //此函数用于提示用户消息
        notifyUser(msg){
            alert(msg)
        },
        //处理切换章节事件，会设置当前阅读章节，并载入
        handleSwitchChap(index){
            console.log('book-view:handle-SwitchPage:处理章节切换：',index);
            let result=this.setReadIndex(index)
            if(result!=-1) this.loadToLocal()
        },
        //设置当前阅读的章节（含index合法性校验,不合法返回-1），会同时更新本地、缓存、服务器端的阅读记录
        setReadIndex(index){
            let t=this,rel=this.relpath()

            //首先校验章节合法性
            if(index<0){
                this.notifyUser('没有前一章啦~');return -1
            }else if(index>=this.$store.getters.getbook.chapterNum){
                this.notifyUser('没有下一章啦~');return -1
            }
            let book={
                path:rel,
                index
            }
            //更新缓存
            t.$store.commit('setReadIndex',book)
            //更新本地
            t.index=index
            //更新服务器
            //首先判定：是否存在上次更新未完成的情况
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
            // this.bufInfo()
            this.bufChapList()
        }
    },
    computed:{
        //将context切割为数组，每个元素为一个段落
        ctxArr(){
            if(this.context==null)return
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
        // t.test()
    }
}
</script>

<style lang="scss" scoped>
#readView{
    position:absolute;
}
</style>