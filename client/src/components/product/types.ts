export type PRODUCT_TYPES = "course" | "source-code" | "ebook" | "ui-kit" | "template" |
    "ai-prompt" | "software" | "other";

export type PRODUCT_STATUSES = "draft" | "published";

export interface ProductLinkItem {
    title: string;
    url: string;
}

export interface Product {
    _id?: string;
    partnerId?: string;
    title: string;
    slug: string;
    description: string;
    type: PRODUCT_TYPES;
    price: number;
    links: ProductLinkItem[];
    status: PRODUCT_STATUSES
    totalSales?: number;
    totalRevenue?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export const PRODUCT_TYPES: { value: PRODUCT_TYPES; label: string }[] = [
    { value: "course", label: "Course" },
    { value: "source-code", label: "Source Code" },
    { value: "ebook", label: "Ebook" },
    { value: "ui-kit", label: "UI Kit" },
    { value: "template", label: "Template" },
    { value: "ai-prompt", label: "AI Prompt" },
    { value: "software", label: "Software" },
    { value: "other", label: "Other" },
];