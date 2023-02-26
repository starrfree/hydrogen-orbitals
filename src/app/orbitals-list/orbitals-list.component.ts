import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { OrbitalRendererService } from '../orbital-renderer.service';

@Component({
  selector: 'app-orbitals-list',
  templateUrl: './orbitals-list.component.html',
  styleUrls: ['./orbitals-list.component.css']
})
export class OrbitalsListComponent implements OnInit {
  @ViewChild('serviceCanvas') public serviceCanvas!: ElementRef
  @ViewChild('extendedView') public extendedView!: ElementRef
  
  showExtended = false
  activeAtomicNumbers = {
    n: 1,
    l: 0,
    m: 0
  }
  atomicNumbers: {n: number, l: number, m: number}[][][] = []
  disableScroll = () => {console.warn("disableScroll", "not initialized")}
  enableScroll = () => {console.warn("enableScroll", "not initialized")}

  constructor(private orbitalRendererService: OrbitalRendererService) {
  }

  ngOnInit() {
    for(var n = 1; n <= 5; n++) {
      this.addGroupN(n)
    }
  }
  
  ngAfterViewInit() {
    this.orbitalRendererService.canvas = this.serviceCanvas.nativeElement
    var scrollControls = this.setupScroll()
    this.disableScroll = scrollControls[0]
    this.enableScroll = scrollControls[1]
  }

  addGroupN(n: number) {
    var groupN: {n: number, l: number, m: number}[][] = []
    for(var step = 0; step < n; step++) {
      groupN.push(this.addGroupStep(n, step))
    }
    this.atomicNumbers.push(groupN)
  }

  addGroupStep(n: number, step: number) {
    var groupStep: {n: number, l: number, m: number}[] = []
    for(var l = step; l < n; l++) {
      groupStep.push({
        n: n,
        l: l,
        m: l - step
      })
    }
    return groupStep
  }
  
  expand(atomicNumber: {n: number, l: number, m: number}) {
    this.activeAtomicNumbers = atomicNumber
    this.showExtended = !this.showExtended
    this.disableScroll()
  }

  reduce() {
    (this.extendedView as any).destroy()
    this.showExtended = false
    this.enableScroll()
  }

  onScroll() {
    var lastGroupN = this.atomicNumbers[this.atomicNumbers.length - 1]
    var lastGroupStep = lastGroupN[lastGroupN.length - 1]
    var lastAtomicNumber = lastGroupStep[lastGroupStep.length - 1]
    var step = lastAtomicNumber.l - lastAtomicNumber.m
    var n = lastAtomicNumber.n
    if (lastGroupStep.length == 1) {
      this.atomicNumbers.push([this.addGroupStep(n+1, 0)])
    }
    lastGroupN.push(this.addGroupStep(n, step + 1))
    // this.atomicNumbers[this.atomicNumbers.length - 1] = lastGroupN
  }

  setupScroll() {
    var keys: any = {37: 1, 38: 1, 39: 1, 40: 1};
    var supportsPassive = false;
    try {
      window.addEventListener("test", () => {}, Object.defineProperty({}, 'passive', {
        get: () => { supportsPassive = true; } 
      }));
    } catch(e) {}
    var wheelOpt: any = supportsPassive ? { passive: false } : false;
    var wheelEvent: any = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';
    const preventDefault = (e: any) => {
      e.preventDefault();
    }
    
    const preventDefaultForScrollKeys = (e: any) => {
      if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
      }
      return true
    }

    // call this to Disable
    const disableScroll = () => {
      window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
      window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
      window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
      window.addEventListener('keydown', preventDefaultForScrollKeys, false);
    }
    
    // call this to Enable
    const enableScroll = () => {
      window.removeEventListener('DOMMouseScroll', preventDefault, false);
      window.removeEventListener(wheelEvent, preventDefault, wheelOpt); 
      window.removeEventListener('touchmove', preventDefault, wheelOpt);
      window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
    }

    return [disableScroll, enableScroll]
  }
}
