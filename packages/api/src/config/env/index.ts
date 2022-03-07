import path from "path";
import { rootDir } from "..";

export const config = require("dotenv").config();

export const isProduction = process.env.NODE_ENV === "production";
export const publicPath =
  process.env.PUBLIC_PATH || path.join(__dirname, "../../../../analytics");
