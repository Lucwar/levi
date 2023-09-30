import { Component } from '@angular/core';
import { BasePage } from 'src/app/core/base.page';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-success',
  templateUrl: './success.page.html',
  styleUrls: ['./success.page.scss'],
})
export class SuccessPage extends BasePage {

  data: any = {};

  options: AnimationOptions = {
    path: 'assets/animations/success.json'
  }

  ionViewWillEnter() {
    this.getLastDataAvailable();
  }

  getLastDataAvailable() {
    const endPoint = this.settings.endPoints.rates + this.settings.endPointsMethods.rates.lastDataAvailable;

    this.pageService.httpGet(endPoint)
      .then(res => this.data = res.data)
      .catch(e => this.pageService.showError(e));
  }

  goToHome() {
    this.pageService.navigateRoute('tabs/home');
  }

}
