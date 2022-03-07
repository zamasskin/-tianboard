import { BodyParams, PathParams, UseAuth } from "@tsed/common";
import { Controller, Inject } from "@tsed/di";
import { ContentType, Get, Post, Put, Delete } from "@tsed/schema";
import { ConnectionCreateParams } from "src/interfaces/ConnectionParams";
import { BootstrapCheckConnectionsMiddleware } from "src/middlewares/BootstrapCheckConnectionsMiddleware";
import { CheckRoleMiddleware } from "src/middlewares/CheckRoleMiddleware";
import {
  ConnectionsModel,
  ConnectionsModelByFile,
  ConnectionsModelByUrl,
} from "src/models/ConnectionsModel";
import { DatabaseQueryModel } from "src/models/DatabaseQueryModel";
import { ConnectionService } from "src/services/ConnectionService";

@Controller("/connections")
export class ConnectionController {
  @Inject()
  protected connectionService: ConnectionService;

  @Get("/")
  @ContentType("application/json")
  getAll() {
    return this.connectionService.findMany();
  }

  @Post("/create")
  @UseAuth(CheckRoleMiddleware)
  create(@BodyParams(ConnectionsModel) config: ConnectionsModel) {
    return this.connectionService.create(config);
  }

  @Post("/create/by-file")
  @UseAuth(CheckRoleMiddleware)
  createByFile(
    @BodyParams(ConnectionsModelByFile) config: ConnectionsModelByFile
  ) {
    return this.connectionService.createByFile(config);
  }

  @Post("/create/by-url")
  @UseAuth(CheckRoleMiddleware)
  createByUrl(
    @BodyParams(ConnectionsModelByUrl) config: ConnectionsModelByUrl
  ) {
    return this.connectionService.createByUrl(config);
  }

  @Post("/:contextName")
  @UseAuth(CheckRoleMiddleware)
  apply(
    @PathParams("contextName") contextName: string,
    @BodyParams(DatabaseQueryModel) params: DatabaseQueryModel
  ) {
    return this.connectionService.apply(contextName, params);
  }

  @Put("/:id")
  @UseAuth(CheckRoleMiddleware)
  update(
    @PathParams("id") id: number,
    @BodyParams() config: ConnectionCreateParams
  ) {
    return this.connectionService.update(id, config);
  }

  @Delete("/:id")
  @UseAuth(CheckRoleMiddleware)
  delete(@PathParams("id") id: number) {
    return this.connectionService.delete(id);
  }

  @UseAuth(BootstrapCheckConnectionsMiddleware)
  @Post("/bootstrap")
  bootstrap(@BodyParams(ConnectionsModel) config: ConnectionsModel) {
    return this.connectionService.create(config);
  }

  @UseAuth(BootstrapCheckConnectionsMiddleware)
  @Post("/bootstrap/by-file")
  bootstrapByFile(
    @BodyParams(ConnectionsModelByFile) config: ConnectionsModelByFile
  ) {
    return this.connectionService.createByFile(config);
  }

  @UseAuth(BootstrapCheckConnectionsMiddleware)
  @Post("/bootstrap/by-url")
  bootstrapByUrl(
    @BodyParams(ConnectionsModelByUrl) config: ConnectionsModelByUrl
  ) {
    return this.connectionService.createByUrl(config);
  }
}
