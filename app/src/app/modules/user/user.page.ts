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
  showPassword2: boolean;
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
    item.username = item.emailAddress;
    return item;
  }

  savePost(item): void {
    if (this.creating) this.pageService.navigateRoute('tabs/home', { key: 'prevent' });
    this.global.saveUser(item.data);
    this.pageService.showSuccess(this.creating ? 'Bienvenido!' : 'Actualizado con exito!');
  };

  getFormNew() {
    return this.formBuilder.group({
      fullName: [null, Validators.required],
      emailAddress: [null, Validators.compose([Validators.required, Validators.email])],
      password: [null, Validators.compose([Validators.minLength(4), Validators.required])],
      verifyPassword: [null, Validators.compose([Validators.minLength(4), Validators.required])],
    })
  }

  getFormEdit(item) {
    return this.formBuilder.group({
      id: [item.id],
      fullName: [item.fullName, Validators.required],
      emailAddress: [item.emailAddress, Validators.compose([Validators.required, Validators.email])],
      password: [item.password,Validators.compose([Validators.minLength(4), Validators.required])],
      verifyPassword: [item.password,Validators.compose([Validators.minLength(4), Validators.required])]
    })
  }

  savePreCheck(item) {
    console.log(">", item)
    if (item.password !== item.verifyPassword) {
      this.pageService.showError('Las contraseñas deben ser las mismas');
      return false;
    }
    return true;
  }

  async logout() {
    const isSure = await this.pageService.createAlertModal({
      title: 'Cerrar sesión',
      subtitle: '¿Está seguro que desea cerrar sesión?',
      actions: [
        {
          label: 'Cerrar sesión',
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
    
    this.formReset();
    this.pageService.logout();
  }

  goToAddress() {
    this.pageService.navigateRoute('address/' + true);
  }
}
