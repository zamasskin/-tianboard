import { Injectable } from "@tsed/di";
import { NotFound } from "@tsed/exceptions";
import { TaskAction } from "src/entities/default/TaskAction";
import { FilterQuery, MikroORM } from "@mikro-orm/core";
import { Orm } from "@tsed/mikro-orm";
import { Task } from "src/entities/default/Task";
import { FindPaginationModel } from "src/models/FindPaginationModel";

import { TaskActionStore, Actions } from "src/storage/TaskActionStore";

@Injectable()
export class TaskActionsService {
  @Orm("default")
  private readonly orm!: MikroORM;

  get repository() {
    return this.orm.em.getRepository(TaskAction);
  }

  async findOne(where: FilterQuery<TaskAction>) {
    return this.repository.findOne(where);
  }

  async findMany(model: FindPaginationModel<TaskAction>) {
    const [actions, count] = await Promise.all([
      this.repository.find(model.where, model.options),
      this.count(),
    ]);
    return {
      actions,
      count,
      perPage: model.perPage,
      currentPage: model.currentPage,
    };
  }

  count() {
    return this.repository.count();
  }

  async delete(id: number) {
    const taskAction = this.repository.findOne({ id });
    await this.repository.removeAndFlush(taskAction);
    return taskAction;
  }

  async create(task: Task) {
    const taskAction = new TaskAction(task);
    await this.orm.em.persistAndFlush(taskAction);
    return taskAction;
  }

  async update(id: number, updateTaskAction: TaskAction) {
    const taskAction = await this.findOne({ id });
    if (!taskAction) {
      throw new NotFound("task action not found");
    }

    taskAction.error = updateTaskAction?.error || taskAction.error;
    taskAction.errorMessage =
      updateTaskAction?.errorMessage || taskAction.errorMessage;
    taskAction.step = updateTaskAction?.step || taskAction.step;
    taskAction.stop = updateTaskAction?.stop || taskAction.stop;

    return this.save(taskAction);
  }

  async save(taskAction: TaskAction) {
    this.repository.persistAndFlush(taskAction);
  }

  async createAndStart(task: Task) {
    const taskAction = await this.create(task);
    if (taskAction?.id) {
      this.call(taskAction.id);
    }
    return taskAction;
  }

  async start(id: number) {
    const taskAction = await this.repository.findOne({ id });
    if (!taskAction) {
      throw new NotFound("task action not found");
    }

    if (!TaskActionStore.has(taskAction)) {
      throw new NotFound("method not found");
    }

    this.call(id)
      .then(() => this.delete(id))
      .catch((err: any) => {
        taskAction.error = true;
        taskAction.errorMessage = err.message;
        this.save(taskAction);
      });
    return taskAction;
  }

  async stop(id: number) {
    const taskAction = await this.repository.findOne({ id });
    if (!taskAction) {
      throw new NotFound("task action not found");
    }

    taskAction.stop = true;
    return this.save(taskAction);
  }

  async stopMany() {
    const taskActionList = await this.repository.find({});
    return Promise.all(
      taskActionList.map((taskAction) => this.stop(taskAction.id))
    );
  }

  async clear() {
    const taskActionList = await this.repository.find({});
    return Promise.all(
      taskActionList.map((taskAction) => this.delete(taskAction.id))
    );
  }

  async restart(id: number) {
    const taskAction = await this.repository.findOne({ id });
    if (!taskAction) {
      throw new NotFound("task action not found");
    }

    taskAction.stop = false;
    taskAction.step = 0;
    taskAction.error = false;
    taskAction.errorMessage = "";
    await this.save(taskAction);
    return this.start(taskAction.id);
  }

  async restartAll() {
    const taskActionList = await this.repository.find({});
    return Promise.all(
      taskActionList.map((taskAction) => this.restart(taskAction.id))
    );
  }

  async next(id: number) {
    const taskAction = await this.repository.findOne({ id });
    if (!taskAction) {
      throw new NotFound("task action not found");
    }

    taskAction.stop = false;
    taskAction.error = false;
    taskAction.errorMessage = "";
    await this.save(taskAction);
    return this.start(taskAction.id);
  }

  async nextAll() {
    const taskActionList = await this.repository.find({});
    return Promise.all(
      taskActionList.map((taskAction) => this.next(taskAction.id))
    );
  }

  async call<T>(id: number): Promise<T | boolean> {
    const taskAction = await this.repository.findOne({ id });
    if (!taskAction) {
      return false;
    }

    if (!TaskActionStore.has(taskAction)) {
      return false;
    }

    const { method, target } = TaskActionStore.get(taskAction) as Actions;
    const next = await method.apply(target, [taskAction]);
    return next && this.call(taskAction.id);
  }
}
