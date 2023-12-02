import { Component, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/base.page';

@Component({
  selector: 'app-songs',
  templateUrl: './songs.page.html',
  styleUrls: ['./songs.page.scss'],
})
export class SongsPage extends BasePage {

  goToSong(){
    this.pageService.navigateRoute('song/watch/1')
  }

  goToCreateSong(){
    this.pageService.navigateRoute('song/edit/new')
  }
}
