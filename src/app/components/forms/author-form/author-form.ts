import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthorModel } from '../../../models/author-model';
import { AuthorService } from '../../../services/authors/author-service';
import { FormInput } from '../../../shared/components/forms/form-input/form-input';
import { FormButton } from '../../../shared/components/forms/form-button/form-button';
import { BaseForm } from '../../../services/base/base-form';
import { parseHttpError } from '../../../utils/parse-http-error.utils';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-author-form',
  imports: [FormInput, ReactiveFormsModule, FormButton],
  templateUrl: './author-form.html',
})
export class AuthorForm extends BaseForm implements OnInit {
  private readonly authorService = inject(AuthorService);

  form = new FormGroup({
    name: new FormControl('', Validators.required),
  });

  ngOnInit(): void {
    this.loadInitial();
  }

  override loadInitial(): void {
    if (!this.editId) return;

    this.form.disable();
    this.authorService
      .getById(this.editId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((author) => {
        this.form.patchValue(author);
        this.form.enable();
      });
  }

  onSubmit() {
    const data = this.form.getRawValue() as AuthorModel;
    const request = this.isEdit
      ? this.authorService.patch(this.editId!, data)
      : this.authorService.create(data);

    return request.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        if (!res) return;
        this.messageService.showSuccess(
          this.isEdit ? this.entitySuccess.authors.update : this.entitySuccess.authors.create,
        );
        return this.ref?.close(res);
      },
      error: (err) => {
        const fallback = this.isEdit
          ? this.entityError.authors.update
          : this.entityError.authors.create;
        parseHttpError(err, fallback).forEach((messages) => {
          this.messageService.showError(messages);
        });
      },
    });
  }
}
