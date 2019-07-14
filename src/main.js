import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import routes from '@/router/index.js'
// const router = new VueRouter({
//   routes
// })
// Vue.use(VueRouter)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  
}).$mount('#app')
