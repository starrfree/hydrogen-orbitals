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
  atomicNumbers: {n: number, l: number, m: number}[][] = []

  constructor(private orbitalRendererService: OrbitalRendererService) {
  }

  ngOnInit() {
    for(var n = 1; n <= 6; n++) {
      var group: {n: number, l: number, m: number}[] = []
      for(var l = 0; l < n; l++) {
        for(var m = 0; m <= l; m++) {
          group.push({
            n: n,
            l: l,
            m: m
          })
        }
      }
      this.atomicNumbers.push(group)
    }
  }
  
  ngAfterViewInit() {
    this.orbitalRendererService.canvas = this.serviceCanvas.nativeElement
  }
  
  expand(atomicNumber: {n: number, l: number, m: number}) {
    this.activeAtomicNumbers = atomicNumber
    this.showExtended = !this.showExtended
  }

  onScroll() {
    var n: number = this.atomicNumbers[this.atomicNumbers.length - 1][0].n + 1
    var group: {n: number, l: number, m: number}[] = []
    for(var l = 0; l < n; l++) {
      for(var m = 0; m <= l; m++) {
        group.push({
          n: n,
          l: l,
          m: m
        })
      }
    }
    this.atomicNumbers.push(group)
    this.atomicNumbers.length
  }
}
