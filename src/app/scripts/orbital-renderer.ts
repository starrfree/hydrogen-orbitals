import { OrbitalCalculator } from "./orbital-calculator";
import * as THREE from 'three';
import { ElementRef } from "@angular/core";

export class OrbitalRenderer {
  pointCount: number

  canvas!: HTMLCanvasElement
  scene!: THREE.Scene
  camera!: THREE.Camera
  renderer!: THREE.WebGLRenderer

  constructor(pointCount: number) {
    this.pointCount = pointCount
  }

  addRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    })
  }

  createScene(n: number, l: number, m: number) {
    if (!this.canvas) {return}
    var n2 = n * n
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(40, this.canvas.clientWidth / this.canvas.clientHeight, 0.1, 1000 * n2)
    var camZ: number = 7 * n2
    if (n <= 2) {
      camZ = 9 * n2
    } else if (n <= 4 && l <= 1) {
      camZ = 8 * n2
    }
    var camY = 0
    this.camera.position.set(0, camY, camZ)
    this.camera.rotateX(-Math.atan2(camY, camZ))
    this.renderer.setClearColor(0xeeeeee, 0)
    this.renderer.setPixelRatio((this.canvas as any).devicePixelRatio)
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight)
  }

  addPoints(n: number, l: number, m: number, scene: THREE.Scene, preview: boolean, phiSection: number = 0.75) {
    var n2 = n * n
    var geometry
    if (preview) {
      geometry = new THREE.SphereGeometry(0.03 * n2 * 0.3, 5, 8)
    } else {
      geometry = new THREE.TetrahedronGeometry(0.03 * n2 * 0.2)
    }
    var material = new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.8})
    var mesh = new THREE.InstancedMesh(geometry, material, this.pointCount)
    scene.add(mesh)

    var o = new THREE.Object3D()
    var theta = Math.PI / 2
    var costheta = Math.cos(theta)
    var sintheta = Math.sin(theta)
    var phi = -Math.PI / 2
    var cosphi = Math.cos(phi)
    var sinphi = Math.sin(phi)

    const orbitalCalculator = new OrbitalCalculator(n, l, m)
    orbitalCalculator.randomPoints(this.pointCount, phiSection, (i, point) => {
      o.position.x = point.x * costheta - point.y * sintheta
      var newy = point.x * sintheta + point.y * costheta
      o.position.y = newy * cosphi - point.z * sinphi
      o.position.z = newy * sinphi + point.z * cosphi
      o.updateMatrix()
      mesh.setMatrixAt(i, o.matrix)

      var color: {r: number, g: number, b: number}
      if ((point.rlobe + point.shlobe) % 2 == 1) {
        color = {r: 0.8, g: 0.3, b: 0.05}
      } else {
        color = {r: 0., g: 0.15, b: 0.6}
      }
      mesh.setColorAt(i, new THREE.Color(color.r, color.g, color.b))
    })
  }
  
  render(ouputCanvas: HTMLCanvasElement) {
    this.renderer.render(this.scene, this.camera)

    var outputContext = ouputCanvas.getContext('2d')!
    outputContext.drawImage(this.canvas, 0, 0)
  }
}