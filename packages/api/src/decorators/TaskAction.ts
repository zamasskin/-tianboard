import { $log } from "@tsed/common";
import { TaskAction } from "src/entities/default/TaskAction";

export type ActionCall = (task: TaskAction) => Promise<any>;
type ActionDescriptor = TypedPropertyDescriptor<ActionCall>;
export type ActionMap = { method: ActionCall; target: any };
declare global {
  var taskAction: Map<string, ActionMap>;
}

export function TaskActionRegister() {
  $log.info("test");

  return (target: any, methodName: string, descriptor: ActionDescriptor) => {
    const originalMethod = descriptor.value;
    if (!global?.taskAction) {
      global.taskAction = new Map<string, ActionMap>();
    }

    if (originalMethod && target) {
      global.taskAction.set(methodName, { target, method: originalMethod });
    }
  };
}
