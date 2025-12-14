
import { storage } from "./storage";

async function main() {
    try {
        console.log("Updating article image...");
        const updated = await storage.updateArticle(4, {
            image: "/attached_assets/blog_longevity_luxury_spa_v2.png"
        });
        console.log("Update result:", updated);
        process.exit(0);
    } catch (error) {
        console.error("Error updating article:", error);
        process.exit(1);
    }
}

main();
