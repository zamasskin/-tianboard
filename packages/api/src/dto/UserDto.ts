import { User } from "src/entities/default/User";
import { UserRole } from "src/models/AccountModel";

export class UserDto {
  id: number;
  email: string;
  firstName: string;
  secondName: string;
  groups: UserRole[];

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.firstName = user.firstName;
    this.secondName = user.secondName;
    this.groups = user.roles;
  }
}
