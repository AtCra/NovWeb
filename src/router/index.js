import Vue from 'vue'
import VueRouter from 'vue-router'
import Test from '../views/Test.vue'

Vue.use(VueRouter)

Vue.prototype.relpath=function(){
  if(undefined!=this.$route.params.relpath){
      // console.log('dir-view:relpath='+'/'+this.$route.params.relpath)
      return '\\'+this.$route.params.relpath;
  }
  else{
      // console.log('dir-view:relpath=/')
      return '\\';
  }
}
const routes = [
  {
    path: '/test',
    name: 'Test',
    component: Test
  },
  {
    path: '/test/read',
    name: 'TestRead',
    component: ()=>import('../components/ReadSection.vue')
  },
  {
    path:'/dir/:relpath?',
    name:'Dir',
    component:()=> import('../views/DirView.vue')
  },
  {
    path:'/book/:relpath',
    name:'Book',
    component:()=>import('../views/BookView.vue')
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
