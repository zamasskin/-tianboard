import { join } from "path";
import { readdir, stat } from "fs/promises";
import { Injectable } from "@tsed/di";

import { publicPath } from "../config/env";

@Injectable()
export class PublicFsService {
  async files(path: string) {
    const findPath = join(publicPath, path || "");
    const files = await readdir(findPath);
    const stats = await Promise.all(
      files.map(async (file) => {
        const stats = await stat(join(findPath, file));
        return {
          file,
          path: join(findPath, file),
          isFile: stats.isFile(),
        };
      })
    );
    return stats;
  }
}
