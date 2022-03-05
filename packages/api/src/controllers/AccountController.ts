import { BodyParams, UseAuth } from "@tsed/common";
import { Controller, Inject } from "@tsed/di";
import { Get, Post } from "@tsed/schema";
import { CheckRoleMiddleware } from "src/middlewares/CheckRoleMiddleware";
import { AccountModel, UserRole } from "src/models/AccountModel";
import { AccountService } from "src/services/AccountService";

@Controller("/account")
@UseAuth(CheckRoleMiddleware, { role: UserRole.Admin, bootstrap: "account" })
export class AccountController {
  @Inject()
  protected service: AccountService;

  @Get("/")
  get() {
    return "hello";
  }

  @Post("/create")
  create(@BodyParams(AccountModel) account: AccountModel) {
    return this.service.create(account);
  }
}
