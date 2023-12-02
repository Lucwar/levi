import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListGroupPage } from './list-group.page';

const routes: Routes = [
  {
    path: '',
    component: ListGroupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListGroupPageRoutingModule {}
