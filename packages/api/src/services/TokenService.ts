import { FilterQuery, MikroORM } from "@mikro-orm/core";
import { Constant, Injectable } from "@tsed/di";
import { Orm } from "@tsed/mikro-orm";
import { Token } from "src/entities/default/Token";
import { User } from "src/entities/default/User";
import * as jwt from "jsonwebtoken";
import { UserDto } from "src/dto/UserDto";

@Injectable()
export class TokenService {
  @Orm("default")
  private readonly orm!: MikroORM;

  @Constant("passport.protocols.jwt.settings")
  jwtSettings: Record<string, string | number>;

  get repository() {
    return this.orm.em.getRepository(Token);
  }

  async findOne(where: FilterQuery<Token>) {
    return this.repository.findOne(where);
  }

  async saveToken(user: User, refreshToken: string) {
    let token = await this.repository.findOne({ user });
    if (token) {
      token.refreshToken = refreshToken;
      this.repository.persistAndFlush(token);
    } else {
      token = new Token(user, refreshToken);
      this.repository.persistAndFlush(token);
    }
    return token;
  }

  validateRefreshToken(token: string) {
    try {
      const userData = jwt.verify(token, "refresh");
      return userData;
    } catch (e) {
      return null;
    }
  }

  generateTokens(payload: UserDto) {
    const { secretOrKey, expiresIn } = this.jwtSettings;
    const accessToken = jwt.sign({ ...payload }, secretOrKey as string, {
      expiresIn,
    });
    const refreshToken = jwt.sign({ ...payload }, "refresh", {
      expiresIn: "30d",
    });
    return {
      accessToken,
      refreshToken,
    };
  }
}
