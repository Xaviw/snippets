/* 
  调用myBind：  this为函数本身，记录下函数本身的prototype
  第一次调用时：  this为window或其他
  new调用时：    this为与函数同prototype的新对象

  使用新对象fNOP是避免修改fBound的prototype时影响到原函数的prototype
*/
Function.prototype.myBind = function (context, ...args) {
  if (typeof this !== "function") {
    throw new Error();
  }
  let self = this;
  let fNOP = function () {};
  let fBound = function () {
    console.log(this);
    self.call(
      this instanceof fNOP ? this : context,
      ...args,
      ...Array.from(arguments)
    );
  };
  fNOP.prototype = this.prototype;
  fBound.prototype = new fNOP();
  return fBound;
};

let value = 2;
let foo = {
  value: 1,
};
function bar(name, age) {
  console.log({
    value: this.value,
    name: name,
    age: age,
  });
}
let bindFoo1 = bar.myBind(foo, "Jack", 10);
bindFoo1();

let bindFoo2 = bar.myBind(foo, "jerry");
bindFoo2(20);

let bindFoo3 = new bindFoo2(30);
