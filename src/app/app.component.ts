import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { OrbitalRendererService } from './orbital-renderer.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('serviceCanvas') public serviceCanvas!: ElementRef
  
  showExtended = false
  activeAtomicNumbers = {
    n: 1,
    l: 0,
    m: 0
  }
  atomicNumbers: {n: number, l: number, m: number}[][][] = []

  constructor(private orbitalRendererService: OrbitalRendererService) {
  }

  ngOnInit() {
    for(var n = 1; n <= 5; n++) {
      this.addGroupN(n)
    }
  }
  
  ngAfterViewInit() {
    this.orbitalRendererService.canvas = this.serviceCanvas.nativeElement
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
}
