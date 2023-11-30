import { test, expect } from "@playwright/test";
import config from "~/config.server";

test("initial items", async ({ page }) => {
  await page.goto(config.get("baseURL"));

  const items = await page.getByTestId("item").all();

  expect(items.length).toBeLessThanOrEqual(
    config.get("app.numberOfItemsPerPage")
  );
});

test("search for items", async ({ page }) => {
  await page.goto(config.get("baseURL"));

  const link = await page.getByText("Search");
  await link.click();

  const searchInput = await page.getByLabel("Search for");
  await searchInput.fill("test");

  const items = await page.getByTestId("item").all();

  expect(items.length).toBeLessThanOrEqual(
    config.get("app.numberOfItemsPerPage")
  );
});

test("add item", async ({ page }) => {
  await page.goto(config.get("baseURL"));

  const link = await page.getByText("Add");
  await link.click();

  const nameInput = await page.getByLabel("Name");
  await nameInput.fill("test21");

  const addButton = (await page.$$("button")).find(async (button) => {
    return (await button.textContent()) === "Add";
  });

  if (typeof addButton === "undefined") {
    throw new Error("Add button not found");
  }

  await addButton.click();

  await page.waitForTimeout(config.get("testing.e2e.waitAfterSubmit"));

  const items = await page.getByTestId("item").all();

  expect(items.length).toBe(1);
});
