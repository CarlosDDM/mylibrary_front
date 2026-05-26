import { Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Checkbox } from 'primeng/checkbox';

@Component({
  selector: 'app-form-input-checkbox',
  imports: [Checkbox, FormsModule],
  templateUrl: './form-input-checkbox.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputCheckbox),
      multi: true,
    },
  ],
})
export class FormInputCheckbox implements ControlValueAccessor {
  id = input.required<string>();
  label = input.required<string>();

  value = false;
  disabled = false;

  onChange = (_: boolean) => {};
  onTouched = () => {};

  onValueChange(checked: boolean): void {
    this.value = checked;
    this.onChange(checked);
  }

  writeValue(value: boolean): void {
    this.value = value ?? false;
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
