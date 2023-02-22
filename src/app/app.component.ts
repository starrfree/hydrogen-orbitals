import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'hydrogen-atom';
  
  atomicNumbers: {n: number, l: number, m: number}[] = []

  ngOnInit() {
    for(var n = 1; n <= 4; n++) {
      for(var l = 0; l < n; l++) {
        for(var m = 0; m <= l; m++) {
          this.atomicNumbers.push({
            n: n,
            l: l,
            m: m
          })
        }
      }
    }
  }
}
