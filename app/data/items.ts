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

export function searchForItems(
  query: string,
  options?: { sort?: "asc" | "desc" | (string | null) }
) {
  const { sort = "asc" } = options || {};

  const lowerCasesQuery = query.toLowerCase();
  const filteredItems = items
    .filter((item) => {
      const lowerCasedName = item.name.toLowerCase();
      return lowerCasedName.includes(lowerCasesQuery);
    })
    .sort((a, b) => {
      if (sort === "desc") {
        return b.id - a.id;
      }
      return a.id - b.id;
    });
  return filteredItems;
}

export function getItemByID(id: number) {
  const item = items.find((item) => {
    return item.id === id;
  });
  return item;
}

export function getItemsByIDs(
  ids: number[],
  options?: { sort?: "asc" | "desc" | (string | null) }
) {
  const { sort = "asc" } = options || {};

  const filteredItems = items
    .filter((item) => {
      return ids.includes(item.id);
    })
    .sort((a, b) => {
      if (sort === "desc") {
        return b.id - a.id;
      }
      return a.id - b.id;
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
