# speedo
Speed measurement

## API

There are two exports - `speedo`, which is a simple calculator that you manually update.

`speedo/gen` is an aync-generator transform stream which updates automatically. This is the preferred option.

### Speedo/gen
```
import speedo from 'speedo/gen'
const sp = speedo({opts})

await pipeline(..., sp, ...)
```
The only & default import is a function which creates a speedo transform stream. Options are:

- `total` - the expected size of the file
- `interval` - how frequently should the speedo update
- `windowSize` - how large a window to use to calculate average speeds


### Attributes

The speedo created has the following attributes:

- `current` - how many bytes passed through so far
- `total` - the total size
- `percent` - percent complete (assuming `.total` was set)
- `rate` - in bytes/second
- `eta` - in ms
- `done` - whether it is done yet

### Old version

The old version exports a class. Options on construction are

- `window` - how many measurements to measure the speed over
- `total` - sets the total expected

And then you manually update with `.update(current)` or `.update({ current, total })`

The object then supports the following methods and attributes

- `total` - the total size
- `speed()` - the average speed
- `taken()` - time taken so far, or in total if done
- `eta()` - eta in ms
- `done` - if done
