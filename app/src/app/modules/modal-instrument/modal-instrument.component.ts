import { Component, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/base.page';

@Component({
  selector: 'app-modal-instrument',
  templateUrl: './modal-instrument.component.html',
  styleUrls: ['./modal-instrument.component.scss'],
})
export class ModalInstrumentComponent extends BasePage {

  closeModal(){
    this.pageService.modalCtrl.dismiss()
  }

}
