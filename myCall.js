Function.prototype.myCall = function (context) {
  // 处理传入null的情况
  context = context || window;
  // this为调用myCall的函数
  let fn = Symbol();
  context[fn] = this;
  // 得到参数
  context[fn](...Array.from(arguments).slice(1));
  console.log(context);
  // 删除添加的fn
  delete context[fn];
};
var value = 2;
var obj = { value: 1 };
function test(a, b) {
  console.log(a, b, this.value);
}
test.myCall(obj, "a", "b");
