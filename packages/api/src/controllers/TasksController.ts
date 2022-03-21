import { BodyParams, PathParams } from "@tsed/common";
import { Controller, Inject } from "@tsed/di";
import { Delete, GenericOf, Get, Post, Put } from "@tsed/schema";
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

  @Post("/create")
  create(@BodyParams(TaskModel) model: TaskModel) {
    return this.taskService.create(model);
  }

  @Delete("/:id")
  delete(@PathParams("id") id: number) {
    return this.taskService.delete(id);
  }

  @Post("/list")
  findMany(
    @BodyParams(FindPaginationModel)
    @GenericOf(Task)
    model: FindPaginationModel<Task>
  ) {
    return this.taskService.findMany(model);
  }

  @Get("/:id")
  findOne(@PathParams("id") id: number) {
    return this.taskService.findOne(id);
  }

  @Post("/action/list")
  findManyActions(
    @BodyParams(FindPaginationModel)
    @GenericOf(TaskAction)
    model: FindPaginationModel<TaskAction>
  ) {
    return this.taskActionService.findMany(model);
  }

  @Get("/action/:id")
  findOneAction(@PathParams("id") id: number) {
    return this.taskActionService.findOne(id);
  }

  @Put("/start/:id")
  start(@PathParams("id") id: number) {
    return this.taskService.start(id);
  }

  @Post("/action/pause/:id")
  pause(@PathParams("id") id: number) {
    return this.taskActionService.stop(id);
  }

  @Delete("/action/stop/:id")
  stop(@PathParams("id") id: number) {
    this.taskActionService.delete(id);
  }

  @Post("/action/restart/:id")
  restart(@PathParams("id") id: number) {
    return this.taskActionService.restart(id);
  }

  @Post("/action/next/:id")
  next(@PathParams("id") id: number) {
    return this.taskActionService.next(id);
  }

  @Post("/action/restart")
  restartAll() {
    return this.taskActionService.restartAll();
  }

  @Post("/action/next")
  nextAll() {
    return this.taskActionService.nextAll();
  }

  @Post("/start")
  startMany() {
    return this.taskService.startMany();
  }

  @Post("/pause")
  pauseMany() {
    return this.taskActionService.stopMany();
  }

  @Post("/stop")
  stopMany() {
    return this.taskActionService.clear();
  }
}
