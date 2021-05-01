import { test } from 'uvu'
import * as assert from 'uvu/assert'

import { pipeline } from 'stream/promises'

import speedo from '../src/gen.mjs'

test('normal stream run', async () => {
  async function * producer () {
    for (let i = 0; i < 5; i++) {
      await delay(200)
      yield Buffer.allocUnsafe(1000)
    }
  }

  async function * consumer (source) {
    // eslint-disable-next-line no-unused-vars
    for await (const chunk of source) {
      // do nothing
    }
  }

  const sp = speedo({ interval: 100, total: 5000 })
  const pDone = pipeline(producer, sp, consumer)

  await delay(250)
  assert.not.ok(sp.done)
  assert.is(sp.current, 1000)
  roughly(sp.taken, 200)
  roughly(sp.percent, 20)
  roughly(sp.eta, 800)
  roughly(sp.rate, 5000)

  await pDone

  assert.ok(sp.done)
  roughly(sp.taken, 1000)
  assert.is(sp.eta, 0)
  roughly(sp.rate, 5000)
  assert.is(sp.percent, 100)
  assert.is(sp.current, 5000)

  assert.not.throws(() => sp.update())
  assert.is(sp.done, true)
})

test('error run', async () => {
  const err = new Error('oops')
  async function * producer () {
    await delay(200)
    yield Buffer.allocUnsafe(1000)
    await delay(200)
    throw err
  }

  async function * consumer (source) {
    try {
      // eslint-disable-next-line no-unused-vars
      for await (const chunk of source) {
        // do nothing
      }
    } catch (e) {
      assert.is(e, err)
      throw e
    }
  }

  const pDone = pipeline(producer, speedo(), consumer)
  await pDone.then(assert.unreachable, e => assert.is(e, err))
})

function roughly (a, b, tol = 0.05) {
  assert.ok(Math.abs(b - a) / Math.max(a, b) < tol, `Is ${a} ~ ${b}`)
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

test.run()
