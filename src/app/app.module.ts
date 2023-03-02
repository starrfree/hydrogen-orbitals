import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { InfiniteScrollModule } from "ngx-infinite-scroll";

import { AppComponent } from './app.component';
import { AtomComponent } from './atom/atom.component';
import { AtomPreviewComponent } from './atom-preview/atom-preview.component';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { OrbitalsListComponent } from './orbitals-list/orbitals-list.component';
import { AtomViewComponent } from './atom-view/atom-view.component';
import { SearchComponent } from './search/search.component';

@NgModule({
  declarations: [
    AppComponent,
    AtomComponent,
    AtomPreviewComponent,
    OrbitalsListComponent,
    AtomViewComponent,
    SearchComponent
  ],
  imports: [
    BrowserModule,
    InfiniteScrollModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
