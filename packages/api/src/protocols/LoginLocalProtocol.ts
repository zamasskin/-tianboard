import { BodyParams, Constant, Inject, Req, Res } from "@tsed/common";
import { Unauthorized, BadRequest } from "@tsed/exceptions";
import { OnVerify, Protocol } from "@tsed/passport";
import * as jwt from "jsonwebtoken";
import { IStrategyOptions, Strategy } from "passport-local";
import { UserDto } from "src/dto/UserDto";
import { User } from "src/entities/default/User";
import { AccountService } from "src/services/AccountService";

import bcrypt from "bcrypt";
import { LoginModel } from "src/models/LoginModel";

@Protocol<IStrategyOptions>({
  name: "login",
  useStrategy: Strategy,
  settings: {
    usernameField: "email",
    passwordField: "password",
  },
})
export class LoginLocalProtocol implements OnVerify {
  @Inject()
  accountService: AccountService;

  async $onVerify(@BodyParams(LoginModel) credentials: LoginModel) {
    const { email, password } = credentials;

    const user = await this.accountService.findOne({ email });
    if (!user) {
      throw new BadRequest("Пользователь с таким email не найден");
    }

    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw new BadRequest("Неверный пароль");
    }

    return user;
  }
}
