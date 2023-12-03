import { PrismaClient } from "@prisma/client";

declare global {
  var __prismaClient: PrismaClient | undefined;
}

let prismaClient: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prismaClient = new PrismaClient();
} else {
  if (global.__prismaClient === undefined) {
    global.__prismaClient = new PrismaClient({
      log: [
        {
          emit: "event",
          level: "query",
        },
        {
          emit: "stdout",
          level: "error",
        },
        {
          emit: "stdout",
          level: "info",
        },
        {
          emit: "stdout",
          level: "warn",
        },
      ],
    });
  }
  prismaClient = global.__prismaClient;
}

try {
  prismaClient.$connect();
  console.log("Database connection established.");
} catch (error) {
  console.error("Error, while connecting to Database.", error);
  throw error;
}

export const dbClient = prismaClient;
