
let _Vue = null
export default class VueRouter {
  constructor(options) {
    this.options = options // 存储传入的参数options
    this.routeMap = {} // 将存储键值对对象，键为：传入routes的path,值：传入routes的component
    // 一个响应式的对象，里面存储当前的路由地址
    this.data =  _Vue.observable({
      current: '/' // 作用是存储当前的路由地址，默认'/'
    })
  }

  static install(Vue){
    // Vue.use()调用VueRouter时会传递两个参数，一个是Vue的构造函数，第二个是可选的选项对象
    // install 分析
    // 1. 判断当前插件是否已经被安装， 如果已经安装就不需要重复安装
    if(VueRouter.install.installed) {
      return
    }
    VueRouter.install.installed = true
    // 2. 把Vue构造函数记录到全局变量中，因为在实例方法中还需要调用Vue构造函数
    _Vue = Vue
    // 3. 把创建Vue实例时传入的router对象， 注入到所有的Vue实例上(this.$router 就是在这个时候注册到Vue实例上的)，注意：我们所有的组件也都是Vue的实例
    /**想让所有的实例共享一个成员，可以想到要把这个成员注入到原型上 */
    Vue.mixin({
      beforeCreate(){
        // 此时的this指向构造实例
        // 原型挂载只需要执行一次，所以需要判断如果是组件就不执行了，如果是Vue实例的话才执行
        // 只有Vue 的$options 才有router 属性
        if(this.$options.router){
          _Vue.prototype.$router = this.$options.router;
          this.$options.router.init()
        }
      }
    })
  }

  createRouteMap(){
    this.options.routes.forEach(route => {
      this.routeMap[route.path] = route.component
    })
  }

  initComponents(Vue){
    Vue.component('router-link',{
      props: {
        to: String,
      },
      render(h){
        return h('a', {
          attrs: {
            herf: this.to
          },
          on: {
            click: this.clickHandler
          }
        },[this.$slots.default]);
      },
      methods: {
        clickHandler(e){
          // 改变浏览器地址栏，但是不会向浏览器发请求
          history.pushState({}, '', this.to)
          // 把当前路径记录到current里面
          this.$router.data.current = this.to
          e.preventDefault();
        }
      }
      // template: '<a :herf="to"><slot></slot></a>'
    })
    const self = this
    Vue.component('router-view',{
      render(h){
        const component = self.routeMap[self.data.current]
        return h(component)
      }
    })

  }
  initEvent(){
    window.addEventListener('popstate',()=>{
      this.data.current = window.location.pathname
    })
  }

  init(){
    this.createRouteMap()
    this.initComponents(_Vue)
    this.initEvent()
    
  }
}
