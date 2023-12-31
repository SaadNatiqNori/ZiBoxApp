import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchResultPage } from './search-result.page';

const routes: Routes = [
  {
    path: ':search',
    component: SearchResultPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchResultPageRoutingModule {}
