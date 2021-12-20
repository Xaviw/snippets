/* 
  创建空对象
  绑定空对象prototype至构造函数prototype
  执行构造函数并绑定this为新对象
  判断函数返回值，返回返回值对象或新对象
*/
function myNew(context, ...args) {
  let obj = new Object();
  obj.__proto__ = obj.prototype;
  let res = context.apply(obj, args);
  return typeof res === "object" ? res : obj;
}

function Otaku(name, age) {
  this.strength = 60;
  this.age = age;

  return "handsome boy";
}

var person = myNew(Otaku, "Kevin", "18");

console.log(person.name); // undefined
console.log(person.habit); // undefined
console.log(person.strength); // 60
console.log(person.age); // 18
