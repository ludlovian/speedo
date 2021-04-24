import { test } from 'uvu'
import * as assert from 'uvu/assert'

import Speedo from '../src/index.mjs'

test('basic run', async () => {
  const sp = new Speedo()
  assert.is(sp.rate(), 0)
  assert.is(sp.eta(), 0)
  assert.is(sp.percent(), null)

  await delay(100)
  sp.update({ current: 1, total: 5 })

  assert.not.ok(sp.done)
  roughly(sp.taken(), 100)
  roughly(sp.percent(), 20)
  roughly(sp.eta(), 400)
  roughly(sp.rate(), 10)

  await delay(400)
  sp.update(5)

  assert.ok(sp.done)
  roughly(sp.taken(), 500)
  assert.is(sp.eta(), 0)
  roughly(sp.rate(), 10)
  assert.is(sp.percent(), 100)
})

test.run()

function roughly (a, b, tolerance = 0.05) {
  const diff = Math.abs(b - a)
  const larger = Math.max(a, b)
  assert.ok(diff / larger < tolerance)
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
