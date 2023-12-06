import schema from "~/config/schema";
import { generateEnv } from "./utils";
import { program } from "commander";

program
  .version("0.1.0")
  .description(
    "Generates environment variables from config schema.\n\nYou can pass environment or file path as an argument.\nIf nothing is passed, .env.example file will be generated."
  )
  .option("-e, --env <env>", "environment (e.g. development, production)")
  .option(
    "-f, --file <file>",
    "file path (if set environment will be ignored))"
  );

program.parse(process.argv);

const options = program.opts();

let filePath = options.file;
if (typeof filePath === "undefined" && typeof options.env !== "undefined") {
  filePath = `.env.${options.env}`;
}
if (typeof filePath === "undefined") {
  filePath = ".env.example";
}

generateEnv(schema, filePath)
  .catch(console.error)
  .then(() =>
    console.log(
      `Environment variables file "${filePath}" generated successfully.`
    )
  );
