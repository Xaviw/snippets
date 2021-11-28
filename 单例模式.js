let getSingle = (fn) => {
  let instance;
  return function () {
    return instance || (instance = fn.apply(this, arguments));
  };
};

let test = (first, last) => {
  this.first = first;
  this.last = last;
  return first + last;
};

let a = getSingle(test);

console.log(a("夏", "巍"));
console.log(a("zhang", "san"));
console.log(a("li", "si"));
