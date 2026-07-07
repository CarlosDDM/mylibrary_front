import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { FranchiseService } from '../../../../services/franchises/franchise-service';
import { OptionService } from '../../../../services/options/option-service';
import { OptionModel } from '../../../../models/option-model';
import { AsyncResource } from '../../../../models/async-resource';
import { FranchiseModel } from '../../../../models/franchise-model';
import { forkJoin } from 'rxjs';
import { FormInputChip } from '../../../../shared/components/forms/form-input-chip/form-input-chip';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormInputMultiselect } from '../../../../shared/components/forms/form-input-multiselect/form-input-multiselect';
import { STATUS_TRANSLATION } from '../../../../constants/status-translation-constant';
import { FormButton } from '../../../../shared/components/forms/form-button/form-button';
import { FormInput } from '../../../../shared/components/forms/form-input/form-input';
import { SerieFilterValue } from '../../../../models/filter/serie/serie-filter-model';

@Component({
  selector: 'app-serie-filter',
  imports: [FormInputChip, ReactiveFormsModule, FormInputMultiselect, FormButton, FormInput],
  templateUrl: './serie-filter.html',
})
export class SerieFilter implements OnInit {
  private readonly franchiseService = inject(FranchiseService);
  private readonly optionService = inject(OptionService);

  protected readonly status = signal<AsyncResource<OptionModel[]>>(AsyncResource.loading([]));
  protected readonly franchises = signal<AsyncResource<FranchiseModel[]>>(
    AsyncResource.loading([]),
  );
  readonly initialName = input('');
  protected readonly apply = output<SerieFilterValue>();
  protected readonly handleClose = output<void>();

  protected readonly statusTranslated = computed(() =>
    this.status().data.map((s) => {
      return {
        ...s,
        type: STATUS_TRANSLATION[s.type],
      };
    }),
  );

  protected readonly FormFilterSerie = new FormGroup({
    name: new FormControl<string>(''),
    statusIds: new FormControl<string[]>([]),
    franchiseIds: new FormControl<string[]>([]),
  });

  loadAll() {
    forkJoin({
      franchises: this.franchiseService.getAll(),
      options: this.optionService.getOptions(),
    }).subscribe({
      next: (result) => {
        if (!result) return;
        const {
          franchises,
          options: { status },
        } = result;

        this.franchises.update((s) => AsyncResource.success(s.data.concat(franchises.data)));
        this.status.update((s) => AsyncResource.success(s.data.concat(status)));
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
    if (this.initialName()) {
      this.FormFilterSerie.patchValue({ name: this.initialName() });
      this.FormFilterSerie.markAsDirty();
    }
  }

  clear() {
    if (this.FormFilterSerie.pristine) return;
    this.FormFilterSerie.reset();
    this.apply.emit(this.FormFilterSerie.getRawValue());
  }

  submit() {
    if (this.FormFilterSerie.pristine || this.FormFilterSerie.invalid) return;
    this.apply.emit(this.FormFilterSerie.getRawValue());
    this.handleClose.emit();
  }
}
