import type {
    NextFunction,
    Request,
    Response,
} from "express";

import { AppError } from "../error/AppError.js";
import {
    getAllPublicPartner as getAllPublicPartnerService,
    getPartner as getPartnerService,
    updatePartner as updatePartnerService,
    updatePartnerSales as updatePartnerSalesService,
    type PartnerUpdate,
} from "../services/partner.service.js";

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value);

const assertAllowedKeys = (
    value: Record<string, unknown>,
    allowedKeys: readonly string[],
    label: string,
): void => {
    const unknownKey = Object.keys(value).find((key) => !allowedKeys.includes(key));

    if (unknownKey) {
        throw new AppError(`Invalid ${label} field: ${unknownKey}`, 400);
    }
};

const readString = (
    value: unknown,
    label: string,
    required = false,
): string => {
    if (typeof value !== "string" || (required && !value.trim())) {
        throw new AppError(`Invalid ${label}`, 400);
    }

    return value.trim();
};

const parsePartnerUpdate = (body: unknown): PartnerUpdate => {
    if (!isRecord(body)) {
        throw new AppError("Invalid partner update data", 400);
    }

    assertAllowedKeys(body, ["name", "profileDetails", "paymentDetails"], "request");

    if (Object.keys(body).length === 0) {
        throw new AppError("At least one partner field is required", 400);
    }

    const update: PartnerUpdate = {};

    if ("name" in body) {
        update.name = readString(body.name, "name", true);
    }

    if ("profileDetails" in body) {
        if (!isRecord(body.profileDetails)) {
            throw new AppError("Invalid profileDetails", 400);
        }

        const profile = body.profileDetails;
        assertAllowedKeys(
            profile,
            ["slug", "bio", "website", "socialLinks"],
            "profileDetails",
        );

        if (Object.keys(profile).length === 0) {
            throw new AppError("At least one profileDetails field is required", 400);
        }

        update.profileDetails = {};

        if ("slug" in profile) {
            update.profileDetails.slug = readString(profile.slug, "profile slug");
        }
        if ("bio" in profile) {
            update.profileDetails.bio = readString(profile.bio, "profile bio");
        }
        if ("website" in profile) {
            update.profileDetails.website = readString(profile.website, "profile website");
        }

        if ("socialLinks" in profile) {
            if (!isRecord(profile.socialLinks)) {
                throw new AppError("Invalid profile socialLinks", 400);
            }

            const socialLinks = profile.socialLinks;
            assertAllowedKeys(
                socialLinks,
                ["youtube", "linkedin", "instagram", "github"],
                "socialLinks",
            );

            if (Object.keys(socialLinks).length === 0) {
                throw new AppError("At least one social link is required", 400);
            }

            update.profileDetails.socialLinks = {};
            for (const key of ["youtube", "linkedin", "instagram", "github"] as const) {
                if (key in socialLinks) {
                    update.profileDetails.socialLinks[key] = readString(
                        socialLinks[key],
                        `socialLinks.${key}`,
                    );
                }
            }
        }
    }

    if ("paymentDetails" in body) {
        if (!isRecord(body.paymentDetails)) {
            throw new AppError("Invalid paymentDetails", 400);
        }

        const payment = body.paymentDetails;
        assertAllowedKeys(
            payment,
            ["method", "upiId", "accountHolderName", "accountNumber", "ifscCode"],
            "paymentDetails",
        );

        if (Object.keys(payment).length === 0) {
            throw new AppError("At least one paymentDetails field is required", 400);
        }

        update.paymentDetails = {};

        if ("method" in payment) {
            if (payment.method !== "upi" && payment.method !== "bank") {
                throw new AppError("Invalid paymentDetails.method", 400);
            }
            update.paymentDetails.method = payment.method;
        }

        for (const key of [
            "upiId",
            "accountHolderName",
            "accountNumber",
            "ifscCode",
        ] as const) {
            if (key in payment) {
                update.paymentDetails[key] = readString(
                    payment[key],
                    `paymentDetails.${key}`,
                );
            }
        }
    }

    return update;
};

export const getAllPublicPartner = async (
    _req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const result = await getAllPublicPartnerService();

        res.status(200).json({
            success: true,
            source: result.source,
            partners: result.partners,
        });
    } catch (error) {
        next(error);
    }
};

export const getPartner = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const sessionId = req.cookies?.session;

        if (
            typeof sessionId !== "string" ||
            !sessionId.trim()
        ) {
            throw new AppError("Unauthorized", 401);
        }

        const { partner, source } = await getPartnerService(sessionId.trim());

        res.status(200).json({
            success: true,
            data: source,
            partner,
        });
    } catch (error) {
        next(error);
    }
};

export const updatePartner = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const sessionId = req.cookies?.session;

        if (
            typeof sessionId !== "string" ||
            !sessionId.trim()
        ) {
            throw new AppError("Unauthorized", 401);
        }

        const update = parsePartnerUpdate(req.body);
        const partner = await updatePartnerService(sessionId.trim(), update);

        res.status(200).json({
            success: true,
            message: "Partner updated successfully",
            partner,
        });
    } catch (error) {
        next(error);
    }
};

export const updatePartnerSales = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { partnerId, amount } = req.body;

        if (!partnerId || amount === undefined || amount === null) {
            throw new AppError("Partner id and amount are required", 400);
        }

        const partner = await updatePartnerSalesService(
            partnerId,
            Number(amount),
        );

        res.status(200).json({
            success: true,
            message: "Partner sales updated",
            totalSales: partner.totalSales,
            totalRevenue: partner.totalRevenue,
        });
    } catch (error) {
        next(error);
    }
};


