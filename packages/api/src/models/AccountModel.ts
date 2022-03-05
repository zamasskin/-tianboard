import { Enum, Property, Required } from "@tsed/schema";

export enum UserRole {
  User = "user",
  Admin = "admin",
  Moderator = "moderator",
}

export enum UserStatus {
  Disabled = "disabled",
  Active = "active",
}

export class AccountModel {
  @Property()
  @Required()
  firstName: string;

  @Property()
  @Required()
  secondName: string;

  @Property()
  @Required()
  email: string;

  @Property()
  @Required()
  password: string;

  @Enum([UserRole])
  roles: UserRole[] = [UserRole.User];

  @Enum(UserStatus)
  status: UserStatus = UserStatus.Active;
}
