import { Property, Required } from "@tsed/schema";

export class ConnectionsModel {
  @Property()
  @Required()
  connectionName: string;

  @Property()
  @Required()
  port: number;

  @Property()
  @Required()
  host: string;

  @Property()
  @Required()
  user: string;

  @Property()
  @Required()
  password: string;

  @Property()
  @Required()
  type: string;

  @Property()
  @Required()
  dbName: string;
}

export class ConnectionsModelByFile {
  @Property()
  @Required()
  connectionName: string;

  @Property()
  @Required()
  type: string;
}

export class ConnectionsModelByUrl {
  @Property()
  @Required()
  connectionName: string;

  @Property()
  @Required()
  clientUrl: string;

  @Property()
  @Required()
  type: string;
}
