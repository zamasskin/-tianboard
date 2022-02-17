import { Inject, Injectable } from "@tsed/di";
import { Prisma, DatabaseConnections } from "@prisma/client";
import { PrismaService } from "../PrismaService";

@Injectable()
export class ConnectionsRepository {
  @Inject()
  prisma: PrismaService;

  async findUnique(
    args: Prisma.DatabaseConnectionsFindUniqueArgs
  ): Promise<DatabaseConnections | null> {
    return this.prisma.databaseConnections.findUnique(args);
  }

  async findMany(
    args?: Prisma.DatabaseConnectionsFindManyArgs
  ): Promise<DatabaseConnections[]> {
    return this.prisma.databaseConnections.findMany(args);
  }

  async create(
    args: Prisma.DatabaseConnectionsCreateArgs
  ): Promise<DatabaseConnections> {
    return this.prisma.databaseConnections.create(args);
  }

  async update(
    args: Prisma.DatabaseConnectionsUpdateArgs
  ): Promise<DatabaseConnections> {
    return this.prisma.databaseConnections.update(args);
  }

  async delete(
    args: Prisma.DatabaseConnectionsDeleteArgs
  ): Promise<DatabaseConnections> {
    return this.prisma.databaseConnections.delete(args);
  }
}
