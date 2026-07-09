import { Component, forwardRef, input, output, signal } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { FloatLabel } from 'primeng/floatlabel';
import { MultiSelect } from 'primeng/multiselect';
import { FormButton } from '../form-button/form-button';

@Component({
  selector: 'app-form-input-multiselect',
  imports: [FloatLabel, MultiSelect, FormsModule, FormButton],
  templateUrl: './form-input-multiselect.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputMultiselect),
      multi: true,
    },
  ],
})
export class FormInputMultiselect implements ControlValueAccessor {
  label = input.required<string>();
  id = input.required<string>();
  translateKey = input<Record<string, string>>({} as Record<string, string>);
  optionLabel = input.required<string>();
  options = input<unknown[]>([]);
  invalid = input<boolean>(false);
  optionValue = input.required<string>();
  loading = input<boolean>(false);
  lazy = input<boolean>(false);
  buttonLabel = input<string>();
  handleOnclick = output<void>();
  filterChange = output<string>();
  loadMore = output<void>();

  value = signal<unknown>(null);
  isDisabled = signal(false);

  private readonly filter$ = new Subject<string>();

  constructor() {
    this.filter$
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((term) => this.filterChange.emit(term));
  }

  onFilterInput(event: { filter: string }): void {
    this.filter$.next(event.filter ?? '');
  }

  onLazy(event: { last: number }): void {
    if (event.last >= this.options().length - 1) this.loadMore.emit();
  }

  protected ptChip = {
    pcChip: {
      root: { class: 'py-0.5 text-sm/tight' },
    },
  };

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
    if (this.sameSelection(this.value(), value)) return;
    this.value.set(value);
    this.onChange(value);
    this.onTouched();
  }

  private sameSelection(a: unknown, b: unknown): boolean {
    if (a === b) return true;
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
    return a.every((item, index) => item === b[index]);
  }
}
