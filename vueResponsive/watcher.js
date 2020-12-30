class Watcher {
  constructor(vm,key,cb) {
    this.vm = vm;
    this.key = key;
    this.cb = cb;

    // 把Watcher对象记录到Dep类的静态属性target
    Dep.target = this;
    this.oldValue = vm[key];
    Dep.target = null
  }
  update() {
    const newValue = this.vm[this.key];
    if(newValue === this.oldValue) return;
    this.cb(newValue)
  }
}