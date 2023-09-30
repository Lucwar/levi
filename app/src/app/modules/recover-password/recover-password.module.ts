import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecoverPasswordPageRoutingModule } from './recover-password-routing.module';

import { RecoverPasswordPage } from './recover-password.page';
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';

export function playerFactory() {
  return player
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RecoverPasswordPageRoutingModule,
    LottieModule.forRoot({player:playerFactory})
  ],
  declarations: [RecoverPasswordPage]
})
export class RecoverPasswordPageModule {}
