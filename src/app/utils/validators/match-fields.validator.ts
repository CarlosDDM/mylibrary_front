import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function matchFields(source: string, target: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const sourceValue = group.get(source)?.value;
    const targetValue = group.get(target)?.value;

    return sourceValue === targetValue ? null : { fieldsMismatch: true };
  };
}
