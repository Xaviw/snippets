class MyPromise {
  status = "pending";
  value = null;
  reason = null;
  onFulfilledCallbacks = [];
  onRejectedCallbacks = [];

  constructor(executor) {
    try {
      executor(this.resolve, this.reject);
    } catch (err) {
      this.reject(err);
    }
  }

  resolve = (value) => {
    if (this.status === "pending") {
      this.status = "fulfilled";
      this.value = value;
      while (this.onFulfilledCallbacks.length) {
        this.onFulfilledCallbacks.shift()(value);
      }
    }
  };

  reject = (reason) => {
    if (this.status === "pending") {
      this.status = "rejected";
      this.reason = reason;
      while (this.onRejectedCallbacks.length) {
        this.onRejectedCallbacks.shift()(reason);
      }
    }
  };

  then(onFulfilled, onRejected) {
    onFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : (value) => value;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (reason) => {
            throw reason;
          };

    const promise2 = new MyPromise((resolve, reject) => {
      const fulfilledMicrotask = () => {
        queueMicrotask(() => {
          try {
            const x = onFulfilled(this.value);
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
        this.onFulfilledCallbacks.push(fulfilledMicrotask);
        this.onRejectedCallbacks.push(rejectedMicrotask);
      } else if (this.status === "fulfilled") {
        fulfilledMicrotask();
      } else if (this.status === "rejected") {
        rejectedMicrotask();
      }
    });

    return promise2;
  }

  resolvePromise(promise, x, resolve, reject) {
    if (promise === x) {
      return reject(new TypeError("same"));
    }
    if ((typeof x === "object" && x !== null) || typeof x === "function") {
      let then;
      try {
        then = x.then;
      } catch (err) {
        reject(err);
      }
      let called = false;
      if (typeof then === "function") {
        try {
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
        } catch (err) {
          if (called) return;
          reject(err);
        }
      } else {
        resolve(x);
      }
    } else {
      resolve(x);
    }
  }

  static resolve(value) {
    // if (value instanceof MyPromise) return value;
    // return new MyPromise((resolve) => {
    //   resolve(value);
    // });
    if (value instanceof MyPromise) {
      // 递归解析
      return value.then(resolve, reject);
    }
    // ===================
    if (this.status === "pending") {
      this.status = "fulfilled";
      this.value = value;
      this.onFulfilledCallbacks.forEach((fn) => fn());
    }
  }

  static reject(reason) {
    return new MyPromise((resolve, reject) => {
      reject(reason);
    });
  }
}

MyPromise.deferred = function () {
  var result = {};
  result.promise = new MyPromise(function (resolve, reject) {
    result.resolve = resolve;
    result.reject = reject;
  });

  return result;
};
module.exports = MyPromise;

MyPromise.resolve(
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("ok");
    }, 3000);
  })
).then((data) => {
  console.log(data, "success");
});
// .catch((err) => {
//   console.log(err, "error");
// });
