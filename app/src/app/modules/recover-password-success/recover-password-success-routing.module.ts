import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecoverPasswordSuccessPage } from './recover-password-success';

const routes: Routes = [
  {
    path: '',
    component: RecoverPasswordSuccessPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecoverPasswordSuccessPageRoutingModule {}
