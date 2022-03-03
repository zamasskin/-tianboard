import { Configuration, Inject } from "@tsed/di";
import { PlatformApplication } from "@tsed/common";
import { MikroOrmModule } from "@tsed/mikro-orm";
import "@tsed/platform-express"; // /!\ keep this import
import bodyParser from "body-parser";
import compress from "compression";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import cors from "cors";
import "@tsed/ajv";
import { config, rootDir } from "./config";
import { getConnections } from "./config/databases";

@Configuration({
  ...config,
  imports: [MikroOrmModule],
  mikroOrm: getConnections(),
  acceptMimes: ["application/json"],
  httpPort: process.env.PORT || 8083,
  httpsPort: false, // CHANGE
  mount: {
    "/api": [`${rootDir}/controllers/**/*.ts`],
  },
  componentsScan: [`./services/**/**.js`],
  customServiceOptions: {},
  views: {
    root: `${rootDir}/views`,
    extensions: {
      ejs: "ejs",
    },
  },
  exclude: ["**/*.spec.ts"],
})
export class Server {
  @Inject()
  app: PlatformApplication;

  @Configuration()
  settings: Configuration;

  $beforeRoutesInit(): void {
    this.app
      .use(cors())
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride())
      .use(bodyParser.json())
      .use(
        bodyParser.urlencoded({
          extended: true,
        })
      );
  }
}
