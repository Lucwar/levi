import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/base.page';
import { MapBasePage } from 'src/app/core/map-base.page';

@Component({
  selector: 'app-store',
  templateUrl: './store.page.html',
  styleUrls: ['./store.page.scss'],
})
export class StorePage extends MapBasePage {

  endPoint: string = this.settings.endPoints.construya;

  getFormNew() {
    return this.formBuilder.group({
      month: [null, Validators.compose([Validators.min(1), Validators.max(12), Validators.required])],
      year: [null, Validators.required],
      seasonallyAdjustedIndex: [null, Validators.required],
      monthlyVariation: [null, Validators.compose([Validators.min(-100), Validators.max(100), Validators.required])],
    });
  }

  getFormEdit(item) {
    return this.formBuilder.group({
      id: [item.id],
      month: [item.month, Validators.compose([Validators.min(1), Validators.max(12), Validators.required])],
      year: [item.year, Validators.required],
      seasonallyAdjustedIndex: [item.seasonallyAdjustedIndex, Validators.required],
      monthlyVariation: [item.monthlyVariation, Validators.compose([Validators.min(-100), Validators.max(100), Validators.required])],
    });
  }
  
  onChangeSearchLocation() {

    if (this.address.address.trim()) return;

    this.address.location = { coordinates: [0, 0], type: 'Point' };
  }

  goToBooking() {
    this.pageService.navigateRoute('booking');
  }

}
