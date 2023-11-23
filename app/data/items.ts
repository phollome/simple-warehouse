type item = {
  id: number;
  name: string;
};

let items: item[] = [];

export function addItem(item: Omit<item, "id">) {
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

export function deleteItem(id: number) {
  items = items.filter((item) => {
    return item.id !== id;
  });
}

export function dropItems() {
  items = [];
}
