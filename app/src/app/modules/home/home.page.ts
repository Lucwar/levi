import { Component } from '@angular/core';
import { BasePage } from 'src/app/core/base.page';
import { SwiperOptions } from 'swiper';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage extends BasePage {

  data: any = {};
  swiperConfig: SwiperOptions = {
    slidesPerView: 2.5,
    spaceBetween: 5
  };

  ionViewWillEnter() {
  }

  goToDetail() {
    this.pageService.navigateRoute('service');
  }

}
