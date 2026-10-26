import { AppError } from "../error/AppError.js";
import type { AIAnalytics, AnalyticsData } from "../types/ai.types.js";
import redis from "../../../../shared/redis/redis.js";
import { aiAgent } from "../agent/ai.agent.js";

interface ProductPerformance {
    productId: string;
    product: string;
    sales: number;
    revenue: number;
}

interface SalesTrend {
    date: string;
    sales: number;
}

export interface PartnerAnalytics {
    summary: AnalyticsData["summary"];
    charts: {
        productPerformance: ProductPerformance[];
        salesTrend: SalesTrend[];
    };
    aiResponse: AIAnalytics;
}

export interface AIAnalyticsResult {
    aiAnalytics: PartnerAnalytics;
    cached: boolean;
    expiresIn: number;
}

const CACHE_TTL = 600;

export const getAIAnalytics = async (
    partnerId: unknown,
    input: AnalyticsData,
): Promise<AIAnalyticsResult> => {
    if (
        typeof partnerId !== "string" ||
        !partnerId.trim()
    ) {
        throw new AppError("Invalid partner ID", 400);
    }

    const normalizedPartnerId = partnerId.trim();
    const cacheKey = `ai:${normalizedPartnerId}`;

    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
        try {
            const aiAnalytics: PartnerAnalytics = JSON.parse(cachedData);
            const expiresIn = await redis.ttl(cacheKey);

            if (expiresIn === -1) {
                await redis.expire(cacheKey, CACHE_TTL);

                return {
                    aiAnalytics,
                    cached: true,
                    expiresIn: CACHE_TTL,
                };
            }

            if (expiresIn === -2) {

            } else {
                return {
                    aiAnalytics,
                    cached: true,
                    expiresIn,
                };
            }
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            await redis.del(cacheKey);
        }
    }

    if (
        !input ||
        !input.summary ||
        !Array.isArray(input.products) ||
        !Array.isArray(input.orders)
    ) {
        throw new AppError("Invalid analytics data", 400);
    }
    const aiResponse = await aiAgent(input);
    const productPerformance: ProductPerformance[] =
        input.products.map((product) => ({
            productId: product.id,
            product: product.title,
            sales: product.totalSales,
            revenue: product.totalRevenue,
        }));

    const salesMap: Record<string, number> = {};

    for (const order of input.orders) {
        const date = new Date(order.createdAt);

        if (Number.isNaN(date.getTime())) {
            continue;
        }

        const dateKey = date.toISOString().slice(0, 10);

        salesMap[dateKey] = (salesMap[dateKey] ?? 0) + 1;
    }

    const salesTrend: SalesTrend[] = Object.entries(salesMap)
        .map(([date, sales]) => ({ date, sales }))
        .sort((a, b) => a.date.localeCompare(b.date));

    const result: PartnerAnalytics = {
        summary: input.summary,
        charts: {
            productPerformance,
            salesTrend,
        },
        aiResponse,
    };

    await redis.set(
        cacheKey,
        JSON.stringify(result),
        "EX",
        CACHE_TTL,
    );

    return {
        aiAnalytics: result,
        cached: false,
        expiresIn: CACHE_TTL,
    };
};
