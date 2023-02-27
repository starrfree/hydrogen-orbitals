import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
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
  @Input() backgroundColor = 0xeeeeee
  @Input() backgroundOpacity = 1
  @Input() allowPhiControl = true
  @Input() phiSection: number = 0.8
  @Input() autoRotate: boolean = false
  @Input() embed: boolean = false
  @Input() interaction: boolean = true
  @Output() close = new EventEmitter<any>()

  @ViewChild('atomCanvas') public sceneCanvas?: ElementRef
  @ViewChild('phiIndicator') public phiIndicator?: ElementRef
  scene!: THREE.Scene
  camera!: THREE.Camera
  renderer!: THREE.WebGLRenderer
  stats?: Stats

  orbitalCalculator!: OrbitalCalculator
  pointCount!: number
  phiControl = {
    active: false,
    startPosition: [0, 0],
    lastPhi: 0
  }
  public destroy = () => {}

  constructor() { }

  ngOnInit(): void {
    this.orbitalCalculator = new OrbitalCalculator(this.n, this.l, this.m)
    this.pointCount = this.preview ? 100000 : 500000//1400000
    CameraControls.install( { THREE: THREE } );
  }

  ngAfterViewInit(): void {
    this.setupControls()

    var resizeCanvas = () => {
      this.sceneCanvas!.nativeElement.width = this.sceneCanvas!.nativeElement.clientWidth
      this.sceneCanvas!.nativeElement.height = this.sceneCanvas!.nativeElement.clientHeight
    }
    resizeCanvas()

    this.createScene()
    
    // var startFrom = new Date().getTime()
    var orbitalRenderer = new OrbitalRenderer(this.pointCount)
    orbitalRenderer.addPoints(this.n, this.l, this.m, this.scene, this.preview, this.phiSection)
    // console.log(`(${this.n}, ${this.l}, ${this.m})`, (new Date().getTime() - startFrom) / 1000)

    const cameraControls = new CameraControls(this.camera as THREE.PerspectiveCamera, this.renderer.domElement)
    
    if (!this.interaction) {
      cameraControls.mouseButtons.wheel = CameraControls.ACTION.NONE
      cameraControls.mouseButtons.left = CameraControls.ACTION.NONE
      cameraControls.mouseButtons.right = CameraControls.ACTION.NONE
      cameraControls.mouseButtons.middle = CameraControls.ACTION.NONE
      cameraControls.touches.one = CameraControls.ACTION.NONE
      cameraControls.touches.two = CameraControls.ACTION.NONE
      cameraControls.touches.three = CameraControls.ACTION.NONE
    }

    cameraControls.rotatePolarTo(Math.PI / 4, false)
    cameraControls.rotateAzimuthTo(Math.PI / 6, false)
    cameraControls.smoothTime = 0.25
    cameraControls.rotatePolarTo(Math.PI / 2 - 0.05, true)
    cameraControls.rotateAzimuthTo(0, true)

    this.destroy = () => {
      cameraControls.dispose()
      this.renderer.forceContextLoss()
    }

    const clock = new THREE.Clock()
    var lastUpdate = new Date().getTime()
    var didReset = true
    var render = () => {
      var dt = clock.getDelta();
      if (this.autoRotate) {
        cameraControls.rotate(0.2 * dt, 0, false)
      }
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

  setupControls() {
    this.phiIndicator?.nativeElement.addEventListener('pointerdown', (event: any) => {
      this.phiControl.lastPhi = this.phiSection
      this.phiControl.startPosition = [event.clientX, event.clientY]
      this.phiControl.active = true
    })
    var move = (event: any) => {
      if (this.phiControl.active) {
        var dy = event.clientY - this.phiControl.startPosition[1]
        var phiSectionNew = this.phiControl.lastPhi + dy / 100
        phiSectionNew = Math.max(Math.min(phiSectionNew, 1), 0.5)
        this.phiSection = phiSectionNew
      }
    }
    this.phiIndicator?.nativeElement.addEventListener('pointermove', (event: any) => { move(event) })
    this.sceneCanvas?.nativeElement.addEventListener('pointermove', (event: any) => { move(event) })
    var stopDrag = (event: any) => {
      if (this.phiControl.active) {
        this.phiControl.active = false
        this.redraw()
      }
    }
    this.phiIndicator?.nativeElement.addEventListener('pointerup', (event: any) => { stopDrag(event) })
    this.sceneCanvas?.nativeElement.addEventListener('pointerup', (event: any) => { stopDrag(event) })
    // this.sceneCanvas?.nativeElement.addEventListener('pointerleave', (event: any) => { stopDrag() })
    // this.sceneCanvas?.nativeElement.addEventListener('pointerout', (event: any) => { stopDrag() })
  }

  createScene() {
    if (!this.sceneCanvas) {return}
    var n2 = this.n * this.n
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(40, this.sceneCanvas.nativeElement.clientWidth / this.sceneCanvas.nativeElement.clientHeight, 0.1, 1000 * n2)
    this.camera.position.set(0, n2, this.getCameraDistance())
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.sceneCanvas.nativeElement,
      antialias: true,
      alpha: true
    })
    this.renderer.setClearColor(this.backgroundColor, this.backgroundOpacity)
    this.renderer.setPixelRatio(this.sceneCanvas.nativeElement.devicePixelRatio)
    this.renderer.setSize(this.sceneCanvas.nativeElement.clientWidth, this.sceneCanvas.nativeElement.clientHeight)
  }

  getCameraDistance() {
    var n2 = this.n * this.n
    var camD: number = 7 * n2
    if (this.n <= 2) {
      camD = 9 * n2
    } else if (this.n <= 4 && this.l <= 1) {
      camD = 8 * n2
    }
    return camD
  }

  public redraw() {
    this.scene.remove(this.scene.children[0])
    var orbitalRenderer = new OrbitalRenderer(this.pointCount)
    orbitalRenderer.addPoints(this.n, this.l, this.m, this.scene, this.preview, this.phiSection)
    this.renderer.render(this.scene, this.camera)
  }

  getSemiDiskTransform(sign: -1 | 1) {
    return `rotate(${180 * (1 - this.phiSection) * sign}, 50, 50)`
  }

  closeExtendedView() {
    this.close.emit()
  }
}
