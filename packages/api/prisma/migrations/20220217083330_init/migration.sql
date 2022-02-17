-- CreateTable
CREATE TABLE "DatabaseConnections" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "connectionUrl" TEXT NOT NULL,
    "provider" TEXT NOT NULL
);
