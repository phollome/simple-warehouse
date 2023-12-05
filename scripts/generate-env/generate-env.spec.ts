import fs from "node:fs/promises";
import { afterAll, expect, test } from "vitest";
import { extractEnvsWithDescriptions, generateEnv } from "./utils";
import schema from "~/config/schema";
import constantcase from "@stdlib/string-constantcase";

const filePath = `${__dirname}/.env.example`;

test("extract environment variables with description from schema", async () => {
  const result = extractEnvsWithDescriptions(schema);
  expect(result[0]).toEqual({
    description: schema.app.baseURL.doc,
    env: `${constantcase("app.baseURL")}=${schema.app.baseURL.default}`,
  });
});

test("run script (load schema file, enhance schema with environment variables names and write .env file)", async () => {
  await generateEnv(schema, filePath);
  const envFile = await fs.readFile(filePath, "utf-8");

  const expectedEnvFile =
    "# " +
    schema.app.baseURL.doc +
    "\n# " +
    constantcase("app.baseURL") +
    "=" +
    schema.app.baseURL.default +
    "\n\n";
  expect(envFile).toContain(expectedEnvFile);
});

afterAll(() => {
  fs.rm(filePath);
});
