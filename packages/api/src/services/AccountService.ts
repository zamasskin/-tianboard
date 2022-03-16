import { Inject, Injectable } from "@tsed/di";
import { Orm } from "@tsed/mikro-orm";
import { FilterQuery, MikroORM } from "@mikro-orm/core";
import { AccountModel, UpdateAccountModel } from "src/models/AccountModel";
import { User } from "src/entities/default/User";
import { Forbidden, NotFound, Unauthorized } from "@tsed/exceptions";
import * as uuid from "uuid";
import bcrypt from "bcrypt";

import { originUrl } from "src/config/env";
import { UserDto } from "src/dto/UserDto";
import { TokenService } from "./TokenService";
import { FindPaginationModel } from "src/models/FindPaginationModel";
import { PlatformCache, ValidationError } from "@tsed/common";
import { MailService } from "./MailService";
import ForgotMail from "src/views/mail/ForgotMail";

@Injectable()
export class AccountService {
  @Orm("default")
  private readonly orm!: MikroORM;

  @Inject()
  private tokenService: TokenService;

  @Inject()
  mailService: MailService;

  @Inject()
  cache: PlatformCache;

  get repository() {
    return this.orm.em.getRepository(User);
  }

  async create(account: AccountModel) {
    const { email } = account;
    const found = await this.findOne({ email });

    if (found) {
      throw new Forbidden("Email is already registered");
    }

    const hashPassword = await this.hash(account.password);
    const user = new User({
      ...account,
      password: hashPassword,
    });
    return user;
  }

  hash(password: string) {
    return bcrypt.hash(password, 3);
  }

  async findAccount(id: number) {
    const user = await this.findOne({ id });
    if (!user) {
      throw new NotFound("user not found");
    }
    return {
      ...new UserDto(user),
    };
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

  async delete(id: number) {
    const user = await this.findOne({ id });
    const userRepository = this.orm.em.getRepository(User);
    return userRepository.removeAndFlush([user]);
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

  async update(id: number, updateParams: UpdateAccountModel) {
    const userRepository = this.orm.em.getRepository(User);
    const user = await this.findOne({ id });
    if (!user) {
      throw new NotFound("user not found");
    }

    if (user.email !== updateParams.email) {
      const similarUser = await this.findOne({ email: updateParams.email });
      if (similarUser) {
        throw new ValidationError(
          `Email '${updateParams.email}' is already registered`
        );
      }
    }

    user.firstName = updateParams.firstName;
    user.secondName = updateParams.secondName;
    user.email = updateParams.email;
    user.roles = updateParams.roles;
    user.status = updateParams.status;
    if (updateParams.password) {
      const hashPassword = await this.hash(updateParams.password);
      user.password = hashPassword;
    }
    return userRepository.persistAndFlush([user]);
  }

  async updatePasswordByMail(email: string, password: string) {
    const userRepository = this.orm.em.getRepository(User);
    const user = await this.findOne({ email });
    if (!user) {
      throw new NotFound("user not found");
    }
    const hashPassword = await this.hash(password);
    user.password = hashPassword;
    return userRepository.persistAndFlush([user]);
  }

  setForgotToken(email: string, token: string) {
    this.cache.set(`account/forgot/${email}`, token, { ttl: 60 * 60 * 1000 });
  }

  getForgotToken(email: string) {
    return this.cache.get(`account/forgot/${email}`);
  }

  deleteForgotToken(email: string) {
    return this.cache.del(`account/forgot/${email}`);
  }

  async forgot(email: string) {
    const user = await this.findOne({ email });
    if (!user) {
      throw new NotFound("user not found");
    }

    const token = uuid.v4();
    const mailParams = ForgotMail(email, token);
    const result = this.mailService.send(mailParams);
    await this.setForgotToken(email, token);
    return result;
  }
}
