import convict from "convict";
import configFormatWithValidator from "convict-format-with-validator";
import yaml from "js-yaml";
import fs from "node:fs";

convict.addParser({ extension: ["yml", "yaml"], parse: yaml.load });
convict.addFormat(configFormatWithValidator.url);

const config = convict({
  env: {
    doc: "The application environment.",
    format: ["development"],
    default: "development",
    env: "NODE_ENV",
  },
  baseURL: {
    doc: "The base url of the application.",
    format: "url",
    default: "http://localhost:3000",
    env: "BASE_URL",
  },
});

const env = config.get("env");

try {
  fs.accessSync(`./app/config/${env}.yml`);
  config.loadFile(`./app/config/${env}.yml`);
} catch (error) {
  console.warn(`No config file found for ${env} environment, using defaults`);
  console.log(config.getProperties());
}

config.validate({ allowed: "strict" });

export default config;
