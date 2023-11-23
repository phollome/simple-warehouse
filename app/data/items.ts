import { z } from "zod";

export const itemSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(3, "Must be at least 3 characters"),
});

type item = z.infer<typeof itemSchema> & { id: number };

const items: item[] = [];

export function addItem(item: z.infer<typeof itemSchema>) {
  items.push({ ...item, id: items.length + 1 });
}

export function getItems() {
  return items;
}

export function getItemsCount() {
  return items.length;
}
