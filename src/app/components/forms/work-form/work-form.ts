import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api-service';
import { WorkModel } from '../../../models/work-model';
import { FormInput } from '../components/form-input/form-input';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { OptionModel, OptionsModel } from '../../../models/option-model';
import { SerieModel } from '../../../models/serie-model';
import { AuthorModel } from '../../../models/author-model';
import { IllustratorModel } from '../../../models/illustrator-model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';
import { ToastService } from '../../../services/toast-service';
import { DialogService } from '../../../services/dialog-service';
import { AuthorForm } from '../author-form/author-form';
import { AsyncResource } from '../../../models/async-resource';

@Component({
  selector: 'app-work-form',
  imports: [
    ReactiveFormsModule,
    FormInput,
    InputNumberModule,
    CheckboxModule,
    SelectModule,
    ButtonModule,
    MultiSelectModule,
  ],
  templateUrl: './work-form.html',
})
export class WorkForm implements OnInit {
  private readonly apiRequest = inject(ApiService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly messageService = inject(ToastService);
  private readonly dialogService = inject(DialogService);

  languages = signal<OptionModel[]>([]);
  medias = signal<OptionModel[]>([]);
  series = signal<SerieModel[]>([]);
  authors = signal<AuthorModel[]>([]);
  illustrators = signal<AsyncResource<IllustratorModel[]>>({
    data: [],
    state: 'loading',
    error: null,
  });

  formWork = new FormGroup({
    name: new FormControl('', Validators.required),
    subtitle: new FormControl<string | null>(null),
    volume: new FormControl<number>(0, Validators.min(0)),
    price: new FormControl<number>(0, Validators.min(0)),
    mediaId: new FormControl<string | null>(null, Validators.required),
    languageId: new FormControl<string | null>(null, Validators.required),
    serieId: new FormControl<string | null>(null),
    isSpecialEdition: new FormControl(false),
    authors: new FormControl<string[]>([], Validators.required),
    illustrators: new FormControl<string[]>([]),
  });

  isInvalid(field: string): boolean {
    const control = this.formWork.get(field);
    return !!control?.invalid && !!control?.touched;
  }

  ngOnInit() {
    forkJoin({
      options: this.apiRequest.get<OptionsModel>('/options'),
      series: this.apiRequest.get<SerieModel[]>('/series'),
      authors: this.apiRequest.get<AuthorModel[]>('/authors'),
      illustrators: this.apiRequest.get<IllustratorModel[]>('/illustrators'),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ authors, illustrators, options: { languages, medias }, series }) => {
        this.languages.set(languages);
        this.medias.set(medias);
        this.series.set(series);
        this.authors.set(authors);
        this.illustrators.set({ state: 'success', data: illustrators, error: null });
      });

    this.formWork
      .get('serieId')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((serieId) => {
        const nameControl = this.formWork.get('name');
        const serie = this.series().find((s) => s.id === serieId);

        if (serie) nameControl?.setValue(serie.name);
      });
  }

  onClick() {
    console.log('faz o L');
  }

  authorModal() {
    const ref = this.dialogService.show(AuthorForm, {
      header: 'Criar autor',
    });

    ref.onClose.subscribe((author: AuthorModel) => {
      if (author) {
        this.authors.update((list) => [...list, author]);
        this.formWork
          .get('authors')
          ?.setValue([...(this.formWork.get('authors')?.value ?? []), author.id]);
      }
    });
  }

  onSubmit() {
    if (this.formWork.invalid) return;

    const data = this.formWork.value as WorkModel;

    this.apiRequest.post<WorkModel>('/works', data).subscribe({
      next: () => {
        this.messageService.showSuccess('Obra criada com sucesso');
        this.dialogService.close();
        return this.formWork.reset();
      },
      error: (err) => this.messageService.showError('Deu ruim'),
    });
  }
}
