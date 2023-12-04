import config from "~/config";

if (typeof process.env.DaTABASE_URL === "undefined") {
  process.env.DATABASE_URL = config.get("database.url");
}
