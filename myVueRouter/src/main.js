import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false
// 3. 创建Vue实例，注册router对象
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
