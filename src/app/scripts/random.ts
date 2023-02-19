export function randomDensity(density: (x: number) => number, min: number, max: number | undefined, step: number) {
  const x = Math.random()
  var u = min
  var F = 0
  while (max == undefined || u <= max) {
    if (F >= x) {
      return u
    }
    F += density(u) * step
    u += step
  }
  return u
}

export function randomDensityVStep(density: (x: number) => number, min: number, max: number | undefined, step: (x: number) => number) {
  const x = Math.random()
  var u = min
  var F = 0
  while (max == undefined || u <= max) {
    if (F >= x) {
      return u
    }
    F += density(u) * step(u)
    u += step(u)
  }
  return u
}