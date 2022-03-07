import { Format, Property, Required } from "@tsed/schema";

export class LoginModel {
  @Required()
  @Format("email")
  email: string;

  @Required()
  password: string;
}
