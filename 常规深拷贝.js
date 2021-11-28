function deepClone(value) {
  let map = new Map();

  function main(value) {
    if (value === null || typeof value !== "object") {
      return value;
    }
    if (map.get(value)) {
      return map.get(value);
    }
    let result = Array.isArray(value) ? [] : {};
    map.set(value, result);
    for (let item in value) {
      if (value.hasOwnProperty(item)) {
        result[item] = main(value[item]);
      }
    }
    return result;
  }

  return main(value);
}
