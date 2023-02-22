import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { OrbitalCalculator } from '../scripts/orbital-calculator'
import * as THREE from 'three';
import CameraControls from 'camera-controls';
import Stats from 'three/examples/jsm/libs/stats.module'

@Component({
  selector: 'app-atom',
  templateUrl: './atom.component.html',
  styleUrls: ['./atom.component.css']
})
export class AtomComponent implements OnInit {
  @Input() n: number = 1
  @Input() l: number = 0
  @Input() m: number = 0
  @Input() preview: boolean = false

  @ViewChild('atomCanvas') public sceneCanvas?: ElementRef
  scene!: THREE.Scene
  camera!: THREE.Camera
  renderer!: THREE.WebGLRenderer
  stats?: Stats

  orbitalCalculator!: OrbitalCalculator
  pointCount!: number

  constructor() { }

  ngOnInit(): void {
    this.orbitalCalculator = new OrbitalCalculator(this.n, this.l, this.m)
    this.pointCount = this.preview ? 100000 : 1400000
    if (!this.preview) {
      CameraControls.install( { THREE: THREE } );
    }
  }

  ngAfterViewInit(): void {
    var resizeCanvas = () => {
      this.sceneCanvas!.nativeElement.width = this.sceneCanvas!.nativeElement.clientWidth
      this.sceneCanvas!.nativeElement.height = this.sceneCanvas!.nativeElement.clientHeight
    }
    resizeCanvas()

    this.createScene()
    
    var startFrom = new Date().getTime()
    this.addPoints()
    console.log(`(${this.n}, ${this.l}, ${this.m})`, (new Date().getTime() - startFrom) / 1000)

    const cameraControls = new CameraControls(this.camera as THREE.PerspectiveCamera, this.renderer.domElement)
    if (this.preview) {
      cameraControls.mouseButtons.wheel = CameraControls.ACTION.NONE
      cameraControls.mouseButtons.middle = CameraControls.ACTION.NONE
      cameraControls.touches.two = CameraControls.ACTION.NONE
      cameraControls.touches.three = CameraControls.ACTION.NONE
    }
    const clock = new THREE.Clock()
    var lastUpdate = new Date().getTime()
    var didReset = true
    var render = () => {
      var dt = clock.getDelta();
      var controlsUpdate = cameraControls.update(dt)
      if (controlsUpdate) {
        this.renderer.render(this.scene, this.camera)
        this.stats?.update()
      }
      if (this.preview) {
        if (cameraControls.currentAction) {
          lastUpdate = new Date().getTime()
          didReset = false
        }
        if (!didReset && (new Date().getTime() - lastUpdate) / 1000 > 3) {
          cameraControls.smoothTime = 0.15
          cameraControls.reset(true)
          lastUpdate = new Date().getTime()
          didReset = true
        }
      }
      requestAnimationFrame(render)
    }
    this.renderer.render(this.scene, this.camera)
    render()
  }

  createScene() {
    if (!this.sceneCanvas) {return}
    var n2 = this.n * this.n
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(40, this.sceneCanvas.nativeElement.clientWidth / this.sceneCanvas.nativeElement.clientHeight, 0.1, 1000 * n2)
    var camD: number = 7 * n2
    if (this.n <= 2) {
      camD = 9 * n2
    } else if (this.n <= 4 && this.l <= 1) {
      camD = 8 * n2
    }
    this.camera.position.set(0, n2, camD)
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.sceneCanvas.nativeElement,
      antialias: true
    })
    this.renderer.setClearColor(0xeeeeee)
    this.renderer.setPixelRatio(this.sceneCanvas.nativeElement.devicePixelRatio)
    this.renderer.setSize(this.sceneCanvas.nativeElement.clientWidth, this.sceneCanvas.nativeElement.clientHeight)

    // this.stats = Stats()
    // document.body.appendChild(this.stats.dom)    
  }

  addPoints() {
    var n2 = this.n * this.n
    var geometry
    if (this.preview) {
      geometry = new THREE.SphereGeometry(0.03 * n2 * 0.3, 5, 8)
    } else {
      geometry = new THREE.TetrahedronGeometry(0.03 * n2 * 0.11)
    }
    var material = new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.8})
    var mesh = new THREE.InstancedMesh(geometry, material, this.pointCount)
    this.scene.add(mesh)

    var o = new THREE.Object3D()
    var theta = Math.PI / 2
    var costheta = Math.cos(theta)
    var sintheta = Math.sin(theta)
    var phi = -Math.PI / 2
    var cosphi = Math.cos(phi)
    var sinphi = Math.sin(phi)
    this.orbitalCalculator.randomPoints(this.pointCount, (i, point) => {
      o.position.x = point.x * costheta - point.y * sintheta
      var newy = point.x * sintheta + point.y * costheta
      o.position.y = newy * cosphi - point.z * sinphi
      o.position.z = newy * sinphi + point.z * cosphi
      o.updateMatrix()
      mesh.setMatrixAt(i, o.matrix)
      var color: {r: number, g: number, b: number}
      // if (point.rlobe % 2 == 1) {
      //   if (point.shlobe % 2 == 0) {
      //     // color = {r: 0.8, g: 0.3, b: 0.05}
      //     color = {r: 0.2, g: 0.6, b: 0.2}
      //   } else {
      //     // color = {r: 0.7, g: 0., b: 0.}
      //     color = {r: 0.2, g: 0.6, b: 0.6}
      //   }
      // } else {
      //   if (point.shlobe % 2 == 0) {
      //     color = {r: 0., g: 0.1, b: 0.6}
      //   } else {
      //     color = {r: 0.8, g: 0.3, b: 0.05}
      //     // color = {r: 0.2, g: 0.6, b: 0.2}
      //     // color = {r: 0.2, g: 0.6, b: 0.6}
      //   }
      // }

      if ((point.rlobe + point.shlobe) % 2 == 1) {
        color = {r: 0.8, g: 0.3, b: 0.05}
      } else {
        color = {r: 0., g: 0.15, b: 0.6}
      }
      mesh.setColorAt(i, new THREE.Color(color.r, color.g, color.b))
    })
  }
}
