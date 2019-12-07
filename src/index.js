export default class Speedo {
  // Units:
  //  curr / total - things
  //  rate - things per second
  //  eta / taken - ms
  constructor ({ window = 10 } = {}) {
    this.windowSize = window
    this.start = Date.now()
    this.readings = [[this.start, 0]]
  }

  update (n) {
    this.readings.push([Date.now(), n])
    if (this.readings.length > this.windowSize) {
      this.readings.splice(0, this.readings.length - this.windowSize)
    }
    this.current = n
  }

  get done () {
    return this.total && this.current >= this.total
  }

  rate () {
    if (this.readings.length < 2) return null
    const last = this.readings[this.readings.length - 1]
    const first = this.readings[0]
    return ((last[1] - first[1]) * 1e3) / (last[0] - first[0])
  }

  percent () {
    if (!this.total) return null
    return this.done ? 100 : Math.round((100 * this.current) / this.total)
  }

  eta () {
    if (!this.total) return null
    if (this.done) return 0
    const rate = this.rate()
    if (rate === null) return null
    return (1e3 * (this.total - this.current)) / rate
  }

  taken () {
    return this.readings[this.readings.length - 1][0] - this.start
  }
}
