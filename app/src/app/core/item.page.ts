import { Directive } from '@angular/core';
import { FormPage } from './form.page';
import { FormGroup } from '@angular/forms';

@Directive({ selector: '[itemPage]' })
export abstract class ItemPage extends FormPage {

  abstract endPoint: string;
  item: MongoObject;
  creating = true;
  processing = true;
  params: any;
  isWatching: boolean = false;

  ngOnInit() {
    this.initialize();
  }

  initializePre() {

  }

  initialize() {

    this.initializePre();

    const paramId = this.getParamId();
    this.processing = true;

    if (!paramId) this.activatedRoute.params.subscribe(params => {

      if (!params) return this.processing = false;

      this.params = params;
      this.parametersLoaded(params);

      params.id && params.id !== 'new'
        ? this.checkLoadingsAndLoadItem(params.id)
        : this.processing = false;

    }); else paramId === 'new'
      ? this.processing = false
      : this.loadItem(paramId);
  }

  getFormEdit(item): FormGroup {
    return this.formBuilder.group({});
  }

  getEndPointCreate(): string {
    return this.endPoint;
  }

  getEndPointUpdate(): string {
    return this.endPoint;
  }

  getEndPointLoad(): string {
    return this.endPoint;
  }

  onSubmitPerform(item: { [k: string]: any }) {

    item = this.savePre(item);

    if (!this.savePreCheck(item)) return;

    if (!item.id) {

      delete (item.id);

      this.pageService.httpPost(this.getEndPointCreate(), item)
        .then(res => this.savePost(res))
        .catch(e => this.pageService.showError(e));

    } else this.pageService.httpPut(this.getEndPointUpdate(), { id: item.id, body: item })
      .then(res => this.savePost(res))
      .catch(e => this.pageService.showError(e));
  }

  getParamId(): string {
    return null;
  }

  parametersLoaded(params): void {
    this.isWatching = (params.action === 'watch');
  }

  savePre(item): { [k: string]: any } {
    return item;
  }

  savePreCheck(item): boolean {
    return true;
  }

  savePost(item): void {

  }

  getPopulates(): any[] {
    return [];
  }

  checkLoadings(): boolean {
    return true;
  }

  checkLoadingsAndLoadItem(id: string) {
    setTimeout(() => this.checkLoadings() ? this.loadItem(id) : this.checkLoadingsAndLoadItem(id), 100);
  }

  loadItem(id: string) {

    this.loadItemPre();

    this.pageService.httpGetOne(this.getEndPointLoad(), { id, populates: this.getPopulates() })
      .then(item => {
        this.form = this.getFormEdit(item.data);
        this.item = item.data;
        this.creating = false;
        this.processing = false;
        this.loadItemPost();
      }).catch(e => this.pageService.showError(e));
  }

  loadItemPre() {

  }

  loadItemPost() {

  }

  handlePicture(field = 'picture') {
    this.pageService.showImageUpload({ image: this.getImage(this.form.value[field], 'default') })
      .then(res => {
        if (res?.data?.file) this.form.patchValue({ [field]: res.data.file });
      }).catch(e => this.pageService.showError('Error al cargar la imágen'));
  }

}
