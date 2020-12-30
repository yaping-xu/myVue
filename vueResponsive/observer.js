class Observer {
  constructor(data){
    this.walk(data)
  }

  walk(data) {
    if(!data || typeof data !== 'object'){
      return
    }

    Object.keys(data).forEach(key => {
      this.defineReactive(data,key,data[key])
    })
  }
  defineReactive(data,key,value) {
    const that = this
    // 负责收集依赖，并发送通知
    let dep = new Dep()
    // 如果value是对象，把value内部的属性转换成响应式数据
    this.walk(value)
    Object.defineProperty(data,key,{
      enumerable: true,
      configurable: true,
      get() {
        // 收集依赖
        Dep.target && dep.addSub(Dep.target)
        return value
      },
      set(newValue) {
        if(newValue === value) return
        value = newValue
        that.walk(newValue)
        // 发送通知
        dep.notify()
      }
    })
  }
}