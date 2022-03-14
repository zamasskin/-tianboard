import { Enum, Property, Groups } from "@tsed/schema";
import { UserRole, UserStatus } from "./AccountModel";

export class FindAccountModel {
  @Property()
  @Groups("where")
  id?: number;

  @Property()
  firstName?: string;

  @Property()
  secondName?: string;

  @Property()
  email?: string;

  @Property()
  @Enum(UserRole)
  roles?: UserRole;

  @Enum(UserStatus)
  status?: UserStatus;
}
