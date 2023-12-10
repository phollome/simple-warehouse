import fse from "fs-extra";
import childProcess from "node:child_process";
import { promisify } from "node:util";
import { afterAll, expect, test } from "vitest";

const exec = promisify(childProcess.exec);

const path = `${__dirname}/__tmp`;

test("generate .env.test file", async () => {
  await exec(`npm run scripts:generate-env -- -f ${path}/.env.test -e test`);

  const envFile = await fse.readFile(`${path}/.env.test`, "utf-8");
  expect(envFile).toContain("DATABASE_URL=file:./db.test.sqlite");

  await fse.rm(`${path}/.env.test`);
});

test("generate .env.development file", async () => {
  await exec(
    `npm run scripts:generate-env -- -f ${path}/.env.development -e development`
  );

  const envFile = await fse.readFile(`${path}/.env.development`, "utf-8");
  expect(envFile).toContain("DATABASE_URL=file:./db.development.sqlite");

  await fse.rm(`${path}/.env.development`);
});

test("generate .env.example file", async () => {
  await exec(`npm run scripts:generate-env -- -f ${path}/.env.example`);

  const envFile = await fse.readFile(`${path}/.env.example`, "utf-8");
  expect(envFile).toContain("# APP_BASE_URL=");
  expect(envFile).toContain("# APP_NAME=");
  expect(envFile).toContain("# APP_DESCRIPTION=");
  expect(envFile).toContain("# APP_NUMBER_OF_ITEMS_PER_PAGE=");
  expect(envFile).toContain("# TESTING_E2E_WAIT_AFTER_SUBMIT=");
  expect(envFile).toContain("# DATABASE_URL=");
  expect(envFile).toContain("# DATABASE_SEED_NUMBER_OF_ITEMS=");

  await fse.rm(`${path}/.env.example`);
});

test("prevent overwriting existing file", async () => {
  await fse.outputFile(`${path}/.env.to-be-overwritten`, "test");

  const { stderr } = await exec(
    `npm run scripts:generate-env -- -f ${path}/.env.to-be-overwritten`
  );
  expect(stderr).toContain(
    `File "${path}/.env.to-be-overwritten" already exists.`
  );

  await fse.rm(`${path}/.env.to-be-overwritten`);
});

test("prevent overwriting existing file (interactive)", () => {
  return new Promise((resolve) => {
    expect.assertions(1);
    fse.outputFile(`${path}/.env.to-be-overwritten`, "test").then(() => {
      let aborted = false;
      const subprocess = childProcess.spawn("npm", [
        "run",
        "scripts:generate-env",
        "--",
        "-f ${path}/.env.to-be-overwritten",
        "-i",
      ]);

      subprocess.stdout.on("data", (data) => {
        const questionItems = "Do you want to overwrite it? (y/N)".split(" ");
        if (questionItems.every((item) => data.toString().includes(item))) {
          subprocess.stdin.end("n\n");
        }
        if (data.toString().includes("Aborted.")) {
          subprocess.stdin.end();
          aborted = true;
        }
      });

      subprocess.on("close", () => {
        expect(aborted).toBe(true);
        resolve(null);
      });
    });
  });
});

afterAll(async () => {
  await fse.remove(path);
});
