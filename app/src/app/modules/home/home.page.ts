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
    this.getLastDataAvailable();
  }

  getLastDataAvailable() {
    const endPoint = this.settings.endPoints.rates + this.settings.endPointsMethods.rates.lastDataAvailable;

    this.pageService.httpGet(endPoint)
      .then(res => this.data = res.data)
      .catch(e => this.pageService.showError(e));
  }

  goToDetail() {
    this.pageService.navigateRoute('service');
  }

}
