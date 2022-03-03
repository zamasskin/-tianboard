import {
  Collection,
  Entity,
  ManyToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import { Group } from "./Group";

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

  @ManyToMany(() => Group, (group) => group.users)
  groups = new Collection<Group>(this);
}
