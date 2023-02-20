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

  private associated_legendre_polynomial(n: number, m: number, x: number) {
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

  private laguerre_polynomial(n: number, x: number) {
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

  spherical_harmonic(theta: number) {
    var x = this.associated_legendre_polynomial(this.l, this.m, theta)//Math.cos(theta)
    return x*x
  }

  radial_wave_function(r: number) {
    var r_n = r / this.n
    var x = Math.exp(-r_n) * this.laguerre_polynomial(this.n - this.l - 1, 2 * r_n) * (2 * r_n) ** this.l
    return x*x
  }

  randomPoints(count: number, callback: (i: number, point: {x: number, y: number, z: number, r: number, theta: number, phi: number}) => any) {
    var fr = (x: number) => {return this.radial_wave_function(x)}
    var rmax = 2.5 * this.n * this.n
    var integralR = this.integrate(fr, 0, rmax*2, rmax / 800)
    var cumulativeR = getCumulativeDensity((x: number) => {return fr(x) / integralR}, 0, rmax, rmax / 300)
    
    var fsh = (x: number) => {return this.spherical_harmonic(x)}
    var integralSH = this.integrate(fsh, -1, 1, 2 / 800)
    var shVStep = (x: number) => {return Math.max(Math.sqrt(1 - x*x) / 200, 0.00005)}
    var cumulativeSH = getCumulativeDensityVStep((x: number) => {return fsh(x) / integralSH}, -1, 1, shVStep)

    var phifactor = 2 * Math.PI * 0.8

    for(var i = 0; i < count; i++) {
      var r = randomCumulativeDensity(cumulativeR.x, cumulativeR.cdf)
      var z_norm = randomCumulativeDensity(cumulativeSH.x, cumulativeSH.cdf)
      var theta = Math.acos(z_norm)
      var phi = Math.random() * phifactor
      var rsintheta = r * Math.sin(theta)
      callback(i, {
        x: rsintheta * Math.cos(phi),
        y: rsintheta * Math.sin(phi),
        z: r * z_norm,
        r: r, theta: theta, phi: phi
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