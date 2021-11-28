// 缓存代理->分页列表

// 获取列表方法
function getList(pageIndex, pageSize) {
  const list = [];
  for (let i = (pageIndex - 1) * pageSize; i < pageIndex * pageSize; i++) {
    list.push(i);
  }
  return list;
}

// 代理
function Proxy(fn) {
  const cache = {};
  return function () {
    let key = Array.prototype.join.call(arguments, ",");
    if (key in cache) {
      return cache[key];
    }
    return (cache[key] = fn.apply(this, arguments));
  };
}

let getListByProxy = Proxy(getList);
a = getListByProxy(1, 10);
b = getListByProxy(1, 10);
c = getListByProxy(1, 10);
// console.log(a, b, c);
// console.log(a === b, a === c);
