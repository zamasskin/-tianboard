import { BodyParams, PathParams } from "@tsed/common";
import { Controller, Inject } from "@tsed/di";
import { NotFound } from "@tsed/exceptions";
import { ContentType, Delete, GenericOf, Get, Post, Put } from "@tsed/schema";
import { Task } from "src/entities/default/Task";
import { TaskAction } from "src/entities/default/TaskAction";
import { FindPaginationModel } from "src/models/FindPaginationModel";
import { TaskModel } from "src/models/TaskModel";
import { TaskActionsService } from "src/services/TaskAction/TaskActionsService";
import { TasksService } from "src/services/TasksService";

@Controller("/tasks")
export class TasksController {
  @Inject()
  protected taskService: TasksService;

  @Inject()
  protected taskActionService: TaskActionsService;

  @Get("/")
  get() {
    return "hello";
  }

  @Get("/methods")
  @ContentType("application/json")
  findMethods() {
    return this.taskActionService.findMethods();
  }

  @Post("/create")
  @ContentType("application/json")
  create(@BodyParams(TaskModel) model: TaskModel) {
    return this.taskService.create(model);
  }

  @Delete("/:id")
  @ContentType("application/json")
  delete(@PathParams("id") id: number) {
    return this.taskService.delete(id);
  }

  @Put("/:id")
  update(
    @PathParams("id") id: number,
    @BodyParams(TaskModel) model: TaskModel
  ) {
    return this.taskService.update(id, model);
  }

  @Post("/list")
  @ContentType("application/json")
  findMany(
    @BodyParams(FindPaginationModel)
    @GenericOf(Task)
    model: FindPaginationModel<Task>
  ) {
    return this.taskService.findMany(model);
  }

  @Get("/:id")
  @ContentType("application/json")
  async findOne(@PathParams("id") id: number) {
    const task = await this.taskService.findOne(id);
    if (!task) {
      throw new NotFound("task not found");
    }
    return task;
  }

  @Post("/action/list")
  @ContentType("application/json")
  findManyActions(
    @BodyParams(FindPaginationModel)
    @GenericOf(TaskAction)
    model: FindPaginationModel<TaskAction>
  ) {
    return this.taskActionService.findMany(model);
  }

  @Get("/action/:id")
  @ContentType("application/json")
  findOneAction(@PathParams("id") id: number) {
    return this.taskActionService.findOne(id);
  }

  @Put("/start/:id")
  @ContentType("application/json")
  start(@PathParams("id") id: number) {
    return this.taskService.start(id);
  }

  @Post("/action/pause/:id")
  @ContentType("application/json")
  pause(@PathParams("id") id: number) {
    return this.taskActionService.stop(id);
  }

  @Delete("/action/stop/:id")
  @ContentType("application/json")
  stop(@PathParams("id") id: number) {
    this.taskActionService.delete(id);
  }

  @Post("/action/restart/:id")
  @ContentType("application/json")
  restart(@PathParams("id") id: number) {
    return this.taskActionService.restart(id);
  }

  @Post("/action/next/:id")
  @ContentType("application/json")
  next(@PathParams("id") id: number) {
    return this.taskActionService.next(id);
  }

  @Post("/action/restart")
  @ContentType("application/json")
  restartAll() {
    return this.taskActionService.restartAll();
  }

  @Post("/action/next")
  @ContentType("application/json")
  nextAll() {
    return this.taskActionService.nextAll();
  }

  @Post("/start")
  @ContentType("application/json")
  startMany() {
    return this.taskService.startMany();
  }

  @Post("/pause")
  @ContentType("application/json")
  pauseMany() {
    return this.taskActionService.stopMany();
  }

  @Post("/stop")
  @ContentType("application/json")
  stopMany() {
    return this.taskActionService.clear();
  }
}
