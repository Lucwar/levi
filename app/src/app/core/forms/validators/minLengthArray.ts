import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function minLengthArray(minLength): ValidatorFn {

    return (control: AbstractControl): ValidationErrors | null => {
      if(!control.value || control.value.length < minLength) {
        return { minLengthArray: true };
      }
      return null;
    }

}
