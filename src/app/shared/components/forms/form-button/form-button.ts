import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule, ButtonSeverity } from 'primeng/button';

type ButtonType = 'button' | 'submit' | 'reset';
type ButtonVariant = 'text' | 'outlined';
type ButtonSize = 'small' | 'large';

@Component({
  selector: 'app-form-button',
  imports: [FormsModule, ButtonModule],
  templateUrl: './form-button.html',
})
export class FormButton {
  type = input<ButtonType>('button');
  label = input<string>('');
  disabled = input<boolean>(false);
  handleClick = output<void>();
  severity = input<ButtonSeverity>('primary');
  variant = input<ButtonVariant>('outlined');
  icon = input<string | undefined>(undefined);
  size = input<ButtonSize>('small');
  text = input<boolean>(false);
  fluid = input<boolean>(true);
}
