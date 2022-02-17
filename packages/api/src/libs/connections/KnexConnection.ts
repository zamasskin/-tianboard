import _ from "lodash";
import knex, { Knex } from "knex";
import { ConnectionStringParser } from "connection-string-parser";
import ConnectionAbstract from "src/abstract/ConnectionAbstract";
import { ConnectionApplyParams } from "src/interfaces/ConnectionParams";

export type providerType = "mysql" | "pg" | "postgres" | "sqlite" | "sqlite3";
export const PROVIDERS = ["mysql", "pg", "postgres", "sqlite", "sqlite3"];

export default class KnexConnection extends ConnectionAbstract<Knex> {
  connect(provider: providerType, connectionUrl: string) {
    switch (provider) {
      case "mysql": // Mysql Connection
        const connectionStringParser = new ConnectionStringParser({
          scheme: "mysql",
          hosts: [],
        });
        const params = connectionStringParser.parse(connectionUrl);
        return knex({
          client: "mysql",
          connection: {
            host: _.first(params.hosts)?.host || "localhost",
            port: _.first(params.hosts)?.port || 3306,
            user: params.username,
            password: params.password,
          },
        });
      case "pg":
      case "postgres": // Postgres connection
        return knex({
          client: "pg",
          connection: connectionUrl,
        });
      case "sqlite":
      case "sqlite3": // Sqlite connection
        return knex({
          client: "sqlite3",
          connection: {
            filename: connectionUrl,
          },
        });
    }
  }

  destroy() {
    this.provider.destroy();
  }

  async apply({ query, params }: ConnectionApplyParams) {
    return this.provider.raw(query);
  }
}
