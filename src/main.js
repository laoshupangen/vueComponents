import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import routes from '@/router/index.js'
// const router = new VueRouter({
//   routes
// })
// Vue.use(VueRouter)
const onPlusReady = function(callback,context=this){
  if(window.plus){
    callback.call(context)
  }else{
    console.log(context)
    document.addEventListener('plusready', callback.bind(context))
  }
}
Vue.config.productionTip = false
Vue.mixin({
  beforeCreate () {
    onPlusReady(() => {
      this.plusReady = true
    }, this)
  },
  methods: {
    onPlusReady: onPlusReady
  }
})

new Vue({
  render: h => h(App),
  
}).$mount('#app')
