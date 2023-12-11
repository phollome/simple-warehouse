import convict from "convict";
import configFormatWithValidator from "convict-format-with-validator";
import { schema } from "./schema";
import dotenv from "dotenv";

convict.addFormat(configFormatWithValidator.url);

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const config = convict(schema);

config.validate({ allowed: "strict" });

export default config;
