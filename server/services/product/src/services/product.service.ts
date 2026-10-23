import { Types } from "mongoose";

import redis from "../../../../shared/redis/redis.js";
import { AppError } from "../error/AppError.js";
import { Product, type IProduct } from "../models/product.model.js";

const PRODUCT_CACHE_TTL = 600;
const PUBLIC_PRODUCTS_CACHE_TTL = 600;
const PUBLIC_PRODUCTS_CACHE_KEY = "public:products";

export type CreateProductResult =
    | { kind: "duplicate" }
    | { kind: "created"; product: IProduct };

export interface PartnerProductsResult {
    products: IProduct[];
    source: "cached" | "database";
}

export type UpdateProductResult =
    | { kind: "duplicate" }
    | { kind: "updated"; product: IProduct };

export interface DeleteProductResult {
    deleted: true;
}

interface PublicProductsResult {
    products: ProductInput[];
    source: "Redis" | "Database";
}

interface ProductInput {
    title: string;
    slug: string;
    description: string;
    type: IProduct["type"];
    price: number;
    links: IProduct["links"];
    status: IProduct["status"];
}

export const createProduct = async (
    partnerId: unknown,
    input: ProductInput,
): Promise<CreateProductResult> => {
    if (
        typeof partnerId !== "string" ||
        !partnerId.trim() ||
        !Types.ObjectId.isValid(partnerId)
    ) {
        throw new AppError("Invalid partner ID", 400);
    }

    const { title, slug, description, type, price, links, status } = input;

    if (typeof slug !== "string" || !slug.trim()) {
        throw new AppError("Slug is required", 400);
    }

    const cleanedSlug = slug
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-");

    const existingProduct = await Product.findOne({ slug: cleanedSlug });

    if (existingProduct) {
        return { kind: "duplicate" };
    }

    const product = await Product.create({
        partnerId: new Types.ObjectId(partnerId.trim()),
        title,
        slug: cleanedSlug,
        description,
        type,
        price,
        links,
        status,
    });

    await redis.del(`products:${partnerId.trim()}`);

    if (product.status === "published") {
        await redis.del(PUBLIC_PRODUCTS_CACHE_KEY);
    }

    return { kind: "created", product };
};

export const getAllPartnerProducts = async (
    partnerId: unknown,
): Promise<PartnerProductsResult> => {
    if (
        typeof partnerId !== "string" ||
        !partnerId.trim() ||
        !Types.ObjectId.isValid(partnerId)
    ) {
        throw new AppError("Invalid partner ID", 400);
    }

    const normalizedPartnerId = partnerId.trim();
    const cacheKey = `products:${normalizedPartnerId}`;
    const cachedProducts = await redis.get(cacheKey);

    if (cachedProducts) {
        const products: IProduct[] = JSON.parse(cachedProducts);

        return {
            products,
            source: "cached",
        };
    }

    const products = await Product.find({
        partnerId: new Types.ObjectId(normalizedPartnerId),
    }).sort({ createdAt: -1 });

    await redis.set(
        cacheKey,
        JSON.stringify(products),
        "EX",
        PRODUCT_CACHE_TTL,
    );

    return {
        products,
        source: "database",
    };
};

export const updateProduct = async (
    partnerId: unknown,
    productId: unknown,
    input: Partial<ProductInput>,
): Promise<UpdateProductResult> => {
    if (
        typeof partnerId !== "string" ||
        !partnerId.trim() ||
        !Types.ObjectId.isValid(partnerId)
    ) {
        throw new AppError("Invalid partner ID", 400);
    }

    if (
        typeof productId !== "string" ||
        !productId.trim() ||
        !Types.ObjectId.isValid(productId)
    ) {
        throw new AppError("Invalid product ID", 400);
    }

    const normalizedPartnerId = partnerId.trim();
    const partnerObjectId = new Types.ObjectId(normalizedPartnerId);
    const productObjectId = new Types.ObjectId(productId.trim());

    const product = await Product.findOne({
        _id: productObjectId,
        partnerId: partnerObjectId,
    });

    if (!product) {
        throw new AppError("Product not found", 404);
    }

    const wasPublished = product.status === "published";

    if (input.slug !== undefined) {
        if (typeof input.slug !== "string" || !input.slug.trim()) {
            throw new AppError("Slug cannot be empty", 400);
        }

        const cleanedSlug = input.slug
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "-");

        const existingProduct = await Product.findOne({
            slug: cleanedSlug,
            _id: { $ne: productObjectId },
        });

        if (existingProduct) {
            return { kind: "duplicate" };
        }

        product.slug = cleanedSlug;
    }

    product.title = input.title ?? product.title;
    product.description = input.description ?? product.description;
    product.type = input.type ?? product.type;
    product.price = input.price ?? product.price;
    product.links = input.links ?? product.links;
    product.status = input.status ?? product.status;

    const updatedProduct = await product.save();

    await redis.del(`products:${normalizedPartnerId}`);

    if (wasPublished || product.status === "published") {
        await redis.del(PUBLIC_PRODUCTS_CACHE_KEY);
    }

    return {
        kind: "updated",
        product: updatedProduct,
    };
};

export const deleteProduct = async (
    partnerId: unknown,
    productId: unknown,
): Promise<DeleteProductResult> => {
    if (
        typeof partnerId !== "string" ||
        !partnerId.trim() ||
        !Types.ObjectId.isValid(partnerId)
    ) {
        throw new AppError("Invalid partner ID", 400);
    }

    if (
        typeof productId !== "string" ||
        !productId.trim() ||
        !Types.ObjectId.isValid(productId)
    ) {
        throw new AppError("Invalid product ID", 400);
    }

    const normalizedPartnerId = partnerId.trim();
    const result = await Product.deleteOne({
        _id: new Types.ObjectId(productId.trim()),
        partnerId: new Types.ObjectId(normalizedPartnerId),
    });

    if (result.deletedCount === 0) {
        throw new AppError("Product not found", 404);
    }

    await redis.del(`products:${normalizedPartnerId}`);

    await redis.del(PUBLIC_PRODUCTS_CACHE_KEY);

    return { deleted: true };
};

export const allPublicProducts = async (): Promise<PublicProductsResult> => {
    const cachedProducts = await redis.get(PUBLIC_PRODUCTS_CACHE_KEY);

    if (cachedProducts) {
        return {
            products: JSON.parse(cachedProducts) as ProductInput[],
            source: "Redis",
        };
    }

    const products = await Product.find({ status: "published" })
        .select("_id partnerId title slug description type price links status createdAt")
        .sort({ createdAt: -1 })
        .lean();

    await redis.set(
        PUBLIC_PRODUCTS_CACHE_KEY,
        JSON.stringify(products),
        "EX",
        PUBLIC_PRODUCTS_CACHE_TTL,
    );

    return {
        products,
        source: "Database",
    };
}
