import { NgModule } from '@angular/core';
import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { FileTransfer, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { Camera } from '@awesome-cordova-plugins/camera/ngx';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { Push } from '@awesome-cordova-plugins/push/ngx';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { Device } from '@awesome-cordova-plugins/device/ngx';
import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { Clipboard } from '@awesome-cordova-plugins/clipboard/ngx';
import { Diagnostic } from '@awesome-cordova-plugins/diagnostic/ngx';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { QRScanner } from '@ionic-native/qr-scanner/ngx';
import { SpeechRecognition } from '@awesome-cordova-plugins/speech-recognition/ngx';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { Deeplinks } from '@awesome-cordova-plugins/deeplinks/ngx';
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';
import { LocalNotifications } from '@awesome-cordova-plugins/local-notifications/ngx';
import { AlertModalPage } from './core/components/alert-modal/alert-modal';
import { Keyboard } from '@awesome-cordova-plugins/keyboard/ngx';
import { StreamingMedia } from '@awesome-cordova-plugins/streaming-media/ngx';
import { NativeAudio } from '@awesome-cordova-plugins/native-audio/ngx';
import { FilterPopoverPage } from './core/components/filter-popover/filter-popover.page';
import { PopoverNotesComponent } from './modules/popover-notes/popover-notes.component';

const config: SocketIoConfig = { url: environment.socketUrl, options: {} };

@NgModule({
  declarations: [AppComponent, AlertModalPage, FilterPopoverPage, PopoverNotesComponent],
  entryComponents: [],
  imports: [
    HttpClientModule,
    BrowserModule,
    IonicModule.forRoot({
      mode: 'md'
    }),
    AppRoutingModule,
    SocketIoModule.forRoot(config),
    HammerModule,
  ],
  providers: [
    LocalNotifications,
    StreamingMedia,
    StatusBar,
    SplashScreen,
    InAppBrowser,
    NativeAudio,
    Geolocation,
    Push,
    HTTP,
    Diagnostic,
    Network,
    Clipboard,
    Keyboard,
    Device,
    File,
    PhotoViewer,
    Camera,
    FileTransfer,
    FileTransferObject,
    QRScanner,
    SpeechRecognition,
    SocialSharing,
    Deeplinks,
    AppVersion,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
