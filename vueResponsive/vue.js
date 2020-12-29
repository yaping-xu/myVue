class Vue {
  constructor(options) {
    // 1. 接收初始化参数
    this.$options = options || {};
    this.$data = options.data || {}
    this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el;
    // 2.把data对象转成getter和 setter 注入到Vue实例中
    this._proxyData(this.$data)
    // 3. 负责调用observer监听data中所有属性的变化
    new Observer(this.$data)
    // 4. 负责调用compiler 解析指令/差值表达式
    new Compiler(this)
  }

  _proxyData(data) {
    Object.keys(data).forEach((key) => {
      console.log(data[key])
      // 把data属性注入到实例当中
      Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        get(){
          return data[key];
        },
        set(newValue){
          if(newValue === data[key]){
            return
          }
          data[key] = newValue;
        }
      })
    })
  }

}