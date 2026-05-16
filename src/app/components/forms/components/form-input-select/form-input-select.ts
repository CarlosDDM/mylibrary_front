import { Component, forwardRef, input, output, signal } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FloatLabel } from 'primeng/floatlabel';
import { Select } from 'primeng/select';
import { TranslatePipe } from '../../../../pipes/translate-pipe';
import { FormButton } from '../form-button/form-button';

@Component({
  selector: 'app-form-input-select',
  imports: [FloatLabel, Select, TranslatePipe, FormsModule, FormButton],
  templateUrl: './form-input-select.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputSelect),
      multi: true,
    },
  ],
})
export class FormInputSelect implements ControlValueAccessor {
  label = input.required<string>();
  id = input.required<string>();
  translateKey = input<Record<string, string>>({} as Record<string, string>);
  optionLabel = input.required<string>();
  options = input<unknown[]>([]);
  invalid = input<boolean>(false);
  optionValue = input.required<string>();
  loading = input<boolean>(false);
  buttonLabel = input<string>();
  handleOnclick = output<void>();

  value = signal<unknown>(null);
  isDisabled = signal(false);

  private onChange: (value: unknown) => void = () => {};
  protected onTouched: () => void = () => {};

  writeValue(obj: unknown): void {
    this.value.set(obj);
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  onValueChange(value: unknown): void {
    this.value.set(value);
    this.onChange(value);
    this.onTouched();
  }
}
