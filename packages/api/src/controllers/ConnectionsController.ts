import { BodyParams, PathParams } from "@tsed/common";
import { Controller, Inject } from "@tsed/di";
import { ContentType, Get, Post, Put, Delete } from "@tsed/schema";
import { ConnectionCreateParams } from "src/interfaces/ConnectionParams";
import { ConnectionService } from "src/services/connections/ConnectionService";

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
  create(@BodyParams() config: ConnectionCreateParams) {
    return this.connectionService.create(config);
  }

  @Post("/apply")
  apply() {}

  @Put(":id")
  update(
    @PathParams("id") id: number,
    @BodyParams() config: ConnectionCreateParams
  ) {
    return this.connectionService.update(id, config);
  }

  @Delete(":id")
  delete(@PathParams("id") id: number) {
    return this.connectionService.delete(id);
  }
}
