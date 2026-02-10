
import { storage } from "../server/storage";
import { db } from "../server/db";
import { articles } from "@shared/schema";
import { eq, ilike } from "drizzle-orm";

async function updateWowDate() {
    console.log("Updating 'Efecto WOW' date...");

    const targetDate = "2025-12-20T09:00:00Z";

    const allArticles = await storage.getAllArticles();
    const wowArticles = allArticles.filter(a => a.title.toLowerCase().includes("efecto wow") || a.title.toLowerCase().includes("wow effect"));

    for (const article of wowArticles) {
        console.log(`Updating date for: ${article.title}`);
        await db.update(articles)
            .set({ date: targetDate })
            .where(eq(articles.id, article.id));
    }

    console.log("Update complete.");
    process.exit(0);
}

updateWowDate();
