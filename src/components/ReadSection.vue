<template>
<div class="read-container">
    <div class="article-container" ref="container">
        <!-- 章节标题 -->
        <h3 class="article-title">{{title}}</h3>
        <!-- 章节内容 -->
        <article ref="article"><!-- +'transform:'+transform+';' -->
            <p v-for="(p,index) in ctxArr" :key="index">
                {{p}}
            </p>
        </article>
    </div>
    <!-- 底栏展示阅读进度，注意pageNum的计算需等待dom尺寸渲染完毕 -->
    <div class="read-process">{{pageIndex+1}}/{{pageNum}}</div>
</div>
</template>
<script>

export default {
    data(){return {
        pageIndex:0,//当前阅读的页码
        pageNum:1,//总页数
        margin:16,//边距

    }},
    props:{
        chapIndex:{//章节编号
            type:Number,
            default(){return 0}
        },
        ctxArr:{//章节段落数组
            type:Array,
            default(){return ['等待载入']}
        },
        title:{//章节标题
            type:String,
            default(){return '载入中'}
        }
    },
    methods:{
        //从store中载入阅读样式
        loadReadSetting(){
            let article=this.$refs.article
            article.style.fontSize=this.$store.state.settings.read.font_size
            article.style.lineHeight=this.$store.state.settings.read.line_height
            article.style.fontFamily=this.$store.state.settings.read.font
        },
        //重新计数页码
        reCalcPageNum(){
            let pageWidth=document.body.offsetWidth-this.margin
            let containerWidth=this.$refs.container.scrollWidth
            this.pageNum=Math.round(containerWidth/pageWidth)//四舍五入
            console.log(`read-section:reCalc-PageNum: pageWidth:${pageWidth},containerWidth:${containerWidth},pageNum:${this.pageNum}`);
        },
        //跳转到page页。成功后会修改data中的pageIndex
        //会检查是否需要载入前/后一章，若需要会发送事件给父组件
        goPage(page){
            //单次翻页完毕前禁止再次翻页
            if(undefined == this.pageGoFinish)this.pageGoFinish=false
            else if(!this.pageGoFinish)return

            //检查传入的page是否合理
            if(page<-1||page>this.pageNum){
                console.log(new Error(`read-section:goPage:页码不存在！欲跳转页码编号:${page},章节总页数:${this.pageNum}`));
                 return
            }

            //检查是否需要载入上/下一章
            if(page==this.pageNum||page==-1){
                if(page==-1){//请求载入上一章
                    this.$emit('previous_chap',this.chapIndex-1);    
                }else if(page==this.pageNum){//请求载入下一章
                    this.$emit('next_chap',this.chapIndex+1);
                }
                return
            }
            
            

            //执行翻页效果
            let width = document.body.offsetWidth
            let translateX=page*(width-this.margin)//减去边距，单位px    
            let article=this.$refs.article
            article.style.transform = `translateX(-${translateX}px)`//注意向左偏移为负

            //翻页完毕
            this.pageIndex=page
            let t=this
            setTimeout(()=>{t.pageGoFinish=true},400)//400毫秒后翻页动画结束
        },
        addListener(){
            // let container=this.$refs.container
            document.addEventListener('keydown',this.handleKeyDown)
        },
        handleKeyDown(e){
            // console.log(`read-section:event:`,e);
            if(e.key=='ArrowLeft'){this.goPage(this.pageIndex-1)}
            else if(e.key=='ArrowRight'){this.goPage(this.pageIndex+1)}
        },
        handleClick(e){
            console.log(`read-section:event:`,e);
        },
        handleTouch(e){
            console.log(`read-section:event:`,e);
        },

    },
    watch:{
        //监听章节编号的改变，章节编号改变代表新章节载入了
        chapIndex:{
            handler(newIndex,oldIndex){
                let t=this
                t.$nextTick(()=>{
                    //内容更新后重新计算页数
                    t.reCalcPageNum()
                    
                    //重置章节阅读进度，跳页
                    if(oldIndex==null || newIndex>=oldIndex){//oldIndex==null表示刚打开这一章
                        t.pageIndex=0
                    }else t.pageIndex=t.pageNum-1
                    t.goPage(t.pageIndex)
                })
            }
        }
    },
    mounted(){
        this.loadReadSetting()
        this.addListener()
        this.reCalcPageNum()
    }
}
</script>
<style lang="scss" scoped>
$m:16px;//阅读区域边距，修改时需同时修改data中的边距 

.read-container{
    text-align: justify;
    background-color: #c2b193;
}
.read-process{
    $m-rp:2em;
    position: relative;
    width: max-content;
    padding : $m-rp 0 $m-rp 2*$m-rp;
    font-size: 0.5em;
}

.article-container {
// 以下属性用于实现滑动翻页
    height: 95vh;
    overflow: hidden;
    margin: 0 $m;
}
article {
//滑动翻页的本质是将article元素横向展开（width很大），翻页的本质就是将article元素进行横向位移
// 以下属性用于实现滑动翻页
    columns: calc(100vw - #{2*$m}) 1;
    column-gap:$m;
    height: 90%;//定高即可
    transition: .4s;//翻页动画持续时间
}

p {
    text-indent:2em;//段首缩进2个字符
}
</style>