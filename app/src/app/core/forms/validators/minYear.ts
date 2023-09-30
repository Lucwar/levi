import { FormControl, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import * as moment from 'moment';

export function minYear(requiredYear: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let birthdayDate = moment(control.value);
    let years = moment().diff(birthdayDate, 'years');
    if (years < requiredYear) {
        return {minYear: {requiredYear: requiredYear} }
    }
    return null;
  }
}

export function yearBike(min:number,  maxDate = moment().format('YYYY')): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let yearControl =control.value;
    if (yearControl < min || yearControl > maxDate) {
        return {yearBike: 'El año debe ser mayor a 1999 y menor o igual a ' + maxDate  }
    }
    return null;
  }
}

