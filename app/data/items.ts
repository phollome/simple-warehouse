type item = {
  id: number;
  name: string;
};

let items: item[] = [
  { id: 1, name: "test1" },
  { id: 2, name: "test2" },
  { id: 3, name: "test3" },
  { id: 4, name: "test4" },
  { id: 5, name: "test5" },
  { id: 6, name: "test6" },
  { id: 7, name: "test7" },
  { id: 8, name: "test8" },
  { id: 9, name: "test9" },
  { id: 10, name: "test10" },
  { id: 11, name: "test11" },
  { id: 12, name: "test12" },
  { id: 13, name: "test13" },
  { id: 14, name: "test14" },
  { id: 15, name: "test15" },
  { id: 16, name: "test16" },
  { id: 17, name: "test17" },
  { id: 18, name: "test18" },
  { id: 19, name: "test19" },
  { id: 20, name: "test20" },
];

export function addItem(item: Omit<item, "id">) {
  const itemToAdd = { ...item, id: items.length + 1 };
  items.push(itemToAdd);
  return itemToAdd;
}

export function getItems(options?: {
  sort?: "asc" | "desc" | (string | null);
  skip?: number;
  take?: number;
}) {
  const { sort = "asc", skip, take } = options || {};
  const sortedItems = items.sort((a, b) => {
    if (sort === "desc") {
      return b.id - a.id;
    }
    return a.id - b.id;
  });
  if (typeof skip === "number" && typeof take === "number") {
    return sortedItems.slice(skip, skip + take);
  }
  return sortedItems;
}

export function getItemsCount(options?: {
  query?: string | null;
  ids?: number[] | null;
}) {
  const { query, ids } = options || {};

  if (typeof query === "string") {
    return searchForItems(query).length;
  }
  if (Array.isArray(ids)) {
    return getItemsByIDs(ids).length;
  }
  return items.length;
}

export function searchForItems(
  query: string,
  options?: {
    sort?: "asc" | "desc" | (string | null);
    skip?: number;
    take?: number;
  }
) {
  const { sort = "asc", skip, take } = options || {};

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
  if (typeof skip === "number" && typeof take === "number") {
    return filteredItems.slice(skip, skip + take);
  }
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
  options?: {
    sort?: "asc" | "desc" | (string | null);
    skip?: number;
    take?: number;
  }
) {
  const { sort = "asc", skip, take } = options || {};

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
  if (typeof skip === "number" && typeof take === "number") {
    return filteredItems.slice(skip, skip + take);
  }
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
