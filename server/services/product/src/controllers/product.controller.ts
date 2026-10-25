import type {
    NextFunction,
    Request,
    Response,
} from "express";

import {
    createProduct as createProductService,
    deleteProduct as deleteProductService,
    getAllPartnerProducts as getAllPartnerProductsService,
    updateProduct as updateProductService,
    updateSales as updateProductSalesService,
    allPublicProducts as getAllPublicProductsService,
    handleDownload as handleDownloadService,
} from "../services/product.service.js";
import { AppError } from "../error/AppError.js";
import { pipeline } from "node:stream";
import { Readable } from "node:stream";

export const createProduct = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const result = await createProductService(
            req.headers["x-user-id"],
            req.body,
        );

        if (result.kind === "duplicate") {
            res.status(409).json({
                success: false,
                field: "slug",
                message: "A product with this slug already exists",
            });

            return;
        }

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            product: result.product,
        });
    } catch (error) {
        next(error);
    }
};

export const getAllPartnerProducts = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const result = await getAllPartnerProductsService(
            req.headers["x-user-id"],
        );

        res.status(200).json({
            success: true,
            source: result.source,
            products: result.products,
        });
    } catch (error) {
        next(error);
    }
};

export const updateProduct = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const result = await updateProductService(
            req.headers["x-user-id"],
            req.params.productId,
            req.body,
        );

        if (result.kind === "duplicate") {
            res.status(409).json({
                success: false,
                field: "slug",
                message: "A product with this slug already exists",
            });

            return;
        }

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product: result.product,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteProduct = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        await deleteProductService(
            req.headers["x-user-id"],
            req.params.productId,
        );

        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const getAllPublicProducts = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const result = await getAllPublicProductsService();

        res.status(200).json({
            success: true,
            source: result.source,
            products: result.products,
        });
    } catch (error) {
        next(error);
    }
};

export const updateProductSales = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { productId, amount } = req.body;

        if (!productId || amount === undefined || amount === null) {
            throw new AppError("Product id and amount are required", 400);
        }

        const product = await updateProductSalesService(
            productId,
            Number(amount),
        );

        res.status(200).json({
            success: true,
            message: "Product sales updated",
            totalSales: product.totalSales,
            totalRevenue: product.totalRevenue,
        });
    } catch (error) {
        next(error);
    }
};

export const handleDownload = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { url } = req.body;

        if (typeof url !== "string" || !url.trim()) {
            throw new AppError("File URL is required", 400);
        }

        const response = await handleDownloadService(url.trim());

        if (!response.body) {
            throw new AppError("File stream unavailable", 502);
        }

        const contentType =
            response.headers.get("content-type") ||
            "application/octet-stream";

        const contentLength = response.headers.get("content-length");

        res.setHeader("Content-Type", contentType);

        if (contentLength) {
            res.setHeader("Content-Length", contentLength);
        }

        res.setHeader(
            "Content-Disposition",
            'attachment; filename="product"',
        );

        for await (const chunk of response.body as any) {
            res.write(chunk);
        }

        res.end();
    } catch (error) {
        if (res.headersSent) {
            res.destroy(
                error instanceof Error ? error : undefined,
            );
            return;
        }

        next(error);
    }
};

