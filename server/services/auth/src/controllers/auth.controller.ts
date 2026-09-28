import type {
    NextFunction,
    Request,
    Response,
} from "express";

import { env } from "../config/env.js";
import { AppError } from "../error/AppError.js";
import {
    login as loginService,
    logout as logoutService,
} from "../services/auth.service.js";

const SESSION_COOKIE = "session";
const SESSION_MAX_AGE = 7 * 24 * 60 * 60 * 1000;
const isProduction = env.NODE_ENV === "production";

const clearSessionCookie = (
    res: Response,
): void => {
    res.clearCookie(
        SESSION_COOKIE,
        {
            path: "/",
            secure: isProduction,
            sameSite: isProduction
                ? "none"
                : "lax",
        },
    );
};

// =====================================================
// LOGIN
// =====================================================

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { token } = req.body;

        if (
            typeof token !== "string" ||
            !token.trim()
        ) {
            throw new AppError(
                "Firebase token is required",
                400,
            );
        }

        const {
            user,
            sessionId,
        } = await loginService(
            token.trim(),
        );

        res.cookie(
            SESSION_COOKIE,
            sessionId,
            {
                httpOnly: true,
                secure: isProduction,
                sameSite: isProduction
                    ? "none"
                    : "lax",
                path: "/",
                maxAge: SESSION_MAX_AGE,
            },
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            user,
        });
    } catch (error) {
        next(error);
    }
};

// =====================================================
// LOGOUT
// =====================================================

export const logout = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const sessionId = req.cookies?.[SESSION_COOKIE];

        if (
            !sessionId ||
            typeof sessionId !== "string"
        ) {
            clearSessionCookie(res);

            res.status(200).json({
                success: true,
                message: "Already logged out",
            });

            return;
        }

        await logoutService(sessionId);

        clearSessionCookie(res);

        res.status(200).json({
            success: true,
            message: "Logout successful",
        });
    } catch (error) {
        next(error);
    }
};

