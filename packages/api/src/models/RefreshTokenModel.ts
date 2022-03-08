import { Property, Required } from "@tsed/schema";

export class RefreshTokenModel {
  @Required()
  @Property()
  refreshToken: string;
}
