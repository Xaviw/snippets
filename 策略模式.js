let method = {
  strategyA: (a, b) => a + b,
  strategyB: (a, b) => a * b,
  strategyC: (a, b) => a ** b,

  execute: function (strategy, ...param) {
    return this[strategy](...param);
  },
};

console.log(method.execute("strategyA", 2, 3));
console.log(method.execute("strategyB", 2, 3));
console.log(method.execute("strategyC", 2, 3));
