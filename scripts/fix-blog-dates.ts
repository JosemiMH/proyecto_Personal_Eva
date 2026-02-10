
import { storage } from "../server/storage";
import { db } from "../server/db";
import { articles } from "@shared/schema";
import { eq, ilike } from "drizzle-orm";

const dateUpdates = [
    {
        term: "Tendencias Spa 2026", // Tendencias vs Trends
        date: "2026-02-10T09:00:00Z"
    },
    {
        term: "El Secreto de la Longevidad",
        date: "2025-12-12T09:00:00Z"
    },
    {
        term: "Healthspan",
        date: "2025-11-30T09:00:00Z" // Keep as is (Late 2025)
    },
    {
        term: "Diseño Biofílico",
        date: "2025-11-30T09:00:00Z" // Keep as is
    },
    {
        term: "ROI",
        date: "2025-11-30T09:00:00Z" // Keep as is
    },
    {
        term: "Efecto WOW",
        date: "2025-03-25T09:00:00Z"
    },
    {
        term: "Menopausia",
        date: "2025-03-12T09:00:00Z"
    },
    {
        term: "Bienestar Mental",
        date: "2025-03-05T09:00:00Z"
    },
    {
        term: "Eco-Lujo",
        date: "2025-02-20T09:00:00Z"
    },
    {
        term: "Eco-Luxury", // English title
        date: "2025-02-20T09:00:00Z"
    },
    {
        term: "Revolución de la Longevidad",
        date: "2025-02-02T09:00:00Z"
    },
    {
        term: "Longevity Revolution",
        date: "2025-02-02T09:00:00Z"
    },
    {
        term: "IA y la Hiper-personalización",
        date: "2025-01-15T09:00:00Z"
    },
    {
        term: "AI & Hyper-personalization",
        date: "2025-01-15T09:00:00Z"
    }
];

async function fixDates() {
    console.log("Fixing blog post dates...");

    const allArticles = await storage.getAllArticles();

    for (const update of dateUpdates) {
        const targets = allArticles.filter(a =>
            a.title.toLowerCase().includes(update.term.toLowerCase())
        );

        for (const article of targets) {
            console.log(`Updating date for: ${article.title} -> ${update.date}`);
            await db.update(articles)
                .set({ date: update.date })
                .where(eq(articles.id, article.id));
        }
    }

    console.log("Date fix complete.");
    process.exit(0);
}

fixDates();
