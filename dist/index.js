'use strict';

class Speedo {
  constructor ({ window = 10 } = {}) {
    this.windowSize = window;
    this.start = Date.now();
    this.readings = [[this.start, 0]];
  }
  update (data) {
    if (typeof data === 'number') data = { current: data };
    const { current, total } = data;
    if (total) this.total = total;
    this.readings = [...this.readings, [Date.now(), current]].slice(
      -this.windowSize
    );
    this.current = current;
  }
  get done () {
    return this.total && this.current >= this.total
  }
  rate () {
    if (this.readings.length < 2) return 0
    if (this.done) return (this.current * 1e3) / this.taken()
    const last = this.readings[this.readings.length - 1];
    const first = this.readings[0];
    return ((last[1] - first[1]) * 1e3) / (last[0] - first[0])
  }
  percent () {
    if (!this.total) return null
    return this.done ? 100 : Math.round((100 * this.current) / this.total)
  }
  eta () {
    if (!this.total || this.done) return 0
    const rate = this.rate();
    if (!rate) return 0
    return (1e3 * (this.total - this.current)) / rate
  }
  taken () {
    return this.readings[this.readings.length - 1][0] - this.start
  }
}

module.exports = Speedo;
