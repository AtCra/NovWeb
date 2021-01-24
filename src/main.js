import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './cube-ui'
import Cube from 'cube-ui'
Vue.use(Cube)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
