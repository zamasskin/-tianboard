import { User } from "src/entities/default/User";
import { UserRole, UserStatus } from "src/models/AccountModel";

export class UserDto {
  id: number;
  email: string;
  firstName: string;
  secondName: string;
  roles: UserRole[];
  status: UserStatus;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.firstName = user.firstName;
    this.secondName = user.secondName;
    this.roles = user.roles;
    this.status = user.status;
  }
}
