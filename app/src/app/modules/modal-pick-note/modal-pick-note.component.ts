import { Component, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/base.page';
import { PopoverNotesComponent } from '../popover-notes/popover-notes.component';

@Component({
  selector: 'app-modal-pick-note',
  templateUrl: './modal-pick-note.component.html',
  styleUrls: ['./modal-pick-note.component.scss'],
})
export class ModalPickNoteComponent extends BasePage {
  pageName: string;

  ngOnInit() {}

  closeModal() {
    this.pageService.modalCtrl.dismiss();
  }
  
  pick(value) {
    this.pageService.modalCtrl.dismiss(value);
  }

  tapEvent(e, note){
    console.log("tapEvent >> ", e);
    this.openPopover(e, note)
  }

  async openPopover(ev, note){
    const popover = await this.pageService.popoverController.create({
      component: PopoverNotesComponent,
      cssClass: 'popover-notes',
      event: ev,
      side: 'top',
      showBackdrop: false,
      componentProps: {note}
    });

    popover.onDidDismiss().then((item) => {
      if (item && item.data) {
        console.log(">>> ", item.data); 
        this.pick(item.data);
      }
    });

    await popover.present();
  }

}
