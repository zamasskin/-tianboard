import { DateType, Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { TaskModel } from "src/models/TaskModel";

@Entity()
export class Task {
  @PrimaryKey()
  id: number;

  @Property()
  name: string;

  @Property({ type: DateType })
  dateStart: Date;

  @Property({ nullable: true })
  interval: number;

  @Property()
  recurrent: boolean;

  @Property()
  action: string;

  @Property()
  actionId: number;

  constructor(task?: TaskModel) {
    if (task) {
      this.name = task.name;
      this.dateStart = task.dateStart;
      this.action = task.action;
      this.actionId = task.actionId;
      this.recurrent = task.recurrent;
      if (task?.interval) {
        this.interval = task.interval;
      }
    }
  }
}
