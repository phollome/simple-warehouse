import fs from "node:fs/promises";
import { afterAll, expect, test } from "vitest";
import { extractEnvsWithDescriptions, generateExampleEnv } from "./utils";

const schema = {
  nodeENV: {
    doc: "The node environment.",
    default: "development",
    env: "NODE_ENV",
  },
  field1: {
    doc: "some value",
    default: "someValue",
    env: "FIELD1",
  },
  field2: {
    someKey: {
      doc: "some nested value",
      default: "someNestedValue",
      env: "FIELD2_SOME_KEY",
    },
  },
};
const filePath = `${__dirname}/.env.example`;

test("extract environment variables with description from schema", async () => {
  const result = extractEnvsWithDescriptions(schema);
  const expected = [
    { description: schema.field1.doc, env: "FIELD1=someValue" },
    {
      description: schema.field2.someKey.doc,
      env: "FIELD2_SOME_KEY=someNestedValue",
    },
  ];
  expect(result).toEqual(expected);
});

test("run script (load schema file, enhance schema with environment variables names and write .env file)", async () => {
  await generateExampleEnv(schema, filePath);
  const envFile = await fs.readFile(filePath, "utf-8");

  const expectedEnvFile =
    "# some value\n# FIELD1=someValue\n\n# some nested value\n# FIELD2_SOME_KEY=someNestedValue";
  expect(envFile).toBe(expectedEnvFile);
});

afterAll(() => {
  fs.rm(filePath);
});
