import {
  Collection,
  DateType,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import { NotFound } from "@tsed/exceptions";
import { TaskModel } from "src/models/TaskModel";
import { TaskAction } from "./TaskAction";

@Entity()
export class Task {
  @PrimaryKey()
  id: number;

  @Property()
  name: string;

  @Property({ type: DateType, nullable: true })
  dateStart: Date;

  @Property({ nullable: true })
  cronExpression: string;

  @Property()
  recurrent: boolean;

  @Property()
  action: string;

  @Property()
  actionId: number;

  @OneToMany(() => TaskAction, (action) => action.task)
  actions = new Collection<TaskAction>(this);

  constructor(task?: TaskModel) {
    if (task instanceof TaskModel) {
      this.name = task.name;
      this.action = task.action;
      this.actionId = task.actionId;
      this.recurrent = task.recurrent;
      if (task.recurrent) {
        if (!task.cronExpression) {
          throw new NotFound("cronExpression is required");
        }
        this.cronExpression = task.cronExpression;
      } else {
        if (!task.dateStart) {
          throw new NotFound("dateStart is required");
        }
        this.dateStart = task.dateStart;
      }
    }
  }
}
