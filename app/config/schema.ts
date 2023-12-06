import constantcase from "@stdlib/string-constantcase";
import packageJSON from "../../package.json" assert { type: "json" };

const schema = {
  nodeENV: {
    doc: "The application environment.",
    format: ["development", "test", "production"],
    default: "development",
    env: constantcase("nodeENV"),
  },
  app: {
    baseURL: {
      doc: "The base url of the application.",
      format: "url",
      default: "http://localhost:3000",
      env: constantcase("app.baseURL"),
    },
    name: {
      doc: "The application name.",
      format: String,
      default: "New Remix App",
      env: constantcase("app.name"),
    },
    description: {
      doc: "The application description.",
      format: String,
      default: "Welcome to Remix!",
      env: constantcase("app.description"),
    },
    version: {
      doc: "The application version.",
      format: String,
      default: packageJSON.version,
      env: constantcase("app.version")
    },
    numberOfItemsPerPage: {
      doc: "The number of items to display per page.",
      format: Number,
      default: 10,
      env: constantcase("app.numberOfItemsPerPage")
    },
  },
  testing: {
    e2e: {
      waitAfterSubmit: {
        doc: "The number of milliseconds to wait after submitting a form.",
        format: Number,
        default: 100,
        env: constantcase("testing.e2e.waitAfterSubmit")
      },
    },
  },
  database: {
    url: {
      doc: "The database connection URL.",
      format: String,
      default: "file:./db.sqlite",
      env: constantcase("database.url")
    },
    seed: {
      numberOfItems: {
        doc: "The number of items to seed the database with.",
        format: Number,
        default: 10,
        env: constantcase("database.seed.numberOfItems")
      },
    },
  },
};

export default schema;
