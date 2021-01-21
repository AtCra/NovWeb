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
    <!-- 展示页码，注意此处不能直接使用计算属性pageNum，原因为pageNum的计算需等待dom尺寸渲染完毕 -->
    <div class="read-process">{{pageProcessStr}}</div>
</div>
</template>
<script>

export default {
    data(){return {
        pageIndex:0,//当前阅读的页码
        pageProcessStr:'',//在页面下方展示的页码字符串，如'4/9'
        margin:16,//边距

        context:"第3章 第三章：星神降临<br><br> 在现在，苏拉西附近所有的祭司，都汇聚在这个祭坛的下方。<br> 祭坛的模样，冷弈看着是类似美洲金字塔。百余年前，佛科多的高祖，就是在这个祭坛，参透了星空的秘密，并带领他的多莱曼部落走向崛起。<br> 如今即将在这里聚会的22个祭司，基本都是多莱曼或多莱曼盟友的后裔。<br> 祭坛的方向选的很好，现在佛科多站在祭坛的脚下朝上看，可以看到祭坛的顶端触摸到了旭日，整个祭坛此时都沐浴在旭日那璀璨的光芒之下，每当佛科多看到这一幅壮美的景象时，总是会心生无尽的豪情。<br> 感慨完毕以后，佛科多的目光看向自己旁边的一位祭司，他的眼神中带上一丝阴霾。<br> 在场的22位祭司，有7位围绕着佛科多，而有4位围绕着那个人，多莱曼城邦的祭司，自己这一次会议的最大对手，多莱曼三世·苏·多莱曼。<br> 现年64岁的多莱曼三世，发色虽已全部发白，但是每一根头发依旧如同生命力旺盛的杂草一般，朝着天空争锋相对。<br> 多莱曼三世一看就知道是那种不甘平凡的人，纵使已经进入生命的晚年，他那身躯依旧如同少年时的那么健壮。<br> 或许可能只是外表比较吓人，内地里实际上是在强撑着，但也即使是这样，也很吓人了。<br> 多莱曼三世，这个自己的老对头，他的过去自然是在佛科多的脑海中，记得牢牢地。<br> 在自己的曾祖死后，多莱曼部落一分为三。<br> 其实在那时候，多莱曼最正统的继承者，也是最强大的分家者，并不是自己的米达尔，而是继承了多莱曼名号的多莱曼二世所统治的多莱曼城邦。<br> 自己的祖父米达尔，只是曾祖父的次子，而多莱曼二世，才是曾祖的长子，获得了分家后的最多资源。<br> 而多莱曼二世也毫不掩饰自己的野心，他原本不叫多莱曼的，可是在分家之后，却让自己改名多莱曼，也就是多莱曼二世，想做多莱曼老大的欲望不加掩饰的涌上了外表。<br> 可惜在之后，一群恐惧多莱曼后裔实力快速增长的败犬们，当年被高祖多莱曼一世打败的死敌，对多莱曼的盟友们发动了猛烈进攻。<br> 而多莱曼城邦，身为诸城邦的最强者，继承了最大资源和多莱曼名号的继承人，自然也要钉在前线。<br> 即使现在米达尔和多莱曼关系恶劣，但是佛科多不得不承认，在这长达十余年的血腥搏斗中，多莱曼城邦始终站在最前线，起到了带头大哥的作用。<br> 但也正是因此，在战争结束之后，因为过于惨烈的损失，导致多莱曼一时半会没法恢复最初的元气，而之后米达尔的崛起，更是让多莱曼彻底失去了恢复最强城邦地位的可能。<br> 因此，佛科多经常听到多莱曼城邦那边的祭司念叨，什么都是因为米达尔在战争中游而不击，才会趁着多莱曼抵御外敌的时候崛起的。<br> 什么跟什么，有没有搞错啊！<br> 佛科多每次听到这种说法，都想要咆哮，想让那群多莱曼的那群渣渣，先搞清楚时间再来喷好不好。<br> 米达尔的崛起，可是在自己的父亲手上完成的，再在自己的手上推向更高峰，而这个时候，都离那场战争都过去多久了！<br> 别的就别说，有种你们这群渣渣别在自己的城邦，建设我父亲发明的祭司塔！我父亲还不是靠着祭司塔的发明，以此作为基点，完成米达尔的最初崛起。<br> 可惜，那群多莱曼的渣渣，每次一听到这个，都是我不听我不听，肯定是因为你们游而不击！<br> 也因此，这次会议的地点选择，佛科多只能和对方先妥协，将会议地点放在这个，对所有人都有特殊意义的地方，星启木来举行。<br> 这是第一次由自己主持的会议，自己不能过于飞扬跋扈。<br> 想到这里，佛科多皱了皱眉头。<br> “时辰已到！”这时候，旁边一个带着鸡冠一般头饰的人员，看了看插在地上棍子的阴影后，喊出了话语，然后对着天空，用魔力发出一道蓝色光线，以此提醒所有人。<br> 听到这个话语，各怀心思的祭司们起身，开始往祭坛走去。<br> 多莱曼三世也随着众人起身，起身前，他对着自己的儿子低声耳语一番，然后就几步走到佛科多的旁边，和他并驾齐驱。<br> 对于多莱曼的行为，佛科多连头都没有转，好像什么也没有发生。<br> 等着瞧吧，你也就趁着现在嚣张了，正戏还在后头。<br> 这个时候，能在祭坛上的，只有22位祭司，他们面对着祭坛中央的一根古老木头，一个接着一个跪下了。<br> 这个古老的木头，被称为星启木，到现在已经有百年的历史了。木头本身不是什么有魔力的木头，现在还没有被腐朽风化，全赖后人对他施加魔法来保存。<br> 当年，自己的高祖就是在这个地方，用这根木头雕刻下了星空的轨迹，对着这根木头冥思苦想，最后在这个时刻，参悟了星空的奥秘。<br> 而在自己父亲的提议下，从十多年前开始，诸位祭司固定的，每隔4年就会来这里参拜。<br> 不过，这个参拜仅仅是仪式而已，对于佛科多来说，星神？或许是存在的，但是自己这群凡人的死活，与星神有什么关系呢？<br> 之所以佛科多大力要推崇星神，不过是让城邦的那群公民，愉快而没有借口的缴纳一笔税收而已，恩，代神收税，给祭司用。<br> 就在佛科多一边毫无诚意的参拜根本不信的星神，心里一边重温接下来对付多莱曼的时候，异变，发生了。<br> 星启木，居然自己升空了！<br> 看到这个景象，佛科多的大脑瞬间宕机，这种情况剧本可没有啊！<br> “是谁敢用漂浮术操控星启木！”看到星启木自己飘了起来，一些祭司顿时暴怒，毕竟敢对星启木动手脚，这可是在对在场的所有人打脸啊！<br> 于是瞬间，祭坛上多股精神力迸发出来，一边想要把星启木按回原地，另一边则到处扫描，想要找到操控星启木的狂徒。<br> 不过，随着星启木冒出了蓝光，被风化的模糊了的群星轨迹一个接着一个亮了起来，星启木恢复了百年前的模样。<br> 看到这里，一些祭司已经隐约猜到了什么。<br> 而在祭坛下面等待的随从们，看到祭坛上的异变，顿时有些骚动。<br> “别慌！”佛科多毕竟是当了十多年的祭司了，此时已经平静了下来，他用扩音术让自己的声音传遍祭坛的周围，“星神在注视着你们。”<br> 现在首先要做的，是要稳定人群，说不定，我还可以借着这个机会，达到自己的目的···当然也可能死掉。<br> 在星启木升高了三米之后，星启木的顶端，就射出一道蓝色的光线，光线伴随着biu的一声，直接射穿了云层，朝着更上面前进。<br> 然后，夜幕降临了，群星在白日浮现，而一双带有无尽星空的巨大双眼，赫然出现在了所有人的面前。<br> 看到这里，即使是祭坛上的祭司，都不得不跟着随从们跪下了。<br> 毕竟，虽然自己的实力已经站在人群中的最顶尖的那一批，但那终究只是人的最顶峰，而面对神灵的浩瀚神威，仅仅是看了一眼，所有的人都在不自觉的发抖。<br> 这个时候，不管是高贵的祭司，还是跑腿的随从，都只敢跪下向神灵祈祷，哪还敢去做其他的呢？<br> 佛科多也跪下了，内心带着苦涩，他知道现在自己的命运，就是全靠神灵的操作了，而自己费了那么大功夫，持续了三年的安排谋划，到现在恐怕都要打水漂了。<br> 这双眼睛的主人，自然就是神降的冷弈，借用这他们的传统信仰，降临此处。<br> 顺便一说，即使降临到这个世界，鼠标诡异的依旧能用，只不过估计那群人看不到而已。借用着鼠标，冷弈看到了22位祭司的两位大佬，佛科多和多莱曼三世的过往。<br> 姓名：佛科多·苏·米达尔·多莱曼<br> 修为：有领域的魔法师，斗气附体的战士<br> 头衔：米达尔城邦祭司<br> 信仰：原始星空信仰<br> 民族：原始苏拉西人<br> 岁数：54岁（76岁，括号里的是预计岁数）<br> 家谱：巴拉巴拉（就是在这一章，我前面已经用了几百字说明了，我相信，你们不会想看我再把上文复制黏贴来水字数的）<br> 个人经历：巴拉巴拉<br> 姓名：多莱曼三世·苏·多莱曼出生<br> 修为：老练的战士，稚嫩的魔法师<br> 头衔：多莱曼城邦祭司<br> 信仰：原始星空信仰<br> 民族：原始苏拉西人<br> 岁数：64岁（67岁）<br> 家谱：巴拉巴拉（就是在这一章，我前面已经用了几百字说明了，我相信，你们不会想看我再把上文复制黏贴来水字数的）<br> 个人经历：巴拉巴拉<br> 此时，在冷弈的注视下，整个祭坛周围的人，即使是在祭坛上的22位祭司，也只敢跪下祈祷，所有的祭司都战栗的沉默着，在等着冷弈的下一步行动。<br> 而冷弈此时，正在思考一个问题。现在自己，到底是划水完就走呢，还是在佛科多和多莱曼三世之间，选一个人呢？<br> <br><br><br>"
    }},
    props:{
        chapIndex:{//章节编号
            type:Number,
            default(){return -1}
        },
        ctxArr:{//章节段落数组
            type:Array,
            default(){return []}
        },
        title:{//章节标题
            type:String,
            default(){return '载入中'}
        }
    },
    computed:{
        //返回本章总页数（注意计算需要dom尺寸加载完毕）
        pageNum(){
            let num=0
            let pageWidth=document.body.offsetWidth-this.margin
            let containerWidth=this.$refs.container.scrollWidth
            num=Math.round(containerWidth/pageWidth)//四舍五入
            console.log(`read-section:compted:pageNum: pageWidth:${pageWidth},containerWidth:${containerWidth},pageNum:${num}`);
            return num
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
        //跳转到page页。成功后会修改data中的pageIndex
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
            if(page==-1){//请求载入上一章
                this.$emit('previousChap')       
            }else if(page>this.pageNum){//请求载入下一章
                this.$emit('nextChap')
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
        //监听页码的改变
        pageIndex:{
            immediate:true,
            handler(){
                let t=this
                //更新底栏的阅读进度：当前页/本章总页数。使用nextTick避免在dom加载完成前读取PageNum
                t.$nextTick(()=>{
                    t.pageProcessStr=t.pageIndex+1+'/'+t.pageNum
                })
            }
        },
        //监听章节编号的改变，章节编号改变代表新章节载入了
        chapIndex:{
            handler(newIndex,oldIndex){
                //重置章节阅读进度，跳页
                newIndex>oldIndex?this.pageIndex=0:this.pageIndex=this.pageNum
                this.goPage(this.pageIndex)
            }
        }
    },
    mounted(){
        this.loadReadSetting()
        this.addListener()
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
// 以下属性用于实现滑动翻页
    columns: calc(100vw - #{2*$m}) 1;
    column-gap:$m;
    height: 100%;//定高即可
    transition: .4s;//翻页动画持续时间
}

p {
    text-indent:2em;//段首缩进2个字符
}
</style>