import fse from "fs-extra";
import childProcess from "node:child_process";
import { expect, test } from "vitest";

const waitTick = () => new Promise((resolve) => setTimeout(resolve, 0));

test("generate .env.test file", async () => {
  await childProcess.exec(
    `tsx scripts/generate-env -f ${__dirname}/.env.test -e test`
  );

  // necessary to wait for the file to be created
  while (!(await fse.pathExists(`${__dirname}/.env.test`))) {
    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  const envFile = await fse.readFile(`${__dirname}/.env.test`, "utf-8");
  expect(envFile).toContain("DATABASE_URL=file:./db.test.sqlite");

  await fse.rm(`${__dirname}/.env.test`);
});

test("generate .env.development file", async () => {
  await childProcess.exec(
    `tsx scripts/generate-env -f ${__dirname}/.env.development -e development`
  );

  // necessary to wait for the file to be created
  while (!(await fse.pathExists(`${__dirname}/.env.development`))) {
    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  const envFile = await fse.readFile(`${__dirname}/.env.development`, "utf-8");
  expect(envFile).toContain("DATABASE_URL=file:./db.development.sqlite");

  await fse.rm(`${__dirname}/.env.development`);
});

test("generate .env.example file", async () => {
  await childProcess.exec(
    `tsx scripts/generate-env -f ${__dirname}/.env.example`
  );

  // necessary to wait for the file to be created
  while (!(await fse.pathExists(`${__dirname}/.env.example`))) {
    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  const envFile = await fse.readFile(`${__dirname}/.env.example`, "utf-8");
  expect(envFile).toContain("# APP_BASE_URL=");
  expect(envFile).toContain("# APP_NAME=");
  expect(envFile).toContain("# APP_DESCRIPTION=");
  expect(envFile).toContain("# APP_NUMBER_OF_ITEMS_PER_PAGE=");
  expect(envFile).toContain("# TESTING_E2E_WAIT_AFTER_SUBMIT=");
  expect(envFile).toContain("# DATABASE_URL=");
  expect(envFile).toContain("# DATABASE_SEED_NUMBER_OF_ITEMS=");

  await fse.rm(`${__dirname}/.env.example`);
});
