import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GlobalService } from './global.service';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@awesome-cordova-plugins/file-transfer/ngx';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  INVALID_TOKEN_ERROR = 'Token inválido';
  NETWORK_CONNECTION_ERROR = 'No hay conexión a internet.';
  serviceName: string;
  urls = [
    environment.serverUrl + '/' + environment.apiVersion
  ];
  baseParams = {
    useUrl: 0,
    loader: true,
    body: {},
    queryParams: {}
  };
  defaultParams: EndPointParams = {
    ...this.baseParams,
    filters: {},
    findOne: false,
    page: 0,
    perPage: 0,
    populates: [],
    select: [],
    sort: {}
  };

  constructor(
    public httpx: HTTP,
    public http: HttpClient,
    public global: GlobalService,
    private transfer: FileTransfer,
    private platform: Platform
  ) {
    this.platform.ready().then(() => this.initialize());
  }

  initialize() {
    this.buildServiceName();

    if (this.platform.is('cordova')) this.httpx.setDataSerializer('json');
  }

  buildServiceName() {
    this.serviceName = this.constructor.name.replace("Service", "").toLowerCase();
  }


  // (+) Items

  getAll(endPoint: string, params: EndPointParams) {

    params.queryParams._filters = JSON.stringify(params.filters);
    params.queryParams._sort = JSON.stringify(params.sort);
    params.queryParams._populates = JSON.stringify(params.populates);
    params.queryParams._page = JSON.stringify(params.page);
    params.queryParams._perPage = JSON.stringify(params.perPage);
    if (Object.keys(params.select).length) params.queryParams._select = JSON.stringify(params.select);

    return this.get(endPoint, params);
  }

  getOne(endPoint: string, params: EndPointParams) {

    params.queryParams._filters = JSON.stringify(params.filters);
    params.queryParams._populates = JSON.stringify(params.populates);
    if (Object.keys(params.select).length) params.queryParams._select = JSON.stringify(params.select);
    if (!params.id) params.queryParams._findOne = JSON.stringify(true);

    return this.get(endPoint, params);
  }

  // (-) Items

  refreshToken() {

    if (!this.global.settings.networkConnection) return Promise.reject(this.NETWORK_CONNECTION_ERROR);

    const endPoint = this.global.settings.endPoints.users + this.global.settings.endPointsMethods.users.refreshToken;

    const url = new URL(this.urls[0] + endPoint).toString();

    this.global.showLoading();

    return this.http.post(url, {}, this.getHeaders('refreshToken')).toPromise()
      .then((res: any) => this.global.setToken('accessToken', res.data))
      .catch(e => {
        if (e?.status === 401) this.global.emitAction({ action: 'logout' });
      }).finally(() => this.global.hideLoading());
  }


  // (+) Basic

  async get(endPoint: string, params: EndPointParams) {

    if (!this.global.settings.networkConnection) return Promise.reject(this.NETWORK_CONNECTION_ERROR);

    if (await this.checkTokenExpiration()) return Promise.reject(this.INVALID_TOKEN_ERROR);

    if (params.id) endPoint += '/' + params.id;

    const Url = new URL(this.urls[params.useUrl] + endPoint);
    Object.entries(params.queryParams).forEach(([key, value]) => Url.searchParams.set(key, value));

    const url = Url.toString();

    if (params.loader) this.global.showLoading();

    return this.http.get(url, this.getHeaders()).toPromise()
      .then(res => res)
      .catch(e => this.handleError(e))
      .finally(() => { if (params.loader) this.global.hideLoading() });
  }

  async delete(endPoint: string, params: Partial<EndPointParams>) {

    if (!this.global.settings.networkConnection) return Promise.reject(this.NETWORK_CONNECTION_ERROR);

    if (await this.checkTokenExpiration()) return Promise.reject(this.INVALID_TOKEN_ERROR);

    if (params.id) endPoint += '/' + params.id;

    const Url = new URL(this.urls[params.useUrl] + endPoint);
    Object.entries(params.queryParams).forEach(([key, value]) => Url.searchParams.set(key, value));

    const url = Url.toString();

    if (params.loader) this.global.showLoading();

    return this.http.delete(url, this.getHeaders()).toPromise()
      .then(res => res)
      .catch(e => this.handleError(e))
      .finally(() => { if (params.loader) this.global.hideLoading() });
  }

  async put(endPoint: string, params: Partial<EndPointParams>) {

    if (!this.global.settings.networkConnection) return Promise.reject(this.NETWORK_CONNECTION_ERROR);

    if (await this.checkTokenExpiration()) return Promise.reject(this.INVALID_TOKEN_ERROR);

    if (params.id) endPoint += '/' + params.id;

    const Url = new URL(this.urls[params.useUrl] + endPoint);
    Object.entries(params.queryParams).forEach(([key, value]) => Url.searchParams.set(key, value));

    const url = Url.toString();

    if (params.loader) this.global.showLoading();

    return this.http.put(url, params.body, this.getHeaders()).toPromise()
      .then(res => res)
      .catch(e => this.handleError(e))
      .finally(() => { if (params.loader) this.global.hideLoading() });
  }

  async post(endPoint: string, params: Partial<EndPointParams>) {

    if (!this.global.settings.networkConnection) return Promise.reject(this.NETWORK_CONNECTION_ERROR);

    if (await this.checkTokenExpiration()) return Promise.reject(this.INVALID_TOKEN_ERROR);

    if (params.id) endPoint += '/' + params.id;

    const Url = new URL(this.urls[params.useUrl] + endPoint);
    Object.entries(params.queryParams).forEach(([key, value]) => Url.searchParams.set(key, value));

    const url = Url.toString();

    if (params.loader) this.global.showLoading();

    return this.http.post(url, params.body, this.getHeaders()).toPromise()
      .then(res => res)
      .catch(e => this.handleError(e))
      .finally(() => { if (params.loader) this.global.hideLoading() });
  }

  async patch(endPoint: string, params: EndPointParams) {

    if (!this.global.settings.networkConnection) return Promise.reject(this.NETWORK_CONNECTION_ERROR);

    if (await this.checkTokenExpiration()) return Promise.reject(this.INVALID_TOKEN_ERROR);

    if (params.id) endPoint += '/' + params.id;

    const Url = new URL(this.urls[params.useUrl] + endPoint);
    Object.entries(params.queryParams).forEach(([key, value]) => Url.searchParams.set(key, value));

    const url = Url.toString();

    if (params.loader) this.global.showLoading();

    return this.platform.is('cordova')
      ? this.httpx.patch(url, params.body, this.getHeaders())
        .then(res => JSON.parse(res.data))
        .catch(e => this.handleError(e))
        .finally(() => { if (params.loader) this.global.hideLoading() })

      : this.http.patch(url, params.body, this.getHeaders()).toPromise()
        .then(res => res)
        .catch(e => this.handleError(e))
        .finally(() => { if (params.loader) this.global.hideLoading() });
  }


  postExternalUrl(params: EndPointParamsExternalURL) {

    if (!this.global.settings.networkConnection) return Promise.reject(this.NETWORK_CONNECTION_ERROR);

    if (params.loader) this.global.showLoading();

    return this.http.post(params.url, params.body).toPromise()
      .then(res => res)
      .catch(e => this.handleError(e))
      .finally(() => { if (params.loader) this.global.hideLoading() });
  }

  // (-) Basic

  async postFormData(params: EndPointParamsFormData, endPoint?: string) {

    if (!this.global.settings.networkConnection) return Promise.reject(this.NETWORK_CONNECTION_ERROR);

    if (await this.checkTokenExpiration()) return Promise.reject(this.INVALID_TOKEN_ERROR);

    if (params.loader) this.global.showLoading();

    const url = endPoint ? this.urls[params.useUrl] + endPoint : this.urls[params.useUrl] + this.global.settings.endPoints.files + '/upload';

    const formData = new FormData();

    for (const file of params.files) formData.append(file.key, file.data, file.name);

    if (params.extraParams) for (const [key, value] of Object.entries(params.extraParams)) formData.append(key, value);

    return this.http.post(url, formData).toPromise()
      .then(res => res)
      .catch(e => this.handleError(e))
      .finally(() => { if (params.loader) this.global.hideLoading() });
  }

  async postFileFromPath(params: { path: string, mimeType: string, fileName: string }, resolve, reject) {

    if (!this.global.settings.networkConnection) return Promise.reject(this.NETWORK_CONNECTION_ERROR);

    if (await this.checkTokenExpiration()) return Promise.reject(this.INVALID_TOKEN_ERROR);

    const url = this.urls[0] + this.global.settings.endPoints.files + '/upload'

    let fileUploadOptions: FileUploadOptions = {
      fileKey: 'file',
      fileName: params.fileName,
      chunkedMode: false,
      mimeType: params.mimeType,
      headers: {
        'x-content-type': 'on',
        'x-access-token': this.global.getUser() ? this.global.getUser().token : ''
      }
    };
    let fileTransferObject: FileTransferObject = this.transfer.create();
    fileTransferObject.upload(
      params.path + params.fileName,
      url,
      fileUploadOptions
    ).then((result: any) => {
      if (result && result.response) {
        let data = JSON.parse(result.response) || null;
        resolve(data);
      }
    }, (error) => {
      reject(error);
    });
  }


  async postFileBase64(file, resolve, reject, showLoading) {

    if (!this.global.settings.networkConnection) return Promise.reject(this.NETWORK_CONNECTION_ERROR);

    if (await this.checkTokenExpiration()) return Promise.reject(this.INVALID_TOKEN_ERROR);

    const url = this.urls[0] + this.global.settings.endPoints.files + '/upload';
    if (showLoading) this.global.showLoading();

    let fileUploadOptions: FileUploadOptions = {
      fileKey: 'file',
      fileName: 'file',
      chunkedMode: false,
      mimeType: 'image/jpeg',
      headers: {
        'x-content-type': 'on',
        'x-access-token': this.global.getUser() ? this.global.getUser().token : ''
      }
    };
    let fileTransferObject: FileTransferObject = this.transfer.create();
    return fileTransferObject.upload(
      'data:image/jpeg;base64,' + file.replace('data:image/jpeg;base64,', ''),
      url,
      fileUploadOptions
    ).then((result: any) => {
      if (result && result.response) {
        let data = JSON.parse(result.response) || null;
        resolve(data);
      }
    }, (error) => {
      reject(error);
    })
      .finally(() => { if (showLoading) this.global.hideLoading() });

  }

  async postFileVideo(file, resolve, reject, showLoading) {

    if (!this.global.settings.networkConnection) return Promise.reject(this.NETWORK_CONNECTION_ERROR);

    if (await this.checkTokenExpiration()) return Promise.reject(this.INVALID_TOKEN_ERROR);

    const url = this.urls[0] + this.global.settings.endPoints.files + '/upload';
    if (showLoading) this.global.showLoading();

    let fileUploadOptions: FileUploadOptions = {
      fileKey: 'file',
      fileName: 'file',
      chunkedMode: false,
      mimeType: 'video/mp4',
      headers: {
        'x-content-type': 'on',
        'x-access-token': this.global.getUser() ? this.global.getUser().token : ''
      }
    };
    let fileTransferObject: FileTransferObject = this.transfer.create();
    return fileTransferObject.upload(
      file,
      url,
      fileUploadOptions
    ).then((result: any) => {
      if (result && result.response) {
        let data = JSON.parse(result.response) || null;
        resolve(data);
      }
    }, (error) => {
      reject(error);
    })
      .finally(() => { if (showLoading) this.global.hideLoading() });
  }

  downloadFile(params: DownloadParams) {

    return this.http.get(params.url, { responseType: 'blob' }).toPromise()
      .then(res => {
        const splitName = params.fileName.split('.');
        let downloadLink = document.createElement('a');

        downloadLink.href = URL.createObjectURL(new Blob([res], { type: this.getMIMEtype(splitName[splitName.length - 1]) }));

        downloadLink.setAttribute('download', params.fileName);
        document.body.appendChild(downloadLink);

        downloadLink.click();
        downloadLink.remove();
      }).catch(e => this.handleError(e))
  }

  getMIMEtype(extension: string) {
    const MIMETypes = {
      'txt': 'text/plain',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'doc': 'application/msword',
      'pdf': 'application/pdf',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'bmp': 'image/bmp',
      'png': 'image/png',
      'xls': 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'rtf': 'application/rtf',
      'ppt': 'application/vnd.ms-powerpoint',
      'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    }

    return MIMETypes[extension];
  }

  getHeaders(type: 'accessToken' | 'refreshToken' = 'accessToken') {
    return this.global.getToken(type)
      ? {
        headers: new HttpHeaders({
          [type === 'accessToken' ? 'x-access-token' : 'x-refresh-token']: this.global.getToken(type)
        })
      }
      : {};
  }

  handleError(error: any) {

    const status = error.status ?? 500;
    let message = 'Ha ocurrido un error';

    console.log(error);

    if (error.error && error.error.message) message = error.error.message;
    else if (error.message) message = error.message;
    else if (error.name) message = error.name;

    if (status === 401 && this.global.getUser()) this.global.emitAction({ action: 'logout', httpUnauthorized: true });

    const splittedMessage = message.split(':', 2);

    if (splittedMessage.length === 2) {
      const splittedError = splittedMessage[0].split('.');

      if (splittedError.length === 2) {
        // const translation = this.translations?.[splittedError[0]]?.[splittedError[1]];

        // if (!translation) console.warn('No se ha encontrado la traducción para el error: ' + splittedMessage[0]);

        // message = translation || splittedMessage[1].trim();
        message = splittedMessage[1].trim();
      }
    }

    return Promise.reject({ status, message });
  }

  async checkTokenExpiration(): Promise<boolean> {

    const token = this.global.getToken('accessToken');

    if (!token) return false;

    const isTokenExpired = (Math.floor((new Date).getTime() / 1000)) >= ((JSON.parse(atob(token.split('.')[1]))).exp);

    if (!isTokenExpired) return false;

    const newToken = await this.refreshToken();

    return !newToken;
  }

  getServiceName() {
    return this.serviceName;
  }

}
