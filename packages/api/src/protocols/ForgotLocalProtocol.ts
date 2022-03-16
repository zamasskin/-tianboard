import { Inject, QueryParams, Req } from "@tsed/common";
import { Forbidden, NotFound } from "@tsed/exceptions";
import { OnVerify, Protocol } from "@tsed/passport";
import { Strategy } from "passport-local";
import { AccountService } from "src/services/AccountService";

@Protocol({
  name: "forgot",
  useStrategy: Strategy,
  settings: {
    usernameField: "email",
    passwordField: "password",
  },
})
export class SignupLocalProtocol implements OnVerify {
  @Inject()
  accountService: AccountService;

  async $onVerify(
    @QueryParams("email") email: string,
    @QueryParams("uuid") uuid: string
  ) {
    const user = this.accountService.findOne({ email });
    if (!user) {
      throw new NotFound("email not found");
    }
    const token = await this.accountService.getForgotToken(email);
    if (token !== uuid) {
      throw new Forbidden("access denied");
    }
    await this.accountService.deleteForgotToken(email);
    return user;
  }
}
