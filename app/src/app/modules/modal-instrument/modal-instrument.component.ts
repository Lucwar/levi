import { Component, Input, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/base.page';

@Component({
  selector: 'app-modal-instrument',
  templateUrl: './modal-instrument.component.html',
  styleUrls: ['./modal-instrument.component.scss'],
})
export class ModalInstrumentComponent extends BasePage {

  @Input() annotationName: any;
  editing = false;

  ionViewWillEnter() {
    this.editing = this.annotationName.length != 0;
  }

  async acceptLabel(){
    if(this.annotationName.trim() == '') return this.pageService.showError('No puedes guardar algo vacio');
    this.pageService.modalCtrl.dismiss({name: this.annotationName});
  }

  closeModal(deleted = false){
    this.pageService.modalCtrl.dismiss({deleted})
  }

}
