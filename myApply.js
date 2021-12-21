Function.prototype.myApply = function (context, arr) {
  context = context || window;
  let fn = Symbol();
  context[fn] = this;
  if (arr?.length) {
    context[fn](...arr);
  } else {
    context[fn]();
  }
  delete context[fn];
};

// var value = 2;
// var obj = { value: 1 };
// function test(a, b) {
//   console.log(a, b, this.value);
// }
// test.myApply(obj, ["a", "b"]);
