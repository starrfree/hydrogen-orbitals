import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  @ViewChild('atom') public atomView!: ElementRef
  n: number = 1
  l: number = 0
  m: number = 0

  nText: string = ""
  lText: string = ""
  mText: string = ""
  error = false
  showAtom = true

  constructor() {}

  ngOnInit(): void {
    this.nText = `${this.n}`
    this.lText = `${this.l}`
    this.mText = `${this.m}`
  }

  blur() {
    (document.activeElement as HTMLElement).blur();
    window.onblur = function () {
      (document.activeElement as HTMLElement).blur();
    };
  }

  setOrbital() {
    var newN = +this.nText
    var newL = +this.lText
    var newM = +this.mText
    if (isNaN(newN) || isNaN(newL) || isNaN(newM)) {
      this.error = true
      return
    }

    if (newN >= 1 && newL >= 0 && newL < newN && newM <= newL && newM >= -newL) {
      this.error = false
      if (this.n != newN || this.l != newL || this.m != newM) {
        this.n = newN
        this.l = newL
        this.m = newM;
        (this.atomView as any).destroy()
        this.showAtom = false
        setTimeout(() => {this.showAtom = true}, 0)
      }
    } else {
      this.error = true
    }
  }
}
