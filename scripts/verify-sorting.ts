
import { storage } from "../server/storage";

async function verifySorting() {
    const articles = await storage.getAllArticles();

    // Test ES sorting
    const esArticles = articles.filter(a => a.language === 'es');

    const sorted = [...esArticles].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    console.log("--- Sorted Articles (ES) ---");
    sorted.forEach(a => {
        console.log(`${a.date} - ${a.title} (${new Date(a.date).getFullYear()})`);
    });

    process.exit(0);
}

verifySorting();
