import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListGroupPageRoutingModule } from './list-group-routing.module';

import { ListGroupPage } from './list-group.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListGroupPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ListGroupPage]
})
export class ListGroupPageModule {}
