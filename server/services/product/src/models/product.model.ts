import { Schema, model, type Document, type Types } from "mongoose";

export const PRODUCT_TYPES = [
    "course",
    "source-code",
    "ebook",
    "ui-kit",
    "template",
    "ai-prompt",
    "software",
    "other",
] as const;

export const PRODUCT_STATUSES = ["draft", "published"] as const;

export interface IProductLink {
    title: string;
    url: string;
}

export interface IProduct extends Document {
    partnerId: Types.ObjectId;
    title: string;
    slug: string;
    description: string;
    type: (typeof PRODUCT_TYPES)[number];
    price: number;
    links: IProductLink[];
    status: (typeof PRODUCT_STATUSES)[number];
    totalSales: number;
    totalRevenue: number;
    createdAt: Date;
    updatedAt: Date;
}

const productLinkSchema = new Schema<IProductLink>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        url: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { _id: false },
);

const productSchema = new Schema<IProduct>(
    {
        partnerId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        type: {
            type: String,
            required: true,
            enum: PRODUCT_TYPES,
            index: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        links: {
            type: [productLinkSchema],
            default: [],
        },
        status: {
            type: String,
            enum: PRODUCT_STATUSES,
            default: "draft",
            index: true,
        },
        totalSales: {
            type: Number,
            default: 0,
            min: 0,
        },
        totalRevenue: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    {
        timestamps: true,
    },
);

export const Product = model<IProduct>("Product", productSchema);
