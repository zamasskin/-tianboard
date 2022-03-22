import { Command, CommandProvider } from "@tsed/cli-core";
import { Inject } from "@tsed/di";
import _, { includes } from "lodash";
import { ConnectionService } from "src/services/ConnectionService";

export interface CreateOrmTablesContext {
  action: string;
}

const actions = ["create", "update", "drop", "generate"];

@Command({
  name: "orm-table",
  description: "Create microOrm tables",
  args: {
    action: {
      type: String,
      // defaultValue: "create",
      description: "action (create|update|drop|generate)",
      required: true,
    },
  },
  options: {},
  allowUnknownOption: false,
})
export class CreateOrmTablesCommand implements CommandProvider {
  @Inject()
  connectionService: ConnectionService;

  $exec(ctx: CreateOrmTablesContext) {
    if (!actions.includes(ctx.action)) {
      throw new Error("action should be create|update|drop|generate");
    }
    return [
      {
        title: ctx.action,
        task: () => {
          switch (ctx.action) {
            case "create":
              return this.connectionService.createSchema();
            case "update":
              return this.connectionService.updateSchema();
            case "drop":
              return this.connectionService.dropSchema();
            case "generate":
              return this.connectionService.generateSchema();
          }
          console.log(ctx);
        },
      },
    ];
  }
}
