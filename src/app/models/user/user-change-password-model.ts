export interface UserChangePasswordModel {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserChangePasswordAdminModel {
  newPassword: string;
}
