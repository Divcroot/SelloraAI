import type {
    NextFunction,
    Request,
    Response,
} from "express";

import { getAdmin as getAdminService } from "../services/admin.service.js";

export const getAdmin = async (
    _req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const admin = await getAdminService();

        res.status(200).json({
            success: true,
            admin,
        });
    } catch (error) {
        next(error);
    }
};