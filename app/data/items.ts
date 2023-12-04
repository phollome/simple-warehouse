import { type Item } from "@prisma/client";
import { dbClient } from "../db.server";

export async function addItem(data: Pick<Item, "name"> & { id?: number }) {
  const item = await dbClient.item.create({
    data,
  });

  return item;
}

export async function getItems(options?: {
  sort?: "asc" | "desc" | (string | null);
  skip?: number;
  take?: number;
}) {
  const { sort = "asc", skip, take } = options || {};

  const items = await dbClient.item.findMany({
    orderBy: {
      id: sort === "asc" ? "asc" : "desc",
    },
    skip,
    take,
  });

  return items;
}

export async function getItemsCount(options?: {
  query?: string | null;
  ids?: number[] | null;
}) {
  const { query, ids } = options || {};

  let where: any = {};
  if (typeof query === "string") {
    where.name = {
      contains: query,
    };
  }
  if (Array.isArray(ids)) {
    where.id = {
      in: ids,
    };
  }
  const count = await dbClient.item.count({
    where,
  });

  return count;
}

export async function searchForItems(
  query: string,
  options?: {
    sort?: "asc" | "desc" | (string | null);
    skip?: number;
    take?: number;
  }
) {
  const { sort = "asc", skip, take } = options || {};

  const items = await dbClient.item.findMany({
    where: {
      name: {
        contains: query,
      },
    },
    orderBy: {
      id: sort === "asc" ? "asc" : "desc",
    },
    skip,
    take,
  });

  return items;
}

export async function getItemByID(id: number) {
  const item = await dbClient.item.findFirst({
    where: {
      id,
    },
  });
  return item;
}

export async function getItemsByIDs(
  ids: number[],
  options?: {
    sort?: "asc" | "desc" | (string | null);
    skip?: number;
    take?: number;
  }
) {
  const { sort = "asc", skip, take } = options || {};

  const items = await dbClient.item.findMany({
    where: {
      id: {
        in: ids,
      },
    },
    orderBy: {
      id: sort === "asc" ? "asc" : "desc",
    },
    skip,
    take,
  });

  return items;
}

export async function deleteItem(id: number) {
  await dbClient.item.delete({
    where: {
      id,
    },
  });
}

export async function dropItems() {
  await dbClient.item.deleteMany();
}
