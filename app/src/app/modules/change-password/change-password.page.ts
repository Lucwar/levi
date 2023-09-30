import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormPage } from 'src/app/core/form.page';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage extends FormPage {

  pageName = 'Cambiar contraseña';

  getFormNew() {
    return this.formBuilder.group({
      password: [null, Validators.required],
      passwordNew: [null, Validators.compose([Validators.required, Validators.minLength(4)])],
      passwordNewVerify: [null, Validators.compose([Validators.required, Validators.minLength(4)])],
    });
  }

  onSubmitPerform(item) {
    this.changePassword(item);
  }

  changePassword(item) {
    let endPoint = this.pageService.global.settings.endPoints.users + '/' + this.user.id + this.pageService.global.settings.endPointsMethods.users.changePassword;
    this.pageService.httpPut(endPoint, { body: item })
      .then((response) => {
        this.pageService.showSuccess('Contraseña actualizada!');
        this.pageService.navigateBack();
        this.form.reset();
      })
      .catch((reason) => {
        this.pageService.showError(reason);
        console.log(reason);
      });
  }


}
