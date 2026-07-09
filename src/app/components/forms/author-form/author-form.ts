import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthorModel } from '../../../models/author-model';
import { AuthorService } from '../../../services/authors/author-service';
import { FormInput } from '../../../shared/components/forms/form-input/form-input';
import { FormButton } from '../../../shared/components/forms/form-button/form-button';
import { BaseForm } from '../../../services/base/base-form';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-author-form',
  imports: [FormInput, ReactiveFormsModule, FormButton],
  templateUrl: './author-form.html',
})
export class AuthorForm extends BaseForm implements OnInit {
  private readonly authorService = inject(AuthorService);
  override readonly entityKey = 'authors';

  form = new FormGroup({
    name: new FormControl('', Validators.required),
  });

  override loadInitial(): void {
    if (!this.editId) return;

    this.form.disable();
    this.authorService
      .getById(this.editId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (author) => {
          this.form.patchValue(author);
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

    const data = this.form.getRawValue() as AuthorModel;
    const request = this.isEdit
      ? this.authorService.patch(this.editId!, data)
      : this.authorService.create(data);

    return request
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
