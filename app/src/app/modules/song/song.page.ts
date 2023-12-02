import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Gesture } from '@ionic/angular';
import { BasePage } from 'src/app/core/base.page';
import { ItemPage } from 'src/app/core/item.page';
import { SwiperOptions } from 'swiper';
import { PopoverNotesComponent } from '../popover-notes/popover-notes.component';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-song',
  templateUrl: './song.page.html',
  styleUrls: ['./song.page.scss'],
})
export class SongPage extends ItemPage {

  endPoint: string = '';
  textRecipe: any = `VERSO1:
  Antes de hablar cantaste sobre mí
  Has sido tan buen para mí
  Antes de respirar soplaste vida en mí
  Has sido tan bueno para mí
  CORO:
  Oh tu amor me envuelve me sostiene
  Amor sin condición
  Me persigue y deja las noventa y nueve
  Y va por mí
  No puedo ganarlo ni merecerlo
  Tu amor se entregó por mí
  Oh tu amor me envuelve Me sostiene
  Amor sin condición
  VERSO 2:
  Aun lejos de ti, tu amor luchó por mí
  Has sido tan bueno para mí
  Cuando no vi mi valor te entregaste por mí
  Has sido tan bueno para mí
  PUENTE:
  //No hay sombra
  que no alumbres
  Monte que no escales
  Para encontrarme a mí`;

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

  getFormNew() {
    return this.formBuilder.group({
      name: [null, Validators.required],
      author: [null, Validators.required],
      tone: [null, Validators.required],
      lyrics: [null],
      annotations: [null],
      singers: [null],
      links: [null],
    })
  }

  getFormEdit(item) {
    return this.formBuilder.group({
      id: [item.id],
      name: [item.name, Validators.required],
      author: [item.author],
      tone: [item.tone, Validators.required],
      lyrics: [item.lyrics],
      annotations: [item.annotations],
      singers: [item.singers],
      links: [item.links],
    })
  }

  save(){
    this.textRecipe = `<div style="width: 683px">${this.textRecipe ? this.textRecipe : ''}</div>`;
  }
 
  press(e){
    console.log('HOLD', e)
  }
  touchend(){
    console.log('TOUCHEND')
  }
  tap = 0;
  tapEvent(e){
    console.log(e);
    this.openPopover(e)
    this.tap++;
  }

  async openPopover(ev){
    const popover = this.pageService.popoverController.create({
      component: PopoverNotesComponent,
      cssClass: 'popover-notes',
      event: ev,
      side: 'top',
      showBackdrop: false
    });

    (await popover).present();

  }

//   @ViewChild('paragraph') p: ElementRef;

// ionViewWillEnter() {
//   const gesture = this.pageService.gestureCtrl.create({
//     el: this.rectangle.nativeElement,
//    [Hammer.press]: (detail) => { this.onMove(detail); }
//   })

//   gesture.enable();
// }

// private onHold(detail) {
//   console.log('HOLDDDDD')
// }

    // el: HTMLElement;
    // pressGesture: Gesture;

    // ionViewWillEnter() {
    //   this.pressGesture = this.pageService.gestureCtrl.create( () = this.el, {
    //     recognizers: [
    //       [Hammer.Press, {time: 6000}] // Should be pressed for 6 seconds
    //     ]
    //   });
    //   this.pressGesture.listen();
    //   this.pressGesture.on('press', e => {
    //     // Here you could also emit a value and subscribe to it
    //     // in the component that hosts the element with the directive
    //     console.log('pressed!!');
    //   });
    // }
    // ngOnDestroy() {
    //   this.pressGesture.destroy();
    // }
}
