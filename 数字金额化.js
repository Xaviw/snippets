const sum = 1234567;
let res1 = String(sum)
  .split("")
  .reverse()
  .reduce((prev, next, index) =>
    index % 3 === 0 ? next + "," + prev : next + prev
  );
console.log(res1);
