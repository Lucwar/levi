import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/base.page';
import { ItemPage } from 'src/app/core/item.page';

@Component({
  selector: 'app-service',
  templateUrl: './service.page.html',
  styleUrls: ['./service.page.scss'],
})
export class ServicePage extends ItemPage {

  endPoint: string = this.settings.endPoints.lists;
  // dateTo;

  songsArray = [];
  textSearch: String;
  listGroups: any = [];
  listGroupsStorage: any = [];
  actionType;

  async ionViewWillEnter(): Promise<void> {
    this.activatedRoute.params.subscribe((params) => {
      this.actionType = params.action;
    });

    this.listGroupsStorage = await this.global.get(this.settings.storage.listGroups);
    if(this.creating){
      this.form.value.listGroups = await this.listGroupsStorage;
      // console.log('Creo/edito y tomo del localstorage', this.form.value)
    }
  }

  async ionViewWillLeave(): Promise<void> {
    // this.global.remove(this.settings.storage.listGroups);
  }

  loadItemPost() {
    if(this.actionType == 'edit' || this.actionType == 'watch'){
      this.listGroups = this.form.value.listGroups;
    }
  }

  getFormNew() {
    return this.formBuilder.group({
      name: [null, Validators.required],
      dateTo: [null, Validators.required],
      user: [this.global.user.id],
      listGroups: [null]
    });
  }

  getFormEdit(item) {
    return this.formBuilder.group({
      id: [item.id],
      name: [item.name, Validators.required],
      dateTo: [item.dateTo, Validators.required],
      listGroups: [item.listGroups, Validators.required],
    });
  }

  savePre(item): { [k: string]: any } {
    this.form.value.listGroups = this.listGroups.map(item => item.id);
    
    return item;
  }

  getPopulates(): any[] {
    return [{ path: 'listGroups', populate: 'songs'}]
  }
  
  savePost(item): void {
    if(this.creating){
      this.pageService.showSuccess('Creado con éxito');
    }else{
      this.pageService.showSuccess('Guardado con éxito');
    }

    this.global.remove(this.settings.storage.listGroups)
    this.pageService.navigateRoute('tabs/home')
  }


  handleTextSearch(): { [k: string]: any } {
    return this.textSearch
      ? { $or: [{ name: { $regex: this.textSearch, $options: 'i' } }] }
      : {};
  }

  goToSong(id){
    this.pageService.navigateRoute('song/watch/' + id)
  }
}
