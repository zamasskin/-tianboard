import { BodyParams, Inject, PathParams } from "@tsed/common";
import { Forbidden } from "@tsed/exceptions";
import { Middleware } from "@tsed/platform-middlewares";
import { LoginModel } from "src/models/LoginModel";
import { AccountService } from "src/services/AccountService";

@Middleware()
export class ForgotMiddleware {
  @Inject()
  private readonly accountService: AccountService;

  async use(
    @PathParams("token") token: string,
    @BodyParams(LoginModel) { email }: LoginModel
  ) {
    const savedToken = await this.accountService.getForgotToken(email);
    if (savedToken !== token) {
      throw new Forbidden("access denied");
    }
  }
}

@Middleware()
export class ForgotAfterMiddleware {
  @Inject()
  private readonly accountService: AccountService;

  async use(
    @PathParams("token") token: string,
    @BodyParams(LoginModel) { email }: LoginModel
  ) {
    await this.accountService.deleteForgotToken(email);
  }
}
