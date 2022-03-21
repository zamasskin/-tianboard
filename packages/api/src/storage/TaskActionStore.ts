import * as uuid from "uuid";

import { TaskAction } from "src/entities/default/TaskAction";

export type ActionCall = (task: TaskAction) => Promise<any>;
export type Actions = { method: ActionCall; target: any };

export class TaskActionStoreClass {
  private taskMethods: Map<string, Actions> = new Map<string, Actions>();

  set(methodName: string, target: any, method: ActionCall | undefined) {
    if (target && method) {
      this.taskMethods.set(methodName, { method, target });
    }
  }

  has(taskAction: TaskAction) {
    const task = taskAction.task;
    const actionName = task.action;
    return this.taskMethods.has(actionName);
  }

  get(taskAction: TaskAction) {
    const task = taskAction.task;
    const actionName = task.action;
    return this.taskMethods.get(actionName);
  }
}

export const TaskActionStore = new TaskActionStoreClass();
