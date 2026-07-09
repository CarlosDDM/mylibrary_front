import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FranchiseModel } from '../../../models/franchise-model';
import { FranchiseService } from '../../../services/franchises/franchise-service';
import { FormInput } from '../../../shared/components/forms/form-input/form-input';
import { FormButton } from '../../../shared/components/forms/form-button/form-button';
import { BaseForm } from '../../../services/base/base-form';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-franchise-form',
  imports: [ReactiveFormsModule, FormInput, FormButton],
  templateUrl: './franchise-form.html',
})
export class FranchiseForm extends BaseForm implements OnInit {
  private readonly franchiseService = inject(FranchiseService);
  override readonly entityKey = 'franchises';

  form = new FormGroup({
    name: new FormControl<string>('', Validators.required),
  });

  override loadInitial(): void {
    if (!this.editId) return;

    this.form.disable();
    this.franchiseService
      .getById(this.editId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (franchise) => {
          if (!franchise) return;
          this.form.patchValue(franchise);
          this.form.enable();
        },
        error: (err) => {
          this.form.enable();
          this.notifyError(err, 'read');
        },
      });
  }

  onSubmit() {
    if (this.form.invalid || this.form.pristine || this.isSubmitting()) return;

    this.isSubmitting.set(true);

    const data = this.form.getRawValue() as FranchiseModel;
    const request = this.isEdit
      ? this.franchiseService.patch(this.editId!, data)
      : this.franchiseService.create(data);

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

  ngOnInit(): void {
    this.loadInitial();
  }
}
