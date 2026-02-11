
import { storage } from "../server/storage";

async function run() {
    console.error("Starting verification...");
    try {
        const articles = await storage.getAllArticles();
        console.error(`Total articles: ${articles.length}`);
        const en = articles.filter(a => a.language === 'en');
        const es = articles.filter(a => a.language === 'es');
        console.error(`EN articles: ${en.length}`);
        console.error(`ES articles: ${es.length}`);
    } catch (err) {
        console.error("Error:", err);
    }
    process.exit(0);
}

run();
