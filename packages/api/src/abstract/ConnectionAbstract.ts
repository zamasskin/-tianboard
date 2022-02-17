import { ConnectionApplyParams } from "src/interfaces/ConnectionParams";

export default abstract class ConnectionAbstract<T> {
  provider: T;
  constructor(url: string, connectionUrl: string) {
    this.provider = this.connect(url, connectionUrl);
  }

  abstract connect(url: string, connectionUrl: string): T;
  abstract destroy(): void;
  abstract apply(params: ConnectionApplyParams): unknown;
}
