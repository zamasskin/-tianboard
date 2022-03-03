import {
  Collection,
  Entity,
  ManyToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import { User } from "./User";

@Entity()
export class Group {
  @PrimaryKey()
  id: number;

  @Property()
  name: string;

  @Property()
  superAdmin: boolean;

  @ManyToMany(() => User)
  users = new Collection<User>(this);
}
