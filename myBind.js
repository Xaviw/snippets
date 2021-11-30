Function.prototype.myBind = function (context, ...args) {
  context = context || window;
  context.fn = this;
  this = context;
  return context.fn();
};
