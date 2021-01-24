<template>
<div class="read-container" ref="container">
    <!-- 垂直滚动 -->
    <div v-if="verticle" class="verticle-article-container">
            <p v-for="(p,index) in ctxArr" :key="index">
                {{p}}
            </p>
        <!-- TODO：垂直滚动时的章节加载 -->
    </div>

    <!-- 水平滚动 -->
    <div v-else class="article-container" ref="acontainer" @click="handleClick">
        <!-- 章节标题 -->
        <h3 class="article-title">{{title}}</h3>
        <!-- 章节内容 -->
        <article ref="article">
            <p v-for="(p,index) in ctxArr" :key="index">
                {{p}}
            </p>
        </article>
        <!-- 底栏展示阅读进度，注意pageNum的计算需等待dom尺寸渲染完毕 -->
        <div class="read-process">{{pageIndex+1}}/{{pageNum}}</div>
    </div>
</div>
</template>
<script>

export default {
    data(){return {
        pageIndex:0,//当前阅读的页码
        pageNum:1,//总页数
        verticle:true,//是否为纵向阅读
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
            let c=this.$refs.container
            c.style.fontSize=this.$store.state.settings.read.font_size
            c.style.lineHeight=this.$store.state.settings.read.line_height
            c.style.fontFamily=this.$store.state.settings.read.font
        },
        //请求载入上一章
        reqPreviousChap(){
            this.$emit('previous_chap',this.chapIndex-1); 
        },
        //请求载入下一章
        reqNextChap(){
            this.$emit('next_chap',this.chapIndex+1);
        },

        
        //=================================以下函数用于横向阅读================================

        //重新计数页码，刷新阅读位置
        reCalcPageNum(){
            if(this.verticle)return
            let pageWidth=document.body.offsetWidth-this.margin
            let containerWidth=this.$refs.acontainer.scrollWidth
            this.pageNum=Math.round(containerWidth/pageWidth)//四舍五入

            this.goPage(this.pageIndex)
            console.log(`read-section:reCalc-PageNum: pageWidth:${pageWidth},containerWidth:${containerWidth},pageNum:${this.pageNum}`);
        },

        //跳转到page页（仅横向滚动模式有效）。成功后会修改data中的pageIndex
        //会检查是否需要载入前/后一章，若需要会发送事件给父组件
        goPage(page){
            //检查是否为横向阅读模式
            if(this.verticle)return

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
                    this.reqPreviousChap()
                }else if(page==this.pageNum){//请求载入下一章
                    this.reqNextChap()
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
        //用于横向翻页，使当前阅读页面沿X轴方向偏移，向左为负
        goTranslateX(translateX){
            let article=this.$refs.article
            article.style.transform = `translateX(${translateX}px)`
        },

        //============================================以上函数用于横向阅读=============================

        addListener(){
            let t=this
            this.$nextTick(()=>{
                //监听浏览器窗口大小，大小改变时重新计算页码
                
                window.onresize=()=>{
                    t.reCalcPageNum()
                }
                //监听触摸事件
                t.$refs.container.addEventListener('touchstart',t.handleTouch)
                //监听方向键
                document.addEventListener('keydown',t.handleKeyDown)
                // this.$refs.acontainer.addEventListener('onclick',this.handleClick)

                console.log('read-section:TOFIX:初始化事件监听器...');
            })
        },
        handleTouch(e){
            // console.log(`read-section:event:`,e);
            let touch=e.targetTouches[0]//当前dom上的头号手指
            let w=document.body.offsetWidth
            if(touch.clientX<w/2){
                this.goPage(this.pageIndex-1)
            }else this.goPage(this.pageIndex+1)
        },
        handleKeyDown(e){
            //纵向阅读
            if(this.verticle){
                if(e.key=='ArrowLeft'){this.reqPreviousChap()}
                if(e.key=='ArrowRight'){this.reqNextChap()}
            }else{//横向阅读
                if(e.key=='ArrowLeft'){this.goPage(this.pageIndex-1)}
                else if(e.key=='ArrowRight'){this.goPage(this.pageIndex+1)}
            }
        },
        handleClick(e){
            //仅处理横向阅读
            if(!this.verticle){
                console.log(`read-section:event:`,e);
                let w=document.body.offsetWidth
                if(e.clientX<w/2){
                    this.goPage(this.pageIndex-1)
                }else this.goPage(this.pageIndex+1)
            }
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
    padding : 0 0 0 $m-rp;
    font-size: 0.5em;
}

.article-container {
// 以下属性用于实现滑动翻页
    height: 98vh;
    overflow: hidden;
    margin: 0 $m;
}
article {
//滑动翻页的本质是将article元素横向展开（width很大），翻页的本质就是将article元素进行横向位移
// 以下属性用于实现滑动翻页
    columns: calc(100vw - #{2*$m}) 1;
    column-gap:$m;
    height: 85%;//定高即可
    transition: .4s;//翻页动画持续时间
}

p {
    text-indent:2em;//段首缩进2个字符
}
</style>