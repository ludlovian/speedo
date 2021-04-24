import test from 'ava'

import Speedo from '../src/index.mjs'

test('basic run', async t => {
  const sp = new Speedo()
  t.is(sp.rate(), 0)
  t.is(sp.eta(), 0)
  t.is(sp.percent(), null)

  await delay(100)
  sp.update({ current: 1, total: 5 })

  t.false(sp.done)
  t.true(roughly(sp.taken(), 100))
  t.true(roughly(sp.percent(), 20))
  t.true(roughly(sp.eta(), 400))
  t.true(roughly(sp.rate(), 10))

  await delay(400)
  sp.update(5)

  t.true(sp.done)
  t.true(roughly(sp.taken(), 500))
  t.is(sp.eta(), 0)
  t.true(roughly(sp.rate(), 10))
  t.is(sp.percent(), 100)
})

function roughly (a, b, tolerance = 0.05) {
  const diff = Math.abs(b - a)
  const larger = Math.max(a, b)
  return diff / larger < tolerance
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
