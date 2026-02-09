export interface LocalizedString {
    es: string;
    en: string;
}

export interface LocalizedArray {
    es: string[];
    en: string[];
}

export interface Project {
    title: LocalizedString;
    description: LocalizedString;
    longDescription: LocalizedString;
    image: string;
    chain: string;
    chainName: LocalizedString;
    highlights: LocalizedArray;
    results: LocalizedArray;
    category: string;
    categoryName: LocalizedString;
}

export interface Service {
    icon: string;
    title: LocalizedString;
    description: LocalizedString;
    longDescription?: LocalizedString;
    features: LocalizedArray;
}

export interface BlogPost {
    title: LocalizedString;
    excerpt: LocalizedString;
    image: string;
    date: LocalizedString;
    category: LocalizedString;
    readTime: LocalizedString;
    content: LocalizedArray;
}
