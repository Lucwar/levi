import { Component, Input, OnInit } from '@angular/core';
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
      await this.pageService.popoverController.dismiss(this.note);
    } catch (error) {
      console.error("Error closing popover:", error);
    }
  }
  deleteNote(){
    this.pageService.popoverController.dismiss('delete');
  }
}
