import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SongPageRoutingModule } from './song-routing.module';

import { SongPage } from './song.page';
import { SwiperModule } from 'swiper/angular';
import { QuillModule } from 'ngx-quill';
import { HammerModule } from '@angular/platform-browser';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SongPageRoutingModule,
    SwiperModule,
    ReactiveFormsModule,
    QuillModule,
  ],
  declarations: [SongPage]
})
export class SongPageModule {}
