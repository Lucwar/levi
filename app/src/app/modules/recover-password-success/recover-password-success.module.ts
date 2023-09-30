import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RecoverPasswordSuccessPage } from './recover-password-success';

import { RecoverPasswordSuccessPageRoutingModule } from './recover-password-success-routing.module';

import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';

export function playerFactory() {
  return player
}


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    RecoverPasswordSuccessPageRoutingModule,
    LottieModule.forRoot({player:playerFactory})
  ],
  declarations: [RecoverPasswordSuccessPage]
})
export class RecoverPasswordSuccessPageModule {}
