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
} from "../services/product.service.js";

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
