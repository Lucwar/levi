import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormPage } from 'src/app/core/form.page';
import { mailFormat } from 'src/app/core/forms/validators/mailFormat';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage extends FormPage implements OnInit {

  showPassword: boolean;

  getFormNew() {
    return this.formBuilder.group({
      username: [null, Validators.compose([Validators.required, mailFormat()])],
      password: [null, Validators.required],
    });
  }

  onSubmitPerform(item) {
    const endPoint = this.settings.endPoints.users + this.settings.endPointsMethods.users.login;

    this.pageService.httpPost(endPoint, item).then((res: any) => {
      this.global.saveUser(res.data);
      this.onSubmitPerformComplete(res.data);
    })
      .catch((reason) => {
        this.pageService.showError(reason);
        console.log(reason)
      });
  }

  onSubmitPerformComplete(user: any) {
    this.pageService.showSuccess('Bienvenido!');
    const route = (!user.firstName || !user.lastName) ? ('user/' + user.id) : 'tabs/home';
    this.pageService.navigateRoute(route);
    this.form.reset();
  }

  goToRecoverPassword() {
    this.pageService.navigateRoute("recover-password");
  }

  goToUser() {
    this.pageService.navigateRoute('register/new');
  }

  goToHome() {
    this.pageService.navigateRoute('tabs/home');
  }

}
