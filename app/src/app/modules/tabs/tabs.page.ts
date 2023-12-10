import { Component, ViewChild } from '@angular/core';
import { IonTabs } from '@ionic/angular';
import { BasePage } from 'src/app/core/base.page';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage extends BasePage {

  @ViewChild('myTabs') tabs: IonTabs;
  tabSelected: any = '';

  setCurrentTab({ tab }) {
    this.tabSelected = tab;
  }

  ionViewWillEnter() {
    try {
      this.tabs.outlet.activatedView.ref.instance.ionViewWillEnter();
    } catch (e) {
      console.log(e);
    };
  }

}
