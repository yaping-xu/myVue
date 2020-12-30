class Compiler{
  constructor(vm) {
    this.el = vm.$el;
    this.vm = vm
    this.compile(this.el)
  }
  // 编译模板，处理文本节点和元素节点
  compile(el){
    const childrenNodes = el.childNodes
    Array.from(childrenNodes).forEach(node => {
      if(this.isTextNode(node)){
        this.compileText(node)
      }else if(this.isElementNode(node)){
        this.compileElement(node)
      }

      // 判断是否有子节点，如果有子节点递归
      if(node.childNodes && node.childNodes.length > 0){
        this.compile(node)
      }
    })
  }
  // 编译元素节点，处理指令
  compileElement(node){
    // 遍历节点的属性
    Array.from(node.attributes).forEach(attr =>{
      let attrName = attr.name;
      if(this.isDirective(attrName)) {
        // 把 v-text 转成 text
        attrName = attrName.substr(2)
        let key = attr.value
        this.update(node,key,attrName)
      }
    })
  }

  update (node,key,attrName) {
    let updateFn = this[attrName + 'Update']
    updateFn && updateFn.call(this, node, this.vm[key], key)
  }

  textUpdate(node,value,key) {
    node.textContent = value

    new Watcher (this.vm,key,(newValue)=>{
      node.textContent = newValue
    })

  }
  modelUpdate(node,value,key) {
    node.value = value

    // 双向绑定
    node.addEventListener('input',()=>{
      this.vm[key] = node.value
    })

    new Watcher (this.vm,key,(newValue)=>{
      node.value = newValue
    })

  }

  // 编译文本节点，处理差值表达式
  compileText(node){
    const reg = /\{\{(.+?)\}\}/
    const value = node.textContent
    if(reg.test(value)){
      let key = RegExp.$1.trim()
      node.textContent = value.replace(reg, this.vm[key])

      // 创建Watcher对象，数据改变更新视图
      new Watcher (this.vm,key,(newValue)=>{
        node.textContent = newValue
      })

    }
  }
  // 判断元素属性是否为指令
  isDirective(attrName){
    return attrName.startsWith('v-')
  }
  // 判断节点是否为文本节点
  isTextNode(node){
    return node.nodeType === 3;
  }
  // 判断节点是否为元素节点
  isElementNode(node){
    return node.nodeType === 1;
  }
}