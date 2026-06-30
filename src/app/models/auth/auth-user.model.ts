import { Role } from '../../enums/role-enum';

export interface AuthUserModel {
  userId: string;
  role: Role;
}
