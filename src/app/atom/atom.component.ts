import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { OrbitalCalculator } from '../scripts/orbital-calculator'
import * as THREE from 'three';
import CameraControls from 'camera-controls';
import Stats from 'three/examples/jsm/libs/stats.module'
import { OrbitalRenderer } from '../scripts/orbital-renderer';

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
    this.pointCount = this.preview ? 100000 : 800000//1400000
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
    
    // var startFrom = new Date().getTime()
    var orbitalRenderer = new OrbitalRenderer(this.pointCount)
    orbitalRenderer.addPoints(this.n, this.l, this.m, this.scene, false)
    // console.log(`(${this.n}, ${this.l}, ${this.m})`, (new Date().getTime() - startFrom) / 1000)

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
  }
}
