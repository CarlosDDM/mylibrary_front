import { Component, forwardRef, input } from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { FloatLabel } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-form-input-password',
  imports: [FloatLabel, PasswordModule, DividerModule, ReactiveFormsModule, FormsModule],
  templateUrl: './form-input-password.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputPassword),
      multi: true,
    },
  ],
})
export class FormInputPassword implements ControlValueAccessor {
  id = input.required<string>();
  label = input.required<string>();
  invalid = input<boolean>(false);
  toggleMask = input<boolean>(true);
  feedback = input<boolean>(false);

  // Strength meter labels (pt-BR by default, overridable)
  promptLabel = input<string>('Digite sua senha');
  weakLabel = input<string>('Fraca');
  mediumLabel = input<string>('Média');
  strongLabel = input<string>('Forte');

  // Strength thresholds — stricter than PrimeNG defaults, matching the
  // rules shown in the feedback footer.
  // medium: 6+ chars mixing two of lower/upper/number
  mediumRegex = input<string>(
    '^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})',
  );
  // strong: 8+ chars with lower, upper, number and a special char
  strongRegex = input<string>('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})');

  value = '';
  disabled = false;

  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue(value: any) {
    this.value = value ?? '';
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }

  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this.onChange(value);
  }
}
