import 'dotenv/config';
import { db } from "../db";
import { articles } from "@shared/schema";
import { eq, like } from "drizzle-orm";

async function main() {
    console.log("Starting blog image update...");

    try {
        // Find the article
        const [article] = await db.select().from(articles).where(like(articles.title, "%Healthspan%"));
    } catch (error) {
        console.error("Error updating article:", error);
        process.exit(1);
    }

    console.log("Done.");
    process.exit(0);
}

main();
