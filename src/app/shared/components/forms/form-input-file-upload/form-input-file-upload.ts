import { Component, computed, forwardRef, input, output, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FileUploadModule, FileSelectEvent } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { FormButton } from '../form-button/form-button';

/**
 * Captures a single image file without uploading it. The selected `File` is the
 * control value, so the caller decides when/where to upload it (e.g. after the
 * parent entity is created). Pass `currentUrl` to preview an already saved image.
 */
@Component({
  selector: 'app-form-input-file-upload',
  imports: [FileUploadModule, ButtonModule, FormButton],
  templateUrl: './form-input-file-upload.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputFileUpload),
      multi: true,
    },
  ],
})
export class FormInputFileUpload implements ControlValueAccessor {
  label = input<string>('');
  currentUrl = input<string | null>(null);
  accept = input<string>('image/*');
  maxFileSize = input<number>(5 * 1024 * 1024);

  /** Emits `true` when the existing cover is cleared, `false` when a new file replaces it. */
  removed = output<boolean>();

  value = signal<File | null>(null);
  isDisabled = signal(false);

  private readonly filePreview = signal<string | null>(null);
  private readonly cleared = signal(false);
  protected readonly previewUrl = computed(
    () => this.filePreview() ?? (this.cleared() ? null : this.currentUrl()),
  );

  private onChange: (value: File | null) => void = () => {};
  protected onTouched: () => void = () => {};

  writeValue(value: File | null): void {
    this.setFile(value ?? null, false);
  }

  registerOnChange(fn: (value: File | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  onSelect(event: FileSelectEvent): void {
    const file = event.files?.[0] ?? null;
    if (file) {
      this.cleared.set(false);
      this.removed.emit(false);
      this.setFile(file, true);
    }
  }

  remove(): void {
    this.cleared.set(true);
    this.removed.emit(true);
    this.setFile(null, true);
  }

  private setFile(file: File | null, emit: boolean): void {
    const previous = this.filePreview();
    if (previous) URL.revokeObjectURL(previous);

    this.filePreview.set(file ? URL.createObjectURL(file) : null);
    this.value.set(file);

    if (emit) {
      this.onChange(file);
      this.onTouched();
    }
  }
}
