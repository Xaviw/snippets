class MyPromise {
  status = "pending";
  value = null;
  reason = null;
  fulfilledCallbacks = [];
  rejectedCallbacks = [];

  constructor(executor) {
    try {
      executor(this.resolve, this.reject);
    } catch (err) {
      this.reject(err);
    }
  }

  // Promise状态改变后不能再改变
  // 状态变为fulfilled时必须有一个value，且不能改变
  resolve = (value) => {
    if (this.status === "pending") {
      this.status = "fulfilled";
      this.value = value;
      // onFulfilled和onRejected是函数则必须在Promise状态改变后，以值作为参数执行且仅执行一次
      // 多次调用，回调执行顺序按原始顺序
      while (this.fulfilledCallbacks.length) {
        this.fulfilledCallbacks.shift()(value);
      }
    }
  };

  // 状态变为rejected时必须有一个reason，且不能改变
  reject = (reason) => {
    if (this.status === "pending") {
      this.status = "rejected";
      this.reason = reason;
      while (this.rejectedCallbacks.length) {
        this.rejectedCallbacks.shift()(reason);
      }
    }
  };

  // onFulfilled和onRejected都是可选参数
  then(onFulfilled, onRejected) {
    // onFulfilled和onRejected不是函数必须忽略
    onFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : (value) => value;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (reason) => {
            throw reason;
          };

    const promise2 = new MyPromise((resolve, reject) => {
      // onFulfilled和onRejected必须在执行上下文堆栈清空后允许（微任务）
      const fulfilledMicrotask = () => {
        queueMicrotask(() => {
          try {
            const x = onFulfilled(this.value);
            // onFulfilled和onRejected的返回值需要检查类型
            this.resolvePromise(promise2, x, resolve, reject);
          } catch (err) {
            reject(err);
          }
        });
      };
      const rejectedMicrotask = () => {
        queueMicrotask(() => {
          try {
            const x = onRejected(this.reason);
            this.resolvePromise(promise2, x, resolve, reject);
          } catch (err) {
            reject(err);
          }
        });
      };

      if (this.status === "pending") {
        this.fulfilledCallbacks.push(fulfilledMicrotask);
        this.rejectedCallbacks.push(rejectedMicrotask);
      } else if (this.status === "fulfilled") {
        fulfilledMicrotask();
      } else if (this.status === "rejected") {
        rejectedMicrotask();
      }
    });
    // then在同一Promise中可以调用多次
    // then必须返回一个Promise
    return promise2;
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  finally(callback) {
    return this.then(
      (value) => MyPromise.resolve(callback()).then(() => value),
      (reason) =>
        MyPromise.resolve(callback()).then(() => {
          throw reason;
        })
    );
  }

  resolvePromise(promise, x, resolve, reject) {
    if (promise === x) {
      return reject(
        new TypeError("The promise and the return value are the same")
      );
    }
    if (x === null || !["object", "function"].includes(typeof x)) {
      return resolve(x);
    }
    let called = false;
    try {
      let then = x.then;
      if (typeof then === "function") {
        then.call(
          x,
          (y) => {
            if (called) return;
            called = true;
            this.resolvePromise(promise, y, resolve, reject);
          },
          (r) => {
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } else {
        resolve(x);
      }
    } catch (err) {
      if (called) return;
      reject(err);
    }
  }

  static resolve(value) {
    if (value instanceof MyPromise) {
      return value;
    }
    return new MyPromise((resolve) => {
      resolve(value);
    });
  }

  static reject(reason) {
    return new MyPromise((resolve, reject) => {
      reject(reason);
    });
  }

  static all(iterator) {
    let err = checkIterable(iterator);
    if (err) throw TypeError(err);

    iterator = Array.from(iterator);
    let count = 0,
      result = [],
      len = iterator.length;
    return new MyPromise((resolve, reject) => {
      for (const index in iterator) {
        MyPromise.resolve(iterator[index])
          .then((data) => {
            result[index] = data;
            if (++count === len) {
              resolve(result);
            }
          })
          .catch((err) => {
            reject(err);
          });
      }
    });
  }

  static race(iterator) {
    let err = checkIterable(iterator);
    if (err) throw TypeError(err);

    iterator = Array.from(iterator);
    return new MyPromise((resolve, reject) => {
      for (let item of iterator) {
        MyPromise.resolve(item).then(
          (res) => {
            return resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
      }
    });
  }

  static any(iterator) {
    let err = checkIterable(iterator);
    if (err) throw TypeError(err);

    iterator = Array.from(iterator);
    let count = 0,
      result = [],
      len = iterator.length;
    return new MyPromise((resolve, reject) => {
      for (const index in iterator) {
        MyPromise.resolve(iterator[index])
          .then((data) => {
            resolve(data);
          })
          .catch((err) => {
            result[index] = err;
            if (++count === len) {
              reject(result);
            }
          });
      }
    });
  }

  static allSettled(iterator) {
    let err = checkIterable(iterator);
    if (err) throw TypeError(err);

    iterator = Array.from(iterator);
    let count = 0,
      result = [],
      len = iterator.length;
    return new MyPromise((resolve, reject) => {
      for (const index in iterator) {
        MyPromise.resolve(iterator[index])
          .then((data) => {
            result[index] = { status: "fulfilled", value: data };
            if (++count === len) {
              resolve(result);
            }
          })
          .catch((err) => {
            result[index] = { status: "rejected", reason: err };
            if (++count === len) {
              resolve(result);
            }
          });
      }
    });
  }
}

function checkIterable(iterator) {
  if (!iterator[Symbol.iterator]) {
    const type = typeof iterator;
    return `${type} ${iterator} is not iterable`;
  }
}

// --------------------------分割线--------------------------
MyPromise.deferred = function () {
  var result = {};
  result.promise = new MyPromise(function (resolve, reject) {
    result.resolve = resolve;
    result.reject = reject;
  });

  return result;
};
module.exports = MyPromise;

MyPromise.resolve()
  .then(() => {
    console.log(0);
    return MyPromise.resolve(4);
  })
  .then((res) => {
    console.log(res);
  });

MyPromise.resolve()
  .then(() => {
    console.log(1);
  })
  .then(() => {
    console.log(2);
  })
  .then(() => {
    console.log(3);
  })
  .then(() => {
    console.log(5);
  })
  .then(() => {
    console.log(6);
  });
