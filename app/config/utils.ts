import constantcase from "@stdlib/string-constantcase";

export function enhanceSchemaWithEnvNames(
  schema: Record<string, any>,
  path: string[] = []
): Record<string, any> {
  const keys = Object.keys(schema);
  const result: typeof schema = {};
  for (const key of keys) {
    const nestedKeys = Object.keys(schema[key]);
    const isLeaf = nestedKeys.some(
      (nestedKey) => typeof schema[key][nestedKey] !== "object"
    );
    if (isLeaf) {
      const env = constantcase([...path, key].join("."));
      result[key] = { ...schema[key], env };
    } else {
      result[key] = enhanceSchemaWithEnvNames(schema[key], [...path, key]);
    }
  }

  return result;
}
