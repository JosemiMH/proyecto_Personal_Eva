
import { storage } from "../server/storage";
import { db } from "../server/db";
import { articles } from "@shared/schema";
import { eq, ilike } from "drizzle-orm";

async function fixImage() {
    console.log("Fixing missing blog image...");

    const targetSlugPart = "eco-lujo"; // Works for ES and EN (keywords)

    const results = await db.select().from(articles).where(ilike(articles.slug, `%eco-lux%`));
    // Wait, ES: eco-lujo, EN: eco-luxury.
    // Better search by title or just fuzzy slug.

    const allArticles = await storage.getAllArticles();
    const ecoArticles = allArticles.filter(a => a.slug.includes('eco-lujo') || a.slug.includes('eco-luxury'));

    if (ecoArticles.length === 0) {
        console.log("No Eco-Luxury articles found.");
        process.exit(1);
    }

    for (const article of ecoArticles) {
        console.log(`Updating image for: ${article.title} (${article.language})`);

        await db.update(articles)
            .set({ image: '/attached_assets/parador_new.png' })
            .where(eq(articles.id, article.id));

        console.log("Updated.");
    }

    console.log("Fix complete.");
    process.exit(0);
}

fixImage();
