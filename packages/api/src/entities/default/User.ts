import { Entity, Enum, PrimaryKey, Property } from "@mikro-orm/core";
import { AccountModel, UserRole, UserStatus } from "src/models/AccountModel";
import crypto from "crypto";

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

  @Enum({ items: () => UserStatus, array: true, default: UserStatus.Active })
  status: UserStatus = UserStatus.Active;

  constructor(account?: AccountModel) {
    if (account) {
      this.firstName = account.firstName;
      this.secondName = account.secondName;
      this.email = account.email;
      this.password = crypto
        .createHash("md5")
        .update(account.password)
        .digest("hex");
      this.roles = account.roles;
      this.status = account.status;
    }
  }
}
