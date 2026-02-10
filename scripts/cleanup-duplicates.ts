
import { storage } from "../server/storage";
import { db } from "../server/db";
import { articles } from "@shared/schema";
import { eq, inArray } from "drizzle-orm";

async function cleanup() {
    console.log("Cleaning up duplicate articles...");

    // IDs to remove based on analysis
    const idsToRemove = [1, 4, 6, 7];

    for (const id of idsToRemove) {
        try {
            await db.delete(articles).where(eq(articles.id, id));
            console.log(`Deleted article ID: ${id}`);
        } catch (e) {
            console.error(`Failed to delete ID ${id}:`, e);
        }
    }

    console.log("Cleanup complete.");
    process.exit(0);
}

cleanup();
