import { Injectable } from "@tsed/di";
import { Orm } from "@tsed/mikro-orm";
import { MikroORM } from "@mikro-orm/core";
import { AccountModel } from "src/models/AccountModel";
import { User } from "src/entities/default/User";

@Injectable()
export class AccountService {
  @Orm("default")
  private readonly orm!: MikroORM;

  async create(account: AccountModel) {
    const user = await this.orm.em.fork({}).create(User, account);
    return user;
  }
}
