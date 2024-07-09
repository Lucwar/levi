import { Component, Input, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/base.page';

@Component({
  selector: 'app-popover-notes',
  templateUrl: './popover-notes.component.html',
  styleUrls: ['./popover-notes.component.scss'],
})
export class PopoverNotesComponent extends BasePage {

  @Input() note: any;

}
