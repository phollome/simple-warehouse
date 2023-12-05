import constantcase from "@stdlib/string-constantcase";
import fs from "fs-extra";

export function extractEnvsWithDescriptions(
  schema: Record<string, any>,
  path: string[] = []
) {
  const result: { description?: string; env: string }[] = [];
  const keys = Object.keys(schema);
  for (const key of keys) {
    if (key === "nodeENV") {
      continue;
    }
    const nestedKeys = Object.keys(schema[key]);
    const isLeaf = nestedKeys.some(
      (nestedKey) => typeof schema[key][nestedKey] !== "object"
    );
    if (isLeaf) {
      const env = constantcase([...path, key].join("."));
      result.push({
        description: schema[key].doc,
        env: `${env}=${schema[key].default}`,
      });
    } else {
      const nestedEnvVariablesNames = extractEnvsWithDescriptions(schema[key], [
        ...path,
        key,
      ]);
      result.push(...nestedEnvVariablesNames);
    }
  }
  return result;
}

export async function generateEnv(schema: Record<string, any>, path: string) {
  const envsWithDescription = extractEnvsWithDescriptions(schema);
  const envFile = envsWithDescription
    .map((item, index, array) => {
      const { description, env } = item;
      if (description) {
        return `# ${description}\n# ${env}${
          index < array.length - 1 ? "\n" : ""
        }`;
      }
      return `# ${env}${index < array.length - 1 ? "\n" : ""}`;
    })
    .join("\n");

  await fs.outputFile(path, envFile);
}
