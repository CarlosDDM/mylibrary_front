import { Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputNumber } from 'primeng/inputnumber';
import { FloatLabel } from 'primeng/floatlabel';

type InputNumberMode = 'decimal' | 'currency';
type ButtonLayout = 'stacked' | 'horizontal' | 'vertical';
type Currency = 'BRL';

@Component({
  selector: 'app-form-input-number',
  imports: [InputNumber, FormsModule, FloatLabel],
  templateUrl: './form-input-number.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputNumber),
      multi: true,
    },
  ],
})
export class FormInputNumber implements ControlValueAccessor {
  label = input.required<string>();
  id = input.required<string>();
  min = input<number>();
  max = input<number>();
  step = input<number>(1);
  invalid = input<boolean>(false);
  mode = input<InputNumberMode>('decimal');
  showButtons = input<boolean>(false);
  buttonLayout = input<ButtonLayout>('horizontal');
  currency = input<Currency>('BRL');

  value = signal<number | null>(null);
  isDisabled = signal(false);

  private onChange: (value: number | null) => void = () => {};
  private onTouched: () => void = () => {};
  writeValue(value: number | null): void {
    this.value.set(value);
  }

  registerOnChange(fn: (value: number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  onValueChange(value: number | null): void {
    if (this.value() === value) return;
    this.value.set(value);
    this.onChange(value);
    this.onTouched();
  }
}
