import convict from "convict";
import configFormatWithValidator from "convict-format-with-validator";
import yaml from "js-yaml";
import fs from "node:fs";
import pkginfo from "pkginfo";

convict.addParser({ extension: ["yml", "yaml"], parse: yaml.load });
convict.addFormat(configFormatWithValidator.url);

const config = convict({
  env: {
    doc: "The application environment.",
    format: ["development", "test"],
    default: "development",
    env: "NODE_ENV",
  },
  baseURL: {
    doc: "The base url of the application.",
    format: "url",
    default: "http://localhost:3000",
    env: "BASE_URL",
  },
  app: {
    name: {
      doc: "The application name.",
      format: String,
      default: "New Remix App",
      env: "APP_NAME",
    },
    description: {
      doc: "The application description.",
      format: String,
      default: "Welcome to Remix!",
      env: "APP_DESCRIPTION",
    },
    version: {
      doc: "The application version.",
      format: String,
      default: pkginfo.version,
      env: "APP_VERSION",
    },
    numberOfItemsPerPage: {
      doc: "The number of items to display per page.",
      format: Number,
      default: 10,
      env: "APP_NUMBER_OF_ITEMS_PER_PAGE",
    },
  },
  testing: {
    e2e: {
      waitAfterSubmit: {
        doc: "The number of milliseconds to wait after submitting a form.",
        format: Number,
        default: 100,
        env: "TESTING_E2E_WAIT_AFTER_SUBMIT",
      },
    },
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
