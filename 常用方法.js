function DeepClone (obj) {
    if (obj == null || typeof obj !== 'object') return obj
    if (obj instanceof Date) return new Date(obj)
    if (obj instanceof RegExp) return new RegExp(obj)
    let result = new obj.constructor()
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            result[key] = DeepClone(obj[key])
        }
    }
    return result
}

function bubbleSort (arr) {
    for (let i=0; i<arr.length; i++) {
        for (let j=0; j<arr.length-1; j++) {
            if (arr[j] > arr[j+1]) [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
        }
    }
    return arr
}



console.log(bubbleSort([1,3,5,7,9,2,4,6,8,10]))
