import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { InfiniteScrollModule } from "ngx-infinite-scroll";

import { AppComponent } from './app.component';
import { AtomComponent } from './atom/atom.component';
import { AtomPreviewComponent } from './atom-preview/atom-preview.component';

@NgModule({
  declarations: [
    AppComponent,
    AtomComponent,
    AtomPreviewComponent
  ],
  imports: [
    BrowserModule,
    InfiniteScrollModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
