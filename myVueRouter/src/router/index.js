import Vue from 'vue'
import VueRouter from '../vuerouter' // 引入VueRouter 
import Home from '../views/Home.vue'

// 1. 注册路由插件
// Vue.use 用来注册组件，传入函数时，直接调用函数，传入对象的时候，会调用对象的install方法
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
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
// 2. 创建router对象
const router = new VueRouter({
  routes // 传入定义好的路由规则数组
})

export default router
