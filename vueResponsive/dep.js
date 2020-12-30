class Dep{
  constructor(sub){
    this.subs = []
    this.addSub(sub)
  }
  addSub(sub){
    if(sub && sub.update){
      this.subs.push(sub)
    }
  }
  notify(){
    this.subs.forEach(sub=>{
      sub.update()
    })
  }
}