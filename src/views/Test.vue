<template>
    <div>
        <h1>APIs</h1>
        <p>{{$store.state.apis}}</p>
        
        <h1>Settings</h1>
        <p>{{$store.state.settings}}</p>

        <h1>ConnectionTest</h1>
        <p v-for="item in rootDir" :key="item.name">{{item}}
            {{item.time}}
        </p>

        <h1>ChapterTest</h1>
        <div>{{book.chapters[2]}}</div>

        <h1>BookConnectionTest</h1>
        <div v-for="chapter in book.chapters" :key="chapter.index">{{chapter}}</div>


    </div>
</template>
<script>
import ajax from '../net/conn.js'
// import * as utils from '../js/utils.js'
export default {
    data(){
        return {
            rootDir:[],
            book:{chapters:[]}
        }
    },
    computed:{
        
    },
    methods:{
        //载入根目录下的文件夹和书
        getRootDir(){
            let t=this;
            ajax(this.$store.state.apis.listDirs,{path:'/'}).then(function(resp){
                let arr=JSON.parse(resp)
                console.log(arr);

                // arr.forEach(item => {
                //     item.time=utils.formatTime(item.timeStamp)
                // });

                t.rootDir.push(...arr)
            }),
            ajax(this.$store.state.apis.listBooks,{path:'/'}).then(function(resp){
                let arr=JSON.parse(resp)
                console.log(arr);
                t.rootDir.push(...arr)
            })
        },
        //载入一本书的章节
        loadChapterList(){
            let t=this
             return ajax(this.$store.state.apis.bookControl,{act:'getPartList',path:'/神的游戏之我是星球的远大意志.txt'}).then(function(resp){
                let arr=JSON.parse(resp)
                console.log(arr);
                t.book.chapters.push(...arr)
            })
        },
        loadChap(){
            let t=this
            let index=2
            return ajax(t.$store.state.apis.chapterUpd,{partNo:index,path:'/神的游戏之我是星球的远大意志.txt'}).then(function(resp){
                let obj=JSON.parse(resp)
                console.log('CHAP:resp',obj);
                t.$set(t.book.chapters[index],'context',obj.context)
                // t.book.chapters[index].resp=resp
            })
        }
    },
    mounted(){
        let t=this
        this.getRootDir();
        this.loadChapterList().then(()=>{
            t.loadChap()
        })
    }
}
</script>