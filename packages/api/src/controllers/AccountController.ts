import {
  BodyParams,
  Cookies,
  PathParams,
  Req,
  Res,
  UseAuth,
} from "@tsed/common";
import { Controller, Inject, ProviderScope, Scope } from "@tsed/di";
import { Delete, GenericOf, Get, Post } from "@tsed/schema";
import { CheckRoleMiddleware } from "src/middlewares/CheckRoleMiddleware";
import { AccountModel, UserRole } from "src/models/AccountModel";
import { AccountService } from "src/services/AccountService";
import { Authenticate } from "@tsed/passport";
import { User } from "src/entities/default/User";
import { UserDto } from "src/dto/UserDto";
import { Auth } from "src/decorators/Auth";
import { RefreshTokenModel } from "src/models/RefreshTokenModel";
import { FindAccountModel } from "src/models/FindAccountModel";
import { FindPaginationModel } from "src/models/FindPaginationModel";
import { FilterQuery } from "@mikro-orm/core";
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

  @Post("/list")
  // @Auth()
  // @UseAuth(CheckRoleMiddleware, { roles: [UserRole.Admin] })
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
}
