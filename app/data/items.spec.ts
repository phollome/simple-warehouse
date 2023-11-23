import { afterEach, expect, test } from "vitest";
import {
  addItem,
  dropItems,
  getItems,
  getItemsCount,
  searchForItems,
} from "./items";

test("add item", () => {
  addItem({ name: "test1" });
  expect(getItemsCount()).toBe(1);

  addItem({ name: "test2" });
  expect(getItemsCount()).toBe(2);

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

afterEach(() => {
  dropItems();
});
