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

export function getCumulativeDensity(density: (x: number) => number, min: number, max: number, step: number, lobeTestFunction: (x: number) => number) {
  var u = min;
  var F = 0
  var lobeTest = lobeTestFunction(u)
  var lastLobeTest = lobeTest
  var lobe = 0;
  const values: number[] = [u]
  const cdf: number[] = [F]
  const lobes: number[] = [lobe]
  while (u <= max) {
    lastLobeTest = lobeTest
    lobeTest = lobeTestFunction(u)
    F += density(u) * step
    u += step
    if (lobeTest * lastLobeTest < 0) {
      lobe++
    }
    values.push(u)
    cdf.push(F)
    lobes.push(lobe)
  }
  return {
    x: values,
    cdf: cdf,
    lobes: lobes
  }
}

export function getCumulativeDensityVStep(density: (x: number) => number, min: number, max: number, step: (x: number) => number, lobeTestFunction: (x: number) => number) {
  var u = min;
  var F = 0
  var lobeTest = lobeTestFunction(u)
  var lastLobeTest = lobeTest
  var lobe = 0;
  const values: number[] = [u]
  const cdf: number[] = [F]
  const lobes: number[] = [lobe]
  while (u <= max) {
    lastLobeTest = lobeTest
    lobeTest = lobeTestFunction(u)
    F += density(u) * step(u)
    u += step(u)
    if (lobeTest * lastLobeTest < 0) {
      lobe++
    }
    values.push(u)
    cdf.push(F)
    lobes.push(lobe)
  }
  return {
    x: values,
    cdf: cdf,
    lobes: lobes
  }
}

export function randomCumulativeDensity(x: number[], cumulativeDensity: number[], lobes: number[]) {
  var rnd = Math.random()
  var len = cumulativeDensity.length
  for (let i = 0; i < len; i++) {
    if (cumulativeDensity[i] >= rnd) {
      return {
        x: x[i],
        lobe: lobes[i]
      }
    }
  }
  return {
    x: x[len - 1],
    lobe: lobes[len - 1]
  }
}