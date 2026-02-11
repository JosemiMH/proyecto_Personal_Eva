
import { storage } from "../server/storage";
import fs from "fs";

async function run() {
    const allArticles = await storage.getAllArticles();

    // Sort by ID to see insertion order
    allArticles.sort((a, b) => a.id - b.id);

    fs.writeFileSync('articles.json', JSON.stringify(allArticles, null, 2));
    console.log(`Exported ${allArticles.length} articles to articles.json`);
    process.exit(0);
}

run();
