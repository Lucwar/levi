import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { ItemPage } from 'src/app/core/item.page';

@Component({
  selector: 'app-list-group',
  templateUrl: './list-group.page.html',
  styleUrls: ['./list-group.page.scss'],
})
export class ListGroupPage extends ItemPage {

  endPoint: string = this.settings.endPoints.listGroups;
  songs;
  songsArray = [];
  textSearch: String;
  listStorage: any;
  actionType;

  async ionViewWillEnter(): Promise<void> {
    this.activatedRoute.params.subscribe((params) => {
      this.actionType = params.action;
    });
  }

  initializePre() {
    this.getSongs()
  }

  getFormNew() {
    return this.formBuilder.group({
      name: [null, Validators.required],
      songs: [null],
    });
  }

  getFormEdit(item) {
    return this.formBuilder.group({
      id: [item.id],
      name: [item.name, Validators.required],
      songs: [item.songs],
    });
  }

  async loadItemPost() {
    this.songsArray = [...await this.item.songs]; 
  }

  getPopulates(): any[] {
    return ['songs']
  }

  savePre(item): { [k: string]: any } {
    this.form.value.songs = this.songsArray.map(item => item.id);

    return item;
  }
  
  savePost(item): void {
    if(this.creating){
      this.pageService.showSuccess('Creado con éxito');
    }else{
      this.pageService.showSuccess('Guardado con éxito');
    }

    this.listStorage = this.global.get(this.settings.storage.listGroups) || [];
    item.data.songs = this.songsArray;
    let existingIndex = this.listStorage.findIndex(obj => obj.id == this.form.value.id);
    if (existingIndex != -1) {
      this.listStorage[existingIndex] = item.data;
    } else {
      this.listStorage.push(item.data);
    }
    this.global.save(this.settings.storage.listGroups, this.listStorage);
    
    this.pageService.navigateBack()
  }

  async getSongs(){
    const endPoint = this.settings.endPoints.songs;
    let params = {
      filters: this.handleTextSearch()
    }
    await this.pageService.httpGetAll(endPoint, params)
    .then((res) => {
      this.songs = res.data;
    })
    .catch(e => this.pageService.showError(e))
  }

  isSelected(song){
    return this.songsArray.some(s => s.id == song.id)
  }

  handleTextSearch(): { [k: string]: any } {
    return this.textSearch
      ? { $or: [{ name: { $regex: this.textSearch, $options: 'i' } }] }
      : {};
  }

  async addSong(song){
    if(!this.songsArray.includes(song)){
      this.songsArray.push(song);
    }
  }

  removeSong(song){
    console.log('Eliminated')
    this.songsArray = this.songsArray.filter(function(item) {
      return item.id !== song.id;
    });
    console.log('Arraysong final: ', this.songsArray)
  }

  async deleteListGroup(){
    const isSure = await this.pageService.createAlertModal({
      title: 'Eliminar grupo',
      subtitle: '¿Está seguro que desea eliminar esto?',
      actions: [
        {
          label: 'Eliminar',
          handler: () => this.pageService.modalCtrl.dismiss(true),
          class: 'btn-orange orange-gradient',
        },
        {
          label: 'Cancelar',
          handler: () => this.pageService.modalCtrl.dismiss(false),
        },
      ],
    });
    
    if (!isSure) return;

    const endPoint = this.settings.endPoints.listGroups + '/' + this.form.value.id;
    this.pageService.httpDelete(endPoint)
    .then(() => {
      this.listStorage = this.global.get(this.settings.storage.listGroups);
      if(this.listStorage){
        let index = this.listStorage.findIndex(obj => obj.id == this.form.value.id);

        if (index !== -1) {
          this.listStorage.splice(index, 1);
        }
        this.listStorage = this.listStorage.filter((obj) => {obj.id == this.form.value.id});
      }
      this.pageService.navigateBack();
      this.pageService.showSuccess('Eliminado con éxito');
    })
    .catch((e) => this.pageService.showError(e))
  }
}