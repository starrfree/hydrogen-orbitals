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

  orbitalCalculator = new OrbitalCalculator(6, 3, 1)
  pointCount = 1400000

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
    
    var startFrom = new Date().getTime()
    this.addPoints()
    console.log("Points", (new Date().getTime() - startFrom) / 1000)

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
    this.camera = new THREE.PerspectiveCamera(40, this.sceneCanvas.nativeElement.clientWidth / this.sceneCanvas.nativeElement.clientHeight, 0.1, 1000 * this.orbitalCalculator.n ** 2)
    this.camera.position.set(0, n2, 6 * n2)
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
    var n2 = this.orbitalCalculator.n * this.orbitalCalculator.n
    var geometry = new THREE.TetrahedronGeometry(0.03 * n2 * 0.11)
    var material = new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.7})
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
