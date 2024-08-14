import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Gesture } from '@ionic/angular';
import { BasePage } from 'src/app/core/base.page';
import { ItemPage } from 'src/app/core/item.page';
import { SwiperOptions } from 'swiper';
import { Validators } from '@angular/forms';
import { ModalInstrumentComponent } from '../modal-instrument/modal-instrument.component';
import { ModalPickNoteComponent } from '../modal-pick-note/modal-pick-note.component';
import { PopoverNotesComponent } from '../popover-notes/popover-notes.component';

@Component({
  selector: 'app-song',
  templateUrl: './song.page.html',
  styleUrls: ['./song.page.scss'],
})
export class SongPage extends ItemPage {

  endPoint: string = this.settings.endPoints.songs;
  textRecipe: any = ``;

  swiperConfig: SwiperOptions = {
    slidesPerView: 2.5,
    spaceBetween: 5
  };
  swiperConfigNotes: SwiperOptions = {
    slidesPerView: 7,
    spaceBetween: 5
  };

   /* SEGMENT */
   segmentSong: string = 'song';
   segmentNotes: string = 'notes';
   segmentGeneral: string = 'general';
   segmentValue: string = this.segmentGeneral;

   config = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote'],
      [{ header: [2] }],
    ],
  };

  transposeTone;
  notesWithMinorIfDeclared = this.settings.notes;

  getFormNew() {
    return this.formBuilder.group({
      name: [null, Validators.required],
      author: [null, Validators.required],
      tone: [null, Validators.required],
      tag: [null, Validators.required],
      lyrics: [null],
      annotations: [[{name: 'General', annotation: [], selected: true}]],
      singers: [[{singer: '', note: ''}]],
      links: [[{name: '', link: ''}]],
    })
  }

  getFormEdit(item) {
    return this.formBuilder.group({
      id: [item.id],
      name: [item.name, Validators.required],
      author: [item.author],
      tone: [item.tone, Validators.required],
      tag: [item.tag, Validators.required],
      lyrics: [item.lyrics],
      annotations: [item.annotations],
      singers: [item.singers],
      links: [item.links],
    })
  }

  loadItemPost() {
    this.segmentValue = this.creating ? this.segmentGeneral : this.segmentSong;
    this.segments = this.item.annotations[0].annotation;
    this.selectAnnotation(0);
    this.transposeTone = this.form.value.tone;
    this.notesWithMinorIfDeclared = this.notesWithMinorIfDeclared.map(n => { return {
      ...n,
      extension: this.transposeTone?.extension
      }
    });
    this.segmentsOriginal = this.segments;
    console.log("item >>> ", this.item)
  }

  compareWithFn = (o1: any, o2: any) => {
    return o1 && o2 ? o1.name === o2.name && o1.grado === o2.grado && o1.extension === o2.extension : o1 === o2;
  }

  savePre(item): { [k: string]: any } {
    
    for (let key in item) {
      if (item[key] === '' || (Array.isArray(item[key]) && item[key].length === 0)) {
        delete item[key];
      } else if (Array.isArray(item[key])) {
        item[key] = item[key].filter(item => Object.values(item).some(value => value !== ''));
        if (item[key].length === 0) {
            delete item[key];
        }
      }
    } 

    return item;
  }

  savePost(item): void {
    this.pageService.navigateBack();
  }

  addOrRemoveSinger(index, remove) {
    if(!remove) {
      if(!this.form.value.singers[index].singer || !this.form.value.singers[index].note) return this.pageService.showError('Debes completar los campos necesarios');
      this.form.value.singers.push({singer: '', note: ''});
    } else {
      this.form.value.singers = this.form.value.singers.slice(0,index).concat(this.form.value.singers.slice(index+1));
      if(index == this.form.value.singers.length) this.form.value.singers.push({singer: '', note: ''});
    }
  }

  addOrRemoveLink(index, remove) {
    if(!remove) {
      if(!this.form.value.links[index].name || !this.form.value.links[index].link) return this.pageService.showError('Debes completar los campos necesarios');
      this.form.value.links.push({name: '', link: ''});
    } else {
      this.form.value.links = this.form.value.links.slice(0,index).concat(this.form.value.links.slice(index+1));
      if(index == this.form.value.links.length) this.form.value.links.push({name: '', link: ''});
    }
  }

  save(){
    this.textRecipe = `<div style="width: 683px">${this.textRecipe ? this.textRecipe : ''}</div>`;
  }

  async openModalInstrument(index=-1){
    const modal = await this.pageService.modalCtrl.create({
      component: ModalInstrumentComponent,
      cssClass: 'modal-instrument',
      componentProps: {annotationName: this.form.value.annotations[index]?.name || ''}
    })

    await modal.present();

    const dismiss = await modal.onDidDismiss();
    
    if (dismiss.data && dismiss.data.deleted) this.form.value.annotations.splice(index, 1);
    if (dismiss.data && dismiss.data.name) {
      if(index!=-1){
        this.form.value.annotations[index].name = dismiss.data.name;
        this.selectAnnotation(index);
      }else{
        this.form.value.annotations.push({
          name: dismiss.data.name,
          annotation: [],
          selected: true
        })
        this.selectAnnotation(this.form.value.annotations.length-1);
      }
    }
  }

  selectAnnotation(index) {
    this.form.value.annotations.forEach(a => a.selected = false);
    this.form.value.annotations[index].selected = true;
    this.segments = this.form.value.annotations[index].annotation || [];
    this.segmentsOriginal = this.segments;
  }

  segment = {
    label: '',
    notes: [['+']]
  }

  segments = [];
  segmentsOriginal = [];

  addOrEditSegment(index = -1) {
    
    if(this.segment.label == '') {
      this.pageService.showError('La parte que se quiere agregar no puede estar vacia')
      return;
    }
    if(index == -1) {
      this.segments[this.segments.length] = this.segment;
    } 
    // else {
    //   this.segment[index] = 
    // }

    this.segment = {
      label: '',
      notes: [['+']]
    }
  }

  deleteSegment(i) {
    this.segments.splice(i, 1);
  }

  async openModalPickNote(segmentIndex, rowIndex, noteIndex) {
    const modal = await this.pageService.modalCtrl.create({
      component: ModalPickNoteComponent,
      componentProps: {},
      cssClass: 'modal-pick-note',
      breakpoints: [0, 0.75],
      initialBreakpoint: 0.75,
    });

    modal.onDidDismiss().then((item) => {
      if (item && item.data) {
        this.segments[segmentIndex].notes[rowIndex][noteIndex] = item.data;
        if(this.segments[segmentIndex].notes[rowIndex].length -1 == noteIndex) this.segments[segmentIndex].notes[rowIndex].push('+');

        if(this.segments[segmentIndex].notes.length -1 == rowIndex){
          this.segments[segmentIndex].notes.push(['+']);
        }
      }
    });

    await modal.present();
  }

  tapEvent(e, note, segmentIndex, rowIndex, noteIndex){
    if(note == '+') return;
    this.openPopover(e, note, segmentIndex, rowIndex, noteIndex);
  }

  async openPopover(ev, note, segmentIndex, rowIndex, noteIndex){
    const popover = await this.pageService.popoverController.create({
      component: PopoverNotesComponent,
      cssClass: 'popover-notes',
      event: ev,
      side: 'top',
      showBackdrop: false,
      componentProps: {note}
    });

    popover.onDidDismiss().then((item) => {
      if (item && item.data && item.data == 'delete') {
        this.segments[segmentIndex].notes[rowIndex].splice(noteIndex, 1);
      }
    });

    await popover.present();
  }
  
  // 2. Crear una función que transporte una sola nota.
  transposeNote(note: any, difference) {

    if (note.grado === -1) return note; // Nota especial, no se transpone (ej: "//")

    // Encuentra el nuevo grado transpuesto
    let newGrado = note.grado + difference;

    // Asegurarse de que el nuevo grado esté dentro del rango (1-12)
    if (newGrado > 12) newGrado -= 12;
    if (newGrado < 1) newGrado += 12;

    // Encontrar la nueva nota en base al nuevo grado
    const transposedNote = this.settings.notes.find(n => n.grado === newGrado);
    console.log(">> ", transposedNote);
    // Retornar la nota transpuesta, manteniendo la extensión si la tiene
    return {
      ...transposedNote,
      extension: note.extension || ''
    };
  }

  transposeAnnotations() {
    // 1. Calcular la diferencia entre los grados de las tonalidades.
    const difference = this.transposeTone.grado - this.form.value.tone.grado;

    // 3. Transponer todas las anotaciones
    this.segments = this.segmentsOriginal.map(section => {
      return {
        label: section.label,
        notes: section.notes.map(line => {
          return line.map(note => {
            if (typeof note === 'string') return note; // Manejar elementos que no son notas (ej: "+")
            return this.transposeNote(note, difference);
          });
        })
      };
    });
  }
}
