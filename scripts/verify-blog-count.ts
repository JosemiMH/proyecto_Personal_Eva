
import { storage } from "../server/storage";
import { db } from "../server/db";
import { articles } from "@shared/schema";
import { eq } from "drizzle-orm";

async function verify() {
    console.log("Verifying article counts...");

    const allArticles = await storage.getAllArticles();
    const enCount = allArticles.filter(a => a.language === 'en').length;
    const esCount = allArticles.filter(a => a.language === 'es').length;

    console.log(`Total Articles: ${allArticles.length}`);
    console.log(`English Articles: ${enCount}`);
    console.log(`Spanish Articles: ${esCount}`);

    if (enCount === 0) {
        console.error("❌ No English articles found!");
        process.exit(1);
    }

    if (enCount !== esCount) {
        console.warn("⚠️ Mismatch between English and Spanish article counts.");
    } else {
        console.log("✅ English and Spanish article counts match.");
    }

    process.exit(0);
}

verify();
