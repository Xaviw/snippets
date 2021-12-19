console.log("worker onload");
this.addEventListener("message", (res) => {
  console.log("Worker 收到数据：", res);
});
this.postMessage("开门！这里是 index.js");
// onmessage = (res) => {
//   console.log("Worker 收到数据：", res);
// };
// postMessage("开门！这里是 index.js");
setTimeout(() => {
  console.log("worker timeout");
}, 50);
