class RunningAverage {
  constructor () {
    this.reset
  }
  push (number) {
    var arr
    if (arguments.length != 1) {
      arr = arguments
    } else if (Array.isArray(number)) {
      arr = number
    }
    if (arr) {
      for (var i = 0; i < arr.length; i++) {
        this.push(arr[i])
      }
    } else {
      var orig = number
      if (typeof number != "number") {
        number = parseInt(number, 10)
      }
      if (isNaN(number)) {
        throw new TypeError("RunningAverage.push only accepts numbers, received: " + orig)
      }
      const diff = number - this.average
      this.average = this.average + diff / this.denominator
      this.denominator++
    }
    return this
  }

  getAverage () {
    return this.average
  }

  reset () {
    this.denominator = 1
    this.average = 0
  }
}



module.exports = RunningAverage
