import { Inject, Injectable } from "@tsed/di";
import { Orm } from "@tsed/mikro-orm";
import { FilterQuery, FindOptions, MikroORM } from "@mikro-orm/core";
import { AccountModel } from "src/models/AccountModel";
import { User } from "src/entities/default/User";
import * as jwt from "jsonwebtoken";
import { Forbidden, NotFound, Unauthorized } from "@tsed/exceptions";

import { UserDto } from "src/dto/UserDto";
import bcrypt from "bcrypt";
import { TokenService } from "./TokenService";
import { FindAccountModel } from "src/models/FindAccountModel";
import { FindPaginationModel } from "src/models/FindPaginationModel";

@Injectable()
export class AccountService {
  @Orm("default")
  private readonly orm!: MikroORM;

  @Inject()
  private tokenService: TokenService;

  get repository() {
    return this.orm.em.getRepository(User);
  }

  async create(account: AccountModel) {
    const { email } = account;
    const found = await this.findOne({ email });

    if (found) {
      throw new Forbidden("Email is already registered");
    }

    const hashPassword = await bcrypt.hash(account.password, 3);
    const user = new User({
      ...account,
      password: hashPassword,
    });
    return user;
  }

  async signUp(user: User) {
    await this.orm.em.persistAndFlush(user);
    return user;
  }

  findOne(where: FilterQuery<User>): Promise<User | null> {
    const userRepository = this.orm.em.getRepository(User);
    return userRepository.findOne(where);
  }

  async findMany(model: FindPaginationModel<User>) {
    const userRepository = this.orm.em.getRepository(User);
    const [data, count] = await Promise.all([
      userRepository.find(model.where, model.options),
      this.count(),
    ]);
    return {
      data,
      count,
      perPage: model.perPage,
      currentPage: model.currentPage,
    };
  }

  count() {
    return this.orm.em.fork({}).count(User);
  }

  roles() {
    return [
      { value: "user", name: "Пользователь" },
      { value: "moderator", name: "Модератор" },
      { value: "admin", name: "Администратор" },
    ];
  }

  async response(user: User) {
    const token = this.tokenService.generateTokens(new UserDto(user));
    await this.tokenService.saveToken(user, token.refreshToken);
    return {
      ...token,
      bearerFormat: "Bearer",
      user: new UserDto(user),
    };
  }

  async refresh(refreshToken?: string) {
    if (!refreshToken) {
      throw new Unauthorized("token not found");
    }

    const userData = this.tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await this.tokenService.findOne({ refreshToken });
    if (!userData || !tokenFromDb) {
      throw new Unauthorized("token not found");
    }

    const user = await this.findOne({ id: tokenFromDb.user.id });
    if (!user) {
      throw new Unauthorized("user not found");
    }

    return this.response(user);
  }

  logout(refreshToken: string) {
    return this.tokenService.remove({ refreshToken });
  }
}
