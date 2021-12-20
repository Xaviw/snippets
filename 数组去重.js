let arr = [1, 2, 3, 4, 5, 5, 4, 3, 2, 1];
// 1.Set
let res1 = [...new Set(arr)];
// 2.循环
let res2 = [];
for (const item of arr) {
  if (!res2.includes(item)) {
    res2.push(item);
  }
}
// 3.高阶方法
let res3 = arr.filter((item, index) => arr.lastIndexOf(item) === index);
console.log(res1, res2, res3);

let deepArr = [1, 2, 3, 4, [1, 2, 3, 4, 5, [1, 2, 3, 4, 5, 6]]];
// 1.Set+Flat
const res4 = Array.from(new Set(arr.flat(Infinity)));
// 2.配合递归
