import { Directive } from '@angular/core';
import { PageService } from './services/page.service';
import { BasePage } from './base.page';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { minLengthArray } from './forms/validators/minLengthArray';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

@Directive({ selector: '[formPage]' })
export abstract class FormPage extends BasePage {

  differenceDays: number // Usado en habit-new y habit
  form: FormGroup;
  formSubmitAttempt = false;

  constructor(
    public formBuilder: FormBuilder,
    public pageService: PageService,
    public activatedRoute: ActivatedRoute,
  ) {
    super(pageService, activatedRoute);
    this.form = this.getFormNew();
  }

  getFormNew(): FormGroup {
    return this.formBuilder.group({});
  }

  formValidated(): boolean {
    this.formSubmitAttempt = true;
    return this.form.valid;
  }

  formReset(): void {
    this.form.reset();
    this.formSubmitAttempt = false;
  }

  validateAllFormFields(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(field => {

      const control = formGroup.get(field);

      if (control instanceof FormControl) control.markAsTouched({ onlySelf: true });
      else if (control instanceof FormGroup) this.validateAllFormFields(control);
    });
  }

  onSubmit(): void {
    this.formValidated()
      ? this.onSubmitPerform(this.form.value)
      : this.validateAllFormFields(this.form);
  }

  abstract onSubmitPerform(item): void;

  isFieldValid(field): boolean {

    if (!this.form.controls[field]) return true;
    if (!this.form.controls[field].valid && this.form.controls[field].touched) return false;
    if (this.form.controls[field].untouched && this.formSubmitAttempt) return true;

    return true;
  }

  getFieldError(field): string {

    let message = 'Validacion OK';

    if (this.form.controls[field]?.errors) {

      let error = this.form.controls[field].errors;

      if (error.required) message = 'Requerido';
      else if (error.minlength) message = 'Debe tener al menos ' + error.minlength.requiredLength + ' caracteres';
      else if (error.minYear) message = 'Debe ser mayor a ' + error.minYear.requiredYear + ' años';
      else if (error.yearBike) message = error.yearBike
      else if (error.mailFormat) message = 'Email inválido';
      else if (error.pattern) message = 'Formato inválido';
      else if (error.min) message = 'El valor no puede ser menor a ' + error.min.min;
      else if (error.max) message = 'El valor no puede ser mayor a ' + error.max.max;
      else if (error.minLengthArray) message = 'Seleccione los valores necesarios';
      else if (error.equalValue) message = error.equalValue.targetKey == 'password' && error.equalValue.toMatchKey == 'passwordVerify' ? "Passwords must be the same" : JSON.stringify(error.equalValue);
      else message = JSON.stringify(error);

    }

    return message;
  }

}
