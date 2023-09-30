import { Component } from '@angular/core';
import { BasePage } from 'src/app/core/base.page';
import * as moment from 'moment';

@Component({
  selector: 'app-filter-popover',
  templateUrl: './filter-popover.page.html',
  styleUrls: ['./filter-popover.page.scss'],
})
export class FilterPopoverPage extends BasePage {

  elements: PopoverElement[];
  maxYear = moment().add(2, 'year').format("YYYY-MM-DD");
  filters: { [k: string]: any } = {};
  pageName = 'FilterPopoverPage';

  close() {
    this.pageService.popoverController.dismiss();
  }

  filter() {

    for (const [key, value] of Object.entries(this.filters)) {

      const element = this.elements.find(element => element.key === key);

      if (element.itemType === 'dateTime') {
        if (key === 'since') this.filters[key] = moment(value).startOf('day').format('YYYY-MM-DD');
        if (key === 'until') this.filters[key] = moment(value).endOf('day').format('YYYY-MM-DD');
      }
    }

    this.pageService.popoverController.dismiss(this.filters);
  }

  handleCheck(element: PopoverElement) {

    if (!this.filters[element.key]) this.filters[element.key] = [];

    const index = this.filters[element.key].indexOf(element.value);

    index === -1
      ? this.filters[element.key].push(element.value)
      : this.filters[element.key].splice(index, 1);
  }

  handleClick(element: PopoverElement) {

    if (element.itemType !== 'label') return;

    this.filters[element.key] = element.value;
    this.filter();
  }

}