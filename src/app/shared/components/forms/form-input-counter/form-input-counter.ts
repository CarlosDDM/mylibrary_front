import { Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputNumber } from 'primeng/inputnumber';

@Component({
  selector: 'app-form-input-counter',
  imports: [InputNumber, FormsModule],
  templateUrl: './form-input-counter.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputCounter),
      multi: true,
    },
  ],
})
export class FormInputCounter implements ControlValueAccessor {
  id = input.required<string>();
  label = input.required<string>();
  min = input<number>(0);
  max = input<number>();
  step = input<number>(1);
  invalid = input<boolean>(false);

  value = signal<number | null>(null);
  isDisabled = signal(false);

  private onChange: (value: number | null) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: number | null) {
    this.value.set(value);
  }
  registerOnChange(fn: any) {
    this.onChange = fn;
  }
  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }
  setDisabledState(disabled: boolean) {
    this.isDisabled.set(disabled);
  }

  onValueChange(value: number | null) {
    if (this.value() === value) return;
    this.value.set(value);
    this.onChange(value);
    this.onTouched();
  }
}
