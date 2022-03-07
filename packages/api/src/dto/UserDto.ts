import { User } from "src/entities/default/User";

export class UserDto {
  id: number;
  email: string;
  firstName: string;
  secondName: string;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.firstName = user.firstName;
    this.secondName = user.secondName;
  }
}
