
import { storage } from "../server/storage";
import { db } from "../server/db";
import { articles } from "@shared/schema";
import { eq, ilike } from "drizzle-orm";

async function updateIaDate() {
    console.log("Updating 'IA' date...");

    const targetDate = "2025-12-18T09:00:00Z";

    const allArticles = await storage.getAllArticles();
    const iaArticles = allArticles.filter(a => a.title.toLowerCase().includes("ia y la hiper") || a.title.toLowerCase().includes("ai & hyper"));

    for (const article of iaArticles) {
        console.log(`Updating date for: ${article.title}`);
        await db.update(articles)
            .set({ date: targetDate })
            .where(eq(articles.id, article.id));
    }

    console.log("Update complete.");
    process.exit(0);
}

updateIaDate();
