import { Component, Input, OnInit, Output } from '@angular/core';
import { BasePage } from 'src/app/core/base.page';

@Component({
  selector: 'app-popover-notes',
  templateUrl: './popover-notes.component.html',
  styleUrls: ['./popover-notes.component.scss'],
})
export class PopoverNotesComponent extends BasePage {

  @Input() note: any;

  async pick(extension) {
    try {
      this.note['extension'] = extension;
      await this.pageService.modalCtrl.dismiss(this.note);
    } catch (error) {
      await this.pageService.popoverController.dismiss(this.note);
    }
  }
  deleteNote(){
    this.pageService.popoverController.dismiss('delete');
  }
}
