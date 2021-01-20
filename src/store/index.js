import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    apis:{
      //该接口用于获得子文件夹
      //请求：{path:this.relpath()}
      //返回：返回数组，数组中每个元素为{ "cnum": 10, "name": "autoUpdate", "relpath": "autoUpdate", "timeStamp": 0 }
      listDirs:'/ajax/getChildrenDirs',

      //该接口用于获得txt类型的子文件
      //请求：{path:this.relpath()}
      //返回：返回数组，数组中每个元素为{ "name": "儒道至圣.txt", "relpath": "%E5%84%92%E9%81%93%E8%87%B3%E5%9C%A3.txt", "size": 28669269, "timeStamp": 0 }
      listBooks:'/ajax/getChildrenFiles/txt',

      //该接口用于控制某一本书的阅读进度，获得章节列表
      //请求:{act:"getPartNo",path:this.relpath},其中act可选值：
      //      getPartNo：读取阅读进度
      //      setPartNo：设置阅读进度
      //      getPartsNum：获得章节数
      //      delete：删除阅读记录        返回：字符串：已删除/删除失败
      //      getPartList：获得章节列表   返回：
      bookControl:'/ajax/ReadControl',

      //该接口用于载入章节内容
      //请求:{partNo:no,path:this.relpath}  其中partNo为要载入的章节编号，path为书籍相对路径
      //返回：{context: "...", index: 2, lineIndex: 221, title: "第3章   第三章：星神降临"}
      chapterUpd:'/ajax/PageUpd'
    },
    settings:{
      read:{
        font:'宋体',
        font_size:16,//单位PX
        line_height:1.5,//行高1.5em
        buf_chapters_num:10//缓存多少章
      }
    },
    books:[],
    dirs:[]
    
  },
  getters:{
    //dir返回一个函数，以便传入rel参数进行查询
    getdir:state=>(relpath)=>{
      return state.dirs.find(dir=>dir.path===relpath)
    },
    getbook:state=>(relpath)=>{
      return state.books.find(book=>book.path===relpath)
    }
  },
  mutations: {
    pushDir(state,dir){
      state.dirs.push(dir)
    },
    //如果该书已缓存则更新缓存，未缓存则写入缓存
    updBook(state,book){
      let exist=false
      state.books.forEach(b=>{
        if(b.path==book.path){
          exist=true
          b=book
        }
      })
      if(!exist){
        state.books.push(book)
      }
    },
    //更新缓存中的章节内容
    //负载chap有以下属性：path：书籍路径  index：章节编号 title：章节标题 context：章节内容
    updChapter(state,chap){
      let exist=false
      state.books.forEach(book=>{
        if(chap.path==book.path){
          exist=true
          if(chap.index<0||chap.index>book.chapterNum-1){
            //章节数(index)越界
            throw new Error('章节数越界：传入的index='+chap.index+'\t允许的index范围：0~'+book.chapterNum-1)
          }
          book.chapters[chap.index].context=chap.context
        }
      })
      if(!exist){
        throw new Error('updChapter:未查找到此书籍，无法写入章节内容缓存\t相对路径:'+chap.path)
      }
    },
    //更新缓存中的阅读进度
    //book应具有index和path属性
    setReadIndex(state,book){
      state.books.forEach(b=>{
        if(book.path==b.path){
          b.index=book.index
        }
      })
    }
  },
  
  actions: {

  },
  modules: {
  }
})
