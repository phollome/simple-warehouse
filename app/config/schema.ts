import packageJSON from "../../package.json" assert { type: "json" };
import { enhanceSchemaWithEnvNames } from "./utils";

const schemaWithoutEnvNames = {
  nodeENV: {
    doc: "The application environment.",
    format: ["development", "test", "production"],
    default: "development",
  },
  app: {
    baseURL: {
      doc: "The base url of the application.",
      format: "url",
      default: "http://localhost:3000",
    },
    name: {
      doc: "The application name.",
      format: String,
      default: "New Remix App",
    },
    description: {
      doc: "The application description.",
      format: String,
      default: "Welcome to Remix!",
    },
    version: {
      doc: "The application version.",
      format: String,
      default: packageJSON.version,
    },
    numberOfItemsPerPage: {
      doc: "The number of items to display per page.",
      format: Number,
      default: 10,
    },
  },
  testing: {
    e2e: {
      waitAfterSubmit: {
        doc: "The number of milliseconds to wait after submitting a form.",
        format: Number,
        default: 100,
      },
    },
  },
  database: {
    url: {
      doc: "The database connection URL.",
      format: String,
      default: "file:./db.sqlite",
    },
    seed: {
      numberOfItems: {
        doc: "The number of items to seed the database with.",
        format: Number,
        default: 10,
      },
    },
  },
};

const schema = enhanceSchemaWithEnvNames(schemaWithoutEnvNames);

export default schema;
