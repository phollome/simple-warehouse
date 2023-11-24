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

beforeAll(() => {
  dropItems();
});

test("count items", () => {
  addItem({ name: "test1" });
  addItem({ name: "test2" });
  addItem({ name: "test3" });
  addItem({ name: "test4" });
  addItem({ name: "test5" });

  expect(getItemsCount()).toBe(5);
  expect(getItemsCount({ query: "test2" })).toBe(1);
  expect(getItemsCount({ ids: [1, 3] })).toBe(2);
});

test("add item", () => {
  addItem({ name: "test1" });
  expect(getItemsCount()).toBe(1);

  const result = addItem({ name: "test2" });
  expect(result).toEqual({ id: 2, name: "test2" });

  const items = getItems();
  expect(items).toEqual([
    { id: 1, name: "test1" },
    { id: 2, name: "test2" },
  ]);
});

test("search for items", () => {
  addItem({ name: "test1" });
  addItem({ name: "test2" });
  addItem({ name: "test3" });
  addItem({ name: "test4" });
  addItem({ name: "test5" });

  const items = getItems();
  expect(items).toEqual([
    { id: 1, name: "test1" },
    { id: 2, name: "test2" },
    { id: 3, name: "test3" },
    { id: 4, name: "test4" },
    { id: 5, name: "test5" },
  ]);

  expect(searchForItems("test2")).toEqual([{ id: 2, name: "test2" }]);

  expect(searchForItems("test")).toEqual([
    { id: 1, name: "test1" },
    { id: 2, name: "test2" },
    { id: 3, name: "test3" },
    { id: 4, name: "test4" },
    { id: 5, name: "test5" },
  ]);

  expect(searchForItems("test", { sort: "desc" })).toEqual([
    { id: 5, name: "test5" },
    { id: 4, name: "test4" },
    { id: 3, name: "test3" },
    { id: 2, name: "test2" },
    { id: 1, name: "test1" },
  ]);

  expect(searchForItems("test", { skip: 3, take: 2 })).toEqual([
    { id: 4, name: "test4" },
    { id: 5, name: "test5" },
  ]);

  expect(searchForItems("test", { sort: "desc", skip: 1, take: 2 })).toEqual([
    { id: 4, name: "test4" },
    { id: 3, name: "test3" },
  ]);
});

test("get items", () => {
  addItem({ name: "test1" });
  addItem({ name: "test2" });
  addItem({ name: "test3" });
  addItem({ name: "test4" });
  addItem({ name: "test5" });

  expect(getItems()).toEqual([
    { id: 1, name: "test1" },
    { id: 2, name: "test2" },
    { id: 3, name: "test3" },
    { id: 4, name: "test4" },
    { id: 5, name: "test5" },
  ]);

  expect(getItems({ sort: "desc" })).toEqual([
    { id: 5, name: "test5" },
    { id: 4, name: "test4" },
    { id: 3, name: "test3" },
    { id: 2, name: "test2" },
    { id: 1, name: "test1" },
  ]);

  expect(getItems({ skip: 3, take: 2 })).toEqual([
    { id: 4, name: "test4" },
    { id: 5, name: "test5" },
  ]);

  expect(getItems({ sort: "desc", skip: 1, take: 2 })).toEqual([
    { id: 4, name: "test4" },
    { id: 3, name: "test3" },
  ]);
});

test("get items by id", () => {
  addItem({ name: "test1" });
  addItem({ name: "test2" });
  addItem({ name: "test3" });
  addItem({ name: "test4" });
  addItem({ name: "test5" });

  const item = getItemByID(1);
  expect(item).toEqual({ id: 1, name: "test1" });

  expect(getItemsByIDs([1, 3])).toEqual([
    { id: 1, name: "test1" },
    { id: 3, name: "test3" },
  ]);
  expect(getItemsByIDs([1, 3], { sort: "desc" })).toEqual([
    { id: 3, name: "test3" },
    { id: 1, name: "test1" },
  ]);

  expect(getItemsByIDs([1, 2, 3, 5], { skip: 2, take: 3 })).toEqual([
    { id: 3, name: "test3" },
    { id: 5, name: "test5" },
  ]);

  expect(
    getItemsByIDs([1, 2, 3, 5], { sort: "desc", skip: 1, take: 2 })
  ).toEqual([
    { id: 3, name: "test3" },
    { id: 2, name: "test2" },
  ]);
});

test("delete items", () => {
  const { id: _id1 } = addItem({ name: "test1" });
  const { id: _id2 } = addItem({ name: "test2" });
  const { id: _id3 } = addItem({ name: "test3" });

  deleteItem(_id2);
  expect(getItemsCount()).toBe(2);
  expect(getItems()).toEqual([
    { id: 1, name: "test1" },
    { id: 3, name: "test3" },
  ]);
});

afterEach(() => {
  dropItems();
});
