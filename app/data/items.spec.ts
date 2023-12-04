import { afterEach, beforeAll, expect, test } from "vitest";
import {
  addItem,
  deleteItem,
  dropItems,
  getItemByID,
  getItems,
  getItemsByIDs,
  getItemsCount,
  searchForItems,
} from "./items";

beforeAll(async () => {
  await dropItems();
});

test("count items", async () => {
  await addItem({ id: 1, name: "test1" });
  await addItem({ id: 2, name: "test2" });
  await addItem({ id: 3, name: "test3" });
  await addItem({ id: 4, name: "test4" });
  await addItem({ id: 5, name: "test5" });

  expect(await getItemsCount()).toBe(5);
  expect(await getItemsCount({ query: "test2" })).toBe(1);
  expect(await getItemsCount({ query: "test" })).toBe(5);
  expect(await getItemsCount({ ids: [1, 3] })).toBe(2);
});

test("add item", async () => {
  await addItem({ id: 1, name: "test1" });
  expect(await getItemsCount()).toBe(1);

  const result = await addItem({ id: 2, name: "test2" });
  expect(result).toContain({ id: 2, name: "test2" });

  const items = await getItems();
  expect(items).toMatchObject([
    { id: 1, name: "test1" },
    { id: 2, name: "test2" },
  ]);
});

test("search for items", async () => {
  await addItem({ id: 1, name: "test1" });
  await addItem({ id: 2, name: "test2" });
  await addItem({ id: 3, name: "test3" });
  await addItem({ id: 4, name: "test4" });
  await addItem({ id: 5, name: "test5" });

  const items = await getItems();
  expect(items).toMatchObject([
    { id: 1, name: "test1" },
    { id: 2, name: "test2" },
    { id: 3, name: "test3" },
    { id: 4, name: "test4" },
    { id: 5, name: "test5" },
  ]);

  expect(await searchForItems("test2")).toMatchObject([
    { id: 2, name: "test2" },
  ]);

  expect(await searchForItems("test")).toMatchObject([
    { id: 1, name: "test1" },
    { id: 2, name: "test2" },
    { id: 3, name: "test3" },
    { id: 4, name: "test4" },
    { id: 5, name: "test5" },
  ]);

  expect(await searchForItems("test", { sort: "desc" })).toMatchObject([
    { id: 5, name: "test5" },
    { id: 4, name: "test4" },
    { id: 3, name: "test3" },
    { id: 2, name: "test2" },
    { id: 1, name: "test1" },
  ]);

  expect(await searchForItems("test", { skip: 3, take: 2 })).toMatchObject([
    { id: 4, name: "test4" },
    { id: 5, name: "test5" },
  ]);

  expect(
    await searchForItems("test", { sort: "desc", skip: 1, take: 2 })
  ).toMatchObject([
    { id: 4, name: "test4" },
    { id: 3, name: "test3" },
  ]);
});

test("get items", async () => {
  await addItem({ id: 1, name: "test1" });
  await addItem({ id: 2, name: "test2" });
  await addItem({ id: 3, name: "test3" });
  await addItem({ id: 4, name: "test4" });
  await addItem({ id: 5, name: "test5" });

  expect(await getItems()).toMatchObject([
    { id: 1, name: "test1" },
    { id: 2, name: "test2" },
    { id: 3, name: "test3" },
    { id: 4, name: "test4" },
    { id: 5, name: "test5" },
  ]);

  expect(await getItems({ sort: "desc" })).toMatchObject([
    { id: 5, name: "test5" },
    { id: 4, name: "test4" },
    { id: 3, name: "test3" },
    { id: 2, name: "test2" },
    { id: 1, name: "test1" },
  ]);

  expect(await getItems({ skip: 3, take: 2 })).toMatchObject([
    { id: 4, name: "test4" },
    { id: 5, name: "test5" },
  ]);

  expect(await getItems({ sort: "desc", skip: 1, take: 2 })).toMatchObject([
    { id: 4, name: "test4" },
    { id: 3, name: "test3" },
  ]);
});

test("get items by id", async () => {
  await addItem({ id: 1, name: "test1" });
  await addItem({ id: 2, name: "test2" });
  await addItem({ id: 3, name: "test3" });
  await addItem({ id: 4, name: "test4" });
  await addItem({ id: 5, name: "test5" });

  const item = await getItemByID(1);
  expect(item).toMatchObject({ id: 1, name: "test1" });

  expect(await getItemsByIDs([1, 3])).toMatchObject([
    { id: 1, name: "test1" },
    { id: 3, name: "test3" },
  ]);
  expect(await getItemsByIDs([1, 3], { sort: "desc" })).toMatchObject([
    { id: 3, name: "test3" },
    { id: 1, name: "test1" },
  ]);

  expect(await getItemsByIDs([1, 2, 3, 5], { skip: 2, take: 3 })).toMatchObject(
    [
      { id: 3, name: "test3" },
      { id: 5, name: "test5" },
    ]
  );

  expect(
    await getItemsByIDs([1, 2, 3, 5], { sort: "desc", skip: 1, take: 2 })
  ).toMatchObject([
    { id: 3, name: "test3" },
    { id: 2, name: "test2" },
  ]);
});

test("delete items", async () => {
  await addItem({ id: 1, name: "test1" });
  await addItem({ id: 2, name: "test2" });
  await addItem({ id: 3, name: "test3" });

  await deleteItem(2);
  expect(await getItemsCount()).toBe(2);
  expect(await getItems()).toMatchObject([
    { id: 1, name: "test1" },
    { id: 3, name: "test3" },
  ]);
});

afterEach(async () => {
  await dropItems();
});
