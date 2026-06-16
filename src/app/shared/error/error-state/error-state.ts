import { Component, computed, input, output } from '@angular/core';
import { FormButton } from '../../components/forms/form-button/form-button';

@Component({
  selector: 'app-error-state',
  imports: [FormButton],
  templateUrl: './error-state.html',
})
export class ErrorState {
  readonly errors = input();
  readonly retry = output<void>();

  protected readonly errorMessages = computed(() => this.errors ?? []);
}
