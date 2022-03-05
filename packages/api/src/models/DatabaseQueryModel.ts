import { Property, Required } from "@tsed/schema";

export class DatabaseQueryModel {
  @Required()
  @Property()
  query: string;

  @Required()
  @Property()
  params: { [key: string]: any };
}
