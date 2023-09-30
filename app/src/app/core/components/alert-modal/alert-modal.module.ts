import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AlertModalPageRoutingModule } from './alert-modal-routing.module';

import { AlertModalPage } from './alert-modal';
import { PipesModule } from 'src/app/core/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AlertModalPageRoutingModule,
    PipesModule
  ],
  declarations: [
    // AlertModalPage
  ]
})
export class AlertModalPageModule {}
