import { Inject, Injectable } from "@tsed/di";
import { NotFound } from "@tsed/exceptions";
import { TaskAction } from "src/entities/default/TaskAction";
import { FilterQuery, MikroORM } from "@mikro-orm/core";
import { Orm } from "@tsed/mikro-orm";
import { Task } from "src/entities/default/Task";
import { FindPaginationModel } from "src/models/FindPaginationModel";
import { $log } from "@tsed/common";

export type ActionCall = {
  method: (taskAction: TaskAction) => Promise<boolean>;
  target: any;
};
@Injectable()
export class TaskActionsService {
  @Orm("default")
  private readonly orm!: MikroORM;

  private methods: Map<string, ActionCall> = new Map<string, ActionCall>();

  setMethod(methodName: string, actionCall: ActionCall) {
    this.methods.set(methodName, actionCall);
  }

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
    const taskAction = await this.repository.findOne({ id });
    await this.repository.removeAndFlush([taskAction]);
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
    return this.repository.persistAndFlush(taskAction);
  }

  async checkAndSave(taskAction: TaskAction) {
    const taskActionBack = await this.findOne({ id: taskAction.id });
    if (taskActionBack) {
      return this.save(taskAction);
    }
  }

  async createAndStart(task: Task) {
    const taskAction = await this.create(task);
    if (taskAction?.id) {
      this.call(taskAction.id)
        .then(() => $log.info(`task ${taskAction.id} success`))
        .catch((e) =>
          $log.error(`error task ${taskAction.id}. error: ${e.message}`)
        );
    }
    return taskAction;
  }

  async start(id: number) {
    const taskAction = await this.repository.findOne({ id });
    if (!taskAction) {
      throw new NotFound("task action not found");
    }

    const task = taskAction.task;
    if (!this.methods.has(task.action)) {
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
    const taskActionList = await this.repository.find({ id: { $gt: 0 } });
    return await Promise.all(
      taskActionList.map((taskAction) => this.stop(taskAction.id))
    );
  }

  async clear() {
    const taskActionList = await this.repository.find({ id: { $gt: 0 } });
    await this.repository.removeAndFlush(taskActionList);
    return taskActionList;
  }

  async restart(id: number) {
    const taskAction = await this.repository.findOne({ id });
    if (!taskAction) {
      throw new NotFound("task action not found");
    }

    taskAction.stop = false;
    taskAction.step = 0;
    taskAction.percent = 0;
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

    const task = taskAction.task;
    if (!this.methods.has(task.action)) {
      return false;
    }

    const { method, target } = this.methods.get(task.action) as ActionCall;
    const next = await method.apply(target, [taskAction]);
    return next && this.call(taskAction.id);
  }
}
