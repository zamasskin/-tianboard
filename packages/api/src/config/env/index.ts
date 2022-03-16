import path from "path";
import { rootDir } from "..";

export const config = require("dotenv").config();

export const isProduction = process.env.NODE_ENV === "production";
export const publicPath =
  process.env.PUBLIC_PATH || path.join(__dirname, "../../../../analytics");

export const originUrl = process.env.ORIGIN_URL || "http://127.0.0.1:8083";
export const publicUrl = process.env.ORIGIN_URL || "http://localhost:4200";
