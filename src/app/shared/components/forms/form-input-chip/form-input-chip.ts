import { Component, computed, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import clsx from 'clsx';

@Component({
  selector: 'app-form-input-chip',
  standalone: true,
  templateUrl: './form-input-chip.html',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => FormInputChip), multi: true },
  ],
})
export class FormInputChip implements ControlValueAccessor {
  readonly label = input<string>('');
  readonly id = input<string>('');
  readonly options = input<any[]>([]);
  readonly optionLabel = input<string>('label');
  readonly optionValue = input<string>('value');

  protected readonly value = signal<string[]>([]);
  protected readonly disabled = signal(false);

  protected readonly chipClass = computed(() => {
    const selected = this.value();
    const isDisabled = this.disabled();
    return (val: string) =>
      clsx('px-4 py-1.5 text-sm rounded-full border transition-colors cursor-pointer', {
        'bg-primary border-primary text-primary-contrast font-medium': selected.includes(val),
        'bg-transparent border-surface text-muted-color hover:border-primary hover:text-color':
          !selected.includes(val),
        'opacity-50 pointer-events-none': isDisabled,
      });
  });
  private onChange: (v: string[]) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(v: string[] | null): void {
    this.value.set(v ?? []);
  }
  registerOnChange(fn: (v: string[]) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  protected toggle(val: string): void {
    if (this.disabled()) return;
    const current = this.value();
    const next = current.includes(val) ? current.filter((x) => x !== val) : [...current, val];
    this.value.set(next);
    this.onChange(next);
    this.onTouched();
  }

  protected optVal = (opt: any): string => opt[this.optionValue()];
}
