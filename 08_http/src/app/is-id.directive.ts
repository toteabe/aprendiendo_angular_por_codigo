import { Directive } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';


@Directive({
  selector: '[appIsId]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: IsIdDirective,
    multi: true
  }]
})
export class IsIdDirective implements Validator{

  validate(control: AbstractControl): ValidationErrors | null {
    
     const value = control.value;
    // Regex para permitir solo números enteros positivos
    const regex = /^\d+$/;

    if (value && !regex.test(value)) {
      return { 'onlyPositiveIntegerNumbers': true };
    }
    return null;
  
  }

}
