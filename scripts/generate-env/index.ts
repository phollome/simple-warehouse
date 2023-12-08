import constantcase from "@stdlib/string-constantcase";
import { program } from "commander";
import convict from "convict";
import configFormatWithValidator from "convict-format-with-validator";
import fse from "fs-extra";
import { schema as baseSchema } from "~/config/schema";

convict.addFormat(configFormatWithValidator.url);

program
  .version("0.1.0")
  .description("Generates environment variables from config schema.")
  .option("-e, --env <env>", "environment (test, development)")
  .option(
    "-f, --file <file>",
    "file path (if set environment will be ignored))"
  )
  .option("--force", "overwrite existing file");

program.parse(process.argv);

const options = program.opts();

if (
  typeof options.env === "string" &&
  options.env !== "test" &&
  options.env !== "development"
) {
  throw new Error("Invalid environment. Allowed values: test, development.");
}

let filePath = options.file;
if (typeof filePath === "undefined" && typeof options.env !== "undefined") {
  filePath = `.env.${options.env}`;
}
if (typeof filePath === "undefined") {
  filePath = ".env.example";
}

export async function generateEnv(filePath: string) {
  console.log(`Generating ${filePath} file...`);

  let fileContent = "";

  if (options.env === "test" || options.env === "development") {
    const schema = {
      database: {
        url: {
          ...baseSchema.database.url,
          // set default value for test environment
          default: `file:./db.${options.env}.sqlite`,
          // clear env value for test environment (to avoid issues while using application config)
          env:
            process.env.NODE_ENV !== "test"
              ? baseSchema.database.url.env
              : undefined,
        },
      },
    };

    const config = convict(schema);
    fileContent = `${constantcase("database.url")}=${config.get(
      "database.url"
    )}`;
  }

  if (typeof options.env === "undefined") {
    const config = convict(baseSchema);

    fileContent = `# ${baseSchema.app.baseURL.doc}\n# ${constantcase(
      "app.baseURL"
    )}=${config.get("app.baseURL")}\n\n# ${
      baseSchema.app.name.doc
    } \n# ${constantcase("app.name")}=${config.get("app.name")} \n\n# ${
      baseSchema.app.description.doc
    } \n# ${constantcase("app.description")}=${config.get(
      "app.description"
    )} \n\n# ${baseSchema.app.version.doc} \n# ${constantcase(
      "app.version"
    )}=${config.get("app.version")} \n\n# ${
      baseSchema.app.numberOfItemsPerPage.doc
    } \n# ${constantcase("app.numberOfItemsPerPage")}=${config.get(
      "app.numberOfItemsPerPage"
    )} \n\n# ${baseSchema.testing.e2e.waitAfterSubmit.doc} \n# ${constantcase(
      "testing.e2e.waitAfterSubmit"
    )}=${config.get("testing.e2e.waitAfterSubmit")} \n\n# ${
      baseSchema.database.url.doc
    } \n# ${constantcase("database.url")}=${config.get("database.url")} \n\n# ${
      baseSchema.database.seed.numberOfItems.doc
    } \n# ${constantcase("database.seed.numberOfItems")}=${config.get(
      "database.seed.numberOfItems"
    )}`;
  }

  const fileExists = await fse.pathExists(filePath);
  const force = Boolean(options.force);

  if (fileExists && force === false) {
    throw new Error(
      `File "${filePath}" already exists. Use --force option to overwrite it.`
    );
  }

  await fse.outputFile(filePath, fileContent);
}

generateEnv(filePath)
  .catch(console.error)
  .then(() =>
    console.log(
      `Environment variables file "${filePath}" generated successfully.`
    )
  );
