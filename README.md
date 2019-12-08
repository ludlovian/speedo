# speedo
Speed measurement

## API

There is a single default export

### Speedo
`const s = new Speedo(opts)`

creates a new speedo

Options:

- `window` - how many measurements to measure the speed over. Default: 10
- `total` - sets the total expected

### .total
Set this to allow ETA measurements. Must be in the same *units* as `update`.

### .update
`.update(current | { current, total })`

Provides a new reading in whatever *units* you like

### .speed
`r = s.speed()`

Provides the average speed (in *units* per second) over the window. Or, if done, the total speed.

### .taken
`t = s.taken()`

Returns how long the speedo has been running (in milliseconds)

### .eta
`e = s.eta()`

Returns how long we have left (in milliseconds)

### .done
`if (s.done) ...`

Says if the speedo is done (i.e. `current` >= `total`)
