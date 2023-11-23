import { afterEach, expect, test } from "vitest";
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

  const items = getItems();
  expect(items).toEqual([
    { id: 1, name: "test1" },
    { id: 2, name: "test2" },
    { id: 3, name: "test3" },
  ]);

  expect(searchForItems("test2")).toEqual([{ id: 2, name: "test2" }]);

  expect(searchForItems("test")).toEqual([
    { id: 1, name: "test1" },
    { id: 2, name: "test2" },
    { id: 3, name: "test3" },
  ]);

  expect(searchForItems("test", { sort: "desc" })).toEqual([
    { id: 3, name: "test3" },
    { id: 2, name: "test2" },
    { id: 1, name: "test1" },
  ]);
});

test("get items by id", () => {
  addItem({ name: "test1" });
  addItem({ name: "test2" });
  addItem({ name: "test3" });

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
