import { Configuration, Inject } from "@tsed/di";
import { PlatformApplication } from "@tsed/common";
import { MikroOrmModule } from "@tsed/mikro-orm";
import "@tsed/passport";
import "@tsed/platform-express"; // /!\ keep this import
import session from "express-session";
import bodyParser from "body-parser";
import compress from "compression";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import cors from "cors";
import "@tsed/ajv";
import { config, rootDir } from "./config";
import { getConnections } from "./config/yaml";
import { User } from "./entities/default/User";

@Configuration({
  ...config,
  imports: [MikroOrmModule],
  mikroOrm: getConnections(),
  cache: {
    ttl: 300, // default TTL
    store: "memory",
  },
  acceptMimes: ["application/json"],
  httpPort: process.env.PORT || 8083,
  httpsPort: false, // CHANGE
  mount: {
    "/api": [`${rootDir}/controllers/**/*.ts`],
  },
  componentsScan: [`./services/**/**.js`, `${rootDir}/protocols/**/*.ts`],
  passport: {
    userInfoModel: User,
  },
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
      .use(
        cors({
          credentials: true,
          origin: "http://localhost:4200",
        })
      )
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride())
      .use(bodyParser.json())
      .use(
        bodyParser.urlencoded({
          extended: true,
        })
      )
      .use(
        session({
          secret: "mysecretkey",
          resave: true,
          saveUninitialized: true,
          // maxAge: 36000,
          cookie: {
            path: "/",
            httpOnly: true,
            secure: false,
            // maxAge: null
          },
        })
      );
  }
}
