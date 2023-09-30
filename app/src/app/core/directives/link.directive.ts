import { Directive, HostListener } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Directive({
  selector: '[appLink]'
})

export class LinkDirective {

  @HostListener('click', ['$event']) handleClick(event) {
    
    event.preventDefault();
    
    if (event.target.tagName === 'A') this.openLink(event.target.href);
    else if (event.target.parentElement.tagName === 'A') this.openLink(event.target.parentElement.href);
  }


  constructor(
    private iab: InAppBrowser
  ) {
  }

  openLink(url: string) {
    const browser = this.iab.create(url, "_blank");
    browser.show();
  }
}
