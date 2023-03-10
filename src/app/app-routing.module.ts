import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AtomViewComponent } from './atom-view/atom-view.component';
import { OrbitalsListComponent } from './orbitals-list/orbitals-list.component';
import { SearchComponent } from './search/search.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: OrbitalsListComponent },
  { path: 'orbital', component: AtomViewComponent },
  { path: 'search', component: SearchComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }