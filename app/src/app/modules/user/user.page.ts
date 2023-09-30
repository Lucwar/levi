import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import * as moment from 'moment';
import { ItemPage } from 'src/app/core/item.page';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})

export class UserPage extends ItemPage {

  endPoint = this.settings.endPoints.users;
  showPassword: boolean;
  profile: any;

  ionViewDidEnter() {
    this.activatedRoute.params.subscribe(params => {
      this.profile = params.id;
      console.log('profile', this.profile)
    });
  }

  getParamId() {
    return this.user?.id;
  }

  goToHome() {
    this.pageService.navigateRoute('tabs/home');
  }

  goToChangePassword() {
    this.pageService.navigateRoute('change-password');
  }

  savePre(item) {
    item.fullName = item.firstName + ' ' + item.lastName;
    return item;
  }

  savePost(item): void {
    if (!this.user.firstName) this.pageService.navigateRoute('tabs/home', { key: 'prevent' });
    this.global.saveUser({ ...item.data, refreshToken: null });
    this.pageService.showSuccess('Actualizado con exito!');
  };

  getFormNew() {
    return this.formBuilder.group({
      termsAndConditionsAccepted: [false, Validators.requiredTrue],
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      password: [null, Validators.required],
      picture: [null],
      gmt: [moment().format('Z')]
    })
  }

  getFormEdit(item) {
    return this.formBuilder.group({
      id: [item.id],
      termsAndConditionsAccepted: [!!item.firstName, Validators.requiredTrue],
      firstName: [item.firstName, Validators.required],
      lastName: [item.lastName, Validators.required],
      password: [item.password],
      gmt: [moment().format('Z')]
    })
  }

  handlePicture(field = 'picture') {
    this.pageService.showImageUpload({ image: this.getImage(this.form.value[field], 'default') })
      .then(res => {
        if (res?.data?.file) this.form.patchValue({ [field]: res.data.file });
      }).catch(e => this.pageService.showError(e));
  }

  async deleteAccount() {
    const title = '¿Está seguro que desea eliminar su cuenta?';

    if (!await this.isSure(title)) return;

    const endPoint = this.settings.endPoints.users + this.settings.endPointsMethods.users.deleteAccount;

    this.pageService.httpPut(endPoint)
      .then(res => this.pageService.logout())
      .catch(e => this.pageService.showError(e));
  }

  goToAddress() {
    this.pageService.navigateRoute('address/' + true);
  }
}
