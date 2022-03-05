import { Orm } from "@tsed/mikro-orm";
import { Middleware, MiddlewareMethods } from "@tsed/platform-middlewares";
import { Context } from "@tsed/platform-params";
import { MikroORM } from "@mikro-orm/core";
import { User } from "src/entities/default/User";

@Middleware()
export class CheckRoleMiddleware implements MiddlewareMethods {
  @Orm("default")
  private readonly orm!: MikroORM;

  async use(@Context() ctx: Context) {
    const options = ctx.endpoint.get(CheckRoleMiddleware) || {};
    if (options?.bootstrap === "account") {
      // const users = await this.orm.em.find(User, {}, { limit: 1 });
      // console.log(users);
    }

    // Тут проверка кода
  }
}
