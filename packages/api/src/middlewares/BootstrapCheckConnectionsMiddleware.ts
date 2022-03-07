import { Middleware, MiddlewareMethods } from "@tsed/common";
import { Forbidden } from "@tsed/exceptions";
import { getConnections } from "src/config/databases";

@Middleware()
export class BootstrapCheckConnectionsMiddleware implements MiddlewareMethods {
  use() {
    const connections = getConnections();
    if (connections.length > 0) {
      throw new Forbidden("База уже создана");
    }
  }
}
