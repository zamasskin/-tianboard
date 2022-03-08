import { BodyParams, Cookies, Req, Res, UseAuth } from "@tsed/common";
import { Controller, Inject, ProviderScope, Scope } from "@tsed/di";
import { Get, parameters, Post } from "@tsed/schema";
import { CheckRoleMiddleware } from "src/middlewares/CheckRoleMiddleware";
import { AccountModel, UserRole } from "src/models/AccountModel";
import { AccountService } from "src/services/AccountService";
import { Authenticate } from "@tsed/passport";
import { User } from "src/entities/default/User";
import { LoginModel } from "src/models/LoginModel";
import { UserDto } from "src/dto/UserDto";
import { Auth } from "src/decorators/Auth";
import { RefreshTokenModel } from "src/models/RefreshTokenModel";
@Controller("/account")
@Scope(ProviderScope.SINGLETON)
export class AccountController {
  @Inject()
  protected service: AccountService;

  @Get("/")
  get() {
    return "hello";
  }

  @Post("/create")
  @Authenticate("signup")
  async create(
    @Req() req: Req,
    @BodyParams(AccountModel) account: AccountModel
  ) {
    return req.user;
  }

  @Post("/bootstrap")
  @Authenticate("bootstrap")
  async bootstrap(@Req("user") user: User, @Res() res: Res) {
    const userData = await this.service.response(user);
    res.cookie("refreshToken", userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return userData;
  }

  @Post("/login")
  @Authenticate("login", { failWithError: false })
  async login(@Req("user") user: User, @Res() res: Res) {
    const userData = await this.service.response(user);
    res.cookie("refreshToken", userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return userData;
  }

  @Post("/signup")
  @Auth()
  @UseAuth(CheckRoleMiddleware, { roles: [UserRole.Admin] })
  async signUp(@BodyParams(AccountModel) account: AccountModel) {
    const user = await this.service.create(account);
    const signUser = await this.service.signUp(user);
    return new UserDto(signUser);
  }

  @Get("/logout")
  logout(@Req() req: Req) {
    req.logout();
  }

  @Get("/refresh")
  async refresh(
    @Cookies("refreshToken") refreshToken: string,
    @Res() res: Res
  ) {
    const userData = await this.service.refresh(refreshToken);
    res.cookie("refreshToken", userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return userData;
  }

  @Post("/refresh")
  async refreshPost(
    @Res() res: Res,
    @BodyParams(RefreshTokenModel) { refreshToken }: RefreshTokenModel
  ) {
    const userData = await this.service.refresh(refreshToken);
    res.cookie("refreshToken", userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return userData;
  }
}
