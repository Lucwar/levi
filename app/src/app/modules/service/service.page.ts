import { Component, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/base.page';
import { ItemPage } from 'src/app/core/item.page';

@Component({
  selector: 'app-service',
  templateUrl: './service.page.html',
  styleUrls: ['./service.page.scss'],
})
export class ServicePage extends ItemPage{

  endPoint: string;
  dateFrom;

    goToSong(){
      this.pageService.navigateRoute('song/view/1')
    }
}
