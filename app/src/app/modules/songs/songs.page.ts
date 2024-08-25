import { Component} from '@angular/core';
import { ItemsPage } from 'src/app/core/items.page';

@Component({
  selector: 'app-songs',
  templateUrl: './songs.page.html',
  styleUrls: ['./songs.page.scss'],
})
export class SongsPage extends ItemsPage{
  endPoint: string = this.settings.endPoints.songs;
  sortAsc: any = 0;

  goToSong(id){
    this.pageService.navigateRoute('song/watch/'+id);
  }

  goToCreateSong(){
    this.pageService.navigateRoute('song/edit/new')
  }

  getParams(): Partial<EndPointParams> {
    const filters = { ...this.handleTextSearch() };
    const populates = [];
    let sort: { [key: string]: number } = { createdAt: -1};
    
    if (this.sortAsc != 0 && this.sortAsc != 2) {
      sort = { name: this.sortAsc };
    } else {
      sort = { createdAt: this.sortAsc == 0 ? -1 : 1};
    }

    return { filters, populates, sort };
  }

  handleTextSearch(): { [k: string]: any } {
    return this.textSearch
      ? { $or: [{ name: { $regex: this.textSearch, $options: 'i' } }, { author: { $regex: this.textSearch, $options: 'i' } }] }
      : {};
  }

  sortSongs(){
    this.sortAsc++;
    if (this.sortAsc > 2) {
      this.sortAsc = -1;
    }

    this.getItems();
  }

}
