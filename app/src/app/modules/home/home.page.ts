import { Component } from '@angular/core';
import { BasePage } from 'src/app/core/base.page';
import { ItemsPage } from 'src/app/core/items.page';
import { SwiperOptions } from 'swiper';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage extends ItemsPage {

  endPoint: string = this.settings.endPoints.lists;

  initializePre(): void {
    this.global.remove(this.settings.storage.listGroups);
  }
  
  goToDetail() {
    this.pageService.navigateRoute('service');
  }

  getParams(): Partial<EndPointParams> {
    const filters = { ...this.handleTextSearch() };
    const populates = ['user'];
    const sort = { dateTo: -1 };

    return { filters, populates, sort };
  }

}
