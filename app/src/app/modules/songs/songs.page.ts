import { Component, OnInit } from '@angular/core';
import { ItemsPage } from 'src/app/core/items.page';

@Component({
  selector: 'app-songs',
  templateUrl: './songs.page.html',
  styleUrls: ['./songs.page.scss'],
})
export class SongsPage extends ItemsPage{
  endPoint: string = this.settings.endPoints.songs;

  goToSong(id){
    this.pageService.navigateRoute('song/watch/'+id);
  }

  goToCreateSong(){
    this.pageService.navigateRoute('song/edit/new')
  }

}
