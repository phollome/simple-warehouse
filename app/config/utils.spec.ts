import { expect, test } from "vitest";
import { enhanceSchemaWithEnvNames } from "./utils";

test("enhance nested schema with environment variables names", () => {
  const schema = {
    field1: {
      someKey: "someValue",
    },
    field2: {
      someKey: {
        someNestedKey: "someNestedValue",
      },
    },
  };

  const expected = {
    field1: {
      someKey: "someValue",
      env: "FIELD1",
    },
    field2: {
      someKey: {
        someNestedKey: "someNestedValue",
        env: "FIELD2_SOME_KEY",
      },
    },
  };
  const result = enhanceSchemaWithEnvNames(schema);
  expect(result).toEqual(expected);
});
