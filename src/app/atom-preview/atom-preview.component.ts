import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { OrbitalRendererService } from '../orbital-renderer.service';

@Component({
  selector: 'app-atom-preview',
  templateUrl: './atom-preview.component.html',
  styleUrls: ['./atom-preview.component.css']
})
export class AtomPreviewComponent implements OnInit {
  @ViewChild('canvas') public canvas!: ElementRef
  @Input() n: number = 1
  @Input() l: number = 0
  @Input() m: number = 0

  get type(): string {
    var type = `${this.n}`
    if (this.l == 0) {
      type += 's'
    } else if (this.l == 1) {
      type += 'p'
    } else if (this.l == 2) {
      type += 'd'
    } else {
      if (this.l - 2 <= 19) {
        type += 'fghijklmnoqrtuvwxyz'[this.l - 3]
      } else {
        type += this.getAlphabeticalOrder(this.l - 2 + 7)
      }
    }
    return type
  }

  constructor(private orbitalRendererService: OrbitalRendererService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    const render = () => {this.render()}
    if (this.orbitalRendererService.didInit) {
      render()
    } else {
      this.orbitalRendererService.onInit.push(render)
    }
  }

  render() {
    setTimeout(() => {
      this.orbitalRendererService.render(this.canvas.nativeElement, this.n, this.l, this.m)
    }, 0);
  }

  getAlphabeticalOrder(num: number): string {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    let result = '';
    while (num > 0) {
      const remainder = (num - 1) % 26;
      result = alphabet[remainder] + result;
      num = Math.floor((num - 1) / 26);
    }
    return result;
  }
  
}

