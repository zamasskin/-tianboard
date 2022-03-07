import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { User } from "./User";

@Entity()
export class Token {
  @PrimaryKey()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @Property()
  refreshToken: string;

  constructor(user: User, refreshToken: string) {
    this.user = user;
    this.refreshToken = refreshToken;
  }
}
