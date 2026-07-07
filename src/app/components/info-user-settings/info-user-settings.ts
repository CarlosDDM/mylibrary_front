import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { UserInfoForm } from '../forms/user-info-forms/user-info-form';
import { FormButton } from '../../shared/components/forms/form-button/form-button';
import { UserResponseModel } from '../../models/user/user-response-model';
import { AsyncResource } from '../../models/async-resource';
import { UsersService } from '../../services/users/users-service';
import { AuthService } from '../../services/auth/auth-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { parseHttpError } from '../../utils/parse-http-error.utils';
import { ENTITY_ERROR } from '../../constants/error-messages-constant';
import { ToastService } from '../../services/toast/toast-service';
import { Skeleton } from 'primeng/skeleton';
import { LoadStateEnum } from '../../enums/load-state-enum';

@Component({
  selector: 'app-info-user-settings',
  imports: [UserInfoForm, FormButton, Skeleton],
  templateUrl: './info-user-settings.html',
})
export class InfoUserSettings implements OnInit {
  protected editable = signal<boolean>(false);
  private readonly userService = inject(UsersService);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly messageService = inject(ToastService);
  protected readonly loadStateEnum = LoadStateEnum;
  private readonly userLoad = signal<AsyncResource<UserResponseModel>>(
    AsyncResource.loading({} as UserResponseModel),
  );

  protected userData = computed(() => this.userLoad().data);
  protected state = computed(() => this.userLoad().state);
  protected rows = computed(() => [
    { icon: 'pi pi-user', label: 'Nome', value: this.userData().name || '-' },
    { icon: 'pi pi-at', label: 'Login', value: this.userData().username || '-' },
    { icon: 'pi pi-envelope', label: 'Email', value: this.userData().email || '-' },
  ]);

  handleClick() {
    this.editable.update((v) => !v);
  }

  onSaved(user: UserResponseModel) {
    this.userLoad.set(AsyncResource.success({ ...this.userData(), ...user }));
    this.editable.set(false);
  }

  loadInitial() {
    this.userService
      .getById(this.authService.user()!.userId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          if (!result) return;

          this.userLoad.set(AsyncResource.success(result));
        },

        error: (err) => {
          this.userLoad.update((v) => AsyncResource.error(v, err));
          parseHttpError(err, ENTITY_ERROR.users.read).forEach((message) =>
            this.messageService.showError(message),
          );
        },
      });
  }

  ngOnInit(): void {
    this.loadInitial();
  }
}
