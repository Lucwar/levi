import { Component, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/base.page';

@Component({
  selector: 'app-service',
  templateUrl: './service.page.html',
  styleUrls: ['./service.page.scss'],
})
export class ServicePage extends BasePage{

    /* SEGMENT */
    segmentSong: string = 'details';
    segmentNotes: string = 'employees';
    segmentValue: string = this.segmentSong;


    goToSong(){
      this.pageService.navigateRoute('song/view/1')
    }
}
