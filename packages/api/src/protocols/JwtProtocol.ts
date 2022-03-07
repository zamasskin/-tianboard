import { Req } from "@tsed/common";
import { Inject } from "@tsed/di";
import { BadRequest, Unauthorized } from "@tsed/exceptions";
import { Arg, OnVerify, Protocol } from "@tsed/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "src/entities/default/User";
import { AccountService } from "src/services/AccountService";
import { TokenService } from "src/services/TokenService";
import bcrypt from "bcrypt";

@Protocol({
  name: "jwt",
  useStrategy: Strategy,
  settings: {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || "JWT_ACCESS_SECRET",
    expiresIn: "30s",
    // issuer: process.env.JWT_ISSUER || "localhost",
    // audience: process.env.JWT_AUDIENCE || "localhost",
  },
})
export class JwtProtocol implements OnVerify {
  @Inject()
  tokenService: TokenService;

  @Inject()
  accountService: AccountService;

  async $onVerify(
    @Req() req: Express.Request,
    @Arg(0) jwtPayload: User
  ): Promise<User | false> {
    console.log("---".repeat(100));
    const { id, password } = jwtPayload;

    const user = await this.accountService.findOne({ id });
    if (user && user.password === password) {
      req.user = user;
      return user;
    }

    return false;
  }
}
