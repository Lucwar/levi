import { Component } from '@angular/core';
import { FormPage } from '../../core/form.page';
import { mailFormat } from 'src/app/core/forms/validators/mailFormat';
import { Validators } from '@angular/forms';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.page.html',
  styleUrls: ['./recover-password.page.scss'],
})
export class RecoverPasswordPage extends FormPage {

  pageName = 'Recuperar contraseña';
  loading = false;

  options: AnimationOptions = {
    path: 'assets/animations/locked.json'
  }

  getFormNew() {
    return this.formBuilder.group({
      emailAddress: [null, Validators.compose([Validators.required, mailFormat()])],
    });
  }

  onSubmitPerform(item) {
    const endPoint = this.settings.endPoints.users + this.settings.endPointsMethods.users.recoverPassword;

    this.loading = true;

    this.pageService.httpPost(endPoint, item, { loader: false })
      .then(res => this.pageService.navigateRoute('recover-password-success'))
      .catch(e => this.pageService.showError(e))
      .finally(() => this.loading = false);
  }

}
