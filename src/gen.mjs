export default function speedo ({
  total,
  interval = 250,
  windowSize = 40
} = {}) {
  let readings
  let start
  return Object.assign(transform, { current: 0, total, update, done: false })

  async function * transform (source) {
    start = Date.now()
    readings = [[start, 0]]
    const int = setInterval(update, interval)
    try {
      for await (const chunk of source) {
        transform.current += chunk.length
        yield chunk
      }
      transform.total = transform.current
      update(true)
    } finally {
      clearInterval(int)
    }
  }

  function update (done = false) {
    if (transform.done) return
    const { current, total } = transform
    const now = Date.now()
    const taken = now - start
    readings = [...readings, [now, current]].slice(-windowSize)
    const first = readings[0]
    const wl = current - first[1]
    const wt = now - first[0]
    const rate = 1e3 * (done ? total / taken : wl / wt)
    const percent = Math.round((100 * current) / total)
    const eta = done || !total ? 0 : (1e3 * (total - current)) / rate
    Object.assign(transform, { done, taken, rate, percent, eta })
  }
}
