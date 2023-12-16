import { Component, NgZone, OnInit } from '@angular/core';
import { Form, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ItemPage } from 'src/app/core/item.page';
import { ItemsPage } from 'src/app/core/items.page';
import { PageService } from 'src/app/core/services/page.service';
import { ChangeDetectorRef } from '@angular/core';

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

  constructor(formBuilder: FormBuilder, pageService: PageService, activatedRoute: ActivatedRoute, public cdr: ChangeDetectorRef, public ngZone: NgZone){
    super(formBuilder, pageService, activatedRoute)
  }

  async ionViewWillEnter(): Promise<void> {
    this.activatedRoute.params.subscribe((params) => {
      this.actionType = params.action;
    });

    // if(this.actionType == 'edit' || this.actionType == 'watch'){
    //   this.songsArray = await this.item?.songs;
    // }
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
    console.log('Consola 1: ', this.songsArray)
    this.songsArray = [...await this.item.songs]; 
    console.log('Consola 2: ', this.songsArray)

    // Forzar una revisión de la jerarquía de componentes
    this.cdr.markForCheck();
    // Forzar una actualización de la vista dentro de la zona de Angular
  this.ngZone.run(() => {});
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

  handleTextSearch(): { [k: string]: any } {
    return this.textSearch
      ? { $or: [{ name: { $regex: this.textSearch, $options: 'i' } }] }
      : {};
  }

  async addSong(song){
    if(!this.songsArray.includes(song)){
      console.log('Array', this.songsArray)
      this.songsArray.push(song);
    }

    this.cdr.markForCheck()
    this.cdr.detectChanges();
  }

  removeSong(song){
    this.songsArray = this.songsArray.filter(function(item) {
      return item !== song;
    });
    console.log('Removidxa', this.songsArray)
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
      let index = this.listStorage.findIndex(obj => obj.id == this.form.value.id);

      if (index !== -1) {
        this.listStorage.splice(index, 1);
      }
      this.listStorage = this.listStorage.filter((obj) => {obj.id == this.form.value.id});
      this.pageService.navigateBack();
      this.pageService.showSuccess('Eliminado con éxito');
    })
    .catch((e) => this.pageService.showError(e))
  }
}