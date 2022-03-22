#!/usr/bin/env node
import { CliCore } from "@tsed/cli-core";
import { config } from "../config"; // Import your application configuration
import { CreateOrmTablesCommand } from "./CreateOrmTablesCommand";

CliCore.bootstrap({
  ...config,
  // add your custom commands here
  commands: [CreateOrmTablesCommand],
}).catch(console.error);
