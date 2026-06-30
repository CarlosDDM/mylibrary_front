import { Role } from '../enums/role-enum';

export interface UserModel {
  name: string | null;
  username: string;
  password: string;
  email: string | null;
  role?: Role;
}
