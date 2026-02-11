
import { storage } from "../server/storage";

function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

const newPost = {
    title: {
        es: "La Matemática del Wellness: Calculando el ROI de una cabina de Crioterapia",
        en: "The Math of Wellness: Calculating the ROI of a Cryotherapy Cabin"
    },
    excerpt: {
        es: "¿Tu spa es un centro de costes o de beneficios? Descubre cómo analizar la rentabilidad real de la tecnología wellness y por qué la ocupación no lo es todo.",
        en: "Is your spa a cost center or a profit center? Discover how to analyze the real profitability of wellness technology and why occupancy isn't everything."
    },
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    date: {
        es: new Date().toISOString(), // Today
        en: new Date().toISOString()
    },
    category: {
        es: "Rentabilidad",
        en: "Profitability"
    },
    readTime: {
        es: "7 min lectura",
        en: "7 min read"
    },
    content: {
        es: [
            "Muchos directores de hotel cometen el error de tratar el spa como un 'amenity' necesario pero costoso, similar a la piscina exterior o el gimnasio. Sin embargo, cuando aplicamos una mentalidad de **gestión de activos** al wellness, descubrimos que puede ser el metro cuadrado más rentable de la propiedad.",
            "**El Mito de la Ocupación**",
            "Tradicionalmente, medimos el éxito por el porcentaje de ocupación de las cabinas. Error. Puedes tener un 90% de ocupación vendiendo masajes relajantes de 60 minutos a 80€, y apenas cubrir costes de personal y producto. La métrica real que utilizo en mis auditorías es el **RevPATH (Revenue Per Available Treatment Hour)**.",
            "**Caso Práctico: Crioterapia vs. Masaje**",
            "Analicemos una inversión en una cabina de Crioterapia de Cuerpo Entero:",
            "- **Inversión Inicial:** ~45.000€",
            "- **Duración del Tratamiento:** 3 minutos (+ 10 min de preparación).",
            "- **Precio Medio:** 60€.",
            "- **Capacidad:** 4 clientes/hora.",
            "- **Personal:** 1 terapeuta (supervisión).",
            "**Comparativa:**",
            "1. **Masaje:** 1 hora = 80€. Coste personal: alto (físico). Límite: 5-6 al día por terapeuta.",
            "2. **Crioterapia:** 1 hora (4 sesiones) = 240€. Coste personal: bajo (supervisión). Límite: La demanda.",
            "**El Resultado:**",
            "Mientras la cabina de masaje genera 80€/hora con alto desgaste, la de crioterapia genera **240€/hora** (3x) con menor coste operativo. El ROI de la máquina se alcanza a menudo en menos de 18 meses, y a partir de ahí, es margen puro.",
            "**Conclusión**",
            "No se trata de eliminar el toque humano, sino de **complementarlo** con tecnología de alto rendimiento. Un spa moderno debe tener un mix equilibrado entre 'High Touch' (terapias manuales) y 'High Tech' (biohacking) para maximizar el RevPATH y ofrecer resultados tangibles al huésped.",
            "¿Quieres que calculemos el potencial de rentabilidad oculta en tu spa? Solicita una auditoría y revisemos tus números."
        ],
        en: [
            "Many hotel directors make the mistake of treating the spa as a necessary but expensive 'amenity', similar to the outdoor pool or the gym. However, when we apply an **asset management** mindset to wellness, we discover it can be the most profitable square meter of the property.",
            "**The Occupancy Myth**",
            "Traditionally, we measure success by treatment room occupancy percentage. Mistake. You can have 90% occupancy selling 60-minute relaxing massages at €80, and barely cover staff and product costs. The real metric I use in my audits is **RevPATH (Revenue Per Available Treatment Hour)**.",
            "**Case Study: Cryotherapy vs. Massage**",
            "Let's analyze an investment in a Whole-Body Cryotherapy cabin:",
            "- **Initial Investment:** ~€45,000",
            "- **Treatment Duration:** 3 minutes (+ 10 min prep).",
            "- **Average Price:** €60.",
            "- **Capacity:** 4 clients/hour.",
            "- **Staff:** 1 therapist (supervision).",
            "**Comparison:**",
            "1. **Massage:** 1 hour = €80. Staff cost: high (physical). Limit: 5-6 per day per therapist.",
            "2. **Cryotherapy:** 1 hour (4 sessions) = €240. Staff cost: low (supervision). Limit: Demand.",
            "**The Result:**",
            "While the massage room generates €80/hour with high wear and tear, the cryotherapy room generates **€240/hour** (3x) with lower operating costs. The machine's ROI is often reached in less than 18 months, and from there, it's pure margin.",
            "**Conclusion**",
            "It's not about eliminating the human touch, but **complementing** it with high-performance technology. A modern spa must have a balanced mix between 'High Touch' (manual therapies) and 'High Tech' (biohacking) to maximize RevPATH and offer tangible results to the guest.",
            "Do you want us to calculate the hidden profitability potential in your spa? Request an audit and let's review your numbers."
        ]
    }
};

async function seed() {
    console.log("Seeding new strategic post...");

    // Spanish
    const esSlug = slugify(newPost.title.es);
    try {
        const existing = await storage.getArticleBySlug(esSlug);
        if (!existing) {
            await storage.createArticle({
                slug: esSlug,
                title: newPost.title.es,
                content: newPost.content.es.join('\n\n'),
                excerpt: newPost.excerpt.es,
                image: newPost.image,
                category: newPost.category.es,
                readTime: newPost.readTime.es,
                date: newPost.date.es,
                language: "es"
            });
            console.log(`✓ Created ES: ${newPost.title.es}`);
        } else {
            console.log(`- Exists ES: ${newPost.title.es}`);
        }
    } catch (e) {
        console.error(`Error creating ES version:`, e);
    }

    // English
    const enSlug = slugify(newPost.title.en);
    try {
        const existing = await storage.getArticleBySlug(enSlug);
        if (!existing) {
            await storage.createArticle({
                slug: enSlug,
                title: newPost.title.en,
                content: newPost.content.en.join('\n\n'),
                excerpt: newPost.excerpt.en,
                image: newPost.image,
                category: newPost.category.en,
                readTime: newPost.readTime.en,
                date: newPost.date.en,
                language: "en"
            });
            console.log(`✓ Created EN: ${newPost.title.en}`);
        } else {
            console.log(`- Exists EN: ${newPost.title.en}`);
        }
    } catch (e) {
        console.error(`Error creating EN version:`, e);
    }

    console.log("Seeding complete.");
    process.exit(0);
}

seed();
