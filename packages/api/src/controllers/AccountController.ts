import {
  BodyParams,
  Cookies,
  PathParams,
  QueryParams,
  Req,
  Res,
  UseAfter,
  UseAuth,
} from "@tsed/common";
import { Controller, Inject, ProviderScope, Scope } from "@tsed/di";
import {
  Delete,
  email,
  GenericOf,
  Get,
  Post,
  Put,
  Redirect,
} from "@tsed/schema";
import { CheckRoleMiddleware } from "src/middlewares/CheckRoleMiddleware";
import {
  AccountModel,
  UpdateAccountModel,
  UserRole,
} from "src/models/AccountModel";
import { AccountService } from "src/services/AccountService";
import { Authenticate } from "@tsed/passport";
import { User } from "src/entities/default/User";
import { UserDto } from "src/dto/UserDto";
import { Auth } from "src/decorators/Auth";
import { RefreshTokenModel } from "src/models/RefreshTokenModel";
import { FindPaginationModel } from "src/models/FindPaginationModel";
import { FilterQuery } from "@mikro-orm/core";
import { publicUrl } from "src/config/env";
import { URL } from "url";
import { LoginModel } from "src/models/LoginModel";
import {
  ForgotAfterMiddleware,
  ForgotMiddleware,
} from "src/middlewares/ForgotMiddleware";
@Controller("/account")
@Scope(ProviderScope.SINGLETON)
export class AccountController {
  @Inject()
  protected service: AccountService;

  @Get("/")
  get() {
    return "hello";
  }

  @Get("/roles")
  roles() {
    return this.service.roles();
  }

  @Get("/forgot")
  checkToken(
    @QueryParams("email") email: string,
    @QueryParams("uuid") uuid: string,
    @Res() res: Res
  ) {
    const url = new URL("http://localhost:4200");
    url.searchParams.append("email", email);
    url.searchParams.append("uuid", uuid);
    url.pathname = "/forgot/restore";
    return res.redirect(url.toString());
  }

  @Post("/forgot")
  forgot(@Req() req: Req, @BodyParams("email") email: string) {
    return this.service.forgot(email);
  }

  @Get("/detail/:id")
  @Auth()
  @UseAuth(CheckRoleMiddleware, { roles: [UserRole.Admin] })
  findAccount(@PathParams("id") id: number) {
    return this.service.findAccount(id);
  }

  @Put("/restore-password/:token")
  @UseAuth(ForgotMiddleware)
  @UseAfter(ForgotAfterMiddleware)
  updatePassword(@BodyParams(LoginModel) { email, password }: LoginModel) {
    this.service.updatePasswordByMail(email, password);
  }

  @Post("/list")
  @Auth()
  @UseAuth(CheckRoleMiddleware, { roles: [UserRole.Admin] })
  findMany(
    @BodyParams(FindPaginationModel)
    @GenericOf(User)
    model: FindPaginationModel<User>
  ) {
    return this.service.findMany(model);
  }

  @Post("/signup")
  @Authenticate("signup")
  async signUp(
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

  @Post("/create")
  @Auth()
  @UseAuth(CheckRoleMiddleware, { roles: [UserRole.Admin] })
  async create(@BodyParams(AccountModel) account: AccountModel) {
    const user = await this.service.create(account);
    const signUser = await this.service.signUp(user);
    return new UserDto(signUser);
  }

  @Post("/user")
  @Auth()
  @UseAuth(CheckRoleMiddleware, { roles: [UserRole.Admin] })
  getUser(@Req("user") user: User) {
    return new UserDto(user);
  }

  @Get("/logout")
  async logout(@Req() req: Req, @Res() res: Res) {
    await this.service.logout(req.cookies["refreshToken"]);
    res.clearCookie("refreshToken");
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

  @Delete("/:id")
  @Auth()
  @UseAuth(CheckRoleMiddleware, { roles: [UserRole.Admin] })
  delete(@PathParams("id") id: number) {
    return this.service.delete(id);
  }

  @Put("/:id")
  @Auth()
  @UseAuth(CheckRoleMiddleware, { roles: [UserRole.Admin] })
  update(
    @PathParams("id") id: number,
    @BodyParams(UpdateAccountModel)
    updateParams: UpdateAccountModel
  ) {
    return this.service.update(id, updateParams);
  }
}
