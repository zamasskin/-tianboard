import { BodyParams, Inject, Req } from "@tsed/common";
import { OnVerify, Protocol } from "@tsed/passport";
import { AccountModel, UserRole } from "src/models/AccountModel";
import { Strategy } from "passport-local";
import { AccountService } from "src/services/AccountService";

@Protocol({
  name: "signup",
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
    const user = await this.accountService.create(account);
    user.roles = [UserRole.User];
    const signUpUser = await this.accountService.signUp(user);
    return signUpUser;
  }
}
