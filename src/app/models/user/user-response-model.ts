import { Role } from '../../enums/role-enum';

export interface UserResponseModel {
  name?: string | null;
  email?: string | null;
  username: string;
  role?: Role;
}
