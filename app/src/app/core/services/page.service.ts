import { Injectable, NgZone } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ModalController, ToastController, ActionSheetController, LoadingController, AlertController, PopoverController, ActionSheetOptions, GestureController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';;
import { HttpService } from './http.service';
import { GlobalService } from './global.service';
import { PickerController } from '@ionic/angular';
import { ToastButton } from '@ionic/core';
import { NotificationEventResponse, Push, PushObject, PushOptions, RegistrationEventResponse } from '@awesome-cordova-plugins/push/ngx';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { Device } from '@awesome-cordova-plugins/device/ngx';
import { Socket } from 'ngx-socket-io';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { Diagnostic } from '@awesome-cordova-plugins/diagnostic/ngx';
// import { TranslateService } from '@ngx-translate/core';
import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer/ngx';
import { Clipboard } from '@awesome-cordova-plugins/clipboard/ngx';
import { File, FileEntry, FileError } from '@awesome-cordova-plugins/file/ngx';
import { SpeechRecognition } from '@awesome-cordova-plugins/speech-recognition/ngx';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import domtoimage from 'dom-to-image';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { Deeplinks } from '@awesome-cordova-plugins/deeplinks/ngx';
import { AlertModalPage } from '../components/alert-modal/alert-modal';
import { MomentInput } from 'moment';
import * as moment from 'moment';
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';
import { Keyboard } from '@awesome-cordova-plugins/keyboard/ngx';
import { StreamingMedia } from '@awesome-cordova-plugins/streaming-media/ngx';
import { NativeAudio } from '@awesome-cordova-plugins/native-audio/ngx';
import { LocalNotifications } from '@awesome-cordova-plugins/local-notifications/ngx';

@Injectable({ providedIn: 'root' })
export class PageService {

  loading: any;
  moduleName = '';
  hideMenu: Boolean = false;
  devicePlatform: string = '';

  constructor(
    public activatedRoute: ActivatedRoute,
    public modalCtrl: ModalController,
    public geolocation: Geolocation,
    public camera: Camera,
    public network: Network,
    public keyboard: Keyboard,
    public loadingController: LoadingController,
    public actionSheetController: ActionSheetController,
    public platform: Platform,
    public global: GlobalService,
    public httpService: HttpService,
    public location: Location,
    public router: Router,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public popoverController: PopoverController,
    public zone: NgZone,
    public pickerCtrl: PickerController,
    public push: Push,
    public iab: InAppBrowser,
    public socket: Socket,
    public diagnostic: Diagnostic,
    public clipboard: Clipboard,
    public appVersion: AppVersion,
    public qrScanner: QRScanner,
    public photoViewer: PhotoViewer,
    public gestureCtrl: GestureController,
    // public translateService: TranslateService,
    public file: File,
    public speechRecognition: SpeechRecognition,
    public socialSharing: SocialSharing,
    public streamingMedia: StreamingMedia,
    public deepLinks: Deeplinks,
    public localNotifications: LocalNotifications,
    public nativeAudio: NativeAudio,
    public device: Device
  ) {
    this.platform.ready().then(() => {
      this.devicePlatform = this.device?.platform?.toLowerCase();
      this.global.devicePlatform = this.devicePlatform;
      console.log('PLATFORM IS: ' + this.devicePlatform);
    });
  }

  // (+) Navigation

  navigate(endPoint = '') {
    this.navigateRoute('/' + this.getModuleName() + endPoint);
  }

  navigateRoute(route: string, backButtonBehavior?: BackButtonBehavior, extra: NavigationExtras = {}) {
    if (backButtonBehavior) extra.state = { backButtonBehavior };
    this.router.navigate([route], extra);
  }

  navigateReplace(url: string, params = {}) {
    this.router.navigate([url, params], { skipLocationChange: true, replaceUrl: false });
  }

  navigateReplaceUrl(url: string, params = {}) {
    this.router.navigate([url, params], { skipLocationChange: false, replaceUrl: true });
  }

  navigateToHome(backButtonBehavior?: BackButtonBehavior) {
    this.navigateRoute('home', backButtonBehavior);
  }

  navigateBack() {
    this.location.back();
  }

  backToHome() {
    window.history.go((window.history.length - 1) * -1);
  }

  // (-) Navigation

  // (+) Module name

  getModuleName() {
    return this.location.path().split('/')[1];
  }

  // (-) Module name

  // (+) Http

  getHttpEndPoint() {
    return '/' + this.getModuleName();
  }

  httpGetAll(endPoint: string, params: Partial<EndPointParams> = {}): Promise<any> {
    return this.httpService.getAll(endPoint, { ...JSON.parse(JSON.stringify(this.httpService.defaultParams)), ...params });
  }

  httpGetOne(endPoint: string, params: Partial<EndPointParamsGETOne> = {}): Promise<any> {
    return this.httpService.getOne(endPoint, { ...JSON.parse(JSON.stringify(this.httpService.defaultParams)), ...params });
  }

  httpGet(endPoint: string, params: Partial<EndPointParams> = {}): Promise<any> {
    return this.httpService.get(endPoint, { ...JSON.parse(JSON.stringify(this.httpService.defaultParams)), ...params });
  }

  httpPut(endPoint: string, params: EndPointParamsBasic = {}): Promise<any> {
    return this.httpService.put(endPoint, { ...JSON.parse(JSON.stringify(this.httpService.baseParams)), ...params });
  }

  httpPost(endPoint: string, body: { [k: string]: any } = {}, params: Partial<EndPointParamsBasic> = {}): Promise<any> {
    return this.httpService.post(endPoint, { ...JSON.parse(JSON.stringify(this.httpService.baseParams)), ...{ ...params, body } });
  }

  httpDelete(endPoint: string, params: Partial<EndPointParamsBasic> = {}): Promise<any> {
    return this.httpService.delete(endPoint, { ...JSON.parse(JSON.stringify(this.httpService.baseParams)), ...params });
  }

  httpPatch(endPoint: string, params: Partial<EndPointParamsBasic> = {}): Promise<any> {
    return this.httpService.patch(endPoint, { ...JSON.parse(JSON.stringify(this.httpService.defaultParams)), ...params });
  }

  httpPostFormData(params: EndPointParamsFormData, endPoint?: string): Promise<any> {
    return this.httpService.postFormData(params, endPoint);
  }

  httpPostFileBase64(file, resolve, reject, showLoading = true): Promise<any> {
    return this.httpService.postFileBase64(file, resolve, reject, showLoading);
  }

  httpPostExternalUrl(params: EndPointParamsExternalURL): Promise<any> {
    return this.httpService.postExternalUrl(params);
  }

  // (-) Http


  refreshAccessToken(params: Partial<EndPointParams> = {}) {

    if (!this.global.getUser()) return;

    this.httpService.refreshToken().catch(e => console.error(e));
  }


  // (+) Map

  loadGoogleMapsLibrary(): Promise<any> {
    return new Promise((resolve, reject) => {

      if (window['google']) return resolve(window['google']);

      let element = document.createElement('script');
      element.id = 'google-maps-api-script';
      element.src = 'https://maps.googleapis.com/maps/api/js?key=' + this.global.settings.keys.googleMaps + '&libraries=places';
      element.type = 'text/javascript';

      element.onload = () => resolve(window['google']);
      element.onerror = error => reject();

      document.body.appendChild(element);
    });
  }

  getCurrentLocation(): Promise<{ lat: number, lng: number }> {
    return new Promise((resolve, reject) => this.geolocation.getCurrentPosition()
      .then(position => resolve({ lat: position.coords.latitude, lng: position.coords.longitude }))
      .catch(e => reject(e)));
  }

  openGoogleMaps(params: OpenGoogleMapsParams) {
    const types = {
      marker: `https://www.google.com/maps/search/?api=1&query=${params.lat},${params.lng}`,
      destination: `https://www.google.com/maps/dir/?api=1&destination=${params.lat},${params.lng}`
    };

    this.iab.create(types[params.type], '_system');
  }

  // (-) Map


  getCaseInsensitivityFilter(value: string, ignoreAccents: boolean = true) {
    let s: any = value;

    if (ignoreAccents) {
      s = s.toLowerCase();
      s = s.replace(/[aáàâäǎăāãåǻą]/g, '[a,á,à,â,ä,ǎ,ă,ā,ã,å,ǻ,ą,]');
      s = s.replace(/[eéèėêëěĕēęẹǝ]/g, '[e,é,è,ė,ê,ë,ě,ĕ,ē,ę,ẹ,ǝ,]');
      s = s.replace(/[iíìiîïǐĭīĩįị]/g, '[i,í,ì,i,î,ï,ǐ,ĭ,ī,ĩ,į,ị,]');
      s = s.replace(/[oóòôöǒŏōõőọøǿ]/g, '[o,ó,ò,ô,ö,ǒ,ŏ,ō,õ,ő,ọ,ø,ǿ,]');
      s = s.replace(/[uúùûüǔŭūũűůųụư]/g, '[u,ú,ù,û,ü,ǔ,ŭ,ū,ũ,ű,ů,ų,ụ,ư,]');
      s = s.replace(/[yýỳŷÿȳỹƴ]/g, '[y,ý,ỳ,ŷ,ÿ,ȳ,ỹ,ƴ,]');
      s = s.replace(/[sśŝšşșṣ]/g, '[s,ś,ŝ,š,ş,ș,ṣ,]');
    }

    s = { '$regex': s, '$options': 'i' };

    return s;
  }



  /**
   * Formatear fecha en UTC, quitandole la zona horaria para que se muestre correctamente en todas las zonas. Para mostrar esta fecha en el HTML es necesario agregarle al date pipe 'UTC' como segundo parámetro. Ej: {{ '2022-05-11T00:00:00Z' | date: 'dd/MM/yyyy HH:mm' : 'UTC' }}
   * @param date 
   * @returns 
   */
  formatDate(date: MomentInput) {
    return moment(date).utcOffset(0, true).format();
  }


  logout() {
    this.disablePush();
    this.global.removeUser();
    // this.socket.emit('logout');
    this.navigateRoute('login', { key: 'prevent' });
  }


  async createAlertModal(componentProps: AlertModalParams): Promise<any> {
    const modal = await this.modalCtrl.create({
      cssClass: 'alert-modal',
      component: AlertModalPage,
      componentProps
    });

    modal.present();

    const dismiss = await modal.onDidDismiss();

    return Promise.resolve(dismiss.data);
  }


  // ------------------------- Loaders -------------------------


  showLoading() {
    this.global.showLoading();
  }

  hideLoading() {
    this.global.hideLoading();
  }


  // ------------------------- Loaders -------------------------


  // ------------------------- Toast -------------------------


  getMessage(message) {
    return message?.message || message;
  }

  showSuccess(message, icon?, color?) {
    this.showMessage(icon, color, message, 'toast-success');
  }

  showError(message, icon?, color?) {
    // Cambiarrrrrrrrrrrrrrrrrrrrr
    // this.showMessage(icon, color, message, 'toast-error');
  }

  showWarning(message, icon?, color?) {
    this.showMessage(icon, color, message, 'toast-warning');
  }

  async showMessage(icon, color, message, cssClass: string) {
    const toast = await this.toastCtrl.create({
      message: this.getMessage(message),
      cssClass,
      duration: 2000,
      position: 'bottom',
      icon: icon,
      color: color
    });

    toast.present();
  }

  async showInfoWithButton(message: string, buttons: ToastButton[], duration = 4000) {
    const toast = await this.toastCtrl.create({
      position: 'top',
      message,
      duration,
      buttons
    });

    toast.present();
  }


  // ------------------------- Toast -------------------------


  // ------------------------- Push -------------------------


  enablePush(fieldUserApp = 'id') {

    if (!this.global.loadUser()) return console.log("PUSH - No hay usuario");

    this.push.hasPermission()
      .then(res => console.log(res.isEnabled ? 'We have permission to send push notifications' : 'We do not have permission to send push notifications'))
      .catch(e => console.error(e))
      .finally(() => this.registerPush(fieldUserApp));
  }

  registerPush(fieldUserApp) {

    const options: PushOptions = {
      android: {
        icon: this.global.settings.push.icon.name,
        iconColor: this.global.settings.push.icon.color
      },
      ios: {
        alert: 'true',
        badge: true,
        sound: 'true'
      },
      windows: {},
      browser: {
        pushServiceURL: 'http://push.api.phonegap.com/v1/push'
      }
    };

    const pushObject: PushObject = this.push.init(options);

    if (this.platform.is('android') && this.global.getUser()?.notificationsSound) {

      const defaultChannel = this.global.settings.push.channel.default;

      this.push.createChannel({
        id: defaultChannel,
        description: "Canal " + defaultChannel,
        importance: 5,
        visibility: 1,
        vibration: true,
        sound: defaultChannel
      }).then(() => console.log('Channel ' + defaultChannel + ' created'));
    }

    pushObject.on('registration').subscribe((registration: RegistrationEventResponse) => {

      console.log('Device registered:' + JSON.stringify(registration));

      let user: { [k: string]: any } = {
        userApp: this.global.loadUser()[fieldUserApp],
        pnId: registration.registrationId,
        app: this.global.settings.push.appId
      };

      if (this.platform.is('android')) user.osType = 'android'
      else if (this.platform.is('ios')) user.osType = 'ios'
      else user.osType = 'web';

      console.log("token:" + user);

      this.httpPostExternalUrl({ url: this.global.settings.push.urls.ensure, body: user })
        .then(response => console.log("Ensure OK:" + JSON.stringify(response)))
        .catch(error => console.error("Error:" + JSON.stringify(error)));
    });

    pushObject.on('error').subscribe(error => this.showError('Ha ocurrido un error con el servidor de push notification ' + error));

    pushObject.on('notification').subscribe((notification: NotificationEventResponse) => {

      console.log(JSON.stringify(notification));

      if (this.platform.is('ios') && notification.additionalData['gcm.notification.payload']) {

        notification.additionalData.payload = JSON.parse(notification.additionalData['gcm.notification.payload'].replace(/\\/g, ''));
        notification.message = notification.additionalData['gcm.notification.message'];
      }

      this.notificationAlways(notification);

      if (notification.additionalData && notification.additionalData.payload) {

        this.notificationWithPayload(notification);

        if (notification.additionalData.foreground) this.notificationAppOpen(notification);
        else {
          this.platform.is('ios')
            ? notification.additionalData.coldstart
              ? this.notificationClicked(notification)
              : this.notificationAppClosed(notification)
            : notification.additionalData.dismissed !== undefined
              ? this.notificationClicked(notification)
              : this.notificationAppClosed(notification);
        };

      } else this.notificationWithoutPayload(notification);
    });
  }

  notificationClicked(notification: NotificationEventResponse) {
    this.global.emitAction(notification.additionalData.payload);
  }

  notificationAppClosed(notification: NotificationEventResponse) {

  }

  notificationAppOpen(notification: NotificationEventResponse) {
    this.global.emitEvent('notificationAppOpen', [notification]);
  }

  notificationAlways(notification: NotificationEventResponse) {

  }

  notificationWithoutPayload(notification: NotificationEventResponse) {

  }

  notificationWithPayload(notification: NotificationEventResponse) {

  }

  notificationToastButtons(payload: { [k: string]: any }): ToastButton[] {
    let buttons: ToastButton[];

    if (payload.action === 'general') return buttons;

    return buttons = [{
      side: 'end',
      text: 'Ver',
      handler: () => this.global.emitAction(payload)
    }];
  }

  disablePush(fieldUserApp = 'id') {

    if (!this.global.loadUser()) return console.log("PUSH - No hay usuario");

    const fields = fieldUserApp.split('.');

    let userApp = this.global.loadUser()[fields[0]];

    for (let i = 1; i < fields.length; i++) userApp = userApp[fields[i]];

    this.httpPostExternalUrl({ url: this.global.settings.push.urls.unensure + '/' + userApp, body: { userApp, app: this.global.settings.push.appId } })
      .then(res => console.log("un-Ensure OK:" + JSON.stringify(res)))
      .catch(e => console.log("Error:" + JSON.stringify(e)));
  }


  // ------------------------- Push -------------------------


  // ------------------------- Socket -------------------------


  initializeSocket() {

    this.socket.on('connect', () => {
      const user = this.global.getUser();
      if (user) {
        this.socket.ioSocket.query = { 'x-access-token': this.global.getToken('accessToken') };
        this.socket.emit('handleUser', user.id);
        setTimeout(() => this.socket.emit('handleTimezone', moment().format('Z')), 100);
      }
    });

    this.socket.connect();

    this.socket.on('event', (eventName: string, ...params) => this.global.emitEvent(eventName, params));

    this.socket.on('pendingActions', (actions: any[], actionsToPerform: any[]) => this.global.addPendingAction(actions, actionsToPerform));
  }

  performAction(action) {
    this.socket.emit('actionPerformed', action);
  }


  // ------------------------- Socket -------------------------


  // ------------------------- Camera -------------------------


  showImageUpload(params: ShowImageUploadParams = {}): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const options: ActionSheetOptions = {
        buttons: [
          {
            text: "Buscar en la galería",
            handler: () => this.showImageUploadTake('gallery', resolve, reject, params)
          },
          {
            text: "Tomar una foto",
            handler: () => this.showImageUploadTake('camera', resolve, reject, params)
          },
          {
            text: "Cancelar",
            role: 'cancel',
            handler: () => resolve(null)
          }
        ]
      };

      if (params.image) options.buttons.unshift({
        text: 'Ver Imágen',
        handler: () => {
          this.watchImage(params.image);
          resolve(null);
        }
      });

      let actionSheet = await this.actionSheetController.create(options);

      await actionSheet.present();
    });
  }

  showImageUploadTake(source: 'gallery' | 'camera', resolve: Function, reject: Function, params: ShowImageUploadParams) {

    if (!this.platform.is('cordova')) {

      let element = document.createElement('input');
      element.type = 'file';
      element.accept = 'image/*';
      element.onchange = () => this.httpPostFormData({ files: [{ key: 'file', data: element.files[0] }], loader: params.loader ?? true, useUrl: 0 })
        .then(res => resolve(res))
        .catch(e => reject(e));

      element.click();

    } else {

      const quality = {
        high: 100,
        medium: 50,
        low: 20
      }

      const cameraOptions: CameraOptions = {
        quality: quality[params.quality],
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: params.enableVideos ? this.camera.MediaType.ALLMEDIA : this.camera.MediaType.PICTURE,
        sourceType: source === 'gallery' ? this.camera.PictureSourceType.PHOTOLIBRARY : this.camera.PictureSourceType.CAMERA,
        correctOrientation: true,
      };

      this.camera.getPicture(cameraOptions)
        .then(file => this.httpPostFileBase64(file, resolve, reject, params.loader ?? true)
          .then(res => resolve(res))
          .catch(e => reject(e)),
          e => reject(e)
        );
    }
  }


  // ------------------------- Camera -------------------------


  // ------------------------- Photo Viewer -------------------------


  watchImage(url: string, title?: string) {
    this.platform.is('cordova')
      ? this.photoViewer.show(url, title)
      : window.open(url, '_blank');
  }


  // ------------------------- Photo Viewer -------------------------


  // ------------------------- Diagnostic -------------------------


  async isAuthorized(authorizations: DiagnosticPermissions): Promise<boolean> {

    if (!this.platform.is('cordova')) return Promise.resolve(true);

    for (const authorization of authorizations) {

      if (authorization === 'GPS') {
        const isGPSEnabled = await this.isGPSEnabled();

        if (!isGPSEnabled) return Promise.resolve(false);

        continue;
      }

      if (authorization === 'BackgroundLocation') {
        const backgroundLocationGranted = await this.handleBackgroundLocationAuthorization();

        if (!backgroundLocationGranted) return Promise.resolve(false);

        continue;
      }

      const isAuthorized = await this.diagnostic['is' + authorization + 'Authorized']().catch(e => console.log(e));

      if (!isAuthorized) {
        const requestSuccess = await this['request' + authorization + 'Authorization']().catch(e => console.log(e));

        if (!requestSuccess) return Promise.resolve(false);
      }
    }

    return Promise.resolve(true);
  }

  async handleBackgroundLocationAuthorization(): Promise<boolean> {
    const status = await this.diagnostic.getLocationAuthorizationStatus().catch(e => console.error(e));

    if (status === this.diagnostic.permissionStatus.GRANTED) return Promise.resolve(true);

    if (status === this.diagnostic.permissionStatus.NOT_REQUESTED) {
      const newStatus = await this.diagnostic.requestLocationAuthorization(this.diagnostic.locationAuthorizationMode.ALWAYS).catch(e => console.error(e));

      if (newStatus === this.diagnostic.permissionStatus.GRANTED) return Promise.resolve(true);
    }

    this.showInfoWithButton('Es necesario activar los permisos de ubicación.', [{
      side: 'end',
      text: 'Activar',
      handler: () => this.diagnostic.switchToSettings()
    }]);

    return Promise.resolve(false);
  }

  async isGPSEnabled(): Promise<boolean> {
    const isEnabled = await this.diagnostic.isLocationEnabled().catch(e => console.log(e));

    if (!isEnabled) {
      this.showInfoWithButton('Es necesario activar la ubicación.', [{
        side: 'end',
        text: 'Activar',
        handler: () => this.diagnostic.switchToLocationSettings()
      }]);

      return Promise.resolve(false);
    }

    return Promise.resolve(true);
  }

  async requestLocationAuthorization(): Promise<boolean> {
    const status = await this.diagnostic.requestLocationAuthorization(this.diagnostic.locationAuthorizationMode.ALWAYS);

    if (status !== this.diagnostic.permissionStatus.GRANTED || status !== this.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE) {
      this.showInfoWithButton('Es necesario activar los permisos de ubicación.', [{
        side: 'end',
        text: 'Activar',
        handler: () => this.diagnostic.switchToSettings()
      }]);
      return Promise.resolve(false);
    }

    return Promise.resolve(true);
  }

  async requestCameraAuthorization(): Promise<boolean> {
    const status = await this.diagnostic.requestCameraAuthorization().catch(e => console.error(e));

    if (status !== this.diagnostic.permissionStatus.GRANTED) {
      this.showInfoWithButton('Es necesario activar los permisos de cámara.', [{
        side: 'end',
        text: 'Activar',
        handler: () => this.diagnostic.switchToSettings()
      }]);
      return Promise.resolve(false);
    }

    return Promise.resolve(true);
  }

  async requestMicrophoneAuthorization(): Promise<boolean> {
    const status = await this.diagnostic.requestMicrophoneAuthorization().catch(e => console.error(e));

    if (status !== this.diagnostic.permissionStatus.GRANTED) {
      this.showInfoWithButton('Es necesario activar los permisos de micrófono.', [{
        side: 'end',
        text: 'Activar',
        handler: () => this.diagnostic.switchToSettings()
      }]);
      return Promise.resolve(false);
    }

    return Promise.resolve(true);
  }


  // ------------------------- Diagnostic -------------------------


  // ------------------------- File -------------------------

  getFile(fileName: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.file.readAsText(this.file.dataDirectory, fileName)
        .then(res => resolve(res))
        .catch((e: FileError) => reject(e));
    })
  }

  saveFile(fileName: string, content: string): Promise<FileEntry> {
    return new Promise((resolve, reject) => {

      const blob = new Blob([content], { type: 'text/plain' });

      this.file.writeFile(this.file.dataDirectory, fileName, blob, { replace: true, append: false })
        .then(res => resolve(res))
        .catch((e: FileError) => reject(e));
    })
  }

  deleteFile(fileName: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.file.removeFile(this.file.dataDirectory, fileName)
        .then(res => resolve(`El archivo "${res.fileRemoved.name}" ha sido eliminado con éxito`))
        .catch((e: FileError) => reject(e));
    })
  }


  // ------------------------- File -------------------------


  // ------------------------- Speech Recognition -------------------------

  startSpeechRecognition(language: 'es-MX' | 'en-US' | 'fr-FR' | 'pt-BR'): Promise<string> {
    return new Promise((resolve, reject) => {
      this.speechRecognition.hasPermission()
        .then(hasPermission => {
          (hasPermission
            ? this.initRecognition(language)
            : this.requestSpeechRecognitionPermission(language))
            .then(res => resolve(res))
            .catch(e => reject(e));
        }).catch(e => reject(e));
    })
  }

  private initRecognition(language: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      if (this.platform.is('ios')) {
        const alert = await this.alertCtrl.create({
          header: 'Iniciando Dictado',
          message: 'Escuchando...',
          buttons: [{
            text: 'Detener',
            handler: () => this.speechRecognition.stopListening()
          }]
        });

        await alert.present();
      }

      this.speechRecognition.startListening({ language, matches: 1 })
        .subscribe(
          matches => resolve(matches[0]),
          error => { console.log(error); reject('No se ha reconocido su dictado. Intente nuevamente...') }
        )
    });
  }

  private requestSpeechRecognitionPermission(language: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.speechRecognition.requestPermission()
        .then(
          () => this.initRecognition(language)
            .then(res => resolve(res))
            .catch(e => reject(e)),
          () => reject('Permiso Denegado')
        )
    })
  }

  // ------------------------- Speech Recognition -------------------------


  // ------------------------- Clipboard -------------------------


  copyToClipboard(params: CopyToClipboardParams) {
    this.clipboard.copy(params.text)
      .then(res => this.showSuccess(params.message || 'Copiado al portapapeles!'))
      .catch(e => this.showError('Error al intentar copiar al portapapeles'));
    ;
  }


  // ------------------------- Clipboard -------------------------


  // ------------------------- QR -------------------------


  async shareQR(params: ShareQRParams) {

    const error = (code: number, e?: any) => {
      const errors = [
        'element is null',
        'dataUrl is undefined',
        'dom-to-image toJpeg catch',
        'socialSharing share catch'
      ];

      console.error(errors[code], e);

      this.showError(params.errorMessage || 'Ocurrió un error inesperado.');
      this.hideLoading();
    };

    this.showLoading();

    const element = document.querySelector(params.elementQuerySelector);
    if (!element) return error(0);

    let dataUrl: string;

    if (params.isHidden) element.style.display = 'block';

    if (params.type === 'img') dataUrl = element.src;
    if (params.type === 'canvas') dataUrl = element.toDataURL('image/jpeg');

    if (!params.type) dataUrl = await domtoimage.toJpeg(element, { quality: 1 }).catch(e => error(2, e));

    if (params.isHidden) element.style.display = 'none';

    if (!dataUrl) return error(1);

    this.platform.is('cordova')
      ? this.socialSharing.share(params.message, params.subject, dataUrl).catch(e => error(3, e))
      : this.downloadFile({ url: dataUrl, fileName: params.subject + '.jpg' });

    this.hideLoading();
  }

  async prepareQRScanner(route: string) {

    if (!this.isAuthorized(['Camera'])) return;

    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {

        if (status.authorized) this.navigateRoute(route);
        else if (status.denied && status.canOpenSettings && confirm('Would you like to enable QR code scanning? You can allow camera access in your settings.')) this.qrScanner.openSettings();
        else this.showError('Access to camera denied');

      }).catch(e => this.showError('Error al obtener los permisos de la cámara'));
  }


  // ------------------------- QR -------------------------


  // ------------------------- LINKS -------------------------


  openNativeApp(app: string) {
    const apps = {
      gmail: {
        android: 'android-app://com.google.android.gm',
        ios: 'googlegmail://'
      }
    }

    this.iab.create(apps[app][this.platform.is('android') ? 'android' : 'ios'], '_system');
  }

  openLink(url: string) {
    this.iab.create(url, '_blank');
  }

  downloadFile(params: DownloadParams) {
    this.platform.is('cordova')
      ? this.iab.create(params.url, '_system')
      : this.httpService.downloadFile(params)
        .then(res => console.log(res))
        .catch(e => console.error(e));
  }


  // ------------------------- LINKS -------------------------




  // ------------------------- AUDIO -------------------------

  private audioPlaying: string;

  async playAudio(id: string, complex = true, path?: string) {

    try {
      if (this.audioPlaying) await this.stopAudio(this.audioPlaying, complex);

      complex
        ? await this.nativeAudio.preloadComplex(id, path || `assets/audios/${id}.mp3`, 1, 1, 0)
        : await this.nativeAudio.preloadSimple(id, path || `assets/audios/${id}.mp3`);

      await this.nativeAudio.play(id);

      this.audioPlaying = id;

      return Promise.resolve(true);

    } catch (error) {
      console.log(error);
      return Promise.resolve(false);
    }
  }

  async stopAudio(id: string, complex: boolean) {
    try {
      if (complex) await this.nativeAudio.stop(id).catch(e => console.log(e));
      await this.nativeAudio.unload(id).catch(e => console.log(e));

      this.audioPlaying = null;

      return Promise.resolve(true);

    } catch (error) {
      return Promise.reject(error);
    }
  }



  // ------------------------- AUDIO -------------------------


}
