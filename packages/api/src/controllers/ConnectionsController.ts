import { BodyParams, PathParams, UseAuth } from "@tsed/common";
import { Controller, Inject } from "@tsed/di";
import { ContentType, Get, Post, Put, Delete } from "@tsed/schema";
import { Auth } from "src/decorators/Auth";
import { ConnectionCreateParams } from "src/interfaces/ConnectionParams";
import { BootstrapCheckConnectionsMiddleware } from "src/middlewares/BootstrapCheckConnectionsMiddleware";
import { CheckRoleMiddleware } from "src/middlewares/CheckRoleMiddleware";
import { UserRole } from "src/models/AccountModel";
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
  @Auth()
  @UseAuth(CheckRoleMiddleware, { roles: [UserRole.Admin] })
  create(@BodyParams(ConnectionsModel) config: ConnectionsModel) {
    return this.connectionService.create(config);
  }

  @Post("/create/by-file")
  @Auth()
  @UseAuth(CheckRoleMiddleware, { roles: [UserRole.Admin] })
  createByFile(
    @BodyParams(ConnectionsModelByFile) config: ConnectionsModelByFile
  ) {
    return this.connectionService.createByFile(config);
  }

  @Post("/create/by-url")
  @Auth()
  @UseAuth(CheckRoleMiddleware, { roles: [UserRole.Admin] })
  createByUrl(
    @BodyParams(ConnectionsModelByUrl) config: ConnectionsModelByUrl
  ) {
    return this.connectionService.createByUrl(config);
  }

  @Post("/:contextName")
  @Auth()
  @UseAuth(CheckRoleMiddleware, { roles: [UserRole.Admin] })
  apply(
    @PathParams("contextName") contextName: string,
    @BodyParams(DatabaseQueryModel) params: DatabaseQueryModel
  ) {
    return this.connectionService.apply(contextName, params);
  }

  @Get("/connection/:contextName")
  @Auth()
  @UseAuth(CheckRoleMiddleware, { roles: [UserRole.Admin] })
  findOne(@PathParams("contextName") contextName: string) {
    return this.connectionService.findOne(contextName);
  }

  @Put("/:id")
  @Auth()
  @UseAuth(CheckRoleMiddleware, { roles: [UserRole.Admin] })
  update(
    @PathParams("id") id: string,
    @BodyParams()
    config: ConnectionsModel | ConnectionsModelByUrl
  ) {
    return this.connectionService.update(id, config);
  }

  @Delete("/:id")
  @Auth()
  @UseAuth(CheckRoleMiddleware, { roles: [UserRole.Admin] })
  delete(@PathParams("id") id: string) {
    return this.connectionService.delete(id);
  }

  @Get("/bootstrap")
  isBootstrap() {
    return this.connectionService.isBootstrap();
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
