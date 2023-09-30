import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { MapBasePage } from 'src/app/core/map-base.page';

@Component({
  selector: 'app-address',
  templateUrl: './address.page.html',
  styleUrls: ['./address.page.scss'],
})
export class AddressPage extends MapBasePage {

  endPoint: string = this.settings.endPoints.construya;

  register: boolean;

  ionViewDidEnter() {
    this.activatedRoute.params.subscribe(params => {
      this.register = params.register;
    });
  }

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
}
