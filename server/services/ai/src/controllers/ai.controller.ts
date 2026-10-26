import type { NextFunction, Request, Response } from "express";
import { getAIAnalytics as getAIAnalyticsService } from "../services/ai.service.js";

export const getAIAnalytics = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const result = await getAIAnalyticsService(
            req.headers["x-user-id"],
            req.body,
        );

        res.status(200).json({
            success: true,
            message: result.cached
                ? "AI analytics retrieved from cache"
                : "AI analytics generated successfully",
            cached: result.cached,
            expiresIn: result.expiresIn,
            aiAnalytics: result.aiAnalytics,
        });
    } catch (error) {
        next(error);
    }
};
