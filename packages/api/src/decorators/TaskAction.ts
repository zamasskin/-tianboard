import { TaskAction as TaskActionEntity } from "src/entities/default/TaskAction";
import { TaskActionStore, ActionCall } from "src/storage/TaskActionStore";

type ActionDescriptor = TypedPropertyDescriptor<ActionCall>;

export function TaskActionRegister() {
  return (target: any, methodName: string, descriptor: ActionDescriptor) => {
    const originalMethod = descriptor.value;
    TaskActionStore.set(methodName, target, originalMethod);
  };
}
