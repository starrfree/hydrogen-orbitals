import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('atomCanvas') public sceneCanvas?: ElementRef
  scene!: THREE.Scene
  camera!: THREE.Camera
  renderer!: THREE.WebGLRenderer
  stats?: Stats

  orbitalCalculator = new OrbitalCalculator(5, 1, 0)
  pointCount = 700000

  constructor() { }

  ngOnInit(): void {
    CameraControls.install( { THREE: THREE } );
  }

  ngAfterViewInit(): void {
    var resizeCanvas = () => {
      this.sceneCanvas!.nativeElement.width = this.sceneCanvas!.nativeElement.clientWidth
      this.sceneCanvas!.nativeElement.height = this.sceneCanvas!.nativeElement.clientHeight
    }
    resizeCanvas()

    this.createScene()
    this.addPoints()
    const cameraControls = new CameraControls(this.camera as THREE.PerspectiveCamera, this.renderer.domElement);
    const clock = new THREE.Clock();
    var render = () => {
      var dt = clock.getDelta();
      var controlsUpdate = cameraControls.update(dt);
      if (controlsUpdate) {
        this.renderer.render(this.scene, this.camera)
        this.stats?.update()
      }
      requestAnimationFrame(render)
    }
    this.renderer.render(this.scene, this.camera)
    render()
  }

  createScene() {
    if (!this.sceneCanvas) {return}
    var n2 = this.orbitalCalculator.n * this.orbitalCalculator.n
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(40, this.sceneCanvas.nativeElement.clientWidth / this.sceneCanvas.nativeElement.clientHeight, 0.1, 20000)//30 * n2 / 9, 80 * n2 / 9
    this.camera.position.set(0, 0, 6 * n2)
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.sceneCanvas.nativeElement,
      antialias: true
    })
    this.renderer.setClearColor(0xffffff)
    this.renderer.setPixelRatio(this.sceneCanvas.nativeElement.devicePixelRatio)
    this.renderer.setSize(this.sceneCanvas.nativeElement.clientWidth, this.sceneCanvas.nativeElement.clientHeight)

    // this.stats = Stats()
    // document.body.appendChild(this.stats.dom)    
  }

  addPoints() {
    var n2 = this.orbitalCalculator.n * this.orbitalCalculator.n
    var geometry = new THREE.SphereGeometry(0.03 * n2 * 0.13, 2, 2)
    var material = new THREE.MeshBasicMaterial({color: 0x000000, transparent: true, opacity: 0.5})//new THREE.MeshDepthMaterial()
    var mesh = new THREE.InstancedMesh(geometry, material, this.pointCount)
    this.scene.add(mesh)

    var o = new THREE.Object3D()
    var theta = -Math.PI / 3
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
      // var color = 0
      // mesh.setColorAt(i, new THREE.Color(color, color, color))
    })
  }
}
