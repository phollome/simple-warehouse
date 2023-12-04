import config from "~/config";
import { dbClient } from "~/db.server";
import { randWord } from "@ngneat/falso";
import { addItem, dropItems } from "~/data/items";

async function seed() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Cannot seed in production.");
  }

  process.env.DATABASE_URL = config.get("database.url");

  await dropItems();

  const numberOfItems = config.get("database.seed.numberOfItems");
  const randomWords = randWord({ capitalize: true, length: 10 });

  for (let i = 0; i < numberOfItems; i++) {
    await addItem({
      id: i,
      name: randomWords[i],
    });
  }
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await dbClient.$disconnect();
  });
