import { Component, OnInit } from '@angular/core';
import { ItemsPage } from 'src/app/core/items.page';

@Component({
  selector: 'app-songs',
  templateUrl: './songs.page.html',
  styleUrls: ['./songs.page.scss'],
})
export class SongsPage extends ItemsPage{
  endPoint: string = this.settings.endPoints.songs;
  sortAsc: any = null;

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

    if (this.sortAsc != null) {
      sort = { name: this.sortAsc ? 1 : -1 };
    }

    return { filters, populates, sort };
  }

  handleTextSearch(): { [k: string]: any } {
    return this.textSearch
      ? { $or: [{ name: { $regex: this.textSearch, $options: 'i' } }, { author: { $regex: this.textSearch, $options: 'i' } }] }
      : {};
  }

  sortSongs(){
    this.sortAsc = !this.sortAsc;

    this.getItems()
  }

}
