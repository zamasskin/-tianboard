import { BodyParams, Inject, Req } from "@tsed/common";
import { Forbidden, NotFound } from "@tsed/exceptions";
import { OnVerify, Protocol } from "@tsed/passport";
import { AccountModel } from "src/models/AccountModel";
import { Strategy } from "passport-local";
import { AccountService } from "src/services/AccountService";
import bcrypt from "bcrypt";
import { UserDto } from "src/dto/UserDto";

import { User } from "src/entities/default/User";

@Protocol({
  name: "bootstrap",
  useStrategy: Strategy,
  settings: {
    usernameField: "email",
    passwordField: "password",
  },
})
export class SignupLocalProtocol implements OnVerify {
  @Inject()
  accountService: AccountService;

  async $onVerify(@BodyParams(AccountModel) account: AccountModel) {
    const count = await this.accountService.count();
    if (count > 0) {
      throw new Forbidden("Суперпользователь уже создан");
    }
    const user = await this.accountService.create(account);
    return this.accountService.signUp(user);
  }
}
