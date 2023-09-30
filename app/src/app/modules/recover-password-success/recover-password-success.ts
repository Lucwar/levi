import { Component } from '@angular/core';
import { BasePage } from 'src/app/core/base.page';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-recover-password-success',
  templateUrl: './recover-password-success.html',
  styleUrls: ['./recover-password-success.scss'],
})
export class RecoverPasswordSuccessPage extends BasePage {

  pageName = 'Contraseña recuperada con éxito';

  options: AnimationOptions = {
    path: 'assets/animations/email.json'
  }

}
