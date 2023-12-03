import schema from "~/config/schema";
import { generateExampleEnv } from "./utils";

generateExampleEnv(schema, ".env.example")
  .catch(console.error)
  .then(() =>
    console.log("Environment variables file generated successfully.")
  );
