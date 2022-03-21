import { Property } from "@tsed/schema";

export class UpdateTaskActionModel {
  @Property()
  step?: number;

  @Property()
  error?: boolean;

  @Property()
  errorMessage?: string;

  @Property()
  stop?: boolean;
}
