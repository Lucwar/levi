import { Component, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/base.page';
import { SwiperOptions } from 'swiper';

@Component({
  selector: 'app-song',
  templateUrl: './song.page.html',
  styleUrls: ['./song.page.scss'],
})
export class SongPage extends BasePage {

  swiperConfig: SwiperOptions = {
    slidesPerView: 2.5,
    spaceBetween: 5
  };


   /* SEGMENT */
   segmentSong: string = 'details';
   segmentNotes: string = 'employees';
   segmentValue: string = this.segmentSong;

}
