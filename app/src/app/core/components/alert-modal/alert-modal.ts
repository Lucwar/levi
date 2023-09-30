import { Component } from '@angular/core';
import { BasePage } from 'src/app/core/base.page';

@Component({
  selector: 'app-alert-modal',
  templateUrl: './alert-modal.html',
  styleUrls: ['./alert-modal.scss'],
})
export class AlertModalPage extends BasePage {

  title: string;
  subtitle: string;
  showCloseButton: boolean;
  actions: AlertModalAction[];
  pageName = 'Alerta';

  close() {
    this.pageService.modalCtrl.dismiss();
  }

}
