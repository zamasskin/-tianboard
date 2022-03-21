import { FilterQuery, MikroORM } from "@mikro-orm/core";
import { Inject, Injectable } from "@tsed/di";
import { NotFound } from "@tsed/exceptions";
import { Orm } from "@tsed/mikro-orm";
import { Task } from "src/entities/default/Task";
import { FindPaginationModel } from "src/models/FindPaginationModel";
import { TaskModel } from "src/models/TaskModel";
import { TaskActionsService } from "./TaskAction/TaskActionsService";

@Injectable()
export class TasksService {
  @Orm("default")
  private readonly orm!: MikroORM;

  @Inject()
  private taskActionService: TaskActionsService;

  get repository() {
    return this.orm.em.getRepository(Task);
  }

  async create(model: TaskModel) {
    const task = new Task(model);
    await this.repository.persistAndFlush(task);
    return task;
  }

  async delete(id: number) {
    const taskAction = this.repository.findOne({ id });
    await this.repository.removeAndFlush(taskAction);
    return taskAction;
  }

  async findOne(where: FilterQuery<Task>) {
    return this.repository.findOne(where);
  }

  async findMany(model: FindPaginationModel<Task>) {
    const [tasks, count] = await Promise.all([
      this.repository.find(model.where, model.options),
      this.count(),
    ]);
    return {
      tasks,
      count,
      perPage: model.perPage,
      currentPage: model.currentPage,
    };
  }

  async count() {
    return this.repository.count();
  }

  async start(id: number) {
    const task = await this.findOne({ id });
    if (!task) {
      throw new NotFound("task not found");
    }
    return this.taskActionService.createAndStart(task);
  }

  async stop(id: number) {}

  async startMany() {
    const taskList = await this.repository.find({});
    return Promise.all(
      taskList.map((task) => this.taskActionService.createAndStart(task))
    );
  }

  async stopMany() {
    // const taskList = await this.repository.find({});
    // return Promise.all(taskList.map(task) )
  }
}
