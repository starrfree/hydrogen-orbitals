import { ElementRef, Injectable } from '@angular/core';
import { OrbitalRenderer } from './scripts/orbital-renderer';

@Injectable({
  providedIn: 'root'
})
export class OrbitalRendererService {
  private _canvas!: HTMLCanvasElement;
  public get canvas() : HTMLCanvasElement {
    return this._canvas;
  }
  public set canvas(c : HTMLCanvasElement) {
    this._canvas = c;
    this.renderer.canvas = c
    this.renderer.addRenderer()
    this.init()
  }
  private renderer = new OrbitalRenderer(100000)
  public onInit: (() => void)[] = []
  didInit = false

  constructor() { 
  }

  init() {
    this.onInit.forEach(f => f())
    this.didInit = true
  }

  render(outputCanvas: HTMLCanvasElement, n: number, l: number, m: number) {
    this.renderer.createScene(n, l, m)
    this.renderer.addPoints(n, l, m, this.renderer.scene, true)
    this.renderer.render(outputCanvas)
  }
}
