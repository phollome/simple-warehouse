import { z } from "zod";

export const itemSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(3, "Must be at least 3 characters"),
});

type item = z.infer<typeof itemSchema> & { id: number };

let items: item[] = [];

export function addItem(item: z.infer<typeof itemSchema>) {
  const itemToAdd = { ...item, id: items.length + 1 };
  items.push(itemToAdd);
  return itemToAdd;
}

export function getItems() {
  return items;
}

export function getItemsCount() {
  return items.length;
}

export function searchForItems(query: string) {
  const lowerCasesQuery = query.toLowerCase();
  const filteredItems = items.filter((item) => {
    const lowerCasedName = item.name.toLowerCase();
    return lowerCasedName.includes(lowerCasesQuery);
  });
  return filteredItems;
}

export function getItemById(id: number) {
  const item = items.find((item) => {
    return item.id === id;
  });
  return item;
}

export function getItemsById(ids: number[]) {
  const filteredItems = items.filter((item) => {
    return ids.includes(item.id);
  });
  return filteredItems;
}

export function dropItems() {
  items = [];
}
