import _ from "lodash";
import { Orm } from "@tsed/mikro-orm";
import { Middleware, MiddlewareMethods } from "@tsed/platform-middlewares";
import { Context } from "@tsed/platform-params";
import { MikroORM } from "@mikro-orm/core";
import { User } from "src/entities/default/User";
import { Inject } from "@tsed/di";
import { AccountService } from "src/services/AccountService";
import { Forbidden, Unauthorized } from "@tsed/exceptions";
import { Req } from "@tsed/common";

@Middleware()
export class CheckRoleMiddleware implements MiddlewareMethods {
  @Inject()
  private readonly accountService: AccountService;

  async use(@Req() request: Req, @Context() ctx: Context) {
    const options = ctx.endpoint.get(CheckRoleMiddleware) || {};

    if (!request?.isAuthenticated()) {
      throw new Unauthorized("Unauthorized 1");
    }

    const user = request?.user as User;
    const roles = user.roles || [];

    if (
      options?.roles &&
      _.isArray(options?.roles) &&
      _.intersection(roles, options?.roles).length === 0
    ) {
      throw new Forbidden("access denied");
    }

    if (options?.role && !roles.includes(options.role)) {
      throw new Forbidden("access denied");
    }
  }
}
