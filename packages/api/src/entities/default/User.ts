import {
  Collection,
  Entity,
  Enum,
  OneToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import { AccountModel, UserRole, UserStatus } from "src/models/AccountModel";
import { Token } from "./Token";

@Entity()
export class User {
  @PrimaryKey()
  id: number;

  @Property()
  firstName: string;

  @Property()
  secondName: string;

  @Property()
  email: string;

  @Property()
  password: string;

  @Enum({ items: () => UserRole, array: true, default: [UserRole.User] })
  roles: UserRole[] = [UserRole.User];

  @Enum({ items: () => UserStatus, default: UserStatus.Active })
  status: UserStatus = UserStatus.Active;

  @OneToMany(() => Token, (token) => token.user)
  tokens = new Collection<Token>(this);

  constructor(account?: AccountModel) {
    if (account) {
      this.firstName = account.firstName;
      this.secondName = account.secondName;
      this.email = account.email;
      this.password = account.password;
      this.roles = account.roles;
      this.status = account.status;
    }
  }

  verifyPassword(password: string) {
    return true;
  }
}
