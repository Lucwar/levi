import { Component } from '@angular/core';
import { ItemsPage } from 'src/app/core/items.page';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage extends ItemsPage {

  endPoint: string = this.settings.endPoints.lists;
  sortAsc: any = 0;

  initializePre(): void {
    this.global.remove(this.settings.storage.listGroups);
  }
  
  goToDetail() {
    this.pageService.navigateRoute('service');
  }

  getParams(): Partial<EndPointParams> {
    const filters = { ...this.handleTextSearch() };
    const populates = ['user', 'listGroups'];
    let sort: { [key: string]: number } = { dateTo: 1 };
    
    if (this.sortAsc != 0 && this.sortAsc != 2) {
      sort = { name: this.sortAsc };
    } else {
      sort = { dateTo: this.sortAsc == 0 ? 1 : -1};
    }

    return { filters, populates, sort };
  }

  sortSongs(){
    this.sortAsc++;
    if (this.sortAsc > 2) {
      this.sortAsc = -1;
    }

    this.getItems();
  }

  countSongs(list){
    return list.reduce((sum, group) => sum + group.songs.length, 0);
  }

}
