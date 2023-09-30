import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AlertModalPage } from './alert-modal';

const routes: Routes = [
  {
    path: '',
    component: AlertModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlertModalPageRoutingModule {}
