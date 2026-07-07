import { Component, computed, input, output } from '@angular/core';
import { FormButton } from '../../components/forms/form-button/form-button';
import { SYSTEM_ERROR } from '../../../constants/error-messages-constant';

@Component({
  selector: 'app-error-state',
  imports: [FormButton],
  templateUrl: './error-state.html',
})
export class ErrorState {
  readonly errors = input<string[] | null>();
  readonly retry = output<void>();
  readonly componentName = input<string>();

  protected readonly errorMessages = computed(() => {
    const errs = this.errors() ?? [];
    return errs.length ? errs : [SYSTEM_ERROR.network];
  });
}
