import { Directive, ElementRef, EventEmitter, Input, NgZone, Output } from '@angular/core';
import { GestureController } from '@ionic/angular';

@Directive({
  selector: '[appLongPress]'
})

export class LongPressDirective {

  @Output() onLongPress = new EventEmitter();
  @Output() onClick = new EventEmitter();
  @Input('delay') delay = 1000;
  
  action: any;
  longPressActive = false;
  
  constructor(
    private el: ElementRef,
    private gestureCtrl: GestureController,
    private zone: NgZone
  ) {
  }

  ngAfterViewInit() {
    this.loadLongPressOnElement();
  } 

	loadLongPressOnElement() {
		const gesture = this.gestureCtrl.create({
      el: this.el.nativeElement,
      threshold: 0,
      gestureName: 'long-press',          
      onStart: ev => {
        
        this.longPressActive = true;

        this.longPressAction();        
      },
      onEnd: ev => {

        if (this.longPressActive) this.zone.run(() => this.onClick.emit());

        this.longPressActive = false;
        
        if (this.action) clearInterval(this.action);
      }
		});
    
		gesture.enable(true);
	}
  
	private longPressAction() {
    
    if (this.action) clearInterval(this.action);
    
    this.action = setTimeout(() => this.zone.run(() => {
      
      if (!this.longPressActive) return;
            
      this.onLongPress.emit();
      this.longPressActive = false;

    }), this.delay);
	}

}
