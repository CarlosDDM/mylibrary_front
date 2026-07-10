import { Component, computed, forwardRef, input, output, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FileUpload, FileUploadModule, FileSelectEvent } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { CoverModel } from '../../../../models/cover-model';

interface PendingCover {
  file: File;
  preview: string;
}

/**
 * Manages a gallery of covers. Existing `covers` are shown for removal (emitting
 * their id via `coverRemoved`), while newly picked files are the CVA value
 * (`File[]`), left for the caller to upload once the parent entity exists.
 */
@Component({
  selector: 'app-form-input-cover-gallery',
  imports: [FileUploadModule, ButtonModule],
  templateUrl: './form-input-cover-gallery.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputCoverGallery),
      multi: true,
    },
  ],
})
export class FormInputCoverGallery implements ControlValueAccessor {
  label = input<string>('');
  covers = input<CoverModel[]>([]);
  accept = input<string>('image/*');
  maxFileSize = input<number>(5 * 1024 * 1024);

  /** Emits the id of an existing cover the user removed. */
  coverRemoved = output<string>();

  protected readonly pending = signal<PendingCover[]>([]);
  private readonly removedIds = signal<Set<string>>(new Set());
  protected readonly isDisabled = signal(false);

  protected readonly visibleCovers = computed(() =>
    this.covers().filter((cover) => !this.removedIds().has(cover.id)),
  );

  private onChange: (value: File[]) => void = () => {};
  protected onTouched: () => void = () => {};

  writeValue(value: File[] | null): void {
    this.pending().forEach((item) => URL.revokeObjectURL(item.preview));
    this.pending.set((value ?? []).map((file) => this.toPending(file)));
  }

  registerOnChange(fn: (value: File[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  onSelect(event: FileSelectEvent, uploader: FileUpload): void {
    const added = Array.from(event.files ?? []).map((file) => this.toPending(file));
    if (added.length) {
      this.pending.update((list) => [...list, ...added]);
      this.emit();
    }
    uploader.clear();
  }

  removePending(index: number): void {
    this.pending.update((list) => {
      const target = list[index];
      if (target) URL.revokeObjectURL(target.preview);
      return list.filter((_, i) => i !== index);
    });
    this.emit();
  }

  removeExisting(cover: CoverModel): void {
    this.removedIds.update((set) => new Set(set).add(cover.id));
    this.coverRemoved.emit(cover.id);
    this.onTouched();
  }

  private toPending(file: File): PendingCover {
    return { file, preview: URL.createObjectURL(file) };
  }

  private emit(): void {
    this.onChange(this.pending().map((item) => item.file));
    this.onTouched();
  }
}
