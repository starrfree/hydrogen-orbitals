import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AtomComponent } from '../atom/atom.component';

@Component({
  selector: 'app-atom-view',
  templateUrl: './atom-view.component.html',
  styleUrls: ['./atom-view.component.css']
})
export class AtomViewComponent implements OnInit {
  @ViewChild('atom') public atomView?: ElementRef
  n: number = 1
  l: number = 0
  m: number = 0
  preview: boolean = false
  allowPhiControl: boolean = true
  phiSection: number = 0.8
  autoRotate: boolean = false
  interaction: boolean = true

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe((map: any) => {
      var urlParams = map.params
      var n = this.n
      if (urlParams['n']) {
        n = +urlParams['n']
      }
      var l = this.l
      if (urlParams['l']) {
        l = +urlParams['l']
      }
      var m = this.m
      if (urlParams['m']) {
        m = +urlParams['m']
      }
      if (urlParams['preview']) {
        this.preview = urlParams['preview'] != 'false'
      }
      if (urlParams['autoRotate']) {
        this.autoRotate = urlParams['autoRotate'] == 'true'
      }
      if (urlParams['autorotate']) {
        this.autoRotate = urlParams['autorotate'] == 'true'
      }
      if (urlParams['slicecontrol']) {
        this.allowPhiControl = urlParams['slicecontrol'] != 'false'
      }
      if (urlParams['sliceControl']) {
        this.allowPhiControl = urlParams['sliceControl'] != 'false'
      }
      if (urlParams['interaction']) {
        this.interaction = urlParams['interaction'] != 'false'
      }
      var phiSection = this.phiSection
      if (urlParams['slice']) {
        phiSection = +urlParams['slice']
      }
      if (n >= 1 && l < n && m >= -l && m <= l) {
        this.n = n
        this.l = l
        this.m = Math.abs(m)
      }
      if (phiSection >= 0 && phiSection <= 1) {
        this.phiSection = phiSection
      }
      if (this.atomView != undefined) {
        (this.atomView as any).redraw()
      }
    })
  }

  ngAfterViewInit() {
    (this.atomView as any).redraw()
  }
}
