export class ConnectionDto {
  connectionName: string;
  type: string;
  contextName: string;
  port: number;
  host: string;
  dbName: string;
  user: string;

  constructor(config: any) {
    if (config?.connectionName) {
      this.connectionName = config.connectionName;
    }

    if (config?.type) {
      this.type = config.type;
    }

    if (config?.contextName) {
      this.contextName = config.contextName;
    }

    if (config?.host) {
      this.host = config.host;
    }

    if (Number(config?.port)) {
      this.port = Number(config.port);
    }

    if (config?.dbName) {
      this.dbName = config.dbName;
    }

    if (config?.user) {
      this.user = config.user;
    }
  }
}
