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
}

