import { getCumulativeDensity, getCumulativeDensityVStep, randomCumulativeDensity, randomDensity, randomDensityVStep } from "./random"

export class OrbitalCalculator {
  n: number
  l: number
  m: number

  constructor(n: number = 1, l: number = 0, m: number = 0) {
    this.n = n
    this.l = l
    this.m = Math.abs(m)
  }

  private associatedLegendrePolynomial(n: number, m: number, x: number) {
    var pmm = 1.0
    if (m > 0) {
      var somx2 = Math.sqrt((1.0 - x) * (1.0 + x))
      var fact = 1.0
      for (var i = 1; i <= m; i++) {
        pmm *= -fact * somx2
        fact += 2.0
      }
    }
    if (n == m) {
      return pmm
    } else {
      var pmmp1 = x * (2 * m + 1) * pmm
      if (n == m + 1) {
        return pmmp1
      } else {
        var pll: number = 0
        for (var l = m + 2; l <= n; l++) {
          pll = (x * (2 * l - 1) * pmmp1 - (l + m - 1) * pmm) / (l - m)
          pmm = pmmp1
          pmmp1 = pll
        }
        return pll
      }
    }
  }

  private laguerrePolynomial(n: number, x: number) {
    if (n == 0) {
      return 1
    } else if (n == 1) {
      return 1 - x
    } else {
      var L0 = 1
      var L1 = 1 - x
      var Ln: number = 0
      for (var i = 2; i <= n; i++) {
        Ln = ((2 * i - 1 - x) * L1 - (i - 1) * L0) / i
        L0 = L1
        L1 = Ln
      }
      return Ln
    }
  }

  private generalizedLaguerrePolynomial(a: number, n: number, x: number) {
    if (n == 0) {
      return 1
    } else if (n == 1) {
      return 1 - x + a
    } else {
      var L0 = 1
      var L1 = 1 - x + a
      var Ln: number = 0
      for (var i = 2; i <= n; i++) {
        Ln = ((2 * i - 1 - x + a) * L1 - (i - 1 + a) * L0) / i
        L0 = L1
        L1 = Ln
      }
      return Ln
    }
  }

  sphericalHarmonic(theta: number) {
    var x = this.associatedLegendrePolynomial(this.l, this.m, theta)//Math.cos(theta)
    return x*x
  }

  laguerrePart(r: number) {
    return this.generalizedLaguerrePolynomial(2 * this.l + 1, this.n - this.l - 1, 2 * r)
  }

  radialWaveFunction(r: number) {
    var r_n = r / this.n
    // var x = Math.exp(-r_n) * this.laguerrePolynomial(this.n - this.l - 1, 2 * r_n) * (2 * r_n) ** this.l
    var x = Math.exp(-r_n) * this.laguerrePart(r_n) * (2 * r_n) ** this.l
    return x*x * r*r
  }

  randomPoints(count: number, callback: (i: number, point: any) => void) {
    var fr = (x: number) => {return this.radialWaveFunction(x)}
    var rmax = 3 * this.n * this.n
    var integralR = this.integrate(fr, 0, rmax, rmax / 800)
    var rLobeTest = (r: number) => {return this.laguerrePart(r / this.n)}
    var cumulativeR = getCumulativeDensity((x: number) => {return fr(x) / integralR}, 0, rmax, rmax / 800, rLobeTest)
    var lastLobeR = cumulativeR.lobes[cumulativeR.lobes.length - 1] % 2
    
    var fsh = (x: number) => {return this.sphericalHarmonic(x)}
    var integralSH = this.integrate(fsh, -1, 1, 2 / 2000)
    var shVStep = (x: number) => {return Math.max(Math.sqrt(1 - x ** 2) / 200, 0.00002)}
    var shLobeTest = (theta: number) => {return this.associatedLegendrePolynomial(this.l, this.m, theta)}
    var cumulativeSH = getCumulativeDensityVStep((x: number) => {return fsh(x) / integralSH}, -1, 1, shVStep, shLobeTest)
    var lastLobeSH = cumulativeSH.lobes[cumulativeSH.lobes.length - 1] % 2

    var phifactor = Math.PI * 0.8

    for(var i = 0; i < count; i++) {
      var rData = randomCumulativeDensity(cumulativeR.x, cumulativeR.cdf, cumulativeR.lobes)
      var r = rData.x
      var zNormData = randomCumulativeDensity(cumulativeSH.x, cumulativeSH.cdf, cumulativeSH.lobes)
      var zNorm = zNormData.x + Math.random() / 300
      var theta = Math.acos(zNorm)
      var phi = (Math.random() * 2 - 1) * phifactor
      var rsintheta = r * Math.sin(theta)
      callback(i, {
        x: rsintheta * Math.cos(phi),
        y: rsintheta * Math.sin(phi),
        z: r * zNorm,
        r: r, theta: theta, phi: phi,
        rlobe: rData.lobe + lastLobeR, shlobe: zNormData.lobe + lastLobeSH
      })
    }
  }

  private integrate(f: (x: number) => number, min: number, max: number, step: number) {
    var integral = 0
    for (let x = min; x < max; x += step) {
      integral += f(x) * step
    }
    return integral
  }
}