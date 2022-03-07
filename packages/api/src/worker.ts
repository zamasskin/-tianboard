import { Worker, isMainThread } from "worker_threads";

function createWorker() {
  const worker = new Worker(__filename);
  worker.on("exit", () => {
    createWorker();
  });
}

if (isMainThread) {
  createWorker();
} else {
  const chokidar = require("chokidar");
  require("./index");

  const watcher = chokidar.watch(__dirname, {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true,
  });

  const log = console.log;
  const events = ["modified", "created", "moved"];
  watcher.once("raw", (event: string) => {
    setTimeout(() => {
      if (events.includes(event)) {
        process.exit(1);
      }
    }, 1)
  });
}
