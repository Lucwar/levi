import { Component } from '@angular/core';
import { BasePage } from 'src/app/core/base.page';
import { SwiperOptions } from 'swiper';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.page.html',
  styleUrls: ['./booking.page.scss'],
})
export class BookingPage extends BasePage {

  data: any = {};

  ionViewWillEnter() {
    this.getLastDataAvailable();
  }

  getLastDataAvailable() {
    const endPoint = this.settings.endPoints.rates + this.settings.endPointsMethods.rates.lastDataAvailable;

    this.pageService.httpGet(endPoint)
      .then(res => this.data = res.data)
      .catch(e => this.pageService.showError(e));
  }

  goToSuccess() {
    this.pageService.navigateRoute('success');
  }

}
