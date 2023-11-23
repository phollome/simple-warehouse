import { afterEach, expect, test } from "vitest";
import {
  addItem,
  dropItems,
  getItemById,
  getItems,
  getItemsById,
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
});

test("get items by id", () => {
  addItem({ name: "test1" });
  addItem({ name: "test2" });
  addItem({ name: "test3" });

  const item = getItemById(1);
  expect(item).toEqual({ id: 1, name: "test1" });

  const items = getItemsById([1, 3]);
  expect(items).toEqual([
    { id: 1, name: "test1" },
    { id: 3, name: "test3" },
  ]);
});

afterEach(() => {
  dropItems();
});
