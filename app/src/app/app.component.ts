import { Component } from '@angular/core';
import { PageService } from './core/services/page.service';
import { MenuController, Platform, LoadingController } from '@ionic/angular';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { Location } from '@angular/common';
import { environment } from './../environments/environment';
import { GlobalService } from './core/services/global.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  user: any;
  logged: any = false;
  filesUrl = environment.filesUrl + '/';

  loading: any;
  isLoading = false;
  isLoadingProcessing = false;

  constructor(
    public location: Location,
    public pageService: PageService,
    public platform: Platform,
    public splashScreen: SplashScreen,
    public statusBar: StatusBar,
    public menu: MenuController,
    public loadingController: LoadingController,
    public global: GlobalService
  ) {
    this.initializeApp();
  }

  ngOnInit() {
  }

  initializeApp() {

    this.pageService.global.checkUser();

    this.platform.ready().then(() => {

      this.pageService.appVersion.getVersionNumber()
        .then(res => this.pageService.global.settings.APP_VERSION = res)
        .catch(e => console.error(e));

      this.splashScreen.hide();

      this.pageService.global.getLoadingAsObservable().subscribe(async result => result ? await this.showLoading() : await this.hideLoading());

      this.pageService.global.checkUser();
      // this.pageService.initializeSocket();
      this.pageService.enablePush();
      this.handleDeepLinks();

      this.pageService.global.getUserAsObservable().subscribe((result) => {
        this.user = this.pageService.global.getUser();

        if (!this.user) this.logged = false;

        else {
          // if (!this.logged) this.pageService.socket.emit('handleUser', this.user.id);

          this.logged = true;
        }
      });

      this.pageService.network.onChange()?.subscribe(status => {
        // if (status === 'disconnected') this.pageService.navigateRoute('no-internet');
        this.pageService.zone.run(() => this.pageService.global.settings.networkConnection = status === 'connected');
      });
    });
  }

  handleDeepLinks() {
    this.pageService.deepLinks.route({ '/recover-password/user/:id/:recoverPasswordID': 'new-password' })
      .subscribe(match => this.pageService.zone.run(() => this.pageService.navigateRoute(`${match.$route}/${match.$args.id}/${match.$args.recoverPasswordID}`)))
  }

  async showLoading() {
    if (this.isLoading) return;

    this.isLoading = true;
    this.isLoadingProcessing = true;

    this.loading = await this.loadingController.create({ mode: 'ios' });

    await this.loading.present();

    this.isLoadingProcessing = false;
  }

  hideLoading() {
    if (this.isLoadingProcessing) return setTimeout(() => this.hideLoading(), 100);

    if (this.loading) this.loading.dismiss();

    this.isLoading = false;
  }

  logout() {
    this.pageService.global.removeUser();
    this.pageService.navigateRoute('/login');
  }

  handleClick(event, page: any) {
    this.menu.close();

    if (!page.disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    if (!page.click) return;
    this[page.click]();
  }
}
