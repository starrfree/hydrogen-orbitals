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

export function getCumulativeDensity(density: (x: number) => number, min: number, max: number, step: number) {
  var u = min;
  var F = 0
  const values: number[] = [u];
  const cdf: number[] = [F];
  while (u <= max) {
    F += density(u) * step
    u += step
    values.push(u);
    cdf.push(F);
  }
  return {
    x: values,
    cdf: cdf
  }
}

export function getCumulativeDensityVStep(density: (x: number) => number, min: number, max: number, step: (x: number) => number) {
  var u = min;
  var F = 0
  const values: number[] = [u];
  const cdf: number[] = [F];
  while (u <= max) {
    F += density(u) * step(u)
    u += step(u)
    values.push(u);
    cdf.push(F);
  }
  return {
    x: values,
    cdf: cdf
  }
}

export function randomCumulativeDensity(x: number[], cumulativeDensity: number[]) {
  var rnd = Math.random()
  for (let i = 0; i < cumulativeDensity.length; i++) {
    if (cumulativeDensity[i] >= rnd) {
      return x[i]
    }
  }
  return x[x.length - 1]
}