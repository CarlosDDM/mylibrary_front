import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IllustratorModel } from '../../../models/illustrator-model';
import { IllustratorService } from '../../../services/illustrators/illustrator-service';
import { FormInput } from '../../../shared/components/forms/form-input/form-input';
import { FormButton } from '../../../shared/components/forms/form-button/form-button';
import { BaseForm } from '../../../services/base/base-form';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-illustrator-form',
  imports: [FormInput, ReactiveFormsModule, FormButton],
  templateUrl: './illustrator-form.html',
})
export class IllustratorForm extends BaseForm implements OnInit {
  private readonly illustratorService = inject(IllustratorService);
  override readonly entityKey = 'illustrators';

  form = new FormGroup({
    name: new FormControl('', Validators.required),
  });

  override loadInitial(): void {
    if (!this.editId) return;

    this.form.disable();
    this.illustratorService
      .getById(this.editId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (illustator) => {
          if (!illustator) return;
          this.form.patchValue(illustator);
          this.form.enable();
        },
        error: (err) => {
          this.form.enable();
          this.notifyError(err, 'read');
        },
      });
  }

  ngOnInit(): void {
    this.loadInitial();
  }

  onSubmit() {
    if (this.form.invalid || this.form.pristine || this.isSubmitting()) return;

    this.isSubmitting.set(true);

    const data = this.form.getRawValue() as IllustratorModel;

    const request = this.isEdit
      ? this.illustratorService.patch(this.editId!, data)
      : this.illustratorService.create(data);

    request
      .pipe(
        finalize(() => this.isSubmitting.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
      next: (res) => {
        if (!res) return;
        this.notifySuccess(this.isEdit ? 'update' : 'create');
        this.form.markAsPristine();
        return this.ref?.close(res);
      },
      error: (err) => this.notifyError(err, this.isEdit ? 'update' : 'create'),
    });
  }
}
