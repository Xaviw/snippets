// 也叫观察者模式
let Event = (function () {
  let list = {};

  let listen = function (key, fn) {
    if (!list[key]) list[key] = [];
    list[key].push(fn);
  };

  let trigger = function () {
    let key = Array.prototype.shift.call(arguments),
      fns = list[key];
    for (let fn of fns) {
      fn.apply(this, arguments);
    }
  };

  let remove = function (key, fn) {
    let fns = list[key];
    if (!fns) return false;
    if (!fn) {
      fns && (fns.length = 0);
    } else {
      for (let i = 0; i <= fns.length; i++) {
        let _fn = fns[i];
        if (_fn === fn) {
          fns.splice(i, 1);
        }
      }
    }
  };

  return {
    listen,
    trigger,
    remove,
  };
})();

Event.listen("test", (a) => {
  console.log(a);
});
Event.trigger("test", "aaa");
